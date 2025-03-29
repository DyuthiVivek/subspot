import React, { useState, useEffect } from 'react';
import './Market.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import ChatIcon from './ChatIcon'; 

function Friends() {
  const [activeTab, setActiveTab] = useState('suggested');
  const [searchTerm, setSearchTerm] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  // const API_BASE_URL = 'http://localhost:8000/subspot/';
  const API_BASE_URL = 'https://subspot.onrender.com/subspot/';


  //user dropdown
  useEffect(() => {
    fetch(`${API_BASE_URL}auth/user/`, { credentials: 'include' })
      .then(res => {
        if (res.status === 401) {
          navigate('/');
          return Promise.reject('Not authenticated');
        }
        return res.json();
      })
      .then(data => setUserInfo({ username: data.username, email: data.email }))
      .catch(err => console.error('Error fetching user info:', err));
  }, [navigate]);

  const handleLogout = () => {
    fetch(`${API_BASE_URL}auth/logout/`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        setIsDropdownOpen(false);
        navigate('/');
      })
      .catch(err => console.error('Logout error:', err));
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


  // Sample Suggested Friends data
  const [suggestedFriends, setSuggestedFriends] = useState([
    { id: 1, name: 'John Doe', mutual: '2 mutual friends' },
    { id: 2, name: 'Alice Johnson', mutual: '4 mutual friends' },
    { id: 3, name: 'Mark Williams', mutual: '1 mutual friend' },
  ]);

  // Sample My Friends data
  const [myFriends, setMyFriends] = useState([
    { id: 101, name: 'Bob Smith', mutual: '1 mutual friend' },
  ]);

  // Handle tab change
  const handleTabChange = (tab) => setActiveTab(tab);

  // Show pop-up message
  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  // Simulate sending connection request
  const handleConnect = (id) => {
    const friendToConnect = suggestedFriends.find((f) => f.id === id);
    if (friendToConnect) {
      showPopupMessage('Connection request sent');
    }
  };

  // Remove friend from My Friends
  const handleRemove = (id) => {
    setMyFriends((prev) => prev.filter((f) => f.id !== id));
  };

  // Determine which list to display based on activeTab
  const displayedList = activeTab === 'suggested' ? suggestedFriends : myFriends;

  // Filter by search term
  const filteredList = displayedList.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="market-container friends-container">
      {/* Header / Navbar */}
      <header className="market-header">
        <nav className="market-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/market" className="nav-link">Market</Link>
          <Link to="/friends" className="nav-link active">Friends</Link>
          <div className="user-icon">
            <FontAwesomeIcon icon={faCircleUser} onClick={toggleDropdown} />
            {isDropdownOpen && (
              <div className="user-dropdown">
                <p>Username: <span className="value">{userInfo.username}</span></p>
                <p>Email: <span className="value">{userInfo.email}</span></p>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
          {/* ChatIcon added next to user icon */}
          <div style={{ marginLeft: '20px' }}>
            <ChatIcon />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="market-content">
        {/* Toggle Buttons */}
        <div className="subscription-toggle" style={{ marginBottom: '20px' }}>
          <button
            className={`toggle-button ${activeTab === 'suggested' ? 'active' : ''}`}
            onClick={() => handleTabChange('suggested')}
          >
            Suggested Friends
          </button>
          <button
            className={`toggle-button ${activeTab === 'myFriends' ? 'active' : ''}`}
            onClick={() => handleTabChange('myFriends')}
          >
            My Friends
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search Friends"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Friends List */}
        {activeTab === 'suggested' && (
          <div className="friends-list">
            {filteredList.length > 0 ? (
              filteredList.map((friend) => (
                <div className="subscription-item" key={friend.id}>
                  <div className="subscription-left">
                    <div className="subscription-text">
                      <div className="subscription-name">{friend.name}</div>
                      <div className="subscription-duration">{friend.mutual}</div>
                    </div>
                  </div>
                  <div className="subscription-right">
                    <button
                      className="action-button"
                      onClick={() => handleConnect(friend.id)}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results-message">No search match found</p>
            )}
          </div>
        )}

        {activeTab === 'myFriends' && (
          <div className="friends-list">
            {filteredList.length > 0 ? (
              filteredList.map((friend) => (
                <Link 
                  to={`/chat/${friend.id}`} 
                  key={friend.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="subscription-item">
                    <div className="subscription-left">
                      <div className="subscription-text">
                        <div className="subscription-name">{friend.name}</div>
                        <div className="subscription-duration">{friend.mutual}</div>
                      </div>
                    </div>
                    <div className="subscription-right">
                      <button className="action-button" onClick={(e) => { 
                        e.preventDefault(); 
                        handleRemove(friend.id);
                      }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-results-message">No search match found</p>
            )}
          </div>
        )}

        {/* Popup Notification */}
        {showPopup && <div className="popup-message">{popupMessage}</div>}
      </main>
    </div>
  );
}

export default Friends;
