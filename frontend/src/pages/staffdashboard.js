import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StaffDashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/staff/getallstaff');
      setStaffList(res.data.staff);
    } catch (err) {
      console.error('Error fetching staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/staff/deletestaff/${id}`);
      setStaffList(prev => prev.filter(staff => staff._id !== id));
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editstaff/${id}`);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF('landscape');
    const title = 'Staff Management Report - 2025';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(34, 45, 67);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;
    doc.text(title, x, 20);

    const columns = [
      { header: 'Emp ID', dataKey: 'employeeID' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Phone', dataKey: 'phone' },
      { header: 'Email', dataKey: 'email' },
      { header: 'Role', dataKey: 'role' },
      { header: 'Net Salary', dataKey: 'netSalary' },
      { header: 'Pay Date', dataKey: 'paymentDate' }
    ];

    const rows = staffList.map(staff => ({
      employeeID: staff.employeeID,
      name: staff.name,
      phone: staff.phone,
      email: staff.email,
      role: staff.role,
      netSalary: staff.netSalary,
      paymentDate: staff.paymentDate ? new Date(staff.paymentDate).toLocaleDateString() : ''
    }));

    autoTable(doc, {
      startY: 30,
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey])),
      theme: 'grid',
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: [255, 255, 255],
        fontSize: 13,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 11,
        cellPadding: 4,
        halign: 'center',
        valign: 'middle',
        textColor: [40, 40, 40],
        lineColor: [230, 230, 230],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255]
      },
      columnStyles: {
        5: { textColor: [26, 188, 156], fontStyle: 'bold' }
      },
      margin: { top: 30 },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10);
      }
    });

    const barStartY = doc.lastAutoTable.finalY + 20;
    const barData = [
      { label: 'Mechanic', value: 25, color: '#1F77B4' },
      { label: 'Engine Repair', value: 30, color: '#FF7F0E' },
      { label: 'Oil Change Technician', value: 20, color: '#2CA02C' },
      { label: 'Cleaner', value: 10, color: '#D62728' },
      { label: 'Tire Specialist', value: 15, color: '#9467BD' },
    ];

    const maxBarValue = Math.max(...barData.map(item => item.value));
    const barWidth = 20;
    const barSpacing = 27;
    const chartHeight = 60;
    const totalChartWidth = (barData.length - 1) * barSpacing + barWidth;
    const chartBaseX = (pageWidth - totalChartWidth) / 2;
    const chartBaseY = barStartY + chartHeight;

    // Draw Y-axis
    doc.setDrawColor(0);
    doc.line(chartBaseX - 20, barStartY - 10, chartBaseX - 20, chartBaseY);

    // Draw Y-axis values
    const numYLabels = 5;
    for (let i = 0; i <= numYLabels; i++) {
      const yValue = Math.round((maxBarValue / numYLabels) * i);
      const yPosition = chartBaseY - (chartHeight / numYLabels) * i;
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.text(`${yValue}`, chartBaseX - 25, yPosition + 2, { align: 'right' });
      // Optional: small grid lines (optional, for neatness)
      doc.setDrawColor(220);
      doc.line(chartBaseX - 20, yPosition, chartBaseX + totalChartWidth + 10, yPosition);
    }

    // Draw X-axis
    doc.setDrawColor(0);
    doc.line(chartBaseX - 20, chartBaseY, chartBaseX + totalChartWidth + 10, chartBaseY);

    barData.forEach((item, index) => {
      const barHeight = (item.value / maxBarValue) * chartHeight;
      const barX = chartBaseX + (index * barSpacing);
      const barY = chartBaseY - barHeight;

      const hex = item.color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      doc.setFillColor(r, g, b);
      doc.rect(barX, barY, barWidth, barHeight, 'F');

      doc.setFontSize(8);
      doc.setTextColor(40);
      doc.text(item.label, barX + barWidth / 2, chartBaseY + 5, { align: 'center', baseline: 'top' });
    });

    doc.save('Staff_Report.pdf');
  };

  const styles = {
    container: {
      width: '100%',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to right, #f0f4ff, #fefefe)',
      minHeight: '100vh',
    },
    heading: {
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#1e3a8a',
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    search: {
      padding: '0.6rem 1rem',
      fontSize: '1rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      flexGrow: 1,
      maxWidth: '300px',
    },
    pdfButton: {
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: '#fff',
      padding: '0.6rem 1.2rem',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    },
    tableWrapper: {
      overflowX: 'auto',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
    },
    table: {
      width: '100%',
      minWidth: '1200px',
      borderCollapse: 'collapse',
      fontSize: '0.95rem',
    },
    th: {
      background: 'linear-gradient(to right, #3b82f6, #2563eb)',
      color: '#fff',
      padding: '14px 10px',
      textAlign: 'left',
    },
    td: {
      padding: '14px 10px',
      borderTop: '1px solid #e2e8f0',
      color: '#374151',
    },
    right: { textAlign: 'right' },
    center: { textAlign: 'center' },
    rowHover: (i) => ({
      backgroundColor: i % 2 === 0 ? '#f9fafb' : '#f1f5f9',
    }),
    btn: {
      padding: '6px 12px',
      fontSize: '0.875rem',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      color: '#fff',
      marginRight: '6px',
    },
    editBtn: {
      backgroundColor: '#f59e0b',
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
    },
  };

  const filtered = staffList.filter((staff) =>
    staff.employeeID?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Staff Dashboard</h2>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by Emp ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.search}
        />
        <button onClick={handleGeneratePDF} style={styles.pdfButton}>
          Generate PDF Report
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Emp ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Role</th>
                <th style={{ ...styles.th, ...styles.right }}>Basic</th>
                <th style={{ ...styles.th, ...styles.right }}>Tax %</th>
                <th style={{ ...styles.th, ...styles.right }}>Deduct</th>
                <th style={{ ...styles.th, ...styles.right }}>Bonus</th>
                <th style={{ ...styles.th, ...styles.right }}>Net</th>
                <th style={{ ...styles.th, ...styles.center }}>Pay Date</th>
                <th style={{ ...styles.th, ...styles.center }}>Shift</th>
                <th style={{ ...styles.th, ...styles.center }}>Days</th>
                <th style={{ ...styles.th, ...styles.center }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((staff, i) => (
                <tr key={staff._id} style={styles.rowHover(i)}>
                  <td style={styles.td}>{staff.employeeID}</td>
                  <td style={styles.td}>{staff.name}</td>
                  <td style={styles.td}>{staff.phone}</td>
                  <td style={styles.td}>{staff.email}</td>
                  <td style={styles.td}>{staff.address}</td>
                  <td style={styles.td}>{staff.role}</td>
                  <td style={{ ...styles.td, ...styles.right }}>{staff.basicSalary}</td>
                  <td style={{ ...styles.td, ...styles.right }}>{staff.taxRate}</td>
                  <td style={{ ...styles.td, ...styles.right }}>{staff.deductions}</td>
                  <td style={{ ...styles.td, ...styles.right }}>{staff.bonuses}</td>
                  <td style={{ ...styles.td, ...styles.right }}>{staff.netSalary}</td>
                  <td style={{ ...styles.td, ...styles.center }}>
                    {staff.paymentDate ? new Date(staff.paymentDate).toLocaleDateString() : ''}
                  </td>
                  <td style={{ ...styles.td, ...styles.center }}>{staff.shift}</td>
                  <td style={{ ...styles.td, ...styles.center }}>
                    {Array.isArray(staff.workDays) ? staff.workDays.join(', ') : ''}
                  </td>
                  <td style={{ ...styles.td, ...styles.center }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        style={{ ...styles.btn, ...styles.editBtn }}
                        onClick={() => handleEdit(staff._id)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...styles.btn, ...styles.deleteBtn }}
                        onClick={() => handleDelete(staff._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
