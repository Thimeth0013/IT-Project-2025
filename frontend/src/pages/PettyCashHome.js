import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { exportPettyCashToPDF } from '../components/utils';
import 'jspdf-autotable';

function HomePage() {
    // Update monthlyBudget initialization to check localStorage
    const [monthlyBudget, setMonthlyBudget] = useState(() => {
        const saved = localStorage.getItem('monthlyBudget');
        return saved ? Number(saved) : 0;
    });
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [entries, setEntries] = useState([]);
    // Remove unused totalBalance state variable
    const [editingEntry, setEditingEntry] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        date: '',
        description: '',
        amount: '',
        category: '',
        paymentMethod: '',
        remarks: ''
    });

    // Add or modify the useEffect to calculate totals correctly
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/pettycash');
                setEntries(response.data);

                // Calculate total expenses from entries (excluding budget entries)
                const expenses = response.data
                    .filter(entry => entry.category !== 'Budget')
                    .reduce((sum, entry) => sum + Number(entry.amount), 0);

                setTotalExpense(expenses);
                setRemainingBudget(monthlyBudget - expenses);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [monthlyBudget]); // Re-run when monthlyBudget changes

    // Add new useEffect for initial budget fetch
    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/pettycash');
                const budgetEntry = response.data.find(entry => entry.category === 'Budget');
                if (budgetEntry) {
                    const budget = Number(budgetEntry.amount);
                    setMonthlyBudget(budget);
                    localStorage.setItem('monthlyBudget', budget.toString());
                }
            } catch (err) {
                console.error('Error fetching budget:', err);
            }
        };
        fetchBudget();
    }, []);

    // Update deleteEntry function
    const deleteEntry = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this entry?')) {
                await axios.delete(`http://localhost:8000/api/pettycash/${id}`);

                // Refresh entries after deletion
                const response = await axios.get('http://localhost:8000/api/pettycash');
                setEntries(response.data);

                // Recalculate totals
                const nonBudgetEntries = response.data.filter(entry => entry.category !== 'Budget');
                const total = nonBudgetEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);
                setTotalExpense(total); // Update totalExpense instead of totalBalance
                setRemainingBudget(monthlyBudget - total);

                alert('Entry deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete entry');
        }
    };

    const handleUpdate = async (id) => {
        setEditingEntry(id);
        const entryToEdit = entries.find(entry => entry._id === id);
        setUpdateFormData({
            date: entryToEdit.date.split('T')[0],
            description: entryToEdit.description,
            amount: entryToEdit.amount,
            category: entryToEdit.category,
            paymentMethod: entryToEdit.paymentMethod,
            remarks: entryToEdit.remarks || ''
        });
    };

    // Update handleUpdateSubmit function
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:8000/api/pettycash/${editingEntry}`,
                updateFormData
            );

            // Refresh entries after update
            const response = await axios.get('http://localhost:8000/api/pettycash');
            setEntries(response.data);

            // Recalculate totals
            const nonBudgetEntries = response.data.filter(entry => entry.category !== 'Budget');
            const total = nonBudgetEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);
            setTotalExpense(total); // Update totalExpense instead of totalBalance
            setRemainingBudget(monthlyBudget - total);

            // Reset form
            setEditingEntry(null);
            setUpdateFormData({
                date: '',
                description: '',
                amount: '',
                category: '',
                paymentMethod: '',
                remarks: ''
            });

            alert('Entry updated successfully');
        } catch (error) {
            console.error('Error updating entry:', error);
            alert('Failed to update entry');
        }
    };

    const handleUpdateChange = (e) => {
        setUpdateFormData({
            ...updateFormData,
            [e.target.name]: e.target.value
        });
    };

    // Update handleSetBudget function
    const handleSetBudget = async () => {
        try {
            await axios.post('http://localhost:8000/api/pettycash', {
                date: new Date(),
                description: 'Monthly Budget',
                amount: monthlyBudget,
                category: 'Budget',
                paymentMethod: 'Budget Set',
                monthlyBudget: monthlyBudget
            });

            // Store budget in localStorage
            localStorage.setItem('monthlyBudget', monthlyBudget.toString());

            // Refresh entries after setting budget
            const response = await axios.get('http://localhost:8000/api/pettycash');
            setEntries(response.data);

            // Update budget calculations
            const nonBudgetEntries = response.data.filter(entry => entry.category !== 'Budget');
            const totalExpenses = nonBudgetEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);
            setTotalExpense(totalExpenses); // Make sure to update totalExpense consistently
            setRemainingBudget(monthlyBudget - totalExpenses);

            alert('Budget set successfully!');
        } catch (error) {
            console.error('Error setting budget:', error);
            alert('Failed to set budget');
        }
    };



    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                <h1 className="text-2xl font-bold text-center py-4">Petty Cash Management System</h1>
                
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4">
                    <h2 className="text-lg font-bold text-center mb-3">Petty Cash Book Format</h2>
                    
                    {/* Controls section - more compact */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                        <div className="w-full md:w-auto">
                            <div className="flex flex-col sm:flex-row gap-1">
                                <input
                                    type="number"
                                    value={monthlyBudget}
                                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                                    className="px-2 py-1 rounded-md border border-gray-300 shadow-sm w-full sm:w-auto text-sm"
                                    placeholder="Enter monthly budget"
                                />
                                <button
                                    onClick={handleSetBudget}
                                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold w-full sm:w-auto text-sm"
                                >
                                    Set Monthly Budget
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-1 w-full sm:w-auto">
                            <button
                                onClick={() => exportPettyCashToPDF(entries, monthlyBudget, totalExpense, remainingBudget)}
                                className="flex-1 sm:flex-none px-2 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-center text-sm"
                            >
                                📄 Export PDF
                            </button>
                            <Link
                                to="/pettycash/new"
                                className="flex-1 sm:flex-none px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-green-600 transition-colors text-center text-sm"
                            >
                                + Add Entry
                            </Link>
                        </div>
                    </div>
    
                    {/* Budget summary - more compact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        <div className="p-2 text-sm font-bold text-white bg-blue-600 text-center rounded-md">
                            Monthly Budget: Rs. {monthlyBudget.toFixed(2)}
                        </div>
                        <div className="p-2 text-sm font-bold text-white bg-green-500 text-center rounded-md">
                            Remaining Budget: Rs. {remainingBudget.toFixed(2)}
                        </div>
                    </div>
    
                    {/* Table that fits window without horizontal scrolling */}
                    <div className="border border-gray-300 rounded-md">
                        <table className="w-full table-fixed divide-y divide-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="w-[7%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Date</th>
                                    <th className="w-[6%] px-1 py-1 text-left text-xs semibold  border-r border-gray-300">Received</th>
                                    <th className="w-[12%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Description</th>
                                    <th className="w-[8%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Total Payment</th>
                                    <th className="w-[9%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Entertainment</th>
                                    <th className="w-[7%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Transport</th>
                                    <th className="w-[5%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Utilities</th>
                                    <th className="w-[5%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Office</th>
                                    <th className="w-[6%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Postage</th>
                                    <th className="w-[8%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Maintenance</th>
                                    <th className="w-[9%] px-1 py-1 text-left text-xs semibold border-r border-gray-300">Miscellaneous</th>
                                    <th className="w-[18%] px-1 py-1 text-center text-xs semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* Budget row */}
                                <tr className="hover:bg-gray-50">
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                        {new Date().toLocaleDateString()}
                                    </td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">Budget Set</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">Monthly Budget</td>
                                    <td className="px-1 py-1 border-r border-gray-300 font-medium text-xs">Rs. {monthlyBudget.toFixed(2)}</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">-</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">-</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">-</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">-</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">-</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">-</td>
                                    <td className="px-1 py-1 border-r border-gray-300 text-xs">-</td>
                                    <td className="px-1 py-1 text-xs">-</td>
                                </tr>
                                
                                {/* Entry rows */}
                                {entries.filter(entry => entry.category !== 'Budget').map((entry) => (
                                    <tr key={entry._id} className="hover:bg-gray-50">
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs overflow-hidden text-ellipsis">{entry.paymentMethod}</td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs overflow-hidden text-ellipsis" title={entry.description}>
                                            {entry.description}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 font-medium text-xs">Rs. {entry.amount}</td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {entry.category === 'Meals&Entertainment' ? `Rs. ${entry.amount}` : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {entry.category === 'Transport' ? `Rs. ${entry.amount}` : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {entry.category === 'Utilities' ? `Rs. ${entry.amount}` : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {entry.category === 'Office' ? `Rs. ${entry.amount}` : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {entry.category === 'Postage' ? `Rs. ${entry.amount}` : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {entry.category === 'Maintenance' ? `Rs. ${entry.amount}` : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-r border-gray-300 text-xs">
                                            {entry.category === 'Miscellaneous' ? `Rs. ${entry.amount}` : '-'}
                                        </td>
                                        <td className="px-1 py-1">
                                            <div className="flex justify-center gap-1">
                                                <button
                                                    className="flex-1 px-1 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                                                    onClick={() => handleUpdate(entry._id)}
                                                >
                                                    🖋 Edit
                                                </button>
                                                <button
                                                    className="flex-1 px-1 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                    onClick={() => deleteEntry(entry._id)}
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Total summary - more compact */}
                    <div className="mt-4 p-2 text-sm font-bold text-white bg-orange-500 text-center rounded-md">
                        Total Expense: Rs. {totalExpense.toFixed(2)}
                    </div>
                </div>
            </div>
    
            {/* Modal - more compact */}
            {editingEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
                    <div className="bg-white rounded-lg p-4 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-3">Update Entry</h3>
                        <form onSubmit={handleUpdateSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={updateFormData.date}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={updateFormData.description}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={updateFormData.amount}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={updateFormData.category}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Meals&Entertainment">Meals&Entertainment</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Office">Office</option>
                                    <option value="Postage">Postage</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={updateFormData.paymentMethod}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    required
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="w-1/2 bg-blue-500 text-white py-1 px-3 text-sm rounded hover:bg-blue-600"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingEntry(null)}
                                    className="w-1/2 bg-gray-500 text-white py-1 px-3 text-sm rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
export default HomePage;