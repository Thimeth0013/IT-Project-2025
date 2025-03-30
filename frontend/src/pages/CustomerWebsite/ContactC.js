import React from 'react'
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon,
} from 'lucide-react'
import NavBarC from '../../components/customerWebsite/NavBarC';
import FooterC from '../../components/customerWebsite/FooterC';
import { motion } from "motion/react";



const ContactSection = () => {

    const linkVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      };
    
      return (
        <div>
        <motion.div
          initial="hidden" // Start with the hidden state
          animate="visible" // Animate to the visible state
          variants={linkVariants} // Use the defined variants
          transition={{ duration: 0.5, ease: 'easeOut' }} // Smooth 500ms animation
        >
        <NavBarC/>
        <section id="contact" className="py-20 bg-[#0b0b0e] w-full">
        <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions or ready to schedule service? Reach out to our team.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 ml-4">Get In Touch</h3>
            <div className="space-y-6 mb-8 ml-10">
              <div className="flex items-start">
                <div className="bg-[#8e1616] rounded-full p-3 mr-4">
                  <PhoneIcon size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Phone</h4>
                  <p className="text-gray-300">(123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#8e1616] rounded-full p-3 mr-4">
                  <MailIcon size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Email</h4>
                  <p className="text-gray-300">info@fixmate.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#8e1616] rounded-full p-3 mr-4">
                  <MapPinIcon size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Address</h4>
                  <p className="text-gray-300">
                    123 Repair Street, Auto City, AC 12345
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#8e1616] rounded-full p-3 mr-4">
                  <ClockIcon size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">
                    Business Hours
                  </h4>
                  <p className="text-gray-300">
                    Monday - Friday: 8:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-300">Saturday - Sunday: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h4 className="font-bold text-white mb-2">Our Location</h4>
            <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59033.10907334528!2d80.62578144999999!3d7.2945453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366266498acd3%3A0x411a3818a1e03c35!2sKandy!5e1!3m2!1sen!2slk!4v1743006136740!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="flex items-center mt-3 text-gray-600">
              <MapPinIcon size={20} className="text-gray-500" />
              <p className="text-gray-300 ml-2">Kandy, Sri Lanka</p>
            </div>
          </div>
          </div>
          <div className='bg-[#1a1a1a] p-6 rounded-lg'>
            <h3 className="text-2xl font-bold text-white mb-6">
              Send Us a Message
            </h3>
            <form className="space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-300 font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-[#2d2626] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent text-white placeholder-gray-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-300 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-[#2d2626] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent text-white placeholder-gray-500"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-300 font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 bg-[#2d2626] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-300 font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={15}
                  className="w-full px-4 py-3 bg-[#2d2626] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Tell us about your vehicle and service needs"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#8E1616] hover:bg-[#c52836] text-white px-8 py-3 rounded-full font-medium flex items-center justify-center w-full md:w-auto transition-colors"
              >
                Send Message
                <SendIcon size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    <FooterC/>
    </motion.div>
    </div>
  )
}
export default ContactSection
