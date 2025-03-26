import React, { useState, useMemo, useEffect } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faPlus, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import ChatIcon from './ChatIcon'; 

function Dashboard() {
  const navigate = useNavigate();
  const [expenseRange, setExpenseRange] = useState('Past year');
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [newSubscriptionName, setNewSubscriptionName] = useState('');
  const [newSubscriptionCost, setNewSubscriptionCost] = useState('');
  const [newSubscriptionReminder, setNewSubscriptionReminder] = useState('monthly');
  const [newSubscriptionSharable, setNewSubscriptionSharable] = useState(true);
  const [newSubscriptionAutoRenew, setNewSubscriptionAutoRenew] = useState(false);

  const testSubscriptions = [
    { id: 1, name: 'Spotify Premium', cost: '799', logo: 'https://loodibee.com/wp-content/uploads/Spotify-symbol-black.png', logoStyle: { width: '32px', height: '32px' }, is_autorenew: false },
    { id: 2, name: 'Netflix', cost: '499', logo: 'https://img.icons8.com/color/48/netflix-desktop-app.png', logoStyle: { width: '32px', height: '32px' }, is_autorenew: true },
    { id: 3, name: 'Coursera', cost: '299', logo: 'https://d3njjcbhbojbot.cloudfront.net/web/bundles/page/assets/coursera-rebrand-logo.png', logoStyle: { width: '30px', height: '30px' }, is_autorenew: false },
    { id: 4, name: 'YouTube Premium', cost: '599', logo: 'https://www.freepnglogos.com/uploads/youtube-logo-icon-transparent---32.png', logoStyle: { width: '31px', height: '31px' }, is_autorenew: true },
    { id: 5, name: 'iCloud', cost: '299', logo: 'https://www.freeiconspng.com/uploads/icloud-logos-revision-wikia-iphone-png-images-4.png', logoStyle: { width: '32px', height: '32px' }, is_autorenew: false },
  ];
  const testReminders = [
    { id: 1, name: 'Spotify Premium', cost: '799', date: 'Mar 25' }, 
    { id: 3, name: 'Coursera', cost: '299', date: 'Mar 26' },
    { id: 5, name: 'iCloud', cost: '299', date: 'Mar 27' },
  ];
  const testExpenseData = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    barHeights: [500, 1000, 1500, 800, 1200, 900, 1100, 1300, 700, 600, 1400, 2000],
  };

  const [subscriptions, setSubscriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [expenseData, setExpenseData] = useState({ months: [], barHeights: [] });

  const API_BASE_URL = 'http://localhost:8000/';

  useEffect(() => {
    fetch(`${API_BASE_URL}subscriptions/`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setSubscriptions(data.length ? data : testSubscriptions))
      .catch(err => {
        console.error('Error fetching subscriptions:', err);
        setSubscriptions(testSubscriptions);
      });

    fetch(`${API_BASE_URL}reminders/`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const filteredData = data.length ? data.filter(r => {
          const sub = (data.find(s => s.id === r.id) || testSubscriptions.find(s => s.id === r.id));
          return sub && !sub.is_autorenew;
        }) : testReminders;
        setReminders(filteredData);
      })
      .catch(err => {
        console.error('Error fetching reminders:', err);
        setReminders(testReminders);
      });

    fetch(`${API_BASE_URL}expenses/?range=${expenseRange.toLowerCase().replace(' ', '_')}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setExpenseData(data.months ? data : testExpenseData))
      .catch(err => {
        console.error('Error fetching expenses:', err);
        setExpenseData(testExpenseData);
      });
  }, [expenseRange]);

  const handleTabClick = (tab) => {
    setShowSubscriptions(tab === 'subscriptions');
  };

  const handleDeleteReminder = (id) => {
    fetch(`${API_BASE_URL}subscriptions/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => {
        setReminders(reminders.filter(reminder => reminder.id !== id));
      })
      .catch(err => {
        console.error('Error deleting reminder:', err);
        setReminders(reminders.filter(reminder => reminder.id !== id));
      });
  };

  const handleExpenseRangeChange = (event) => {
    setExpenseRange(event.target.value);
  };

  const handleDeleteSubscription = (id) => {
    fetch(`${API_BASE_URL}subscriptions/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        setReminders(reminders.filter(reminder => reminder.id !== id));
      })
      .catch(err => {
        console.error('Error deleting subscription:', err);
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        setReminders(reminders.filter(reminder => reminder.id !== id));
      });
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    const newSubscription = {
      name: newSubscriptionName,
      reminder: newSubscriptionReminder,
      cost: newSubscriptionCost,
      is_shareable: newSubscriptionSharable,
      is_autorenew: newSubscriptionAutoRenew,
    };

    fetch(`${API_BASE_URL}subscriptions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubscription),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const matchingTestSub = testSubscriptions.find(sub => sub.name.toLowerCase() === data.name.toLowerCase());
        const updatedData = {
          ...data,
          logo: matchingTestSub ? matchingTestSub.logo : `https://logo.clearbit.com/${data.name.toLowerCase().split(' ')[0]}.com`,
          logoStyle: matchingTestSub ? matchingTestSub.logoStyle : { width: '32px', height: '32px' },
        };
        setSubscriptions([...subscriptions, updatedData]);
        if (data.is_autorenew) {
          const currentDate = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit' });
          setReminders([...reminders, { id: data.id, name: data.name, cost: data.cost, date: currentDate }]);
        }
        closeAddSubscriptionModal();
        setNewSubscriptionName('');
        setNewSubscriptionCost('');
        setNewSubscriptionReminder('monthly');
        setNewSubscriptionSharable(true);
        setNewSubscriptionAutoRenew(false);
      })
      .catch(err => {
        console.error('Error adding subscription:', err);
        const matchingTestSub = testSubscriptions.find(sub => sub.name.toLowerCase() === newSubscriptionName.toLowerCase());
        const mockData = {
          id: Date.now(),
          name: newSubscriptionName,
          cost: String(newSubscriptionCost),
          logo: matchingTestSub ? matchingTestSub.logo : `https://logo.clearbit.com/${newSubscriptionName.toLowerCase().split(' ')[0]}.com`,
          logoStyle: matchingTestSub ? matchingTestSub.logoStyle : { width: '32px', height: '32px' },
          is_autorenew: newSubscriptionAutoRenew,
        };
        setSubscriptions([...subscriptions, mockData]);
        if (newSubscriptionAutoRenew) {
          const currentDate = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit' });
          setReminders([...reminders, { id: mockData.id, name: mockData.name, cost: mockData.cost, date: currentDate }]);
        }
        closeAddSubscriptionModal();
        setNewSubscriptionName('');
        setNewSubscriptionCost('');
        setNewSubscriptionReminder('monthly');
        setNewSubscriptionSharable(true);
        setNewSubscriptionAutoRenew(false);
      });
  };

  const filteredExpenseData = useMemo(() => {
    const allMonths = expenseData.months || [];
    const allBarHeights = expenseData.barHeights || [];
    const currentMonthIndex = new Date().getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const orderedMonths = [];
    const orderedHeights = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonthIndex - 11 + i + 12) % 12;
      orderedMonths.push(monthNames[monthIndex]);
      const backendIndex = allMonths.indexOf(monthNames[monthIndex]);
      orderedHeights.push(backendIndex !== -1 ? allBarHeights[backendIndex] : 0);
    }

    let filteredMonths = [];
    let filteredHeights = [];

    if (expenseRange === 'Last month') {
      filteredMonths = [orderedMonths[11]];
      filteredHeights = [orderedHeights[11]];
    } else if (expenseRange === 'Last 6 months') {
      filteredMonths = orderedMonths.slice(6, 12);
      filteredHeights = orderedHeights.slice(6, 12);
    } else {
      filteredMonths = orderedMonths;
      filteredHeights = orderedHeights;
    }

    return {
      months: filteredMonths,
      barHeights: filteredHeights,
    };
  }, [expenseData, expenseRange]);

  const months = filteredExpenseData.months;
  const barHeights = filteredExpenseData.barHeights;
  const [isAddSubscriptionModalOpen, setIsAddSubscriptionModalOpen] = useState(false);
  const openAddSubscriptionModal = () => setIsAddSubscriptionModalOpen(true);
  const closeAddSubscriptionModal = () => setIsAddSubscriptionModalOpen(false);

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
          {/* Insert ChatIcon next to the user icon */}
          <div style={{ marginLeft: '20px' }}>
            <ChatIcon />
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
              <span>Rs.3000</span>
              <span>Rs.2000</span>
              <span>Rs.1000</span>
              <span>Rs.0</span>
            </div>
            <div className="chart-bars">
              {barHeights.map((height, index) => (
                <div
                  key={index}
                  className="chart-bar"
                  style={{ height: `${(height / 3000) * 100}%` }}
                ></div>
              ))}
            </div>
            <div className="chart-labels">
              {months.map((month, index) => (
                <span key={index}>{month.slice(0, 3)}</span>
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
                  <label>Service Name:</label>
                  <input
                    type="text"
                    placeholder="Enter service name"
                    value={newSubscriptionName}
                    onChange={(e) => setNewSubscriptionName(e.target.value)}
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
                  <label>Billing Cycle:</label>
                  <select
                    value={newSubscriptionReminder}
                    onChange={(e) => setNewSubscriptionReminder(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="InputGroup">
                  <label>Sharable:</label>
                  <select
                    value={newSubscriptionSharable ? 'yes' : 'no'}
                    onChange={(e) => setNewSubscriptionSharable(e.target.value === 'yes')}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="InputGroup">
                  <label>Auto Renew:</label>
                  <select
                    value={newSubscriptionAutoRenew ? 'yes' : 'no'}
                    onChange={(e) => setNewSubscriptionAutoRenew(e.target.value === 'yes')}
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
