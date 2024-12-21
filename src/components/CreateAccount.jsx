import React, { useState, useContext, useRef, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Image } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from './Context.jsx';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import ProfileModal from './ProfileModal.jsx';

// Spacing constants
const SPACE_BELOW_LABEL = '1px';
const SPACE_ABOVE_LABEL = '0px';
const SPACE_BELOW_INPUT_FIELD = '1px';
const SPACE_ABOVE_INPUT_FIELD = '0px';
const SPACE_ABOVE_BUTTON = '6px';
const SPACE_BELOW_BUTTON = '0px';
const SPACE_ABOVE_ENLARGE_LINK = '0px';
const SPACE_BELOW_ENLARGE_LINK = '0px';
const TITLE_BAR_HEIGHT = '42px';
const SPACE_ABOVE_PROFILE_PIC_SECTION = '0px';
const CARD_TOP_PADDING = '8px';
const SPACE_BELOW_TITLE_BAR = '0px';
const PROFILE_PIC_SECTION_MARGIN_TOP = '6px';
const CARD_BOTTOM_PADDING = '0px'; 
const SPACE_ABOVE_NAME_SECTION = '-3px'; 
const SPACE_BELOW_PROFILE_PIC_LABEL = '3px'; 

// Animation constants
const ANIMATION_DURATION = '0.125s'; // Duration for each individual wash
const ANIMATION_DELAY_MULTIPLIER = 0.12; // Multiplier for sequential delays
const ANIMATION_TIMING_FUNCTION = 'linear'; // Timing function for the animation

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBNuKThlYc_FiWQlKHp5NF0n6DVCRcZxAo",
  authDomain: "fir-ab-bad-bank.firebaseapp.com",
  projectId: "fir-ab-bad-bank",
  storageBucket: "fir-ab-bad-bank.appspot.com",
  messagingSenderId: "624475023697",
  appId: "1:624475023697:web:49b4dabebceb34be390b70"
};

console.log("[BB][CA] Initializing Firebase app...");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("[BB][CA] Firebase app initialized");
} else {
  console.log("[BB][CA] Firebase app already initialized");
}

const auth = firebase.auth();
console.log("[BB][CA] Firebase Auth initialized");

const profilePics = [
  "profilepic_new_account_A.webp",
  "profilepic_new_account_B.webp",
  "profilepic_new_account_C.webp",
  "profilepic_new_account_D.webp",
  "profilepic_new_account_E.webp"
];

const cardColor = getComputedStyle(document.documentElement).getPropertyValue('--create-account-color'); // Using CSS variable

