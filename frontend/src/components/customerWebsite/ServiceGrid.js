import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"; // Updated import to framer-motion

const ServiceGrid = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
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

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Fetch all services when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/service/getAllServices");
        setServices(response.data);
      } catch (error) {
        setError("Failed to fetch services");
      }
    };
    fetchServices();
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ maxWidth: "auto", paddingLeft: "60px", paddingRight: "60px", paddingBottom: "100px", backgroundColor: "#0b0b0c"}}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: "red", textAlign: "center", marginBottom: "20px"}}
        >
          {error}
        </motion.div>
      )}

      {services.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", color: "#666" }}
        >
          No services available at the moment.
        </motion.p>
      ) : (
        <motion.div 
          variants={containerVariants}
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "30px" 
          }}
        >
          {services.map((service) => (
            <motion.div
              key={service._id}
              variants={cardVariants}
              whileHover="hover"
              style={{
                border: "1px solid #8e1616",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#1a1a1a",
                textAlign: "left",
              }}
            >
              {service.image && (
                <motion.img
                  src={`http://localhost:8000${service.image}`}
                  alt={service.name}
                  variants={itemVariants}
                  style={{ 
                    width: "100%", 
                    height: "200px", 
                    objectFit: "cover", 
                    borderRadius: "8px", 
                    marginBottom: "10px" 
                  }}
                />
              )}
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-bold text-white mb-2 mt-5"
              >
                {service.name}
              </motion.h3>
              <motion.p 
                variants={itemVariants}
                className="text-gray-300"
              >
                {service.description}
              </motion.p>
              <motion.p 
                variants={itemVariants}
                style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}
              >
                Rs. {service.unitPrice}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  to="/SlotSelectBooking"
                  className="bg-[#8E1616] hover:bg-[#D84040] text-white px-8 py-3 rounded-full font-medium flex items-center transition-colors"
                  style={{ width: "60%", justifyContent: "flex-start", marginTop: "10px" }}
                >
                  Book a Service
                  <ArrowRightIcon size={18} className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceGrid;