import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PettyForm from '../components/PettyCash';

function PettyCashDashboard() {
    // State for storing petty cash entries and total amount
    const [entries, setEntries] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Function to fetch entries from backend
    const fetchEntries = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/pettycash');
            // Filter out budget entries
            const nonBudgetEntries = response.data.filter(entry => entry.category !== 'Budget');
            setEntries(nonBudgetEntries);
            // Calculate total from non-budget entries
            const total = nonBudgetEntries.reduce((sum, entry) => sum + entry.amount, 0);
            setTotalAmount(total);
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    // Fetch entries when component mounts
    useEffect(() => {
        fetchEntries();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Petty Cash Management</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <PettyForm onSubmitSuccess={fetchEntries} />

                <div>
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <h2 className="text-xl font-bold mb-2">Total Amount</h2>
                        <p className="text-2xl text-blue-600">Rs. {totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold p-4 border-b">Recent 5 Entries</h2>
                        <div className="divide-y">
                            {entries.slice(0, 5).map(entry => (
                                <div key={entry._id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{entry.description}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm">{entry.category}</p>
                                        </div>
                                        <p className="font-bold">Rs.{entry.amount.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PettyCashDashboard;
