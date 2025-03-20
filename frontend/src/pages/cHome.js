import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, AwardIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const features = [
    {
      icon: <CheckCircleIcon size={32} className="text-white" />,
      title: 'Quality Service',
      description:
        'Our skilled technicians use advanced diagnostic tools and quality parts to ensure your vehicle receives the best care possible.',
    },
    {
      icon: <AwardIcon size={32} className="text-white" />,
      title: 'Certified Technicians',
      description:
        'All our mechanics are ASE certified with years of experience working on all makes and models of vehicles.',
    },
    {
      icon: <ClockIcon size={32} className="text-white" />,
      title: 'Fast & Affordable',
      description:
        'We provide efficient service at competitive prices, with transparent quotes and no hidden fees.',
    },
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'Toyota Owner',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      text: "I've been taking my car here for years and I'm always impressed by their professionalism and attention to detail.",
    },
    {
      name: 'Michael Chen',
      position: 'Honda Owner',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      text: 'The service is quick and reliable. I had an emergency brake issue and they fit me in the same day. Fair prices and excellent workmanship. Highly recommend!',
    },
    {
      name: 'Emily Rodriguez',
      position: 'Ford Owner',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
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
      {/* Hero Section */}
      <div className="bg-[#0b0b0c] w-full">
        <div
          className="relative min-h-[90vh] flex items-center bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.3)), url("https://images.pexels.com/photos/7530997/pexels-photo-7530997.jpeg")',
          }}
        >
          <div className="container mx-auto px-4 py-16 pt-28">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Reliable & Efficient Vehicle Services at Your Fingertips.
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Professional auto repair and maintenance services to keep your
                vehicle running smoothly. Book online and get back on the road
                faster.
              </p>
              <div className="flex flex-wrap gap-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-[#0b0b0c] w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're committed to providing exceptional auto service with honesty, expertise, and convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#2a2a2a] rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#8E1616]/30">
                <div className="bg-[#8E1616] rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-[#2a2a2a] rounded-lg p-8 shadow text-center border border-[#8E1616]/30">
                      <div className="flex justify-center mb-6">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} size={20} className="text-[#D84040] fill-[#D84040]" />
                        ))}
                      </div>
                      <p className="text-gray-300 italic mb-6">"{testimonial.text}"</p>
                      <div className="flex items-center justify-center">
                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                        <div className="text-left">
                          <h4 className="font-bold text-white ">{testimonial.name}</h4>
                          <p className="text-[#D84040] text-sm">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg " onClick={handlePrevious}>
              <ChevronLeftIcon size={24} />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg" onClick={handleNext}>
              <ChevronRightIcon size={24} />
            </button>
          </div>
        </div>
      </section>
      </motion.div>
    </>
  );
};

export default HomePage;