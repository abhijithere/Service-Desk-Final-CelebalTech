import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Adjust the import path as per your setup
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        if (user) {
          // Fetch user details
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserData(userData);
          } else {
            console.error("User document not found");
          }

          // Fetch tickets for the user
          const ticketsCollectionRef = collection(db, "tickets");
          const q = query(
            ticketsCollectionRef,
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);

          const userTickets = [];
          querySnapshot.forEach((doc) => {
            userTickets.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setTickets(userTickets);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (!user) {
    return <p>User not authenticated. Please log in.</p>;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("Failed to sign out.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome, {userData ? userData.username : "User"}
        </h1>

        {loadingData && <p>Loading user data...</p>}

        {userData && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              User Details
            </h2>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Username:</span>{" "}
              {userData.username}
            </p>
          </div>
        )}

        {tickets.length === 0 && !loadingData && (
          <p className="text-gray-600">No tickets available.</p>
        )}

        {tickets.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              User Tickets
            </h2>
            <ul>
              {tickets.map((ticket) => (
                <li key={ticket.id} className="text-gray-600 mb-2">
                  <span className="font-semibold">{ticket.category}:</span>{" "}
                  {ticket.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/raise-ticket")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Raise Ticket
          </button>
          <button
            onClick={() => navigate("/my-tickets")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            My Tickets
          </button>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Admin Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
