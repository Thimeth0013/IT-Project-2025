import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarC from "../../components/customerWebsite/NavBarC";
import FooterC from "../../components/customerWebsite/FooterC";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedSlot } = location.state || {};

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [booking, setBooking] = useState({
    name: "",
    vehicleNo: "",
    vehicleType: "",
    vehicleMake: "",
    serviceType: [],
    bookingDate: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    bookingTime: selectedSlot || "",
    phoneNumber: "",
    email: "",
    mileage: "",
  });
  const [services, setServices] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/LoginC");
      return;
    }

    const fetchData = async () => {
      try {
        const servicesResponse = await axios.get("http://localhost:8000/api/service/getAllServices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(servicesResponse.data);

        const userResponse = await axios.get("http://localhost:8000/api/auth/currentUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking((prev) => ({ ...prev, email: userResponse.data.email || "" }));
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/LoginC");
        }
      }
    };
    fetchData();
  }, [isLoggedIn, navigate, token]);

  const vehicleOilUsage = {
    Bike: 1,
    Threewheel: 1,
    Car: 2,
    Van: 2,
    SUV: 2,
    Bus: 3,
    Lorry: 3,
  };

  useEffect(() => {
    const calculateCost = () => {
      if (!booking.vehicleType || booking.serviceType.length === 0) {
        setTotalCost(0);
        return;
      }
      const oilCans = vehicleOilUsage[booking.vehicleType] || 0;
      const cost = booking.serviceType.reduce((total, serviceId) => {
        const service = services.find((s) => s._id === serviceId);
        if (!service) return total;
        let serviceCost = service.unitPrice;
        if (service.items && service.items.some((item) => item.itemName === "Oil Can")) {
          const oilCanItem = service.items.find((item) => item.itemName === "Oil Can");
          serviceCost += oilCans * (oilCanItem.unitPrice || 0);
        }
        return total + serviceCost;
      }, 0);
      setTotalCost(cost);
    };
    calculateCost();
  }, [booking.vehicleType, booking.serviceType, services]);

  const restrictNegativeValue = (value) => {
    return Math.max(0, parseFloat(value) || 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setBooking({ ...booking, [name]: lettersOnly });
      return;
    }

    if (name === "vehicleNo") {
      const validVehicleNo = value.replace(/[^a-zA-Z0-9-]/g, "");
      setBooking({ ...booking, [name]: validVehicleNo });
      return;
    }

    if (name === "phoneNumber") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      setBooking({ ...booking, [name]: numbersOnly });
      return;
    }

    if (name === "mileage") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      const restrictedValue = restrictNegativeValue(numbersOnly);
      setBooking({ ...booking, [name]: restrictedValue });
      return;
    }

    setBooking({ ...booking, [name]: value });
  };

  const handleServiceChange = (serviceId) => {
    const updatedServices = booking.serviceType.includes(serviceId)
      ? booking.serviceType.filter((id) => id !== serviceId)
      : [...booking.serviceType, serviceId];
    setBooking({ ...booking, serviceType: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/LoginC");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/booking/addBooking",
        { ...booking, totalCost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking successfully created");
      navigate("/payment", { state: { bookingId: response.data._id, totalCost } });
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("There was an error creating your booking");
    }
  };

  const vehicleMakes = [
    "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz",
    "Volkswagen", "Hyundai", "Kia", "Subaru", "Mazda", "Audi", "Tesla",
    "Jeep", "Dodge", "Porsche", "Lexus", "Volvo", "Mitsubishi",
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <NavBarC />
      <div className="min-h-screen bg-[#0b0b0c] flex">
        {/* Left Section: Booking Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold text-white">
              Booking Form
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-[#1a1a1a] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={booking.name}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Number:</label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={booking.vehicleNo}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Enter vehicle number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Type:</label>
                  <select
                    name="vehicleType"
                    value={booking.vehicleType}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    required
                  >
                    <option value="" className="text-gray-400">Select Vehicle Type</option>
                    <option value="Bike">Bike</option>
                    <option value="Threewheel">Threewheel</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="Bus">Bus</option>
                    <option value="Lorry">Lorry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Make:</label>
                  <select
                    name="vehicleMake"
                    value={booking.vehicleMake}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    required
                  >
                    <option value="" className="text-gray-400">Select Vehicle Make</option>
                    {vehicleMakes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Updated Services Section with Grid Layout */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Services:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-48 overflow-y-auto">
                    {services.map((service) => (
                      <div key={service._id} className="flex items-center text-gray-300">
                        <input
                          type="checkbox"
                          checked={booking.serviceType.includes(service._id)}
                          onChange={() => handleServiceChange(service._id)}
                          className="mr-2 text-[#E63946] focus:ring-[#E63946]"
                        />
                        <label className="text-sm">{service.name} - Rs.{service.unitPrice}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Booking Date:</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-[#2d2d2d] border border-gray-700 rounded-md text-white"
                    value={booking.bookingDate}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Booking Time:</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-[#2d2d2d] border border-gray-700 rounded-md text-white"
                    value={booking.bookingTime}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={booking.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={booking.email || ""}
                    className="w-full p-2 bg-[#2d2d2d] border border-gray-700 rounded-md text-white"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mileage:</label>
                  <input
                    type="number"
                    name="mileage"
                    value={booking.mileage}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1d1616] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Enter mileage"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-[#8E1616] text-white rounded-full font-medium hover:bg-[#c52836] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946]"
                >
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section: Selected Services and Total Cost */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAyL3Jhd3BpeGVsX29mZmljZV8yOV9leHRyZW1lX2Nsb3NlX3VwX3Bob3RvX29mX2JsYWNrX3Nwb3J0X2Nhcl93YV9lZjkwZWY2Ny0xZjM0LTQwNGQtODg5MS00ZTMwNTk3YjQ5OGFfMS5qcGc.jpg")`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center text-white bg-[#1a1a1a]/30 backdrop-blur-md border border-gray-700/50 rounded-md p-10 shadow-lg">
                <h2 className="text-4xl font-bold mb-6">Your Booking Summary</h2>
                {booking.serviceType.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-4">Selected Services:</h3>
                    <ul className="text-lg text-gray-300 max-w-md mx-auto">
                      {booking.serviceType.map((serviceId) => {
                        const service = services.find((s) => s._id === serviceId);
                        return service ? (
                          <li key={service._id} className="mb-2">
                            {service.name} - Rs.{service.unitPrice}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                ) : (
                  <p className="text-lg text-gray-300 max-w-md mx-auto mb-6">
                    No services selected yet. Please choose the services you need.
                  </p>
                )}
                <div className="text-xl font-semibold">
                  <strong>Total Cost:</strong> Rs.{totalCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterC />
    </div>
  );
};

export default BookingForm;