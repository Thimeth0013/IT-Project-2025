import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditStaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeID: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    role: 'Mechanic',
    basicSalary: '',
    taxRate: '',
    deductions: '',
    bonuses: '',
    shift: 'Morning',
    workDays: [],
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/staff/${id}`);
        if (!res.data || !res.data.staff) {
          throw new Error('Staff data not found in response');
        }

        const staff = res.data.staff;

        setFormData({
          employeeID: staff.employeeID || '',
          name: staff.name || '',
          phone: staff.phone || '',
          email: staff.email || '',
          address: staff.address || '',
          role: staff.role || 'Mechanic',
          basicSalary: staff.basicSalary || '',
          taxRate: staff.taxRate || '',
          deductions: staff.deductions || '',
          bonuses: staff.bonuses || '',
          shift: staff.shift || 'Morning',
          workDays: Array.isArray(staff.workDays) ? staff.workDays : [],
        });
      } catch (err) {
        setMessage('Failed to load staff data');
        console.error(err);
      }
    };
    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/staff/${id}`, formData);
      setMessage('Staff updated successfully!');
      alert('✅ Staff updated!'); // ✅ Show pop-up after update
      navigate('/staffd');
    } catch (err) {
      setMessage('Failed to update staff');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Staff Member</h2>
      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <input name="employeeID" value={formData.employeeID} onChange={handleChange} placeholder="Employee ID" className="w-full border p-2 rounded" required />
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" required />

        <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Mechanic">Mechanic</option>
          <option value="Engine Repair">Engine Repair</option>
          <option value="Oil Change Technician">Oil Change Technician</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Tire Specialist">Tire Specialist</option>
        </select>

        {/* Salary Info */}
        <h4 className="font-semibold mt-4">Salary Details</h4>
        <input name="basicSalary" value={formData.basicSalary} onChange={handleChange} placeholder="Basic Salary" type="number" className="w-full border p-2 rounded" required />
        <input name="taxRate" value={formData.taxRate} onChange={handleChange} placeholder="Tax Rate (%)" type="number" className="w-full border p-2 rounded" required />
        <input name="deductions" value={formData.deductions} onChange={handleChange} placeholder="Deductions" type="number" className="w-full border p-2 rounded" required />
        <input name="bonuses" value={formData.bonuses} onChange={handleChange} placeholder="Bonuses" type="number" className="w-full border p-2 rounded" required />

        {/* Schedule Info */}
        <h4 className="font-semibold mt-4">Schedule Details</h4>
        <select name="shift" value={formData.shift} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Morning">Morning</option>
          <option value="Night">Night</option>
        </select>

        {/* Work Days Checkboxes */}
        <div>
          <p className="font-medium mb-1">Work Days</p>
          <div className="grid grid-cols-3 gap-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={day}
                  checked={formData.workDays.includes(day)}
                  onChange={() => handleWorkDayToggle(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Update Staff</button>
      </form>
    </div>
  );
};

export default EditStaffForm;
