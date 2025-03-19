import React, { useState, useMemo, useEffect } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash,faTimes } from '@fortawesome/free-solid-svg-icons'; 
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [expenseRange, setExpenseRange] = useState('Past year'); // State for dropdown
    const [showSubscriptions, setShowSubscriptions] = useState(true);
    const [newSubscriptionName, setNewSubscriptionName] = useState('');
    const [newSubscriptionCost, setNewSubscriptionCost] = useState('');
    const [newSubscriptionReminder, setNewSubscriptionReminder] = useState('every month'); // Default value

    // Sample subscription data (replace with your actual data)
    const [subscriptions, setSubscriptions] = useState([
        { id: 1, name: 'Spotify Premium', cost: '799', logo: 'https://loodibee.com/wp-content/uploads/Spotify-symbol-black.png', logoStyle: { width: '32px', height: '32px' } },
        { id: 2, name: 'Netflix', cost: '499', logo: 'https://logohistory.net/wp-content/uploads/2023/05/Netflix-Logo-2006-1536x864.png', logoStyle: { width: '32px', height: '32px' } },
        { id: 3, name: 'Coursera', cost: '299', logo: 'https://d3njjcbhbojbot.cloudfront.net/web/bundles/page/assets/coursera-rebrand-logo.png', logoStyle: { width: '30px', height: '30px' } },
        { id: 4, name: 'YouTube Premium', cost: '599', logo: 'https://www.freepnglogos.com/uploads/youtube-logo-icon-transparent---32.png', logoStyle: { width: '31px', height: '31px' } },
        { id: 5, name: 'iCloud', cost: '299', logo: 'https://www.freeiconspng.com/uploads/icloud-logos-revision-wikia-iphone-png-images-4.png', logoStyle: { width: '32px', height: '32px' } },
    ]);

    const [reminders, setReminders] = useState([
        { id: uuidv4(), name: 'Spotify Premium', cost: '799', date: 'Jun 25' },
        { id: uuidv4(), name: 'Netflix', cost: '499', date: 'Jul 10' },
        { id: uuidv4(), name: 'Coursera', cost: '299', date: 'Aug 01' },
        { id: uuidv4(), name: 'YouTube Premium', cost: '599', date: 'Sep 15' },
        { id: uuidv4(), name: 'iCloud', cost: '299', date: 'Oct 20' },
    ]);

    useEffect(() => {
        // setReminders(subscriptions.map(sub => ({ id: uuidv4(), name: sub.name, cost: sub.cost, date: 'TBD' })));
    }, [subscriptions]);

    const handleTabClick = (tab) => {
        setShowSubscriptions(tab === 'subscriptions');
    };

    const handleDeleteReminder = (id) => {
        setReminders(reminders.filter(reminder => reminder.id !== id));
    };

    const handleExpenseRangeChange = (event) => {
        setExpenseRange(event.target.value);
    };
    const handleDeleteSubscription = (id) => {
        // Function to delete a subscription
        setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    };
    const handleAddSubscription = (e) => {
        e.preventDefault();

        const existingSubscription = subscriptions.find(sub => sub.name.toLowerCase() === newSubscriptionName.toLowerCase());

        const newSubscription = {
            id: Date.now(),
            name: newSubscriptionName,
            cost: newSubscriptionCost,
            reminder: newSubscriptionReminder,
            logo: existingSubscription ? existingSubscription.logo : null, // Use existing logo or null
            logoStyle: existingSubscription ? existingSubscription.logoStyle : {},
        };

        setSubscriptions([...subscriptions, newSubscription]);
        closeAddSubscriptionModal();

        // Clear the input fields after adding the subscription
        setNewSubscriptionName('');
        setNewSubscriptionCost('');
    };

    // **Expense Chart Variables**
    const months = useMemo(() => {
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonthIndex = new Date().getMonth();

        switch (expenseRange) {
            case 'Last month':
                return [allMonths[currentMonthIndex]];
            case 'Last 6 months':
                const lastSixMonths = [];
                for (let i = 5; i >= 0; i--) {
                    const monthIndex = (currentMonthIndex - i + 12) % 12; // Wrap around to December if needed
                    lastSixMonths.push(allMonths[monthIndex]);
                }
                return lastSixMonths;
            default: // 'Past year'
                return allMonths;
        }
    }, [expenseRange]);

    const barHeights = useMemo(() => {
        // Placeholder for bar heights (replace with actual data)
        const defaultHeights = [70, 20, 35, 50, 10, 75, 80, 90, 25, 15, 60, 40];

        if (expenseRange === 'Last month') {
            return [Math.floor(Math.random() * 100)]; // Random height for last month
        } else if (expenseRange === 'Last 6 months') {
            return Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)); // Random heights for last 6 months
        } else {
            return defaultHeights;
        }
    }, [expenseRange]);

    const [isAddSubscriptionModalOpen, setIsAddSubscriptionModalOpen] = useState(false);

    const openAddSubscriptionModal = () => {
        setIsAddSubscriptionModalOpen(true);
    };

    const closeAddSubscriptionModal = () => {
        setIsAddSubscriptionModalOpen(false);
    };

    const handleHomeClick = () => {
        navigate('/'); // Using navigate here
      };
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
                        {/* Y-Axis Labels */}
                        <div className="chart-y-axis">
                            <span>3000</span>
                            <span>2000</span>
                            <span>1000</span>
                            <span>0</span>
                        </div>

                        {/* Chart Bars */}
                        <div className="chart-bars">
                            {barHeights.map((height, index) => (
                                <div
                                    key={index}
                                    className="chart-bar"
                                    style={{ height: `${height}%` }}
                                ></div>
                            ))}
                        </div>
                        {/* X-Axis Labels */}
                        <div className="chart-labels">
                            {months.map((month, index) => (
                                <span key={index}>{month}</span>
                            ))}
                        </div>

                        {/* Horizontal Lines */}
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
                            <>
                            <div className="reminder-list">
                                {reminders.map((reminder) => (
                                    <div className="reminder-item" key={reminder.id}>
                                        <div className="reminder-date">
                                        <span className="reminder-month">{reminder.date.split(' ')[0]}</span>        
                                        <span className="reminder-day">{reminder.date.split(' ')[1]}</span>
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
                            </>
                        )}
                    </div>
                </section>      
                {/* Add Subscription Modal */}
                {isAddSubscriptionModalOpen && (
                    <div className="LoginModalOverlay">
                        <div className="LoginModal">
                            <button className="CloseButton" onClick={closeAddSubscriptionModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <h2>Add Subscription</h2>
                            <form onSubmit={handleAddSubscription}>
                                <div className="InputGroup">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
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
                                    <label>Reminder:</label>
                                    <select
                                        value={newSubscriptionReminder}
                                        onChange={(e) => setNewSubscriptionReminder(e.target.value)}
                                    >
                                        <option value="every month">Every Month</option>
                                        <option value="every year">Every Year</option>
                                        <option value="every 6 months">Every 6 Months</option>
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