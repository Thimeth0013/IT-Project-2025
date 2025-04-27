import React from 'react'
import ServiceGrid from '../../components/customerWebsite/ServiceGrid'
import { motion } from "motion/react";
import NavBarC from '../../components/customerWebsite/NavBarC';
import FooterC from '../../components/customerWebsite/FooterC';

const Services = () => {

    
  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
    <motion.div
      initial="hidden" // Start with the hidden state
      animate="visible" // Animate to the visible state
      variants={linkVariants} // Use the defined variants
      transition={{ duration: 0.5, ease: 'easeOut' }} // Smooth 500ms animation
    >
    <NavBarC/>
    <div className="w-full">
      <div className="bg-[#0b0b0c] text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We offer a comprehensive range of automotive services to keep your
            vehicle running at its best.
          </p>
        </div>
      </div>
      <ServiceGrid/>
    </div>
    <FooterC/>
    </motion.div>
    </>
  )
}
export default Services
