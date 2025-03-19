import React from 'react'
import { Link } from 'react-router-dom'
import { MailIcon, LockIcon, UserIcon, ArrowRightIcon } from 'lucide-react'
import { motion } from "motion/react";

const SignUpC = () => {

  const handleSubmit = (e) => {
    e.preventDefault();

    sendRequest().then(() => {
        alert("SignUp Succesfull");
        history("/userdetails");
    }).catch((err) => {
        alert(err.message);
    })
    // Handle signup logic here
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E63946] hover:text-[#c52836]">
              Sign in
            </Link>
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#1a1a1a] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Full name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    className="bg-[#1d1616] block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
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
                    autoComplete="new-password"
                    required
                    className="bg-[#1d1616] block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-white"
                >
                  Confirm password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    autoComplete="new-password"
                    required
                    className="bg-[#1d1616] block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-[#E63946] focus:ring-[#E63946] bg-[#1d1616] border-gray-700 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-300"
                >
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-[#E63946] hover:text-[#c52836]"
                  >
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-[#E63946] hover:text-[#c52836]"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#E63946] hover:bg-[#c52836] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946]"
                >
                  Create account
                  <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(to left, rgba(29, 22, 22, 0.9), rgba(29, 22, 22, 0.7)), url("https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Join FixMate Today
              </h2>
              <p className="text-xl text-gray-300 max-w-md mx-auto">
                Create an account to experience premium auto care services and
                exclusive member benefits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  )
}
export default SignUpC;