function CreateAccount() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const ctx = useContext(UserContext);
  const nodeRef = useRef(null);

  useEffect(() => {
    console.log("[BB][CA] Setting up Firebase Auth state listener...");
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log("[BB][CA] Auth state changed. Current user:", user);
    });
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes reveal {
        0% {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
        }
        100% {
          opacity: 1;
          clip-path: inset(0 0 0 0);
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function validate(field, label) {
    if (!field) {
      alert(`\n‼️ALERT‼️\n ${capitalizeFirstLetter(label)} is required`);
      return false;
    }
    if (label === 'password' && field.length < 8) {
      alert(`\n‼️ALERT‼️\n ${capitalizeFirstLetter(label)} must be at least 8 characters long`);
      return false;
    }
    return true;
  }
  async function handleCreate() {
    console.log("[BB][CA] handleCreate called");
    if (!validate(profilePic, 'profile picture')) return;
    if (!validate(name, 'name')) return;
    if (!validate(username, 'username')) return;
    if (!validate(email, 'email')) return;
    if (!validate(password, 'password')) return;

    try {
      console.log("[BB][CA] Creating user with email and password:", email);

      // Send user creation request to the backend
      const response = await fetch('https://d217h16gy2gfka.cloudfront.net/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profilepic: profilePic, name, username, email, password })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("[BB][CA] User inserted into MongoDB:", result.newUser);

        ctx.users.push(result.newUser);
        console.log("[BB][CA] User data saved to MongoDB and state updated");

        // Update the status with the simplified message
        setStatus(`Account successfully created for both authentication and metadata:<br>${result.newUser.name} | ${result.newUser.email}.<br><span style="font-weight: 500; font-style: italic;">“Welcome to the family.”</span>`);
        setShow(false);
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error("[BB][CA] Error creating user:", error);
      setStatus('Error creating user');
    }
  }

  function clearForm() {
    console.log("[BB][CA] Clearing form...");
    setProfilePic('');
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setShow(true);
    setStatus('');
  }

  const isAdmin = currentUser && currentUser.email === 'admin@badbank.com';
  console.log("[BB][CA] isAdmin:", isAdmin);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      appear={true}
      timeout={300}
      classNames="fade"
    >
      <Card text="white" className="mb-2 create-account-card" style={{ marginTop: CARD_TOP_PADDING, paddingBottom: CARD_BOTTOM_PADDING }}>
        {isAdmin ? (
          <>
            <Card.Header style={{ height: TITLE_BAR_HEIGHT, display: 'flex', alignItems: 'center' }}>Create Account</Card.Header>
            <Card.Body style={{ paddingTop: PROFILE_PIC_SECTION_MARGIN_TOP }}>
              {status && show === false && (
                <Alert variant="primary" className="alert-primary-create-account text-center" style={{ marginBottom: SPACE_BELOW_TITLE_BAR }}>
                  <div dangerouslySetInnerHTML={{ __html: status }} />
                </Alert>
              )}
              <CSSTransition
                nodeRef={nodeRef}
                in={show}
                appear={true}
                timeout={500}
                classNames="fade"
                unmountOnExit
              >
                <div ref={nodeRef}>
                  {show && (
                    <Form>
                      <Row className="mb-2">
                        <Form.Group as={Col}>
                          <Form.Label className="d-flex justify-content-between" style={{ marginBottom: SPACE_BELOW_PROFILE_PIC_LABEL, marginTop: SPACE_ABOVE_LABEL }}>
                            <span style={{ fontWeight: 'var(--font-weight-medium-bold)' }}>Profile Pic</span>
                            <span style={{ fontWeight: 'var(--font-weight-regular)', fontStyle: 'italic' }}>Click any image to select.</span>
                          </Form.Label>
                          <div className="d-flex justify-content-between mx-n2">
                            {profilePics.map((pic, index) => (
                              <div
                                key={index}
                                style={{ 
                                  textAlign: 'center', 
                                  flex: 1, 
                                  padding: '0 0px', 
                                  marginLeft: index === 0 ? '0px' : '5px',  // Adjust marginLeft for the first image only 
                                  position: 'relative', // To position overlay
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  alignItems: 'center' // Center items horizontally
                                }}
                              >
                                <div style={{
                                  width: '137px', // Width of the container matches the image width
                                  height: '137px', // Height of the container matches the image height
                                  border: `3px solid ${profilePic === pic ? '#FFD700' : cardColor}`, // Yellow when selected, card color otherwise
                                  borderRadius: '22px', // Border radius to match the image
                                  padding: '2px', // Outer border padding
                                  display: 'flex', // Flex display for centering
                                  alignItems: 'center', // Center align items vertically
                                  justifyContent: 'center', // Center align items horizontally
                                  position: 'relative' // To position overlay
                                }}>
                                  <Image
                                    src={`/images/${pic}`}
                                    alt={`Profile Pic ${index + 1}`}
                                    onClick={() => {
                                      setProfilePic(pic);
                                      console.log(`[BB][CA] Selected profile picture: ${pic}`);
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      width: '130px', // Image width
                                      height: '130px', // Image height
                                      objectFit: 'cover',
                                      borderRadius: '16px', // Image border radius
                                      opacity: 0, // Start invisible
                                      animation: `reveal ${ANIMATION_DURATION} ${index * ANIMATION_DELAY_MULTIPLIER}s forwards ${ANIMATION_TIMING_FUNCTION}`
                                    }}
                                  />
                                </div>
                                <Button
                                  variant="link"
                                  onClick={() => {
                                    setModalImage(`/images/${pic}`);
                                    setModalShow(true);
                                    console.log(`[BB][CA] Enlarge profile picture: ${pic}`);
                                  }}
                                  style={{
                                    padding: SPACE_BELOW_ENLARGE_LINK, // Use existing padding settings
                                    marginTop: SPACE_ABOVE_ENLARGE_LINK,
                                    color: '#FFD700', // Bright yellow color
                                    fontWeight: 'var(--font-weight-medium)', // Medium font weight
                                    textDecoration: 'none', // No underline initially
                                    border: 'none', // No border
                                    backgroundColor: 'transparent', // Transparent background
                                    transition: 'color 0.3s, text-decoration 0.3s', // Smooth transitions
                                    position: 'relative', // To position overlay
                                    opacity: 0, // Start invisible
                                    animation: `reveal ${ANIMATION_DURATION} ${index * ANIMATION_DELAY_MULTIPLIER}s forwards ${ANIMATION_TIMING_FUNCTION}`
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.textDecoration = 'underline'; // Underline on hover
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.textDecoration = 'none'; // Remove underline
                                  }}
                                >
                                  Enlarge
                                </Button>
                              </div>
                            ))}
                          </div>
                        </Form.Group>
                      </Row>
                      <Row className="mb-2" style={{ marginTop: SPACE_ABOVE_NAME_SECTION }}>
                        <Form.Group as={Col} style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}>
                          <Form.Label style={{ marginBottom: SPACE_BELOW_LABEL, marginTop: SPACE_ABOVE_LABEL }}>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={e => {
                              setName(e.currentTarget.value);
                              console.log(`[BB][CA] Name entered: ${e.currentTarget.value}`);
                            }}
                            style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-2">
                        <Form.Group as={Col} style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}>
                          <Form.Label style={{ marginBottom: SPACE_BELOW_LABEL, marginTop: SPACE_ABOVE_LABEL }}>Username</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => {
                              setUsername(e.currentTarget.value);
                              console.log(`[BB][CA] Username entered: ${e.currentTarget.value}`);
                            }}
                            style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-2">
                        <Form.Group as={Col} style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}>
                          <Form.Label style={{ marginBottom: SPACE_BELOW_LABEL, marginTop: SPACE_ABOVE_LABEL }}>Email address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => {
                              setEmail(e.currentTarget.value);
                              console.log(`[BB][CA] Email entered: ${e.currentTarget.value}`);
                            }}
                            style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-2">
                        <Form.Group as={Col} style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}>
                          <Form.Label style={{ marginBottom: SPACE_BELOW_LABEL, marginTop: SPACE_ABOVE_LABEL }}>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => {
                              setPassword(e.currentTarget.value);
                              console.log(`[BB][CA] Password entered: ${e.currentTarget.value}`);
                            }}
                            style={{ marginBottom: SPACE_BELOW_INPUT_FIELD, marginTop: SPACE_ABOVE_INPUT_FIELD }}
                          />
                        </Form.Group>
                      </Row>
                      <Button
                        variant="primary"
                        type="button"
                        onClick={handleCreate}
                        disabled={!name || !username || !email || !password || !profilePic}
                        style={{ marginTop: SPACE_ABOVE_BUTTON, marginBottom: SPACE_BELOW_BUTTON }}
                      >
                        Create Account
                      </Button>
                    </Form>
                  )}
                </div>
              </CSSTransition>
              {!show && (
                <>
                  <Button variant="primary" onClick={clearForm} style={{ marginTop: SPACE_ABOVE_BUTTON, marginBottom: SPACE_BELOW_BUTTON }}>
                    Add another account
                  </Button>
                </>
              )}
            </Card.Body>
          </>
        ) : (
          <CSSTransition
            nodeRef={nodeRef}
            in={true}
            appear={true}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div ref={nodeRef}>
              <Card.Body>
                <div style={{ position: 'relative', width: '100%', height: '530px' }}>
                  <Image 
                    src="/images/bouncer_at_door.webp" 
                    alt="Access Denied" 
                    className="img-fluid" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    textAlign: 'center',
                    padding: '10px',
                  }}>
                    <h4>This is for <b>admins only</b>. It's not personal, <i>it's strictly business</i>.</h4>
                  </div>
                </div>
              </Card.Body>
            </div>
          </CSSTransition>
        )}
        <ProfileModal
          show={modalShow}
          handleClose={() => setModalShow(false)}
          profilePic={modalImage}
          name=""
        />
      </Card>
    </CSSTransition>
  );
}

export default CreateAccount;
