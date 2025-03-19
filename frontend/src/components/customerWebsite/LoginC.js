import React from 'react'
import { Link } from 'react-router-dom'
import { MailIcon, LockIcon, ArrowRightIcon } from 'lucide-react'
import { motion } from "motion/react";


const LoginC = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
  }

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden" // Start with the hidden state
      animate="visible" // Animate to the visible state
      variants={linkVariants} // Use the defined variants
      transition={{ duration: 0.5, ease: 'easeOut' }} // Smooth 500ms animation
    >
    <div className="min-h-screen bg-[#0b0b0c] flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(29, 22, 22, 0.9), rgba(29, 22, 22, 0.7)), url("https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Welcome Back to FixMate
              </h2>
              <p className="text-xl text-gray-300 max-w-md mx-auto">
                Your trusted partner in automotive care. Login to manage your
                service appointments and vehicle maintenance history.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#E63946] hover:text-[#c52836]">
              Sign up
            </Link>
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#1a1a1a] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="bg-[#1d1616] block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    className="bg-[#1d1616] block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#E63946] focus:ring-[#E63946] bg-[#1d1616] border-gray-700 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-[#E63946] hover:text-[#c52836]"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#E63946] hover:bg-[#c52836] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946]"
                >
                  Sign in
                  <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  )
}
export default LoginC;
