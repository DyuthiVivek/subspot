import React, { useState, useEffect } from 'react';
import './Market.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

/**
 * Helper function to convert the string duration (e.g. "1 month", "2 months")
 * into a number of days. Adjust as needed.
 */
function parseDurationToDays(durationStr) {
  switch (durationStr) {
    case '1 month':
      return 30;
    case '2 months':
      return 60;
    case '3 months':
      return 90;
    case '6 months':
      return 180;
    case '1 year':
      return 365;
    default:
      return 30; // fallback
  }
}

function Market() {
  // Track which tab is active: "buy", "sell", or "expired"
  const [activeTab, setActiveTab] = useState('buy');
  // For searching subscriptions (Buy tab)
  const [searchTerm, setSearchTerm] = useState('');

  // Show/hide the Sell form
  const [showSellForm, setShowSellForm] = useState(false);
  // Show/hide the Sold History
  const [showSoldHistory, setShowSoldHistory] = useState(false);

  // For the "Buy" modal
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Example icons
  const subscriptionIcons = {
    'Spotify Premium': 'https://img.icons8.com/fluency/48/spotify.png',
    'Netflix': 'https://img.icons8.com/color/48/netflix-desktop-app.png',
    'Amazon Prime': 'https://img.icons8.com/color/48/amazon.png',
    'YouTube Premium': 'https://img.icons8.com/color/48/youtube-play.png'
  };

  // Example user subscriptions (for the "Add to Sell" form)
  const [userSubscriptions] = useState([
    { id: 1, name: 'Spotify Premium', duration: '1 month' },
    { id: 2, name: 'Netflix', duration: '2 months' },
    { id: 3, name: 'Coursera', duration: '1 month' },
    { id: 4, name: 'YouTube Premium', duration: '3 months' },
    { id: 5, name: 'iCloud', duration: '1 month' }
  ]);

  // Sample items in the Buy tab
  const subscriptionItems = [
    { id: 1, name: 'Spotify Premium', duration: '1 month', price: 149 },
    { id: 2, name: 'Netflix', duration: '2 months', price: 299 },
    { id: 3, name: 'Amazon Prime', duration: '1 month', price: 129 },
    { id: 4, name: 'YouTube Premium', duration: '2 months', price: 249 },
  ];

  // Items currently for sale (Sell tab)
  const [sellItems, setSellItems] = useState([
    {
      id: 101,
      name: 'YouTube Premium',
      duration: '2 months ago',
      price: 599,
      validUntil: null,
    },
    {
      id: 102,
      name: 'Spotify Premium',
      duration: '1 month ago',
      price: 199,
      validUntil: null,
    },
  ]);

  // Items that have been sold
  const [soldItems, setSoldItems] = useState([]);

  // Items that expired
  const [expiredItems, setExpiredItems] = useState([
    {
      id: 201,
      name: 'Amazon Prime',
      duration: 'Expired last month',
      price: 129,
      validUntil: null,
    },
    {
      id: 202,
      name: 'Netflix',
      duration: 'Expired 2 weeks ago',
      price: 199,
      validUntil: null,
    },
  ]);

  // For the Sell form
  const [selectedDashboardSub, setSelectedDashboardSub] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  // ----- NEW STATES & FUNCTIONS for inline price editing -----
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Start editing a particular subscription’s price
  const handlePriceEdit = (id, currentPrice) => {
    setEditingPriceId(id);
    setTempPrice(String(currentPrice)); // keep it as string for input
  };

  // Save the updated price
  const handleSavePrice = (id) => {
    setSellItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, price: parseInt(tempPrice, 10) || item.price };
        }
        return item;
      })
    );
    setEditingPriceId(null);
    setTempPrice('');
  };

  // Cancel price editing
  const handleCancelPriceEdit = () => {
    setEditingPriceId(null);
    setTempPrice('');
  };
  // -----------------------------------------------------------

  // Filter items based on search (Buy tab)
  const filteredItems = subscriptionItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle switching between tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'sell') {
      setShowSellForm(false);
      setShowSoldHistory(false);
    }
  };

  // Mark subscription as sold
  const handleSold = (id) => {
    const itemToSell = sellItems.find((item) => item.id === id);
    if (itemToSell) {
      setSellItems((prev) => prev.filter((it) => it.id !== id));
      setSoldItems((prevSold) => [...prevSold, itemToSell]);
    }
  };

  // Delete a sell item
  const handleDeleteSellItem = (id) => {
    setSellItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Toggle the sell form
  const handleAddSubscriptionClick = () => {
    setShowSellForm((prev) => !prev);
    setShowSoldHistory(false);
  };

  // Toggle the sold history
  const handleSellHistoryClick = () => {
    setShowSoldHistory((prev) => !prev);
    setShowSellForm(false);
  };

  // Handle subscription selection in Sell form
  const handleSelectedSubscriptionChange = (e) => {
    setSelectedDashboardSub(e.target.value);
  };

  // Submit the Sell form
  const handleSellFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedDashboardSub || !sellPrice) {
      alert("Please select a subscription and enter a selling price.");
      return;
    }
    const chosenSub = userSubscriptions.find(
      (sub) => sub.name === selectedDashboardSub
    );
    if (!chosenSub) {
      alert("Invalid subscription selected.");
      return;
    }

    const now = Date.now();
    const days = parseDurationToDays(chosenSub.duration);
    const validUntil = now + days * 24 * 60 * 60 * 1000;

    const newItem = {
      id: Date.now(),
      name: chosenSub.name,
      duration: chosenSub.duration,
      price: parseInt(sellPrice, 10) || 0,
      validUntil,
    };

    setSellItems((prev) => [...prev, newItem]);
    setSelectedDashboardSub('');
    setSellPrice('');
    setShowSellForm(false);
  };

  // Handle "Buy" button
  const handleBuyClick = (item) => {
    setSelectedItem(item);
    setShowBuyModal(true);
  };

  // Close the Buy modal
  const handleCloseBuyModal = () => {
    setShowBuyModal(false);
    setSelectedItem(null);
  };

  // Single button: Contact Seller
  const handleContactSeller = () => {
    alert(`Contacting the seller of ${selectedItem?.name}...`);
    handleCloseBuyModal();
  };

  // Auto-expire logic
  useEffect(() => {
    const interval = setInterval(() => {
      autoExpireCheck();
    }, 60000);
    autoExpireCheck(); // immediate check
    return () => clearInterval(interval);
  }, []);

  const autoExpireCheck = () => {
    const now = Date.now();
    setSellItems((prevSell) => {
      const updatedSell = [];
      const newlyExpired = [];
      for (const item of prevSell) {
        if (item.validUntil && now > item.validUntil) {
          newlyExpired.push(item);
        } else {
          updatedSell.push(item);
        }
      }
      if (newlyExpired.length > 0) {
        setExpiredItems((prevExp) => [...prevExp, ...newlyExpired]);
      }
      return updatedSell;
    });
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
          <button
            className={`toggle-button ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => handleTabChange('expired')}
          >
            Expired Subscriptions
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
            {filteredItems.map((item) => (
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
            {/* Sell History (unsold items) */}
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
                    {/* If editing this item's price, show input + Save/Cancel */}
                    {editingPriceId === item.id ? (
                      <>
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          style={{
                            width: '70px',
                            borderRadius: '4px',
                            padding: '3px 5px'
                          }}
                        />
                        <button
                          className="action-button"
                          onClick={() => handleSavePrice(item.id)}
                        >
                          Save
                        </button>
                        <button
                          className="action-button"
                          onClick={handleCancelPriceEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="subscription-price">Rs. {item.price}</span>
                        <button
                          className="action-button"
                          onClick={() => handlePriceEdit(item.id, item.price)}
                        >
                          Edit
                        </button>
                      </>
                    )}

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
            <div
              className={`sell-buttons-container ${
                !showSellForm ? 'two-buttons' : 'one-button'
              }`}
            >
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
              <form className="sell-form" onSubmit={handleSellFormSubmit}>
                <div className="form-group">
                  <label>Select Subscription</label>
                  <select
                    name="selectedSub"
                    value={selectedDashboardSub}
                    onChange={handleSelectedSubscriptionChange}
                    required
                  >
                    <option value="" disabled>Select from your subscriptions</option>
                    {userSubscriptions.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Selling Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter selling price"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    required
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

        {/* Expired Tab */}
        {activeTab === 'expired' && (
          <div className="sell-section">
            {expiredItems.length === 0 ? (
              <p>No subscriptions have expired yet.</p>
            ) : (
              expiredItems.map((item) => (
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
