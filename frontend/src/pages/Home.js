import React from 'react';

import logo from '../logo.svg';
import SampleComponent from '../components/Sample';

function HomePage() {
    return (
        <div className="w-full min-h-screen bg-gray-100">
            <header className="container mx-auto px-4 py-24 text-center">
                <img src={logo} className="h-16 w-16 mx-auto mb-6" alt="logo" />
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    Learn React
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-600">
                    Edit <code className="text-gray-800 font-semibold">src/pages/Home.js</code> and save to reload.
                </p>
                <a
                    className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <p className="mt-8 text-green-500 font-bold">
                    Congratulations! You have successfully configured Tailwind CSS in your React application.
                </p>
            </header>

            <main className="w-full container flex items-center justify-center mx-auto px-4 py-8">
                <SampleComponent />
            </main>
        </div>
    );
}

export default HomePage;