// src/Router.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Market from './components/Market';
import SubscriptionDetails from './components/SubscriptionDetails'; 


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/market" element={<Market />} />
      {/* <Route path="/friends" element={<Friends />} /> */}
      <Route path="/subscription/:id" element={<SubscriptionDetails />} /> 
    </Routes>
  );
};

export default AppRouter;