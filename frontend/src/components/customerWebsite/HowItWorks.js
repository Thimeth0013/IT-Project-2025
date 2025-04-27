import React from 'react'
import { CalendarIcon, ClockIcon, CarIcon } from 'lucide-react'

const HowItWorks = () => {
  const stepBackgrounds = [
    'url("https://images.pexels.com/photos/29198200/pexels-photo-29198200/free-photo-of-red-vintage-ferrari-in-montigny-le-bretonneux.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
    'url("https://images.pexels.com/photos/28868890/pexels-photo-28868890/free-photo-of-close-up-of-iconic-prancing-horse-logo-on-red-car.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
    'url("https://images.pexels.com/photos/29198198/pexels-photo-29198198/free-photo-of-close-up-of-classic-red-sports-car-hood.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")'
  ];

  return (
    <section className="py-20 bg-[#0b0b0c] text-white w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Getting your vehicle serviced with us is simple and convenient. Just
            follow these three easy steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="text-center relative">
            <div className="bg-[#8E1616] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="hidden md:block absolute top-10 left-[60%] w-[90%] h-0.5 bg-[#8E1616]"></div>
              <CarIcon size={40} className="text-white" />
            </div>
            <div 
              className="rounded-lg p-6 transition-all duration-300 bg-cover bg-center group"
              style={{ 
                backgroundImage: stepBackgrounds[0],
                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                backgroundBlendMode: 'overlay',
                border: '1px solid #8E1616]/30',
              }}
            >
              <div className="group-hover:bg-black group-hover:bg-opacity-50 group-hover:backdrop-blur-sm transition-all duration-300 rounded-lg p-2">
                <h3 className="text-xl font-bold mb-3">Choose a Service</h3>
                <p className="text-gray-300">
                  Browse our service offerings and select the one that meets your vehicle's needs.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center relative">
            <div className="bg-[#8E1616] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="hidden md:block absolute top-10 left-[60%] w-[90%] h-0.5 bg-[#8E1616]"></div>
              <CalendarIcon size={40} className="text-white" />
            </div>
            <div 
              className="rounded-lg p-6 transition-all duration-300 bg-cover bg-center group"
              style={{ 
                backgroundImage: stepBackgrounds[1],
                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="group-hover:bg-black group-hover:bg-opacity-50 group-hover:backdrop-blur-sm transition-all duration-300 rounded-lg p-2">
                <h3 className="text-xl font-bold mb-3">Select Date & Time</h3>
                <p className="text-gray-300">
                  Pick a convenient appointment time that fits your schedule and carry on with your day.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center relative">
            <div className="bg-[#8E1616] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClockIcon size={40} className="text-white" />
            </div>
            <div 
              className="rounded-lg p-6 transition-all duration-300 bg-cover bg-center group"
              style={{ 
                backgroundImage: stepBackgrounds[2],
                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="group-hover:bg-black group-hover:bg-opacity-50 group-hover:backdrop-blur-sm transition-all duration-300 rounded-lg p-2">
                <h3 className="text-xl font-bold mb-3">Get Your Vehicle Serviced</h3>
                <p className="text-gray-300">
                  Bring your vehicle to us, and we'll take care of the rest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks