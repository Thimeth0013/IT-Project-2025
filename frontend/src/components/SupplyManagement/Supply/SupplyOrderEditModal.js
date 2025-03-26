import React, { useState, useEffect } from 'react';

function SupplyOrderEditModal({ isOpen, onClose, item, onSave }) {
    const [formData, setFormData] = useState({
        status: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                status: item.status || ''
            });
        }
    }, [item]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            _id: item._id,
            status: formData.status
        };
        onSave(updatedData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded bg-white">
                <div className="w-full flex flex-col items-center justify-center gap-8">
                    <h3 className="text-lg font-semibold text-black">
                        Edit Status
                    </h3>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-10">
                        <div className="w-full flex flex-col items-center justify-center gap-5">
                            <span className="w-full flex flex-col items-center justify-center gap-2.5">
                                <label htmlFor="status" className="w-full text-xs text-gray-500">
                                    Status:
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 text-xs rounded-md border-2 border-gray-100 bg-gray-100 focus:border-black focus:bg-white focus:outline-none"
                                >
                                    <option value="Accepted" disabled>Select Status</option>
                                    <option value="Delivering">Delivering</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </span>
                        </div>

                        <div className="w-full flex flex-row items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-xs text-white px-4 py-2 rounded outline-none bg-gray-500 hover:bg-gray-400 focus:bg-gray-400"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="text-xs text-white px-4 py-2 rounded outline-none bg-blue-600 hover:bg-blue-500 focus:bg-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SupplyOrderEditModal;