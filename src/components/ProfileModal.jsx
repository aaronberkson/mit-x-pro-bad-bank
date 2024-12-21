import React from 'react';
import { Modal, Image, Button } from 'react-bootstrap';
import { XCircle } from 'react-bootstrap-icons';

function ProfileModal({ show, handleClose, profilePic, name, size = 600 }) {
  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Dark overlay background
  };

  const modalDialogStyle = {
    width: `${size}px`, // Explicit width
    height: `calc(${size}px + 55px)`, // Explicit height with header adjustment
    margin: '0 auto', // Ensure centered horizontally
    borderRadius: '3px', // Set border radius to 3px
    backgroundColor: 'transparent', // Make it transparent to avoid white box
    position: 'absolute', // Ensure absolute positioning
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Center the modal
  };

  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#a9a9a9',
    color: 'black',
    borderBottom: 'none', // Ensure removal of bottom border
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    fontWeight: 600, // Use medium-bold weight for the title
    fontSize: '20px', // Increase the font size of the title
    paddingLeft: '12px', // Add left padding to the title
  };

  const buttonStyle = {
    color: 'black',
    padding: '0',
  };

  const imageContainerStyle = {
    width: '100%',
    height: `${size}px`, // Apply size for height
    backgroundColor: '#a9a9a9', // Match the title bar color
    display: 'block',
    paddingLeft: '9px',
    paddingRight: '9px',
    paddingBottom: '9px',
    borderBottomLeftRadius: '3px',
    borderBottomRightRadius: '3px',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0', // Inherit border radius from container
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="modal-background-profile"
      style={modalStyle}
    >
      <div style={modalDialogStyle} className="modal-dialog-custom">
        <div style={modalHeaderStyle} className="modal-header-custom">
          <span>{name}</span>
          <Button variant="link" onClick={handleClose} style={buttonStyle}>
            <XCircle size={24} />
          </Button>
        </div>
        <div style={imageContainerStyle} className="image-container-custom">
          <Image src={profilePic} style={imageStyle} />
        </div>
      </div>
    </Modal>
  );
}

export default ProfileModal;
