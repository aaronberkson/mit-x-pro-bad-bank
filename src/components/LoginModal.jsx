import React, { useState } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { XCircle } from 'react-bootstrap-icons';
import '../css/Login.css'; // Ensure this import is present

function LoginModal({
  modalShow,
  handleModalClose,
  users,
  handleEmailSelect,
  applySelectedUser,
}) {
  const MODAL_WIDTH = '720px'; // Set your desired width here
  const MODAL_HEIGHT = '390px'; // Set your desired height here
  const TITLE_BAR_HEIGHT = '40px'; // Set your desired title bar height here
  const IMAGE_SIZE = '332px'; // Set your desired image size here

  const TITLE_BAR_MARGIN_TOP = '0'; // Set your desired title bar top margin here
  const TITLE_BAR_MARGIN_BOTTOM = '0'; // Set your desired title bar bottom margin here
  const TITLE_BAR_MARGIN_LEFT = '0'; // Set your desired title bar left margin here
  const TITLE_BAR_MARGIN_RIGHT = '0'; // Set your desired title bar right margin here

  const TITLE_BAR_PADDING_TOP = '0'; // Set your desired title bar top padding here
  const TITLE_BAR_PADDING_BOTTOM = '0'; // Set your desired title bar bottom padding here
  const TITLE_BAR_PADDING_LEFT = '15px'; // Set your desired title bar left padding here
  const TITLE_BAR_PADDING_RIGHT = '6px'; // Set your desired title bar right padding here

  const TITLE_BAR_FONT_SIZE = '20px'; // Set your desired title bar font size here
  const TITLE_BAR_FONT_WEIGHT = 'var(--font-weight-bold)'; // Set your desired title bar font weight here

  const MODAL_BODY_MARGIN_TOP = '0'; // Set your desired modal body top margin here
  const MODAL_BODY_MARGIN_BOTTOM = '0'; // Set your desired modal body bottom margin here
  const MODAL_BODY_MARGIN_LEFT = '0'; // Set your desired modal body left margin here
  const MODAL_BODY_MARGIN_RIGHT = '0'; // Set your desired modal body right margin here

  const MODAL_BODY_PADDING_TOP = '6px'; // Set your desired modal body top padding here
  const MODAL_BODY_PADDING_BOTTOM = '0px'; // Set your desired modal body bottom padding here
  const MODAL_BODY_PADDING_LEFT = '5px'; // Set your desired modal body left padding here
  const MODAL_BODY_PADDING_RIGHT = '0px'; // Set your desired modal body right padding here

  const IMAGE_MARGIN_TOP = '0'; // Set your desired image top margin here
  const IMAGE_MARGIN_BOTTOM = '0'; // Set your desired image bottom margin here
  const IMAGE_MARGIN_LEFT = '0'; // Set your desired image left margin here
  const IMAGE_MARGIN_RIGHT = '0'; // Set your desired image right margin here

  const IMAGE_PADDING_TOP = '0'; // Set your desired image top padding here
  const IMAGE_PADDING_BOTTOM = '0'; // Set your desired image bottom padding here
  const IMAGE_PADDING_LEFT = '0'; // Set your desired image left padding here
  const IMAGE_PADDING_RIGHT = '0'; // Set your desired image right padding here

  const HEADING_MARGIN_TOP = '10px'; // Set your desired heading top margin here
  const HEADING_MARGIN_BOTTOM = '10px'; // Set your desired heading bottom margin here

  const FORM_TITLE_MARGIN_TOP = '-6px'; // Set your desired form title top margin here
  const FORM_TITLE_MARGIN_BOTTOM = '0px'; // Set your desired form title bottom margin here
  const FORM_TITLE_PADDING_TOP = '0'; // Set your desired form title top padding here
  const FORM_TITLE_PADDING_BOTTOM = '6px'; // Set your desired form title bottom padding here
  const FORM_TITLE_FONT_WEIGHT = 'var(--font-weight-bold)'; // Set your desired form title font weight here

  const SUBTITLE_MARGIN_TOP = '10px'; // Set your desired subtitle top margin here
  const SUBTITLE_MARGIN_BOTTOM = '0px'; // Set your desired subtitle bottom margin here
  const SUBTITLE_PADDING_TOP = '0'; // Set your desired subtitle top padding here
  const SUBTITLE_PADDING_BOTTOM = '0'; // Set your desired subtitle bottom padding here
  const SUBTITLE_FONT_WEIGHT = 'var(--font-weight-medium-bold)'; // Set your desired subtitle font weight here

  const RADIO_BUTTON_MARGIN_TOP = '3px'; // Set your desired radio button top margin here
  const RADIO_BUTTON_MARGIN_BOTTOM = '0px'; // Set your desired radio button bottom margin here
  const RADIO_BUTTON_PADDING_TOP = '0px'; // Set your desired radio button top padding here
  const RADIO_BUTTON_PADDING_BOTTOM = '0'; // Set your desired radio button bottom padding here

  const EMAIL_MARGIN_TOP = '0px'; // Set your desired email top margin here
  const EMAIL_MARGIN_BOTTOM = '-2px'; // Set your desired email bottom margin here
  const EMAIL_PADDING_TOP = '0'; // Set your desired email top padding here
  const EMAIL_PADDING_BOTTOM = '0'; // Set your desired email bottom padding here

  const EMAIL_COLOR = 'black'; // Set your desired email font color here
  const EMAIL_WEIGHT = 'var(--font-weight-medium)'; // Set your desired email font weight here
  const EMAIL_SELECTED_COLOR = '#007bff'; // Set your desired selected email font color here
  const EMAIL_SELECTED_WEIGHT = 'var(--font-weight-bold)'; // Set your desired selected email font weight here

  const BUTTON_MARGIN_TOP = '15px'; // Set your desired button top margin here
  const BUTTON_MARGIN_BOTTOM = '0'; // Set your desired button bottom margin here
  const BUTTON_PADDING_TOP = '0'; // Set your desired button top padding here
  const BUTTON_PADDING_BOTTOM = '0'; // Set your desired button bottom padding here

  const BUTTON_HEIGHT = '40px'; // Set your desired button height here

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSelection = (email, password) => {
    if (selectedEmail === email) {
      setSelectedEmail(null);
      handleEmailSelect(null, null);
      setIsFormValid(false); // Set form validity to false
    } else {
      setSelectedEmail(email);
      handleEmailSelect(email, password);
      setIsFormValid(true); // Set form validity to true
    }
  };

  return (
    <Modal
      show={modalShow}
      onHide={handleModalClose}
      centered
      animation={true}
      dialogClassName="modal-background-login"
    >
      <div 
        className="modal-content-custom-login" 
        style={{ 
          width: MODAL_WIDTH, 
          height: MODAL_HEIGHT, 
          margin: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Modal.Header 
          className="modal-header-custom-login"
          style={{ 
            backgroundColor: '#a9a9a9', 
            borderTopLeftRadius: '8px', 
            borderTopRightRadius: '8px',
            height: TITLE_BAR_HEIGHT, // Apply title bar height
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: TITLE_BAR_MARGIN_TOP, // Apply title bar top margin
            marginBottom: TITLE_BAR_MARGIN_BOTTOM, // Apply title bar bottom margin
            marginLeft: TITLE_BAR_MARGIN_LEFT, // Apply title bar left margin
            marginRight: TITLE_BAR_MARGIN_RIGHT, // Apply title bar right margin
            paddingTop: TITLE_BAR_PADDING_TOP, // Apply title bar top padding
            paddingBottom: TITLE_BAR_PADDING_BOTTOM, // Apply title bar bottom padding
            paddingLeft: TITLE_BAR_PADDING_LEFT, // Apply title bar left padding
            paddingRight: TITLE_BAR_PADDING_RIGHT, // Apply title bar right padding
          }}
        >
          <Modal.Title style={{ 
            lineHeight: TITLE_BAR_HEIGHT,
            fontSize: TITLE_BAR_FONT_SIZE, // Apply title bar font size
            fontWeight: TITLE_BAR_FONT_WEIGHT // Apply title bar font weight
          }}>Use Skeleton Key</Modal.Title>
          <XCircle 
            style={{ cursor: 'pointer' }} 
            size={24} 
            onClick={handleModalClose} 
          />
        </Modal.Header>
        <Modal.Body 
          className="modal-body-custom-login"
          style={{ 
            backgroundColor: '#a9a9a9', 
            borderBottomLeftRadius: '8px', 
            borderBottomRightRadius: '8px',
            flexGrow: 1, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start', // Align items to the left
            justifyContent: 'flex-start', // Align items to the top
            marginTop: MODAL_BODY_MARGIN_TOP, // Apply modal body top margin
            marginBottom: MODAL_BODY_MARGIN_BOTTOM, // Apply modal body bottom margin
            marginLeft: MODAL_BODY_MARGIN_LEFT, // Apply modal body left margin
            marginRight: MODAL_BODY_MARGIN_RIGHT, // Apply modal body right margin
            paddingTop: MODAL_BODY_PADDING_TOP, // Apply modal body top padding
            paddingBottom: MODAL_BODY_PADDING_BOTTOM, // Apply modal body bottom padding
            paddingLeft: MODAL_BODY_PADDING_LEFT, // Apply modal body left padding
            paddingRight: MODAL_BODY_PADDING_RIGHT, // Apply modal body right padding
          }}
        >
          <div style={{ display: 'flex', padding: '9px', boxSizing: 'border-box', flex: 1 }}>
            <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <img 
                src="/images/skeleton-key-plain-1.webp" 
                alt="Skeleton Key" 
                style={{ 
                  width: IMAGE_SIZE, // Apply image size for width
                  height: IMAGE_SIZE, // Apply image size for height
                  objectFit: 'contain',
                  marginTop: IMAGE_MARGIN_TOP, // Apply image top margin
                  marginBottom: IMAGE_MARGIN_BOTTOM, // Apply image bottom margin
                  marginLeft: IMAGE_MARGIN_LEFT, // Apply image left margin
                  marginRight: IMAGE_MARGIN_RIGHT, // Apply image right margin
                  paddingTop: IMAGE_PADDING_TOP, // Apply image top padding
                  paddingBottom: IMAGE_PADDING_BOTTOM, // Apply image bottom padding
                  paddingLeft: IMAGE_PADDING_LEFT, // Apply image left padding
                  paddingRight: IMAGE_PADDING_RIGHT, // Apply image right padding
                  borderRadius: '6px'
                }}
              />
            </div>
            <Container style={{ flex: '1 1 auto', padding: '15px' }}>
              <h5 style={{
                marginTop: FORM_TITLE_MARGIN_TOP,
                marginBottom: FORM_TITLE_MARGIN_BOTTOM,
                paddingTop: FORM_TITLE_PADDING_TOP,
                paddingBottom: FORM_TITLE_PADDING_BOTTOM,
                fontWeight: FORM_TITLE_FONT_WEIGHT // Apply form title font weight
              }}>Log in as</h5>
              <Form>
                <h6 style={{
                  marginTop: SUBTITLE_MARGIN_TOP,
                  marginBottom: SUBTITLE_MARGIN_BOTTOM,
                  paddingTop: SUBTITLE_PADDING_TOP,
                  paddingBottom: SUBTITLE_PADDING_BOTTOM,
                  fontWeight: SUBTITLE_FONT_WEIGHT // Apply subtitle font weight
                }}>Administrator</h6>
                {users.filter(user => user.email === 'admin@badbank.com').map((user, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
                    <input 
                      type="radio"
                      name="emailOptions"
                      value={user.email}
                      checked={selectedEmail === user.email}
                      onChange={() => handleSelection(user.email, user.password)}
                      style={{
                        marginTop: RADIO_BUTTON_MARGIN_TOP,
                        marginBottom: RADIO_BUTTON_MARGIN_BOTTOM,
                        paddingTop: RADIO_BUTTON_PADDING_TOP,
                        paddingBottom: RADIO_BUTTON_PADDING_BOTTOM,
                        marginRight: '8px',
                        cursor: selectedEmail === user.email ? 'default' : 'pointer', // Disable cursor when selected
                        accentColor: selectedEmail === user.email ? EMAIL_SELECTED_COLOR : 'black' // Make radio button black until selected
                      }}
                      disabled={selectedEmail === user.email} // Disable radio button when selected
                    />
                    <label 
                      style={{
                        marginTop: EMAIL_MARGIN_TOP,
                        marginBottom: EMAIL_MARGIN_BOTTOM,
                        paddingTop: EMAIL_PADDING_TOP,
                        paddingBottom: EMAIL_PADDING_BOTTOM,
                        cursor: selectedEmail === user.email ? 'default' : 'pointer', // Disable cursor when selected
                        fontWeight: selectedEmail === user.email ? EMAIL_SELECTED_WEIGHT : EMAIL_WEIGHT, // Apply email font weight
                        color: selectedEmail === user.email ? EMAIL_SELECTED_COLOR : EMAIL_COLOR, // Apply email font color
                        lineHeight: '1.6', 
                        display: 'flex', 
                        alignItems: 'center',
                        textDecoration: 'none' // Ensure underline is initially none
                      }}
                      onMouseEnter={(e) => {
                        if (selectedEmail !== user.email) e.target.style.textDecoration = 'underline';
                      }} 
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                      onClick={() => selectedEmail !== user.email && handleSelection(user.email, user.password)}
                    >
                      {user.email}
                    </label>
                  </div>
                ))}
                <h6 style={{
                  marginTop: SUBTITLE_MARGIN_TOP,
                  marginBottom: SUBTITLE_MARGIN_BOTTOM,
                  paddingTop: SUBTITLE_PADDING_TOP,
                  paddingBottom: SUBTITLE_PADDING_BOTTOM,
                  fontWeight: SUBTITLE_FONT_WEIGHT // Apply subtitle font weight
                }}>Account Holder</h6>
                {users.filter(user => user.email !== 'admin@badbank.com').sort((a, b) => {
                  const lastNameA = a.name ? a.name.split(' ').slice(-1)[0].toLowerCase() : '';
                  const lastNameB = b.name ? b.name.split(' ').slice(-1)[0].toLowerCase() : '';
                  return lastNameA.localeCompare(lastNameB);
                }).map((user, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
                    <input 
                      type="radio"
                      name="emailOptions"
                      value={user.email}
                      checked={selectedEmail === user.email}
                      onChange={() => handleSelection(user.email, user.password)}
                      style={{
                        marginTop: RADIO_BUTTON_MARGIN_TOP,
                        marginBottom: RADIO_BUTTON_MARGIN_BOTTOM,
                        paddingTop: RADIO_BUTTON_PADDING_TOP,
                        paddingBottom: RADIO_BUTTON_PADDING_BOTTOM,
                        marginRight: '8px',
                        cursor: selectedEmail === user.email ? 'default' : 'pointer', // Disable cursor when selected
                        accentColor: selectedEmail === user.email ? EMAIL_SELECTED_COLOR : 'black' // Make radio button black until selected
                      }}
                      disabled={selectedEmail === user.email} // Disable radio button when selected
                    />
                    <label 
                      style={{
                        marginTop: EMAIL_MARGIN_TOP,
                        marginBottom: EMAIL_MARGIN_BOTTOM,
                        paddingTop: EMAIL_PADDING_TOP,
                        paddingBottom: EMAIL_PADDING_BOTTOM,
                        cursor: selectedEmail === user.email ? 'default' : 'pointer', // Disable cursor when selected
                        fontWeight: selectedEmail === user.email ? EMAIL_SELECTED_WEIGHT : EMAIL_WEIGHT, // Apply email font weight
                        color: selectedEmail === user.email ? EMAIL_SELECTED_COLOR : EMAIL_COLOR, // Apply email font color
                        lineHeight: '1.6', 
                        display: 'flex', 
                        alignItems: 'center',
                        textDecoration: 'none' // Ensure underline is initially none
                      }}
                      onMouseEnter={(e) => {
                        if (selectedEmail !== user.email) e.target.style.textDecoration = 'underline';
                      }} 
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                      onClick={() => selectedEmail !== user.email && handleSelection(user.email, user.password)}
                    >
                      {user.email}
                    </label>
                  </div>
                ))}
              </Form>
              <Button 
                variant="primary" 
                type="button" 
                className="button-login-custom" 
                onClick={applySelectedUser} 
                disabled={!isFormValid} 
                style={{
                  marginTop: BUTTON_MARGIN_TOP,
                  marginBottom: BUTTON_MARGIN_BOTTOM,
                  paddingTop: BUTTON_PADDING_TOP,
                  paddingBottom: BUTTON_PADDING_BOTTOM,
                  height: BUTTON_HEIGHT, // Apply button height
                  outline: 'none',
                  boxShadow: 'none',
                  cursor: 'pointer'
                }}>
                Use Saved Credentials
              </Button>
            </Container>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
}

export default LoginModal;
