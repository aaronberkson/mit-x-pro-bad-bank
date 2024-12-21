import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { EyeFill, EyeSlashFill, KeyFill } from 'react-bootstrap-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import LoginModal from './LoginModal';
import '../css/Login.css'; // Import the stylesheet
import { parseFirebaseError } from '../../parseFirebaseError'; // Import the utility function two levels up


function Login() {
  const nodeRef = useRef(null);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const TITLE_VERTICAL_OFFSET = '45px'; // Adjust as needed ('px' or '%')
  const TITLE_BUTTON_SPACING = '15px'; // Adjust as needed ('px' or '%')
  const BUTTON_BOTTOM_SPACING = '15px'; // Adjust as needed ('px' or '%')
  const EMAIL_FIELD_SPACING = '10px'; // Adjust as needed ('px' or '%')
  const BUTTON_VERTICAL_OFFSET = '6px'; // Adjust as needed ('px' or '%')

  useEffect(() => {
    if (modalShow) {
      fetchUsers();
    }
  }, [modalShow]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://d217h16gy2gfka.cloudfront.net/api/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      let email = emailOrUsername;
      setError(null);
  
      if (!email.includes('@')) {
        const response = await fetch(`https://d217h16gy2gfka.cloudfront.net/api/getUserByUsername/${emailOrUsername}`);
        if (response.ok) {
          const user = await response.json();
          email = user.email;
        } else {
          throw new Error('User not found');
        }
      }
  
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          const userFriendlyMessage = parseFirebaseError(error.message);
          setError(userFriendlyMessage);
        });
    } catch (error) {
      const userFriendlyMessage = parseFirebaseError(error.message);
      setError(userFriendlyMessage);
    }
  };
  

  const handleModalClose = () => {
    setModalShow(false);
  };

  const handleModalShow = () => {
    setModalShow(true);
  };

  const handleEmailSelect = (email, password) => {
    setSelectedUser({ email, password });
  };

  const applySelectedUser = () => {
    if (selectedUser) {
      setEmailOrUsername(selectedUser.email);
      setPassword(selectedUser.password);
      handleModalClose();
    }
  };

  const isFormValid = emailOrUsername && password;

  return (
    <>
      <CSSTransition
        nodeRef={nodeRef}
        in={true}
        appear={true}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className="login-container-custom" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card 
            ref={nodeRef} 
            bg="dark" 
            text="white" 
            className="login-card card-custom-login"
          >
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6} className="d-flex flex-column justify-content-center" style={{ paddingRight: '20px', paddingLeft: '15px' }}>
                  <Card.Title className="text-left mb-2">What's the password?</Card.Title>
                  <img
                    src="/images/badbank-login.png"
                    className="img-fluid rounded-lg"
                    style={{ border: '2px solid #6c757d', borderRadius: '15px', marginBottom: '5px' }}
                    alt="Login Illustration"
                  />
                </Col>
                <Col md={6} className="d-flex flex-column justify-content-center" style={{ paddingLeft: '20px', paddingRight: '15px' }}>
                  <Card.Title className="text-center" style={{ fontWeight: 'bold', marginTop: TITLE_VERTICAL_OFFSET, marginBottom: 0 }}>Bad Bank Access</Card.Title>
                  <Button variant="secondary" onClick={handleModalShow} className="button-login-custom" style={{ marginBottom: TITLE_BUTTON_SPACING, marginTop: TITLE_BUTTON_SPACING }}>
                    <KeyFill /> Use Skeleton Key
                  </Button>
                  <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formEmailOrUsername" className="form-group-custom">
                      <Form.Label style={{ marginBottom: '0', paddingBottom: '5px' }}>Email or Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter email or username"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        style={{ borderRadius: '0', marginBottom: EMAIL_FIELD_SPACING }} // Removed curved corners and set margin
                      />
                    </Form.Group>
                    <Form.Group controlId="formPassword" className="form-group-custom">
                      <Form.Label style={{ marginBottom: '0', paddingBottom: '5px' }}>Password</Form.Label>
                      <InputGroup style={{ marginBottom: BUTTON_VERTICAL_OFFSET }}>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control-custom"
                          style={{ borderRadius: '0', borderRight: 'none' }} // Removed curved corners
                        />
                        <InputGroup.Text
                          onClick={() => setShowPassword(!showPassword)}
                          className="input-group-text-custom"
                          style={{ 
                            borderRadius: '0',
                            borderTop: '1px solid #ced4da',
                            borderRight: 'none',
                            borderBottom: '1px solid #ced4da',
                            backgroundColor: 'white'
                          }} // Removed curved corners and set background color to white
                        >
                          {showPassword ? <EyeFill /> : <EyeSlashFill />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex align-items-end">
                      <Button variant="primary" type="submit" className="button-login-custom" disabled={!isFormValid} style={{ height: '38px' }}>
                        Log In
                      </Button>
                      {error && <Alert variant="danger" className="ml-3 alert-custom">{error}</Alert>}
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </CSSTransition>
  
      <LoginModal
        modalShow={modalShow}
        handleModalClose={handleModalClose}
        users={users}
        handleEmailSelect={handleEmailSelect}
        applySelectedUser={applySelectedUser}
      />
    </>
  );
  }
  
  export default Login;
  