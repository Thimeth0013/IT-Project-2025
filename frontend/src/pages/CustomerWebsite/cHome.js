import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, AwardIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from "axios";
import HowItWorks from '../../components/customerWebsite/HowItWorks';
import NavBarC from '../../components/customerWebsite/NavBarC';
import FooterC from '../../components/customerWebsite/FooterC';

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
      },
    },
  };

  const features = [
    {
      icon: <CheckCircleIcon size={32} className="text-white" />,
      title: 'Quality Service',
      description: 'Our skilled technicians use advanced diagnostic tools and quality parts to ensure your vehicle receives the best care possible.',
      backgroundImage: 'https://images.pexels.com/photos/17036651/pexels-photo-17036651/free-photo-of-gear-shift-knob.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      icon: <AwardIcon size={32} className="text-white" />,
      title: 'Certified Technicians',
      description: 'All our mechanics are ASE certified with years of experience working on all makes and models of vehicles.',
      backgroundImage: 'https://images.pexels.com/photos/12969804/pexels-photo-12969804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      icon: <ClockIcon size={32} className="text-white" />,
      title: 'Fast & Affordable',
      description: 'We provide efficient service at competitive prices, with transparent quotes and no hidden fees.',
      backgroundImage: 'https://images.pexels.com/photos/10205349/pexels-photo-10205349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'Toyota Owner',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      text: "I've been taking my car here for years and I'm always impressed by their professionalism and attention to detail.",
    },
    {
      name: 'Michael Chen',
      position: 'Honda Owner',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      text: 'The service is quick and reliable. I had an emergency brake issue and they fit me in the same day. Fair prices and excellent workmanship. Highly recommend!',
    },
    {
      name: 'Emily Rodriguez',
      position: 'Ford Owner',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      text: "As someone who knows very little about cars, I appreciate how they take the time to explain what needs to be done without making me feel like I'm being taken advantage of.",
    },
  ];

  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchBookings = async () => {
        try {
          const bookingsResponse = await axios.get("http://localhost:8000/api/booking/myBookings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Sort by booking date (assuming bookingDate is a field) and take the 5 most recent
          const sortedBookings = bookingsResponse.data
            .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
            .slice(0, 5);
          setBookings(sortedBookings);
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setError(`Failed to fetch bookings: ${err.response?.status} - ${err.response?.data?.error || err.message}`);
          setBookings([]);
        }
      };
      fetchBookings();
    }
  }, [isLoggedIn, token]);

  const handlePrevious = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
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
        const sortedBookings = bookingsResponse.data
          .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
          .slice(0, 5);
        setBookings(sortedBookings);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError(`Failed to cancel booking: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
        setSuccessMessage(null);
      }
    }
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <NavBarC/>
        {/* Hero Section */}
        <div className="bg-[#0b0b0c] w-full">
          <motion.div
            variants={containerVariants}
            className="relative min-h-[90vh] flex items-center bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.3)), url("https://images.pexels.com/photos/7530997/pexels-photo-7530997.jpeg")',
            }}
          >
            <div className="container mx-auto px-4 py-16 pt-28">
              <div className="max-w-2xl">
                <motion.h1 
                  variants={itemVariants} 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                >
                  Reliable & Efficient Vehicle Services at Your Fingertips.
                </motion.h1>
                <motion.p 
                  variants={itemVariants} 
                  className="text-xl text-gray-200 mb-8"
                >
                  Professional auto repair and maintenance services to keep your
                  vehicle running smoothly. Book online and get back on the road
                  faster.
                </motion.p>
                <motion.div 
                  variants={itemVariants} 
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to="/SlotSelectBooking"
                    className="bg-[#8E1616] hover:bg-[#D84040] text-white px-8 py-3 rounded-full font-medium flex items-center transition-colors"
                  >
                    Book a Service
                    <ArrowRightIcon size={18} className="ml-2" />
                  </Link>
                  <Link
                    to="/about"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1d1616] px-8 py-3 rounded-full font-medium transition-colors"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Latest Bookings Section (Shown only when logged in) */}
        {isLoggedIn && (
          <div className="w-full py-24 sm:px-6 lg:px-16 bg-[#0b0b0c]">
            <div className="sm:mx-auto sm:w-full sm:max-w-7xl">
              <h2 className="text-center text-3xl font-bold text-white mb-8">
                Your Latest Bookings
              </h2>
              {error && (
                <div className="mb-4 text-center text-red-500">{error}</div>
              )}
              {successMessage && (
                <div className="mb-4 text-center text-green-500">{successMessage}</div>
              )}
              {bookings.length === 0 ? (
                <p className="text-center text-lg text-gray-300">You have no bookings yet.</p>
              ) : (
                <>
                  <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="w-full text-left text-gray-300">
                      <thead className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white">
                        <tr>
                          <th className="p-4 font-semibold text-sm uppercase tracking-wider">Date</th>
                          <th className="p-4 font-semibold text-sm uppercase tracking-wider">Time</th>
                          <th className="p-4 font-semibold text-sm uppercase tracking-wider">Vehicle</th>
                          <th className="p-4 font-semibold text-sm uppercase tracking-wider">Services</th>
                          <th className="p-4 font-semibold text-sm uppercase tracking-wider">Total Cost</th>
                          <th className="p-4 font-semibold text-sm uppercase tracking-wider">Status</th>
                          <th className="p-4 font-semibold text-sm uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking, index) => (
                          <tr
                            key={booking._id}
                            className={`border-b border-gray-700 transition-colors duration-200 ${index % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#141414]"} hover:bg-[#2a2a2a]`}
                          >
                            <td className="p-4">{new Date(booking.bookingDate).toISOString().split("T")[0]}</td>
                            <td className="p-4">{booking.bookingTime}</td>
                            <td className="p-4">{`${booking.vehicleType} (${booking.vehicleMake})`}</td>
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
                  <div className="mt-6 text-center">
                    <Link
                      to="/your-bookings"
                      className="inline-block bg-[#8E1616] hover:bg-[#D84040] text-white px-6 py-2 rounded-full font-medium transition-colors"
                    >
                      See More
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <section className="py-20 bg-[#0b0b0c] w-full">
          <div className="container mx-auto px-4">
            <motion.div 
              variants={containerVariants} 
              className="text-center mb-16"
            >
              <motion.h2 
                variants={itemVariants} 
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Why Choose Us?
              </motion.h2>
              <motion.p 
                variants={itemVariants} 
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                We're committed to providing exceptional auto service with honesty, expertise, and convenience.
              </motion.p>
            </motion.div>
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  className="relative rounded-lg p-8 shadow-lg transition-all duration-300 border border-[#8E1616]/30 overflow-hidden group"
                  style={{
                    backgroundImage: `url(${feature.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black group-hover:bg-opacity-50 group-hover:backdrop-blur-sm transition-all duration-300"></div>
                  <div className="relative z-10">
                    <div className="bg-[#8E1616] rounded-full w-16 h-16 flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <HowItWorks />

        {/* Testimonials Section */}
        <section className="py-20 bg-[#0b0b0c] w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Don't just take our word for it. Here's what our satisfied customers have to say.
              </p>
            </div>
            <div className="max-w-4xl mx-auto relative">
              <div className="px-4">
                <div className="bg-[#2a2a2a] rounded-lg p-8 shadow text-center border border-[#8E1616]/30">
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i}>
                        <StarIcon size={20} className="text-[#D84040] fill-[#D84040]" />
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6">"{testimonials[currentIndex].text}"</p>
                  <div className="flex items-center justify-center">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="text-left">
                      <h4 className="font-bold text-white">{testimonials[currentIndex].name}</h4>
                      <p className="text-[#D84040] text-sm">{testimonials[currentIndex].position}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg"
                onClick={handlePrevious}
              >
                <ChevronLeftIcon size={24} />
              </button>
              <button 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg"
                onClick={handleNext}
              >
                <ChevronRightIcon size={24} />
              </button>
            </div>
          </div>
        </section>
        <FooterC/>
      </motion.div>
    </>
  );
};

export default HomePage;