import React, { useState } from 'react';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const navigate = useNavigate();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };
  const handleLogin = () => {
    // auth
    closeLoginModal();
    navigate('/dashboard');
  };
  return (
    <div className="App">
      <header className="App-header">
        <div className="Navbar">
          <div className="Logo">SubSpot</div>
          <div className="NavLinks">
            
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
            <a href="#" onClick={openLoginModal}>Log In</a>
          </div>
        </div>

        <div className="Content">
          <h1>YOUR SMART</h1>
          <h1>SUBSCRIPTION MANAGER</h1>
          <button className="GetStartedButton" onClick={openSignupModal}>Get Started</button>
          <p className="LoginLink">
            Already a member? <span onClick={openLoginModal}>Log In</span>
          </p>
        </div>

        <div className="bottom-left-ellipse"></div>
        <div className="bottom-right-ellipse"></div>
      </header>

      <section id="services"className="OurServicesSection">
        <h2>Our Services</h2>
        <div  className="ServicesContainer">
          <div className="ServiceCard">
            <h3>Subscription Tracking</h3>
            <p>
              Stay on top of your subscriptions effortlessly with our
              tracking system, ensuring you never miss a renewal date or
              unexpected charge. Easily categorize and manage all your
              subscriptions in one convenient dashboard.
            </p>
          </div>
          <div className="ServiceCard">
            <h3>Expense Prediction</h3>
            <p>
              Take control of your finances with our expense prediction feature
              that analyzes your usage patterns to forecast future subscription
              costs, helping you budget more effectively and avoid surprises.
            </p>
          </div>
          <div className="ServiceCard">
            <h3>Subscription Marketplace</h3>
            <p>
              Discover a seamless and secure platform where users can list
              their subscriptions for sale, and buyers can purchase them
              confidently with our escrow system, guaranteeing a smooth
              transaction for both parties.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="ContactSection">
        <div className="ContactInfo">
          <div>
            <FontAwesomeIcon icon={faPhone} /> +91 9696234647
          </div>
          <div>
            <FontAwesomeIcon icon={faEnvelope} /> support@subspot.com
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="LoginModalOverlay">
          <div className="LoginModal">
            <button className="CloseButton" onClick={closeLoginModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Log In</h2>
            <div className="InputGroup">
              <label>Username:</label>
              <input type="text" placeholder="Enter username" />
            </div>
            <div className="InputGroup">
              <label>Password:</label>
              <input type="password" placeholder="Enter password" />
            </div>
            <button className="LoginButton">Log In</button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="LoginModalOverlay">
          <div className="LoginModal" data-modal-type="signup">
            <button className="CloseButton" onClick={closeSignupModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Sign Up</h2>
            <div className="InputGroup">
              <label>Name:</label>
              <input type="text" placeholder="Enter name" />
            </div>
            <div className="InputGroup">
              <label>Email:</label>
              <input type="email" placeholder="Enter email" />
            </div>
            <div className="InputGroup">
              <label>Username:</label>
              <input type="text" placeholder="Enter username" />
            </div>
            <div className="InputGroup">
              <label>Password:</label>
              <input type="password" placeholder="Enter password" />
            </div>
            <button className="LoginButton">Sign Up</button>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default LandingPage;