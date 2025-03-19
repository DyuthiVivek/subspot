import React, { useState } from 'react';
import './Market.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Market() {
  // Track which tab is active: "buy" or "sell"
  const [activeTab, setActiveTab] = useState('buy');
  // For searching subscriptions
  const [searchTerm, setSearchTerm] = useState('');

  // Show/hide the Sell form
  const [showSellForm, setShowSellForm] = useState(false);
  // Show/hide the Sold History
  const [showSoldHistory, setShowSoldHistory] = useState(false);

  // For the "Buy" modal
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Icons for each subscription
  const subscriptionIcons = {
    'Spotify Premium': 'https://img.icons8.com/fluency/48/spotify.png',
    'Netflix': 'https://img.icons8.com/color/48/netflix-desktop-app.png',
    'Amazon Prime': 'https://img.icons8.com/color/48/amazon.png',
    'YouTube Premium': 'https://img.icons8.com/color/48/youtube-play.png'
  };

  // Sample subscriptions for "Buy" tab
  const subscriptionItems = [
    { id: 1, name: 'Spotify Premium', duration: '1 month', price: 149 },
    { id: 2, name: 'Netflix', duration: '2 months', price: 299 },
    { id: 3, name: 'Amazon Prime', duration: '1 month', price: 129 },
    { id: 4, name: 'YouTube Premium', duration: '2 months', price: 249 },
  ];

  // Items currently for sale (in the Sell tab)
  const [sellItems, setSellItems] = useState([
    { id: 1, name: 'YouTube Premium', duration: '2 months ago', price: 599 },
    { id: 2, name: 'Spotify Premium', duration: '1 month ago', price: 199 },
  ]);

  // Items that have been sold (in the Sold History)
  const [soldItems, setSoldItems] = useState([]);

  // For adding a new subscription to sell
  const [newSellSubscription, setNewSellSubscription] = useState({
    name: '',
    duration: '',
    price: ''
  });

  // Filter items based on search (Buy tab)
  const filteredItems = subscriptionItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle switching between Buy and Sell tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // If switching away from Sell, hide the form and sold history
    if (tab === 'buy') {
      setShowSellForm(false);
      setShowSoldHistory(false);
    }
  };

  // Mark subscription as sold: remove from sellItems, add to soldItems
  const handleSold = (id) => {
    const itemToSell = sellItems.find((item) => item.id === id);
    if (itemToSell) {
      setSellItems((prevItems) => prevItems.filter((it) => it.id !== id));
      setSoldItems((prevSold) => [...prevSold, itemToSell]);
    }
  };

  // Delete a sell item from the list (completely remove it)
  const handleDeleteSellItem = (id) => {
    setSellItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Toggle the sell form on/off
  const handleAddSubscriptionClick = () => {
    setShowSellForm((prev) => !prev);
    setShowSoldHistory(false); // hide sold history if open
  };

  // Toggle the sold history on/off
  const handleSellHistoryClick = () => {
    setShowSoldHistory((prev) => !prev);
    setShowSellForm(false); // hide sell form if open
  };

  // Handle changes in the sell form fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewSellSubscription((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the sell form to add a new item
  const handleSellFormSubmit = (e) => {
    e.preventDefault();
    if (!newSellSubscription.name || !newSellSubscription.price || !newSellSubscription.duration) {
      alert("Please fill all fields.");
      return;
    }
    const newItem = {
      id: Date.now(),
      name: newSellSubscription.name,
      duration: newSellSubscription.duration,
      price: parseInt(newSellSubscription.price, 10) || 0
    };
    setSellItems((prev) => [...prev, newItem]);
    // Clear form
    setNewSellSubscription({ name: '', duration: '', price: '' });
    setShowSellForm(false);
  };

  // Handle "Buy" button click in the Buy tab
  const handleBuyClick = (item) => {
    setSelectedItem(item);
    setShowBuyModal(true);
  };

  // Close the Buy modal
  const handleCloseBuyModal = () => {
    setShowBuyModal(false);
    setSelectedItem(null);
  };

  // Single button: Contact Seller (placeholder logic)
  const handleContactSeller = () => {
    alert(`Contacting the seller of ${selectedItem?.name}...`);
    handleCloseBuyModal();
  };

  return (
    <div className="market-container">
      {/* Header / Navbar */}
      <header className="market-header">
        <nav className="market-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/market" className="nav-link active">Market</Link>
          <Link to="/friends" className="nav-link">Friends</Link>
          <div className="user-icon">
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="market-content">
        {/* Toggle Buttons */}
        <div className="subscription-toggle">
          <button
            className={`toggle-button ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => handleTabChange('buy')}
          >
            Buy Subscription
          </button>
          <button
            className={`toggle-button ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => handleTabChange('sell')}
          >
            Sell Subscription
          </button>
        </div>

        {/* Search Bar (only for Buy) */}
        {activeTab === 'buy' && (
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Buy Tab */}
        {activeTab === 'buy' && (
          <div className="buy-section">
            {filteredItems.map(item => (
              <div className="subscription-item" key={item.id}>
                {/* Left side: Icon + Name/Duration */}
                <div className="subscription-left">
                  <div className="subscription-icon-container">
                    {subscriptionIcons[item.name] ? (
                      <img
                        src={subscriptionIcons[item.name]}
                        alt={item.name}
                        className="subscription-icon"
                      />
                    ) : (
                      <div className="empty-icon-space"></div>
                    )}
                  </div>
                  <div className="subscription-text">
                    <div className="subscription-name">{item.name}</div>
                    <div className="subscription-duration">{item.duration}</div>
                  </div>
                </div>
                {/* Right side: Price + Buy button */}
                <div className="subscription-right">
                  <span className="subscription-price">Rs. {item.price}</span>
                  <button
                    className="action-button"
                    onClick={() => handleBuyClick(item)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sell Tab */}
        {activeTab === 'sell' && (
          <div className="sell-section">
            {/* Sell History List (unsold items) */}
            <div className="sell-history">
              {sellItems.map((item) => (
                <div className="subscription-item" key={item.id}>
                  <div className="subscription-left">
                    <div className="subscription-icon-container">
                      {subscriptionIcons[item.name] ? (
                        <img
                          src={subscriptionIcons[item.name]}
                          alt={item.name}
                          className="subscription-icon"
                        />
                      ) : (
                        <div className="empty-icon-space"></div>
                      )}
                    </div>
                    <div className="subscription-text">
                      <div className="subscription-name">{item.name}</div>
                      <div className="subscription-duration">{item.duration}</div>
                    </div>
                  </div>
                  <div className="subscription-right">
                    <span className="subscription-price">Rs. {item.price}</span>
                    <button
                      className="action-button"
                      onClick={() => handleSold(item.id)}
                    >
                      Sold
                    </button>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDeleteSellItem(item.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons for Add Subscription & Sell History */}
            <div className={`sell-buttons-container ${!showSellForm ? 'two-buttons' : 'one-button'}`}>
              {!showSellForm && (
                <button
                  className="action-button add-subscription-button"
                  onClick={handleAddSubscriptionClick}
                >
                  Add to Sell 
                </button>
              )}
              <button
                className="action-button sell-history-button"
                onClick={handleSellHistoryClick}
              >
                History
              </button>
            </div>
            
            {/* Sell Form */}
            {showSellForm && (
              <form className="sell-form" onSubmit={handleSellFormSubmit} required>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={newSellSubscription.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    name="duration"
                    value={newSellSubscription.duration}
                    onChange={handleFormChange}
                    required 
                  >
                    <option value="" disabled>Select Duration</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>
                <div className="form-group" required>
                  <label>Cost</label>
                  <input
                    type="text"
                    name="price"
                    placeholder="Enter cost"
                    value={newSellSubscription.price}
                    onChange={handleFormChange}
                  />
                </div>
                <button className="action-button sell-button" type="submit">
                  Sell Subscription
                </button>
              </form>
            )}

            {/* Sold Items History */}
            {showSoldHistory && (
              <div className="sold-history">
                <h3>Sold History</h3>
                {soldItems.length === 0 ? (
                  <p>No subscriptions sold yet.</p>
                ) : (
                  soldItems.map((item) => (
                    <div className="subscription-item" key={item.id}>
                      <div className="subscription-left">
                        <div className="subscription-icon-container">
                          {subscriptionIcons[item.name] ? (
                            <img
                              src={subscriptionIcons[item.name]}
                              alt={item.name}
                              className="subscription-icon"
                            />
                          ) : (
                            <div className="empty-icon-space"></div>
                          )}
                        </div>
                        <div className="subscription-text">
                          <div className="subscription-name">{item.name}</div>
                          <div className="subscription-duration">{item.duration}</div>
                        </div>
                      </div>
                      <div className="subscription-right">
                        <span className="subscription-price">Rs. {item.price}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: Single "Contact Seller" Button */}
      {showBuyModal && selectedItem && (
        <div className="buy-modal-overlay">
          <div className="buy-modal-content">
            <button className="buy-modal-close" onClick={handleCloseBuyModal}>
              &times;
            </button>
            <h2>Purchase {selectedItem.name}</h2>
            <p>Duration: {selectedItem.duration}</p>
            <p>Price: Rs. {selectedItem.price}</p>

            <div className="buy-modal-actions">
              {/* Single button: Contact Seller */}
              <button className="action-button" onClick={handleContactSeller}>
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Market;
