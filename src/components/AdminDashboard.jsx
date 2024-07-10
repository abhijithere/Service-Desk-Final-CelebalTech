import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig'; // Adjust the import path as per your setup
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsCollectionRef = collection(db, 'tickets');
        const querySnapshot = await getDocs(ticketsCollectionRef);
        let allTickets = [];

        querySnapshot.forEach(doc => {
          const ticketData = doc.data();
          allTickets.push({
            id: doc.id,
            ...ticketData
          });
        });

        setTickets(allTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error.message);
        alert('Failed to fetch tickets.');
      }
    };

    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, status) => {
    try {
      // Update ticket status in Firestore
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { status }); // Use updateDoc to update document

      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );

      console.log(`Updated ticket ${ticketId} to status: ${status}`);
    } catch (error) {
      console.error('Error updating ticket status:', error.message);
      alert('Failed to update ticket status.');
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (!user) {
    navigate('/login'); // Redirect to login if user is not authenticated
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
      <ul className="w-full max-w-4xl">
        {tickets.map((ticket, index) => (
          <li
            key={index} // Consider using a more unique key like ticket ID
            className="bg-white p-6 mb-4 rounded-lg shadow-lg border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{ticket.description}</h2>
            <p className="text-gray-600 mb-1">Priority: <span className={`font-medium ${ticket.priority === 'High' ? 'text-red-500' : ticket.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{ticket.priority}</span></p>
            <p className="text-gray-600 mb-1">Category: {ticket.category}</p>
            <p className="text-gray-600 mb-4">Status: <span className={`font-medium ${ticket.status === 'Resolved' ? 'text-blue-500' : ticket.status === 'Closed' ? 'text-gray-500' : 'text-yellow-500'}`}>{ticket.status}</span></p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleStatusChange(ticket.id, 'In Progress')}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-300"
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange(ticket.id, 'Resolved')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Resolved
              </button>
              <button
                onClick={() => handleStatusChange(ticket.id, 'Closed')}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
              >
                Closed
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
