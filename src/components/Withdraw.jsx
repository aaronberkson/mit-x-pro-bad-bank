import React, { useState, useContext, useRef, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from './Context.jsx';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ProfileModal from './ProfileModal'; // Import ProfileModal

// Constants
const IMAGE_NAME = '/images/withdrawal-banner-5.webp';
const TITLE_SLICE_HEIGHT = '277px'; // Change this to match the height of the title section
const BACKGROUND_POSITION_Y = '75%'; // Adjust this to move the image up or down
const FONT_WEIGHT_MEDIUM_BOLD = 'var(--font-weight-medium-bold)'; // Using CSS variable for font weight
const FONT_WEIGHT_BOLD = 'var(--font-weight-bold)'; // Using CSS variable for font weight


function Withdraw() {
  const [selectedName, setSelectedName] = useState('');
  const [withdrawal, setWithdrawal] = useState('');
  const [balance, setBalance] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [withdrawalMade, setWithdrawalMade] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false); // State for modal visibility
  const ctx = useContext(UserContext);
  const nodeRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      console.log("[BB][WD] onAuthStateChanged triggered with user:", user);
      setCurrentUser(user);
      if (user) {
        try {
          const response = await fetch('https://d217h16gy2gfka.cloudfront.net/api/fetchData');
          console.log("[BB][WD] fetchData response:", response);
          if (response.ok) {
            const data = await response.json();
            console.log("[BB][WD] Data fetched:", data);
            setUsers(data);

            if (user.email !== 'admin@badbank.com') {
              const currentUserData = data.find(u => u.email === user.email);
              if (currentUserData) {
                setSelectedName(currentUserData.name);
                setBalance(currentUserData.balance);
              }
            }
          } else {
            console.error('[BB][WD] Failed to fetch data', response.status);
          }
        } catch (err) {
          console.error('[BB][WD] Failed to fetch data', err);
        } finally {
          setIsLoading(false);
        }
      }
    });
  }, []);
  async function handleWithdraw(e) {
    e.preventDefault();
    if (!/^-?\d+(\.\d+)?$/.test(withdrawal)) {
      alert("\n‼️ALERT‼️ \nThat's not a number!");
      return;
    }
    if (Number(withdrawal) < 0) {
      alert("\n‼️ALERT‼️ \nYou can't withdraw a negative number!");
      return;
    }
    const user = users.find(user => user.name === selectedName);
    if (user) {
      if (Number(withdrawal) > user.balance) {
        alert("\n‼️ALERT‼️ \nYou can't withdraw more than the balance!");
        return;
      }
      const newBalance = user.balance - Number(withdrawal);
      user.balance = newBalance;
      setBalance(newBalance);
      setStatus(`Withdrawal successful! New balance for ${user.name}: $${newBalance.toLocaleString()}`);
      setShow(true);
      setWithdrawalMade(true);

      // Update balance in the backend
      try {
        const response = await fetch('https://d217h16gy2gfka.cloudfront.net/api/update-balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email, balance: newBalance })
        });

        console.log("[BB][WD] Update balance response:", response);
        if (response.ok) {
          console.log("[BB][WD] Balance updated successfully in MongoDB");
        } else {
          console.error('[BB][WD] Failed to update balance', response.status);
        }
      } catch (err) {
        console.error('[BB][WD] Failed to update balance', err);
      }
    }
  }

  function resetForm() {
    setWithdrawal('');
    setShow(false);
    setStatus('');
    setWithdrawalMade(false);
    if (currentUser) {
      const currentUserData = users.find(u => u.email === currentUser.email);
      if (currentUserData) {
        setSelectedName(currentUserData.name);
        setBalance(currentUserData.balance);
      }
    }
  }

  function updateBalance(selectedName) {
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
        text="white"
        className="mb-2 withdraw-card"
        style={{ backgroundColor: 'var(--withdrawal-card-color)', width: 'var(--card-full-width)', marginTop: '8px' }} // Adjust marginTop as needed
      >
<Card.Header
  style={{
    height: TITLE_SLICE_HEIGHT,
    backgroundImage: `url(${IMAGE_NAME})`,
    backgroundSize: 'cover',
    backgroundPositionY: BACKGROUND_POSITION_Y,
    color: 'white',  // Text color
    fontSize: '1.3em',
    fontWeight: FONT_WEIGHT_MEDIUM_BOLD, // Using the constant for font weight
    // WebkitTextStroke: '1px #800000',  // Same border color as before
    textAlign: 'left',
    display: 'flex',
    alignItems: 'flex-start',  // Align items to the top
    justifyContent: 'flex-start',  // Center the content
    paddingBottom: '36px',
    paddingRight: '73px',
    borderLeft: '8px solid var(--withdrawal-card-color)',
    borderTop: '8px solid var(--withdrawal-card-color)',
    borderRight: '8px solid var(--withdrawal-card-color)',
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
    Withdraw
  </div>



          <Button
  variant="link"
  onClick={() => setModalShow(true)}
  style={{
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent dark background
    color: '#FFD700', // Bright Gold color
    fontWeight: 'bold', // Bold text for better readability
    padding: '5px 10px',
    borderRadius: '4px',
    textDecoration: 'none', // Remove underline by default
    border: '1px solid #FFD700', // Thin Gold border
    fontSize: '16px', // Adjust font size if needed
    transition: 'background-color 0.3s, color 0.3s, border 0.3s, text-decoration 0.3s', // Smooth transitions
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add subtle shadow for better visibility
    WebkitTextStroke: '0px', // Ensure no stroke around text
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#FFD700'; // Solid Gold background on hover
    e.currentTarget.style.color = 'black'; // Black text on hover for better contrast

  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Restore original background
    e.currentTarget.style.color = '#FFD700'; // Restore original text color
    e.currentTarget.style.textDecoration = 'none'; // Remove underline
  }}
>
  Enlarge
</Button>



        </Card.Header>
  
        <Card.Body>
          {show && (
            <Alert variant="success" className={`alert-success-withdraw ${show ? '' : 'hide'}`}>
              {status}
              <br /><em>&ldquo;It's not what you make, it's what you keep.&ldquo;</em>
            </Alert>
          )}
          {!withdrawalMade && (
            currentUser && currentUser.email === 'admin@badbank.com' ? (
              <Form onSubmit={handleWithdraw}>
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
                    <Form.Label>Withdrawal Amount</Form.Label>
                    <Form.Control
                      type="text"
                      value={withdrawal}
                      onChange={e => setWithdrawal(e.currentTarget.value)}
                    />
                  </Form.Group>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!selectedName || withdrawal === ''}
                >
                  Make Withdrawal
                </Button>
              </Form>
            ) : (
              <Form onSubmit={handleWithdraw}>
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
                    <Form.Label>Withdrawal Amount</Form.Label>
                    <Form.Control
                      type="text"
                      value={withdrawal}
                      onChange={e => setWithdrawal(e.currentTarget.value)}
                    />
                  </Form.Group>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={withdrawal === ''}
                >
                  Make Withdrawal
                </Button>
              </Form>
            )
          )}
          {withdrawalMade && (
            <Button variant="primary" onClick={resetForm}>
              Make Another Withdrawal
            </Button>
          )}
        </Card.Body>
  
        <ProfileModal
          show={modalShow}
          handleClose={() => setModalShow(false)}
          profilePic={IMAGE_NAME}
          name="Withdraw"
          imageSize={{ width: '650px', height: '650px' }} // Custom image size
        />
      </Card>
    </CSSTransition>
  );
  
}

export default Withdraw;
