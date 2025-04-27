import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStaffForm = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      if (/^\d{0,10}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === 'email') {
      if (/^[a-zA-Z][\w.-]*@?[\w.-]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (['basicSalary', 'taxRate', 'deductions', 'bonuses'].includes(name)) {
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

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

  const isValidPhone = (phone) => /^\d{10}$/.test(phone);
  const isValidEmail = (email) =>
    /^[a-zA-Z][\w.-]*@gmail\.com$/.test(email);
  const isNonNegative = (...values) => values.every(v => !isNaN(v) && Number(v) >= 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPhone(formData.phone)) {
      setMessage('❌ Phone must contain exactly 10 digits.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setMessage('❌ Email must start with a letter and end with @gmail.com.');
      return;
    }

    const { basicSalary, taxRate, deductions, bonuses } = formData;
    if (!isNonNegative(basicSalary, taxRate, deductions, bonuses)) {
      setMessage('❌ Salary fields must contain only positive numbers.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/staff/addstaff', formData);
      setMessage(`✅ Staff added! Username: ${response.data.staff.username}, Password: ${response.data.staff.plainPassword}`);
      alert("✅ Staff added!"); // ✅ Pop-up box added here
      setTimeout(() => navigate('/staffd'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error adding staff');
    }
  };

  const styles = {
    container: {
      maxWidth: '650px',
      margin: '3rem auto',
      padding: '2.5rem',
      background: '#F8F9FA',
      borderRadius: '18px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      fontFamily: '"Segoe UI", sans-serif',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      color: '#212529',
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      fontSize: '1rem',
      color: '#DC3545',
      marginBottom: '1rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    input: {
      padding: '0.75rem 1rem',
      border: '1px solid #CED4DA',
      borderRadius: '10px',
      fontSize: '1rem',
      background: '#FFFFFF',
      color: '#212529',
      outline: 'none',
    },
    select: {
      padding: '0.75rem 1rem',
      border: '1px solid #CED4DA',
      borderRadius: '10px',
      fontSize: '1rem',
      background: '#FFFFFF',
      color: '#212529',
    },
    sectionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginTop: '1.5rem',
      color: '#212529',
      borderBottom: '1px solid #CED4DA',
      paddingBottom: '0.5rem',
    },
    checkboxContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.95rem',
      gap: '0.4rem',
      color: '#212529',
    },
    button: {
      padding: '0.9rem',
      backgroundColor: '#4D90FE',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Staff Member</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="employeeID" value={formData.employeeID} onChange={handleChange} placeholder="Employee ID" style={styles.input} required />
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" style={styles.input} required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone (10 digits)" style={styles.input} required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email (@gmail.com)" style={styles.input} required />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={styles.input} required />
        <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
          <option value="Mechanic">Mechanic</option>
          <option value="Engine Repair">Engine Repair</option>
          <option value="Oil Change Technician">Oil Change Technician</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Tire Specialist">Tire Specialist</option>
        </select>

        <div style={styles.sectionTitle}>💰 Salary Details</div>
        <input name="basicSalary" value={formData.basicSalary} onChange={handleChange} placeholder="Basic Salary" type="text" style={styles.input} required />
        <input name="taxRate" value={formData.taxRate} onChange={handleChange} placeholder="Tax Rate (%)" type="text" style={styles.input} required />
        <input name="deductions" value={formData.deductions} onChange={handleChange} placeholder="Deductions" type="text" style={styles.input} required />
        <input name="bonuses" value={formData.bonuses} onChange={handleChange} placeholder="Bonuses" type="text" style={styles.input} required />

        <div style={styles.sectionTitle}>📅 Schedule Details</div>
        <select name="shift" value={formData.shift} onChange={handleChange} style={styles.select}>
          <option value="Morning">Morning</option>
          <option value="Night">Night</option>
        </select>

        <div>
          <p style={{ fontWeight: '500', marginTop: '1rem', color: '#212529' }}>Work Days</p>
          <div style={styles.checkboxContainer}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} style={styles.checkboxLabel}>
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

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#3A5FCD')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4D90FE')}
        >
          ➕ Add Staff
        </button>
      </form>
    </div>
  );
};

export default AddStaffForm;
