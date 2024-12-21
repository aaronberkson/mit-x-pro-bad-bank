import React, { useState, useContext, useRef, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Image } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from './Context.jsx';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ProfileModal from './ProfileModal'; // Import ProfileModal

// Constants
const IMAGE_NAME = '/images/deposit-banner-7.webp';
const TITLE_SLICE_HEIGHT = '277px'; // Change this to match the height of the title section
const BACKGROUND_POSITION_Y = '97%'; // Adjust this to move the image up or down
const IMAGE_SIZE = { width: '650px', height: '650px' }; // Define custom image size (perfectly square)
const FONT_WEIGHT_MEDIUM_BOLD = 'var(--font-weight-medium-bold)'; // Using CSS variable for font weight
const FONT_WEIGHT_BOLD = 'var(--font-weight-bold)'; // Using CSS variable for font weight

function Deposit() {
  const [selectedName, setSelectedName] = useState('');
  const [deposit, setDeposit] = useState('');
  const [balance, setBalance] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [depositMade, setDepositMade] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false); // State for modal visibility
  const [modalImage, setModalImage] = useState(IMAGE_NAME); // State for modal image URL
  const ctx = useContext(UserContext);
  const nodeRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      console.log("[BB][DP] onAuthStateChanged triggered with user:", user);
      setCurrentUser(user);
      if (user) {
        try {
          const response = await fetch('https://d217h16gy2gfka.cloudfront.net/api/fetchData');
          console.log("[BB][DP] fetchData response:", response);
          if (response.ok) {
            const data = await response.json();
            console.log("[BB][DP] Data fetched:", data);
            setUsers(data);

            if (user.email !== 'admin@badbank.com') {
              const currentUserData = data.find(u => u.email === user.email);
              if (currentUserData) {
                setSelectedName(currentUserData.name);
                setBalance(currentUserData.balance);
              }
            }
          } else {
            console.error('[BB][DP] Failed to fetch data', response.status);
          }
        } catch (err) {
          console.error('[BB][DP] Failed to fetch data', err);
        } finally {
          setIsLoading(false);
        }
      }
    });
  }, []);

  async function handleDeposit(e) {
    e.preventDefault();
    console.log("[BB][DP] handleDeposit called with deposit amount:", deposit);
    if (!/^-?\d+(\.\d+)?$/.test(deposit)) {
      alert("\n‼️ALERT‼️ \nThat's not a number!");
      return;
    }
    if (Number(deposit) < 0) {
      alert("\n‼️ALERT‼️ \nYou can't deposit a negative number!");
      return;
    }
    const user = users.find(user => user.name === selectedName);
    if (user) {
      const newBalance = user.balance + Number(deposit);
      console.log("[BB][DP] New balance calculated:", newBalance);
      user.balance = newBalance;
      setBalance(newBalance);
      setStatus(`Deposit successful! New balance for ${user.name}: $${newBalance.toLocaleString()}`);
      setShow(true);
      setDepositMade(true);

      // Update balance in the backend
      try {
        const response = await fetch('https://d217h16gy2gfka.cloudfront.net/api/update-balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email, balance: newBalance })
        });

        console.log("[BB][DP] Update balance response:", response);
        if (response.ok) {
          console.log("[BB][DP] Balance updated successfully in MongoDB");
        } else {
          console.error('[BB][DP] Failed to update balance', response.status);
        }
      } catch (err) {
        console.error('[BB][DP] Failed to update balance', err);
      }
    }
  }

  function resetForm() {
    console.log("[BB][DP] resetForm called");
    setDeposit('');
    setShow(false);
    setStatus('');
    setDepositMade(false);
    if (currentUser) {
      const currentUserData = users.find(u => u.email === currentUser.email);
      if (currentUserData) {
        setSelectedName(currentUserData.name);
        setBalance(currentUserData.balance);
      }
    }
  }

  function updateBalance(selectedName) {
    console.log("[BB][DP] updateBalance called with selectedName:", selectedName);
    if (selectedName === '') {
      setBalance('');
    } else {
      const user = users.find(user => user.name === selectedName);
      if (user) {
        setBalance(user.balance);
      }
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={!isLoading}
      appear={true}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <Card
        ref={nodeRef}
        className="mb-2 deposit-card"
        style={{ marginTop: '8px' }}
      >
<Card.Header
  style={{
    height: TITLE_SLICE_HEIGHT,
    backgroundImage: `url(${IMAGE_NAME})`,
    backgroundSize: 'cover',
    backgroundPositionY: BACKGROUND_POSITION_Y,
    color: 'white',  // Neon green color
    fontSize: '1.3em',
    fontWeight: FONT_WEIGHT_MEDIUM_BOLD,
    // WebkitTextStroke: '1px var(--deposit-card-color)',  // Border color
    textAlign: 'left',
    display: 'flex',
    alignItems: 'flex-start',  // Align items to the top
    justifyContent: 'flex-start',  // Justify content to the left
    paddingBottom: '22px',
    paddingLeft: '22px',
    borderLeft: '8px solid var(--deposit-card-color)',
    borderTop: '8px solid var(--deposit-card-color)',
    borderRight: '8px solid var(--deposit-card-color)',
    borderBottom: 'none',
    position: 'relative',
  }}
>
  {/* Semi-transparent overlay rectangle */}
  <div style={{
    position: 'absolute',
    top: '0px',
    left: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '8px 11.5px',
    borderRadius: '0 0 20px 0', // Rounded bottom-right corner
  }}>
    Deposit
  </div>
  <Button
  variant="link"
  onClick={() => setModalShow(true)}
  style={{
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent dark background
    color: '#7CFC00', // Bright green color
    fontWeight: 'bold', // Bold text for better readability
    padding: '5px 10px',
    borderRadius: '4px',
    textDecoration: 'none', // Remove underline by default
    border: '1px solid #7CFC00', // Thin green border
    fontSize: '16px', // Adjust font size if needed
    transition: 'background-color 0.3s, color 0.3s, border 0.3s, text-decoration 0.3s', // Smooth transitions
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add subtle shadow for better visibility
    WebkitTextStroke: '0px', // Ensure no stroke around text
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#7FFF00'; // Solid bright green background on hover
    e.currentTarget.style.color = 'black'; // Black text on hover for better contrast
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Restore original background
    e.currentTarget.style.color = '#7CFC00'; // Restore original text color
    e.currentTarget.style.textDecoration = 'none'; // Remove underline
  }}
>
  Enlarge
</Button>
</Card.Header>
        <Card.Body>
          {show && (
            <Alert variant="success" className={`alert-success-deposit ${show ? '' : 'hide'}`}>
              {status}
              <br /><em>&ldquo;It's not what you make, it's what you keep.&ldquo;</em>
            </Alert>
          )}
          {!depositMade && (
            currentUser && currentUser.email === 'admin@badbank.com' ? (
              <Form onSubmit={handleDeposit}>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Account Name</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedName}
                      onChange={e => {
                        setSelectedName(e.currentTarget.value);
                        updateBalance(e.currentTarget.value);
                      }}
                    >
                      <option value="">Select Account</option>
                      {users.filter(user => user.email !== 'admin@badbank.com').map((user, index) => (
                        <option key={index} value={user.name}>{user.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Balance</Form.Label>
                    <div style={{ fontWeight: 'var(--font-weight-regular)' }}>
                      {balance !== '' ? `$${numberWithCommas(balance)}` : <em>Select an account above to view balance</em>}
                    </div>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Deposit Amount</Form.Label>
                    <Form.Control
                      type="text"
                      value={deposit}
                      onChange={e => setDeposit(e.currentTarget.value)}
                    />
                  </Form.Group>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!selectedName || deposit === ''}
                >
                  Make Deposit
                </Button>
              </Form>
            ) : (
              <Form onSubmit={handleDeposit}>
                <Row className="mb-3">
                  <Col>
                    <div style={{ fontWeight: 'var(--font-weight-medium-bold)' }}>Account Name</div>
                    <div style={{ fontWeight: 'var(--font-weight-regular)' }}>
                      {selectedName || <em>Loading...</em>}
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <div style={{ fontWeight: 'var(--font-weight-medium-bold)' }}>Balance</div>
                    <div style={{ fontWeight: 'var(--font-weight-regular)' }}>
                      {balance !== '' ? `$${numberWithCommas(balance)}` : <em>Select an account above to view balance</em>}
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Deposit Amount</Form.Label>
                    <Form.Control
                      type="text"
                      value={deposit}
                      onChange={e => setDeposit(e.currentTarget.value)}
                    />
                  </Form.Group>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={deposit === ''}
                >
                  Make Deposit
                </Button>
              </Form>
            )
          )}
          {depositMade && (
            <Button variant="primary" onClick={resetForm}>
              Make Another Deposit
            </Button>
          )}
        </Card.Body>
        <ProfileModal
          show={modalShow}
          handleClose={() => setModalShow(false)}
          profilePic={modalImage}
          name="Deposit"
          imageSize={IMAGE_SIZE} // Pass custom image size to ProfileModal
        />
      </Card>
    </CSSTransition>
  );
}

export default Deposit;
