import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import NavBarC from "../../components/customerWebsite/NavBarC";
import FooterC from "../../components/customerWebsite/FooterC";

const YourBookings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedVehicleNo, setSelectedVehicleNo] = useState(""); // Updated to vehicleNo
  const [vehicleNos, setVehicleNos] = useState([]); // Updated to vehicleNos

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/LoginC");
      return;
    }

    const fetchBookings = async () => {
      try {
        const bookingsResponse = await axios.get("http://localhost:8000/api/booking/myBookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedBookings = bookingsResponse.data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);

        // Extract unique vehicle numbers
        const uniqueVehicleNos = [...new Set(sortedBookings.map((booking) => booking.vehicleNo).filter(Boolean))];
        setVehicleNos(uniqueVehicleNos);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(`Failed to fetch bookings: ${err.response?.status} - ${err.response?.data?.error || err.message}`);
        setBookings([]);
        setFilteredBookings([]);
      }
    };
    fetchBookings();
  }, [isLoggedIn, navigate, token]);

  // Filter bookings based on status and vehicle number
  useEffect(() => {
    let updatedBookings = bookings;
    if (filterStatus !== "All") {
      updatedBookings = updatedBookings.filter((booking) => booking.status === filterStatus);
    }
    if (selectedVehicleNo) {
      updatedBookings = updatedBookings.filter((booking) => booking.vehicleNo === selectedVehicleNo);
    }
    setFilteredBookings(updatedBookings);
  }, [filterStatus, selectedVehicleNo, bookings]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.post(
          `http://localhost:8000/api/booking/cancelBooking/${bookingId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMessage("Booking canceled successfully!");
        setError(null);
        const bookingsResponse = await axios.get("http://localhost:8000/api/booking/myBookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedBookings = bookingsResponse.data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sortedBookings);
        const uniqueVehicleNos = [...new Set(sortedBookings.map((booking) => booking.vehicleNo).filter(Boolean))];
        setVehicleNos(uniqueVehicleNos);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError(`Failed to cancel booking: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
        setSuccessMessage(null);
      }
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleVehicleNoChange = (e) => {
    setSelectedVehicleNo(e.target.value);
  };

  const generateReport = () => {
    if (!selectedVehicleNo) {
      alert("Please select a vehicle number to generate a vehicle-specific report.");
      return;
    }

    const reportBookings = bookings.filter((booking) => booking.vehicleNo === selectedVehicleNo);
    if (reportBookings.length === 0) {
      alert("No bookings found for the selected vehicle number.");
      return;
    }

    const doc = new jsPDF({
      putOnlyUsedFonts: true,
      compress: true,
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    const addPageBackground = () => {
      doc.setFillColor(11, 11, 12); // #0b0b0c
      doc.rect(0, 0, pageWidth, pageHeight, "F");
    };

    const addHeader = (y) => {
      doc.setFillColor(142, 22, 22); // #8E1616
      doc.rect(margin, y - 10, pageWidth - 2 * margin, 20, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text(`Vehicle Report: ${selectedVehicleNo}`, pageWidth / 2, y + 5, { align: "center" });
      return y + 20;
    };

    const addStationDetails = (y) => {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(200, 200, 200);
      const stationDetails = [
        "Fix Mate Auto Service",
        "123 Mechanic Lane, Auto City",
        "Phone: (555) 123-4567",
        "Email: contact@fixmateautoservice.com",
        "Website: www.fixmateautoservice.com",
      ];
      stationDetails.forEach((line) => {
        doc.text(line, pageWidth / 2, y, { align: "center" });
        y += 5;
      });
      return y + 10;
    };

    const addTableHeader = (y) => {
      doc.setFillColor(42, 42, 42); // #2a2a2a
      doc.rect(margin, y - 5, pageWidth - 2 * margin, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      const headers = ["Date", "Time", "Vehicle", "Services", "Cost", "Status"];
      const colWidths = [30, 25, 30, 60, 25, 20];
      let x = margin;
      headers.forEach((header, i) => {
        doc.text(header, x + 2, y + 2);
        x += colWidths[i];
      });
      return y + 10;
    };

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        const footerText = `Page ${i} of ${pageCount} | FixMate Auto Service | (555) 123-4567 | www.fixmateautoservice.com`;
        doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.setDrawColor(142, 22, 22);
        doc.setLineWidth(0.2);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      }
    };

    addPageBackground();
    let y = margin;
    y = addHeader(y);
    y = addStationDetails(y);
    y = addTableHeader(y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(220, 220, 220);
    const colWidths = [30, 25, 30, 60, 25, 20];
    reportBookings.forEach((booking) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        addPageBackground();
        y = margin;
        y = addTableHeader(y);
      }

      let x = margin;
      doc.text(new Date(booking.bookingDate).toISOString().split("T")[0], x + 2, y);
      x += colWidths[0];
      doc.text(booking.bookingTime, x + 2, y);
      x += colWidths[1];
      doc.text(`${booking.vehicleType} (${booking.vehicleMake})`, x + 2, y, { maxWidth: colWidths[2] - 4 });
      x += colWidths[2];
      doc.text(booking.serviceType.map((s) => s.name).join(", "), x + 2, y, { maxWidth: colWidths[3] - 4 });
      x += colWidths[3];
      doc.text(`Rs.${booking.totalCost.toFixed(2)}`, x + 2, y);
      x += colWidths[4];
      doc.text(booking.status, x + 2, y);
      y += 10;
    });

    addFooter();
    doc.save(`Vehicle_Report_${selectedVehicleNo}.pdf`);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <NavBarC />
      <div className="min-h-screen bg-[#0b0b0c] flex flex-col">
        <div className="w-full py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-7xl">
            <h2 className="text-left text-3xl font-bold text-white mb-8">
              Your Bookings
            </h2>
            {/* Filter Options and Generate Report */}
            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-4 flex-wrap items-center">
                {["All", "Pending", "Complete", "Canceled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className={`py-2 px-4 rounded-full font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-[#8E1616] text-white"
                        : "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
                <select
                  value={selectedVehicleNo}
                  onChange={handleVehicleNoChange}
                  className="py-2 px-4 bg-[#1a1a1a] text-gray-300 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                >
                  <option value="">All Vehicles</option>
                  {vehicleNos.map((vehicleNo) => (
                    <option key={vehicleNo} value={vehicleNo}>
                      {vehicleNo}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={generateReport}
                className="py-2 px-4 bg-[#8E1616] text-white rounded-full font-medium hover:bg-[#D84040] transition-colors"
              >
                Generate Vehicle Report
              </button>
            </div>
            {error && (
              <div className="mb-4 text-center text-red-500">{error}</div>
            )}
            {successMessage && (
              <div className="mb-4 text-center text-green-500">{successMessage}</div>
            )}
            {filteredBookings.length === 0 ? (
              <p className="text-center text-lg text-gray-300">
                {filterStatus === "All" && !selectedVehicleNo
                  ? "You have no bookings yet."
                  : `No ${filterStatus.toLowerCase()} bookings found${selectedVehicleNo ? ` for ${selectedVehicleNo}` : ""}.`}
              </p>
            ) : (
              <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full text-left text-gray-300">
                  <thead className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white">
                    <tr>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Date</th>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Time</th>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Vehicle</th>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Vehicle No</th>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Services</th>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Total Cost</th>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Status</th>
                      <th className="p-4 font-semibold text-sm uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr
                        key={booking._id}
                        className={`border-b border-gray-700 transition-colors duration-200 ${index % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#141414]"} hover:bg-[#2a2a2a]`}
                      >
                        <td className="p-4">{new Date(booking.bookingDate).toISOString().split("T")[0]}</td>
                        <td className="p-4">{booking.bookingTime}</td>
                        <td className="p-4">{`${booking.vehicleType} (${booking.vehicleMake})`}</td>
                        <td className="p-4">{booking.vehicleNo || "N/A"}</td>
                        <td className="p-4">
                          {booking.serviceType.map((service) => service.name).join(", ")}
                        </td>
                        <td className="p-4">Rs.{booking.totalCost.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === "Complete"
                                ? "bg-green-500/20 text-green-400"
                                : booking.status === "Canceled"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {booking.status !== "Complete" && booking.status !== "Canceled" && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="py-1.5 px-4 bg-[#b91c1c] text-white rounded-full text-sm font-medium shadow-md hover:bg-[#c52836] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946]"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
};

export default YourBookings;