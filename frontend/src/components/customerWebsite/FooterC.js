import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../../assets/Blue White Illustrative Car Wash Logo.png";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
} from 'lucide-react'

const FooterC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <img src={logo} style={{height: "34px"}}/>
            </h3>
            <p className="text-gray-300 mb-4">
              Professional auto repair and maintenance services to keep your
              vehicle running at its best.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#E63946] transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="hover:text-[#E63946] transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="hover:text-[#E63946] transition-colors">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-[#E63946] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-[#E63946] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-[#E63946] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about#contact"
                  className="text-gray-300 hover:text-[#E63946] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-[#E63946] transition-colors"
                >
                  Oil Change
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-[#D84040] transition-colors"
                >
                  Tire Replacement
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-[#D84040] transition-colors"
                >
                  Engine Diagnostics
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-[#D84040] transition-colors"
                >
                  Brake Repair
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <PhoneIcon size={20} className="text-[#E63946] flex-shrink-0" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-start space-x-3">
                <MailIcon size={20} className="text-[#E63946] flex-shrink-0" />
                <span className="text-gray-300">info@autoservice.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPinIcon
                  size={20}
                  className="text-[#E63946] flex-shrink-0"
                />
                <span className="text-gray-300">
                  123 Repair Street, Auto City, AC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterC;
