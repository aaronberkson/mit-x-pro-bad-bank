import React from 'react';
import { Card } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

function Home() {
  const nodeRef = React.useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      appear={true}
      timeout={500}
      classNames="fade"
      unmountOnExit
    >
      <Card
        ref={nodeRef}
        bg="dark"
        text="white"
        className="home-card"
        style={{ position: 'relative', padding: '8px', height: 'auto', marginTop: '8px' }} // Adjust marginTop as needed
      >
        <div style={{ position: 'relative', height: '0', paddingBottom: '77.5%', overflow: 'hidden' }}>
          <img 
            src="/images/badbank-welcome-desk.webp" 
            className="img-fluid" 
            alt="Responsive image" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              objectFit: 'cover', 
              objectPosition: 'center -99px' // Adjust this value to move the image up or down
            }} 
          />
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            width: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            textAlign: 'center', 
            padding: '10px 0' 
          }}>
            <div className="raleway-small-caps-bold" style={{ fontSize: '1.75rem' }}>
              Welcome to Bad Bank.
            </div>
            <div className="raleway-italic" style={{ fontSize: '1.15rem' }}>
              “Where the <span className="bright-green">green</span> gets stashed, no questions asked.”
            </div>
          </div>
        </div>
      </Card>
    </CSSTransition>
  );
}

export default Home;
