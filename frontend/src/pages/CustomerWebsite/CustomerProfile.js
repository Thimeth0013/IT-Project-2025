import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBarC from "../../components/customerWebsite/NavBarC";
import FooterC from "../../components/customerWebsite/FooterC";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/LoginC");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8000/api/auth/currentUser", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => {
          throw new Error(`Failed to fetch customer details: ${err.response?.status} - ${err.response?.data?.error || err.message}`);
        });
        setCustomer({
          id: userResponse.data.id || "",
          name: userResponse.data.name || "",
          email: userResponse.data.email || "",
          phoneNumber: userResponse.data.phoneNumber || "",
        });

        try {
          const bookingsResponse = await axios.get("http://localhost:8000/api/booking/myBookings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBookings(bookingsResponse.data);
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setError(`Failed to fetch bookings: ${err.response?.status} - ${err.response?.data?.error || err.message}`);
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError(error.message || "Failed to load profile data. Please try again.");
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/LoginC");
        }
      }
    };
    fetchData();
  }, [isLoggedIn, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setCustomer({ ...customer, [name]: lettersOnly });
      return;
    }

    if (name === "phoneNumber") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      setCustomer({ ...customer, [name]: numbersOnly });
      return;
    }

    setCustomer({ ...customer, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/auth/updateProfile/${customer.id}`,
        {
          name: customer.name,
          phoneNumber: customer.phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Profile updated successfully!");
      setError(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      if (response.data.user) {
        setCustomer({
          ...customer,
          name: response.data.user.name || customer.name,
          email: response.data.user.email || customer.email,
          phoneNumber: response.data.user.phoneNumber || customer.phoneNumber,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error.response || error);
      setError(`Failed to update profile: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      setSuccessMessage(null);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirmation do not match");
      setSuccessMessage(null);
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/api/auth/changePassword/${customer.id}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Password updated successfully!");
      setError(null);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating password:", error.response || error);
      setError(`Failed to update password: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      setSuccessMessage(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:8000/api/auth/deleteAccount/${customer.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token");
        alert("Profile deleted successfully.");
        navigate("/LoginC");
      } catch (error) {
        console.error("Error deleting profile:", error.response || error);
        setError(`Failed to delete profile: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }
    }
  };

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
        setBookings(bookingsResponse.data);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError(`Failed to cancel booking: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
        setSuccessMessage(null);
      }
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <NavBarC />
      <div className="min-h-screen bg-[#0b0b0c] flex flex-col">
        
        {/* Profile Update and Change Password Section */}
        <div className="w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
            <h2 className="mt-6 text-center text-3xl font-bold text-white mb-8">
              Your Profile
            </h2>
            {successMessage && (
              <div className="mb-4 text-center text-green-500">{successMessage}</div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Profile Update Form */}
              <div className="bg-[#1a1a1a] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                <h3 className="text-xl font-bold text-white mb-6">Update Profile</h3>
                <form className="space-y-6" onSubmit={handleUpdate}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      className="w-full p-2 bg-[#2d2d2d] border border-gray-700 rounded-md text-white"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number:</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={customer.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#8E1616] text-white rounded-full font-medium hover:bg-[#c52836] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946]"
                  >
                    Update Profile
                  </button>
                </form>
              </div>

              {/* Change Password Form */}
              <div className="bg-[#1a1a1a] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
                <form className="space-y-6" onSubmit={handlePasswordUpdate}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Current Password:</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">New Password:</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password:</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#8E1616] text-white rounded-full font-medium hover:bg-[#c52836] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946]"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>

            {/* Delete Profile Section */}
            <div className="mt-10">
              <h2 className="text-center text-3xl font-bold text-white mb-5">
                Delete Your Profile
              </h2>
              <p className="text-xl text-red-600 max-w-2xl mx-auto text-center text-[16px]">
                This action is irreversible! Deleting your account will permanently remove all your data, including bookings and personal information. Proceed with caution.
              </p>
              <button
                onClick={handleDelete}
                className="w-full mt-5 py-2 px-4 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:max-w-md mx-auto block"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
};

export default CustomerProfile;