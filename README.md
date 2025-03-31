# Subspot

SubSpot is your go-to web app for handling subscriptions. We’re here to show you what you’re spending, predict what you can ditch, and connect you with others to share the cost—all in one place.

## Features
1. EXPENSE CHART:
Shows expenses of the user in three different time frames (past year, past month and past 6 months). Helps the user analyse spending patterns.

2. SUBSCRIPTIONS:
Displays user’s current subscriptions. Subscriptions can be added using “Add Subscription”, which contains details of service name, cost, billing cycle (monthly, yearly, quarterly), shareability and auto renew.

3. REMINDERS:
Displays reminders for renewal of subscriptions that are due within 4 days. Can be marked “Done” after renewal.

4. SUBSCRIPTION PREDICTIONS:
Predicts possible cancellation or continuation of subscription based on various details like viewing hours, viewing duration, content downloads, number of customer support tickets raised, rating and presence of parental control. The prediction suggests whether the user should keep the subscription or drop it. Users can simply click on the subscription available on the dashboard and view the prediction pertaining to that subscription.


5. SUBSCRIPTION MARKETPLACE:
Allows users to buy or sell subscriptions. Users can edit the cost of subscriptions, delete them and mark the subscription as sold. They can also see the sale history and expired subscription sale listings. Users can also enter into a chat with potential sellers.

6. FRIENDS FEATURE:
Comprises “Suggested”(suggests potential friends) and “My friends”(user’s current friends) sections. Users can search for friends and send connection requests. “Pending Requests” shows the requests that are yet to be accepted. “Subscriptions” lists the subscriptions that are shared by the user’s friends.

7. CHAT FEATURE:
Allows users to chat with friends or sellers for buying subscriptions, negotiations etc. Allows deletion of messages and attachment of files as well.

## Tech stack
- **Backend**: Django-based REST API.
- **Frontend**: React-based user interface for interacting with the application.
- **Machine Learning**: XGBoost model for predictions. Code for training at `predict_churn.ipynb`.


## Deployed link

https://subspot-smoky.vercel.app/

## Local setup instructions

1. Create a database in MySQL called subspot_db.

2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Add database credentials and Django secret key in a `.env` file.
4. Install the required Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```
5. Apply database migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6. Start the Django development server:
    ```bash
    python manage.py runserver
    ```
7. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

8. Install the required Node.js dependencies:
    ```bash
    npm install
    ```

9. Start the React development server:
    ```bash
    npm start
    ```

10. Access the frontend at http://localhost:3000.
