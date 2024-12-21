import React, { useContext, useState, useEffect } from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { UserContext } from './Context.jsx';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ProfileModal from './ProfileModal';

// Reset CSS to zero out margins and padding
const resetCSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

// Inject the reset CSS into the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = resetCSS;
document.head.appendChild(styleSheet);

// Define constants at the top
const COLUMN_SPACING = '0px';
const TITLE_SPACING = '-3px';
const CARD_MARGIN_TOP = '0px';
const CARD_MARGIN_BOTTOM = '7px';
const CARD_BODY_PADDING = '2px';
const ROW_MARGIN_BOTTOM = '0px';
const IMAGE_WIDTH = '120px';
const IMAGE_HEIGHT = '120px';
const IMAGE_MARGIN_TOP = '2px';
const IMAGE_MARGIN_BOTTOM = '0px';
const IMAGE_MARGIN_LEFT = '17px';
const IMAGE_MARGIN_RIGHT = '18px'; // Reduced space between the image and label column
const COL_PADDING = '0px 0px'; // Set padding to ensure no overlap and even spacing
const TEXT_PADDING_RIGHT = '0px'; // Increased space between the label and value column
const TEXT_PADDING_LEFT = '18px';
const LINE_HEIGHT = '1.1';
const FONT_SIZE = '15.5px'; // Overall font size constant
const CARD_HEIGHT = '140px';
const SPACE_ABOVE_CONTENT = '0px'; // Added space above the label and value columns
const SPACE_BELOW_CONTENT = '0px'; // Added space below the label and value columns
const TEXT_MARGIN_TOP = '10px'; // Adjust this value to move the text downwards

