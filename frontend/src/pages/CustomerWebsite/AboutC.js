import React from 'react';
import { motion } from "framer-motion"; // Updated import to framer-motion
import { 
  CheckIcon, TruckIcon, UserCheckIcon, ClockIcon,
} from 'lucide-react';
import NavBarC from '../../components/customerWebsite/NavBarC';
import FooterC from '../../components/customerWebsite/FooterC';

const teamMembers = [
  {
    name: 'Robert Johnson',
    position: 'Lead Mechanic',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'With over 15 years of experience, Robert leads our team of mechanics with expertise in all vehicle makes and models.',
  },
  {
    name: 'Sarah Williams',
    position: 'Service Manager',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    bio: "Sarah ensures smooth operations and exceptional customer service. She's known for her attention to detail and problem-solving skills.",
  },
  {
    name: 'Michael Chen',
    position: 'Diagnostic Specialist',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Michael specializes in advanced diagnostics and electrical systems. His expertise helps us quickly identify complex vehicle issues.',
  },
  {
    name: 'Emily Rodriguez',
    position: 'Customer Relations',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    bio: "Emily is the friendly face of our front desk. She's dedicated to ensuring every customer has a positive experience with us.",
  },
];

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

const CompanyOverview = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <NavBarC/>
      <section className="py-20 bg-[#0b0b0c] w-full" style={{ paddingTop: "80px" }}>
        <div className="container mx-auto px-4">
          {/* Company Overview Section */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={containerVariants}>
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Your Trusted Auto Service Partner Since 2020
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-gray-300 mb-6 text-lg"
              >
                FixMate was founded with a simple mission: to provide honest,
                reliable, and high-quality vehicle service at fair prices. For
                nearly 5 years, we've been serving our community with dedication
                and expertise.
              </motion.p>
              <motion.p 
                variants={itemVariants}
                className="text-gray-300 mb-8 text-lg"
              >
                Our team of certified technicians has the skills and experience to
                handle all makes and models. We invest in the latest diagnostic
                equipment and ongoing training to ensure we can provide the best
                service possible.
              </motion.p>
              <motion.div variants={containerVariants} className="space-y-4">
                {[
                  'Certified technicians with years of experience',
                  'State-of-the-art diagnostic equipment',
                  'Quality parts and exceptional workmanship',
                  'Transparent pricing with no hidden fees',
                ].map((text, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <CheckIcon size={24} className="text-[#D84040] mr-3 flex-shrink-0" />
                    <p className="text-gray-300">{text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <img
                src="https://purepng.com/public/uploads/large/purepng.com-engine-motorsenginemotorcar-enginemechanical-energyburnfuel-1701527502810xt7qn.png"
                alt="Auto service center"
                style={{ width: "400px", height: "auto", marginLeft: "100px" }}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
              <motion.div 
                variants={itemVariants}
                className="absolute -top-10 -left-30 bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg hidden md:block"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-[#8E1616] rounded-full p-3">
                    <TruckIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">10,000+</h3>
                    <p className="text-sm text-[#D84040]">Vehicles Serviced</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="absolute -bottom-10 -right-0 bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg hidden md:block"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-[#8E1616] rounded-full p-3">
                    <UserCheckIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">98%</h3>
                    <p className="text-sm text-[#D84040]">Customer Satisfaction</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Goals */}
          <motion.div 
            variants={containerVariants}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <ClockIcon size={32} className="text-white" />, title: 'Our Mission', text: 'To provide exceptional auto repair services with integrity, quality, and efficiency, ensuring every customer drives away satisfied.' },
              { icon: <TruckIcon size={32} className="text-white" />, title: 'Our Vision', text: 'To be the most trusted auto service provider in our community, known for excellence in service and customer care.' },
              { icon: <UserCheckIcon size={32} className="text-white" />, title: 'Our Values', text: 'Integrity, transparency, expertise, and commitment to customer satisfaction guide everything we do.' },
            ].map((goal, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#1a1a1a] p-8 rounded-lg text-center border border-[#8E1616]/30"
              >
                <div className="bg-[#8E1616] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {goal.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
                <p className="text-gray-300">{goal.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div variants={containerVariants} className="mt-20 text-center mb-16">
            <motion.h2 
mediv variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our experienced professionals are dedicated to providing you with
              the highest quality service.
            </motion.p>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#8E1616]/30"
              >
                <motion.img
                  src={member.image}
                  alt={member.name}
                  variants={itemVariants}
                  className="w-full h-64 object-cover"
                />
                <motion.div variants={itemVariants} className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-[#D84040] font-medium mb-3">{member.position}</p>
                  <p className="text-gray-300 mb-4">{member.bio}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <FooterC/>
    </motion.div>
  );
};

export default CompanyOverview;