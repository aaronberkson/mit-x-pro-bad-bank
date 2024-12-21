import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { UserContext } from './Context.jsx';
import '../css/NavBar.css';

// Utility function for creating popperConfig
const createPopperConfig = (horizontalOffset, verticalOffset) => ({
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [horizontalOffset, verticalOffset], // [horizontal, vertical] in pixels
      },
    },
  ],
});

// Constants for tooltip adjustments
const TOOLTIP_OFFSETS = {
  createAccount: { box: 14, vertical: 7, arrow: 0 },
  deposit: { box: -142, vertical: 7, arrow: 0 },
  withdraw: { box: -88, vertical: 7, arrow: 0 },
  allData: { box: -12, vertical: 7, arrow: 0 },
};

function NavBar() {
  const ctx = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isNavBrandSelected, setIsNavBrandSelected] = useState(false);
  const underlineRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        if (ctx && ctx.username) {
          setUsername(ctx.username);
        } else {
          fetchUsername(user.uid);
        }
      }
    });
    return unsubscribe;
  }, [ctx]);

  useEffect(() => {
    const updateUnderlinePosition = () => {
      const activeLink = document.querySelector('.nav-link.active-nav-item');
      const navBrand = document.querySelector('.navbar-brand.active-nav-brand');

      if (navBrand && !activeLink) {
        // Animate underline to Create Account, then hide
        if (underlineRef.current) {
          underlineRef.current.style.left = '0';
          underlineRef.current.style.width = '0';
        }
      } else if (activeLink && underlineRef.current) {
        const offsetLeft = activeLink.offsetLeft + 12; // Adjust for margin
        const newWidth = activeLink.offsetWidth - 24; // Adjust for margin
        underlineRef.current.style.left = `${offsetLeft}px`;
        underlineRef.current.style.width = `${newWidth}px`;
      } else if (underlineRef.current) {
        underlineRef.current.style.width = '0';
      }
    };

    updateUnderlinePosition();
    window.addEventListener('resize', updateUnderlinePosition);
    return () => window.removeEventListener('resize', updateUnderlinePosition);
  }, [location.pathname]);

  const fetchUsername = async (uid) => {
    try {
      const response = await fetch(`https://d217h16gy2gfka.cloudfront.net/api/getUsername/${uid}`);
      const data = await response.json();
      if (data && data.username) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavBrandClick = (event) => {
    if (isNavBrandSelected) {
      event.preventDefault(); // Prevent click if selected
      return;
    }
    setIsNavBrandSelected(true);
    if (underlineRef.current) {
      underlineRef.current.style.left = '0';
      underlineRef.current.style.width = '0';
    }
  };

  const handleNavBrandMouseEnter = (event) => {
    if (isNavBrandSelected) {
      event.preventDefault(); // Prevent hover if selected
      return;
    }
  };

  return (
    <nav className="navbar bg-dark raleway-medium-bold" style={{ width: '100%' }}>
      <Container fluid style={{ maxWidth: 'var(--spa-app-width)', padding: '0' }}>
        <Row>
          <Col xs={3} className="d-flex flex-column align-items-center">
            <div className="navbar-brand-wrapper">
              <NavLink
                to="/"
                className={({ isActive }) => {
                  setIsNavBrandSelected(isActive);
                  return `navbar-brand mx-0 ${isActive ? 'active-nav-brand' : 'deselect-nav-brand'}`;
                }}
                onClick={handleNavBrandClick}
                onMouseEnter={handleNavBrandMouseEnter}
                style={{ margin: '0', padding: '0' }}
              >
                <img src="/images/badbank-badkitty.png" style={{ height: '175px', width: '175px' }} alt="Logo" />
                <svg viewBox="0 0 220 220">
                  <circle className="circle" cx="110" cy="110" r="100" />
                </svg>
              </NavLink>
            </div>
          </Col>
          <Col xs={9}>
            <Row className="justify-content-end align-items-start" style={{ height: '33.33%', color: 'whitesmoke', paddingTop: '5px' }}>
              {currentUser ? (
                <div className="d-flex align-items-start">
                  <span className="mr-2" style={{ marginTop: '3px', fontWeight: 'var(--font-weight-light)' }}>
                    Logged in as <span style={{ fontWeight: 'var(--font-weight-bold)' }}>{currentUser.email}</span>
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline-light btn-sm logout-button">
                    Log Out
                  </button>
                </div>
              ) : (
                <NavLink to="/login" className="btn btn-outline-light btn-sm">
                  Log In
                </NavLink>
              )}
            </Row>
            <Row className="align-items-center" style={{ height: '33.33%' }}>
              <nav className="w-100 navbar-nav" style={{ position: 'relative' }}>
                <div className="nav-underline" ref={underlineRef}></div>
                <ul className="navbar-nav d-flex flex-row">
                  <li className="nav-item">
                    {location.pathname !== '/createAccount' && (
                      <OverlayTrigger
                        placement="bottom-start"
                        overlay={
                          <Tooltip className="custom-tooltip create-account">
                            Enroll now, for an <i>offer you can’t refuse.</i>
                          </Tooltip>
                        }
                        popperConfig={createPopperConfig(TOOLTIP_OFFSETS.createAccount.box, TOOLTIP_OFFSETS.createAccount.vertical)}
                      >
                        <NavLink
                          to="/createAccount"
                          className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                        >
                          Create Account
                        </NavLink>
                      </OverlayTrigger>
                    )}
                    {location.pathname === '/createAccount' && (
                      <span className="nav-link custom-link-color active-nav-item">Create Account</span>
                    )}
                  </li>
                  <li className="nav-item">
                    {location.pathname !== '/deposit' && (
                      <OverlayTrigger
                        placement="bottom-start"
                        overlay={
                          <Tooltip className="custom-tooltip deposit">
                            {/* Deposit now, thank us later. */}
                            {/* Safety boxes are the <i>greatest receptacles of loot</i> in the world. */}
                            Hide your stash in <i>someone else's problems</i>.
                          </Tooltip>
                        }
                        popperConfig={createPopperConfig(TOOLTIP_OFFSETS.deposit.box, TOOLTIP_OFFSETS.deposit.vertical)}
                      >
                        <NavLink
                          to="/deposit"
                          className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                        >
                          Deposit
                        </NavLink>
                      </OverlayTrigger>
                    )}
                    {location.pathname === '/deposit' && (
                      <span className="nav-link custom-link-color active-nav-item">Deposit</span>
                    )}
                  </li>
                  <li className="nav-item">
                    {location.pathname !== '/withdraw' && (
                      <OverlayTrigger
                        placement="bottom-start"
                        overlay={
                          <Tooltip className="custom-tooltip withdraw">
                            {/* Leave the sum, <i>take the cannoli</i>. */}
                            {/* Retrieve your hidden stash, knowing that <i>timing is everything</i>. */}
                            {/* You don't leave the stash behind. <i>You get the money when it's time.</i> */}
                            Snag some green <i>when you're lean.</i>
                          </Tooltip>
                        }
                        popperConfig={createPopperConfig(TOOLTIP_OFFSETS.withdraw.box, TOOLTIP_OFFSETS.withdraw.vertical)}
                      >
                        <NavLink
                          to="/withdraw"
                          className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                        >
                          Withdraw
                        </NavLink>
                      </OverlayTrigger>
                    )}
                    {location.pathname === '/withdraw' && (
                      <span className="nav-link custom-link-color active-nav-item">Withdraw</span>
                    )}
                  </li>
                  <li className="nav-item">
                    {location.pathname !== '/alldata' && (
                      <OverlayTrigger
                        placement="bottom-end"
                        overlay={
                          <Tooltip className="custom-tooltip all-data">
                            Knowledge of the books is <i>knowledge of the game</i>. 
                          </Tooltip>
                        }
                        popperConfig={createPopperConfig(TOOLTIP_OFFSETS.allData.box, TOOLTIP_OFFSETS.allData.vertical)}
                      >
                        <NavLink
                          to="/alldata"
                          className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                        >
                          All Data
                        </NavLink>
                      </OverlayTrigger>
                    )}
                    {location.pathname === '/alldata' && (
                      <span className="nav-link custom-link-color active-nav-item">All Data</span>
                    )}
                  </li>
                </ul>
              </nav>
            </Row>
            <Row style={{ height: '33.33%' }}>
              <Col></Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </nav>
  );
  
}

export default NavBar;
