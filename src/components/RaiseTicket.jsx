import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const RaiseTicket = () => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('IT Support');
  const [user] = useAuthState(auth); // Optional: Get current user

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add ticket to tickets collection in Firestore
      const ticketsCollectionRef = collection(db, 'tickets');
      await addDoc(ticketsCollectionRef, {
        userId: user.uid,
        description,
        priority,
        category,
        status: 'Open' // Default status
      });

      alert('Ticket raised successfully!');
      setDescription('');
      setPriority('Low');
      setCategory('IT Support');
    } catch (error) {
      console.error('Error raising ticket:', error.message);
      alert('Failed to raise ticket.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Raise Ticket</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue"
          required
          className="w-full p-2 mb-3 border rounded h-32"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="IT Support">IT Support</option>
          <option value="HR">HR</option>
          <option value="Facilities">Facilities</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Raise Ticket
        </button>
      </form>
    </div>
  );
};

export default RaiseTicket;