function AllData() {
  const ctx = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('https://d217h16gy2gfka.cloudfront.net/api/fetchData');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);
          setUsers(data);
        } else {
          setError('Failed to fetch data');
          console.error('Failed to fetch data', response.status);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Failed to fetch data', err);
      }
    };
    getData();
  }, []);
  useEffect(() => {
    const delayIncrement = 0.5;
    const style = document.createElement('style');
    document.head.appendChild(style);
    const cssRules = users.map(
      (_, index) => `
      .fade-in-${index} {
        animation: fadeIn 600ms ${index * delayIncrement}s ease-in-out forwards;
      }
    `
    ).join('');
    style.innerHTML = cssRules;
  }, [users]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function blurData(data) {
    return '••••••';
  }

  function handleImageClick(user) {
    setSelectedUser(user);
    setModalShow(true);
  }

  function getLastName(name) {
    const parts = name.trim().split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isAdmin = currentUser && currentUser.email === 'admin@badbank.com';

  // Sort users by last name
  const sortedUsers = [...users].sort((a, b) => {
    const lastNameA = getLastName(a.name).toLowerCase();
    const lastNameB = getLastName(b.name).toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  return (
    <div className="all-data-container">
      <div className="all-data-title" style={{ marginTop: '2px', marginBottom: TITLE_SPACING }}>All Data</div>
      <div>
        {Array.isArray(sortedUsers) && sortedUsers.length > 0 && sortedUsers.map((user, index) => (
          user.email !== 'admin@badbank.com' && (
            <Card key={user._id} className={`all-data-card fade-in-${index}`} style={{ 
              marginTop: CARD_MARGIN_TOP, 
              marginBottom: CARD_MARGIN_BOTTOM, 
              height: CARD_HEIGHT, 
              animation: `fadeIn 600ms ${index * 0.5}s ease-in-out forwards` 
            }}>
              <Card.Body style={{ padding: CARD_BODY_PADDING, paddingTop: SPACE_ABOVE_CONTENT, paddingBottom: SPACE_BELOW_CONTENT }}>
                <Row className="mb-2" style={{ marginBottom: ROW_MARGIN_BOTTOM, width: '100%', alignItems: 'center', display: 'flex', flexWrap: 'nowrap' }}>
                  <Col xs={2} md={2} style={{ padding: '0', marginTop: IMAGE_MARGIN_TOP, marginBottom: IMAGE_MARGIN_BOTTOM, marginLeft: IMAGE_MARGIN_LEFT, marginRight: IMAGE_MARGIN_RIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        width: IMAGE_WIDTH,
                        height: IMAGE_HEIGHT,
                      }}
                      onClick={() => handleImageClick(user)}
                    >
                      <Image
                        src={`/images/${user.profilepic}`}
                        rounded
                        style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: '10px' }}
                      />
                      <div className="hover-overlay">
                        <span>Enlarge</span>
                      </div>
                    </div>
                  </Col>
                  <Col xs={10} md={10} style={{ padding: COL_PADDING, marginTop: TEXT_MARGIN_TOP }}>
                    <Row className="mb-2" style={{ marginBottom: '4px', lineHeight: LINE_HEIGHT, height: '100%', display: 'flex', alignItems: 'center' }}>
                      <Col xs={3} md={2} style={{ whiteSpace: 'nowrap', paddingRight: TEXT_PADDING_RIGHT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        <strong>Name</strong>
                      </Col>
                      <Col xs={9} md={10} style={{ paddingLeft: TEXT_PADDING_LEFT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        {user.name}
                      </Col>
                    </Row>
                    <Row className="mb-2" style={{ marginBottom: '4px', lineHeight: LINE_HEIGHT, height: '100%', display: 'flex', alignItems: 'center' }}>
                      <Col xs={3} md={2} style={{ whiteSpace: 'nowrap', paddingRight: TEXT_PADDING_RIGHT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        <strong>Email</strong>
                      </Col>
                      <Col xs={9} md={10} style={{ paddingLeft: TEXT_PADDING_LEFT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        {user.email}
                      </Col>
                    </Row>
                    <Row className="mb-2" style={{ marginBottom: '4px', lineHeight: LINE_HEIGHT, height: '100%', display: 'flex', alignItems: 'center' }}>
                      <Col xs={3} md={2} style={{ whiteSpace: 'nowrap', paddingRight: TEXT_PADDING_RIGHT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        <strong>Balance</strong>
                      </Col>
                      <Col xs={9} md={10} style={{ paddingLeft: TEXT_PADDING_LEFT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        {isAdmin || (currentUser && currentUser.email === user.email)
                          ? `$${numberWithCommas(user.balance)}`
                          : blurData(user.balance)}
                      </Col>
                    </Row>
                    <Row className="mb-2" style={{ marginBottom: '4px', lineHeight: LINE_HEIGHT, height: '100%', display: 'flex', alignItems: 'center' }}>
                      <Col xs={3} md={2} style={{ whiteSpace: 'nowrap', paddingRight: TEXT_PADDING_RIGHT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        <strong>Username</strong>
                      </Col>
                      <Col xs={9} md={10} style={{ paddingLeft: TEXT_PADDING_LEFT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        {isAdmin || (currentUser && currentUser.email === user.email)
                          ? user.username
                          : blurData(user.username)}
                      </Col>
                    </Row>
                    <Row className="mb-2" style={{ marginBottom: '4px', lineHeight: LINE_HEIGHT, height: '100%', display: 'flex', alignItems: 'center' }}>
                      <Col xs={3} md={2} style={{ whiteSpace: 'nowrap', paddingRight: TEXT_PADDING_RIGHT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        <strong>Password</strong>
                      </Col>
                      <Col xs={9} md={10} style={{ paddingLeft: TEXT_PADDING_LEFT, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT }}>
                        {isAdmin || (currentUser && currentUser.email === user.email)
                          ? user.password
                          : blurData(user.password)}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )
        ))}
      </div>
      {selectedUser && (
        <ProfileModal
          show={modalShow}
          handleClose={() => setModalShow(false)}
          profilePic={`/images/${selectedUser.profilepic}`}
          name={selectedUser.name}
        />
      )}
    </div>
  );
}

export default AllData;
