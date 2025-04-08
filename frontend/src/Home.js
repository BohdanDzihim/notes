import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>Home</header>
      <main className="grid place-content-center place-items-center text-center lg:max-w-xl md:max-w-lg sm:max-w-md m-auto flex-1">
        <h1 className="lg:text-4xl md:text-3xl sm:text-2xl font-bold mb-10">Hello, in order to use the app you should log in or register.</h1>
        <div className="flex flex-row gap-2">
          <Link to="/login"><h2 className="inline px-10 py-6 bg-blue-600 text-white rounded-md no-underline font-bold transition-3000 transition-colors hover:bg-blue-700 lg:text-3xl md:text-2xl sm:text-xl">Login</h2></Link>
          <Link to="/registration"><h2 className="inline px-10 py-6 bg-blue-600 text-white rounded-md no-underline font-bold transition-3000 transition-colors hover:bg-blue-700 lg:text-3xl md:text-2xl sm:text-xl">Registration</h2></Link>
        </div>
      </main>
      <footer>&#0169; 2025</footer>
    </div>
  )
}

export default Home