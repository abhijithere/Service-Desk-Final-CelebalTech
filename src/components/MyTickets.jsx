import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Adjust the import path as per your setup

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (user) {
          // Reference to the tickets collection in Firestore
          const ticketsCollectionRef = collection(db, 'tickets');

          // Query tickets for the current user
          const q = query(ticketsCollectionRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          // Extract ticket data from the query snapshot
          const userTickets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setTickets(userTickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error.message);
        alert('Failed to fetch tickets.');
      }
    };

    if (!loading) {
      fetchTickets();
    }
  }, [user, loading]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Tickets</h1>
      <ul className="w-full max-w-4xl">
        {tickets.map((ticket) => (
          <li
            key={ticket.id} // Use unique key for each ticket
            className="bg-white p-6 mb-4 rounded-lg shadow-lg border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{ticket.description}</h2>
            <p className="text-gray-600 mb-1">Priority: <span className={`font-medium ${ticket.priority === 'High' ? 'text-red-500' : ticket.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{ticket.priority}</span></p>
            <p className="text-gray-600 mb-1">Category: {ticket.category}</p>
            <p className="text-gray-600 mb-4">Status: <span className={`font-medium ${ticket.status === 'Resolved' ? 'text-blue-500' : ticket.status === 'Closed' ? 'text-gray-500' : 'text-yellow-500'}`}>{ticket.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTickets;
