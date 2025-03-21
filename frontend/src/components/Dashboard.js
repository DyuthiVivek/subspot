import React, { useState, useMemo, useEffect } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faPlus, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [expenseRange, setExpenseRange] = useState('Past year');
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [newSubscriptionUserId, setNewSubscriptionUserId] = useState('');
  const [newSubscriptionServiceName, setNewSubscriptionServiceName] = useState('');
  const [newSubscriptionCost, setNewSubscriptionCost] = useState('');
  const [newSubscriptionReminder, setNewSubscriptionReminder] = useState('every month');
  const [newSubscriptionStartDate, setNewSubscriptionStartDate] = useState('');
  const [newSubscriptionSharable, setNewSubscriptionSharable] = useState('no');
  const [newSubscriptionAutoRenew, setNewSubscriptionAutoRenew] = useState('yes');
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [expenseData, setExpenseData] = useState([]); 

  // Base URL 
  const API_BASE_URL = 'http://localhost:8000/api/';

  useEffect(() => {
    // Fetch Subscriptions
    fetch(`${API_BASE_URL}subscriptions/`)
      .then(res => res.json())
      .then(data => setSubscriptions(data))
      .catch(err => console.error('Error fetching subscriptions:', err));

    // Fetch Reminders
    fetch(`${API_BASE_URL}reminders/`)
      .then(res => res.json())
      .then(data => setReminders(data))
      .catch(err => console.error('Error fetching reminders:', err));

    // Fetch Expense Data 
    fetch(`${API_BASE_URL}expenses/?range=${expenseRange.toLowerCase().replace(' ', '_')}`)
      .then(res => res.json())
      .then(data => setExpenseData(data))
      .catch(err => console.error('Error fetching expenses:', err));
  }, [expenseRange]); 

  const handleTabClick = (tab) => {
    setShowSubscriptions(tab === 'subscriptions');
  };

  const handleDeleteReminder = (id) => {
    fetch(`${API_BASE_URL}reminders/${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setReminders(reminders.filter(reminder => reminder.id !== id));
      })
      .catch(err => console.error('Error deleting reminder:', err));
  };

  const handleExpenseRangeChange = (event) => {
    setExpenseRange(event.target.value);
  };

  const handleDeleteSubscription = (id) => {
    fetch(`${API_BASE_URL}subscriptions/${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      })
      .catch(err => console.error('Error deleting subscription:', err));
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    const newSubscription = {
      user_id: newSubscriptionUserId,
      name: newSubscriptionServiceName,
      cost: newSubscriptionCost,
      reminder: newSubscriptionReminder,
      start_date: newSubscriptionStartDate,
      sharable: newSubscriptionSharable === 'yes',
      auto_renew: newSubscriptionAutoRenew === 'yes',
    };

    fetch(`${API_BASE_URL}subscriptions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubscription),
    })
      .then(res => res.json())
      .then(data => {
        setSubscriptions([...subscriptions, data]);
        closeAddSubscriptionModal();
        setNewSubscriptionUserId('');
        setNewSubscriptionServiceName('');
        setNewSubscriptionCost('');
        setNewSubscriptionReminder('every month');
        setNewSubscriptionStartDate('');
        setNewSubscriptionSharable('no');
        setNewSubscriptionAutoRenew('yes');
      })
      .catch(err => console.error('Error adding subscription:', err));
  };

  const months = useMemo(() => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    switch (expenseRange) {
      case 'Last month':
        return [allMonths[currentMonthIndex]];
      case 'Last 6 months':
        const lastSixMonths = [];
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonthIndex - i + 12) % 12;
          lastSixMonths.push(allMonths[monthIndex]);
        }
        return lastSixMonths;
      default:
        return allMonths;
    }
  }, [expenseRange]);

  const barHeights = useMemo(() => {
    if (!expenseData.length) return months.map(() => 0); 
    return months.map((month, index) => {
      const expense = expenseData.find(e => e.month === month) || { amount: 0 };
      return (expense.amount / 3000) * 100; 
    });
  }, [expenseData, months]);

  const [isAddSubscriptionModalOpen, setIsAddSubscriptionModalOpen] = useState(false);
  const openAddSubscriptionModal = () => setIsAddSubscriptionModalOpen(true);
  const closeAddSubscriptionModal = () => setIsAddSubscriptionModalOpen(false);

  const handleHomeClick = () => navigate('/');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/market" className="nav-link">Market</Link>
          <Link to="/friends" className="nav-link">Friends</Link>
          <div className="user-icon">
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <section className="expense-section">
          <div className="expense-header">
            <h2 className="section-title">Expense</h2>
            <select
              className="expense-range-select"
              value={expenseRange}
              onChange={handleExpenseRangeChange}
            >
              <option value="Past year">Past year</option>
              <option value="Last month">Last month</option>
              <option value="Last 6 months">Last 6 months</option>
            </select>
          </div>
          <div className="expense-chart">
            <div className="chart-y-axis">
              <span>3000</span>
              <span>2000</span>
              <span>1000</span>
              <span>0</span>
            </div>
            <div className="chart-bars">
              {barHeights.map((height, index) => (
                <div key={index} className="chart-bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="chart-labels">
              {months.map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
            <div className="chart-horizontal-lines">
              <div className="horizontal-line"></div>
              <div className="horizontal-line"></div>
              <div className="horizontal-line"></div>
              <div className="horizontal-line"></div>
            </div>
          </div>
        </section>

        <section className="subscriptions-section">
          <div className="section-tabs">
            <button
              className={`tab-button ${showSubscriptions ? 'active' : ''}`}
              onClick={() => handleTabClick('subscriptions')}
            >
              Subscriptions
            </button>
            <button
              className={`tab-button ${!showSubscriptions ? 'active' : ''}`}
              onClick={() => handleTabClick('reminders')}
            >
              Reminders
            </button>
          </div>
          <div className="subscription-list">
            {showSubscriptions ? (
              <>
                {subscriptions.map((subscription) => (
                  <div className="subscription-item" key={subscription.id}>
                    <div className="subscription-logo">
                      {subscription.logo && (
                        <img src={subscription.logo} alt={`${subscription.name} Logo`} style={subscription.logoStyle} />
                      )}
                    </div>
                    <div className="subscription-name">{subscription.name}</div>
                    <div className="subscription-cost">Rs. {subscription.cost}</div>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <button className="add-subscription-button" onClick={openAddSubscriptionModal}>
                  <FontAwesomeIcon icon={faPlus} /> Add Subscription
                </button>
              </>
            ) : (
              <div className="reminder-list">
                {reminders.map((reminder) => (
                  <div className="reminder-item" key={reminder.id}>
                    <div className="reminder-date">
                      <span className="reminder-month">{reminder.date?.split(' ')[0]}</span>
                      <span className="reminder-day">{reminder.date?.split(' ')[1]}</span>
                    </div>
                    <div className="reminder-name">{reminder.name}</div>
                    <div className="reminder-cost">Rs. {reminder.cost}</div>
                    <button
                      className="done-button"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      Done
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {isAddSubscriptionModalOpen && (
          <div className="LoginModalOverlay">
            <div className="LoginModal">
              <button className="CloseButton" onClick={closeAddSubscriptionModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2>Add Subscription</h2>
              <form onSubmit={handleAddSubscription}>
                <div className="InputGroup">
                  <label>User ID:</label>
                  <input
                    type="text"
                    placeholder="Enter user ID"
                    value={newSubscriptionUserId}
                    onChange={(e) => setNewSubscriptionUserId(e.target.value)}
                  />
                </div>
                <div className="InputGroup">
                  <label>Service Name:</label>
                  <input
                    type="text"
                    placeholder="Enter service name"
                    value={newSubscriptionServiceName}
                    onChange={(e) => setNewSubscriptionServiceName(e.target.value)}
                  />
                </div>
                <div className="InputGroup">
                  <label>Cost:</label>
                  <input
                    type="number"
                    placeholder="Enter cost"
                    value={newSubscriptionCost}
                    onChange={(e) => setNewSubscriptionCost(e.target.value)}
                  />
                </div>
                <div className="InputGroup">
                  <label>Reminder:</label>
                  <select
                    value={newSubscriptionReminder}
                    onChange={(e) => setNewSubscriptionReminder(e.target.value)}
                  >
                    <option value="every month">Every Month</option>
                    <option value="every year">Every Year</option>
                    <option value="every 6 months">Every 6 Months</option>
                    <option value="every week">Every Week</option>
                  </select>
                </div>
                <div className="InputGroup">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={newSubscriptionStartDate}
                    onChange={(e) => setNewSubscriptionStartDate(e.target.value)}
                  />
                </div>
                <div className="InputGroup">
                  <label>Sharable:</label>
                  <select
                    value={newSubscriptionSharable}
                    onChange={(e) => setNewSubscriptionSharable(e.target.value)}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="InputGroup">
                  <label>Auto Renew:</label>
                  <select
                    value={newSubscriptionAutoRenew}
                    onChange={(e) => setNewSubscriptionAutoRenew(e.target.value)}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <button className="LoginButton">Add Subscription</button>
              </form>
            </div>
          </div>
        )}
        <div className="bottom-left-ellipse"></div>
        <div className="bottom-right-ellipse"></div>
      </main>
    </div>
  );
}

export default Dashboard;