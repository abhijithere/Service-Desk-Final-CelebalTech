import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import RaiseTicket from "./components/RaiseTicket";
import MyTickets from "./components/MyTickets";
import AdminDashboard from "./components/AdminDashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig"; // Adjust the path as per your setup
import HomePage from "./Pages/HomePage";

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading indicator while Firebase initializes
  }

  return (
    <Router>
      <Routes>
        {/* Route for Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />

        {/* Route for Register */}
        <Route
          path="/register"
          element={user ? <Navigate to="/home" /> : <Registration />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />

        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/raise-ticket"
          element={user ? <RaiseTicket /> : <Navigate to="/login" />}
        />

        <Route
          path="/my-tickets"
          element={user ? <MyTickets /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin-dashboard"
          element={user ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
