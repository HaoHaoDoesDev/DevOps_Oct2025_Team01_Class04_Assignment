"use client";

import Navbar from "./_components/landing-navbar";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main>
      <Navbar/>
      <div className="flex flex-col max-w-8xl md:flex-row items-center px-8 md:px-16 pt-32 pb-16 min-h-[80vh] ">
        <section className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/assets/landing-page-image.png"
            alt="Logo"
            width={500}
            height={500}
          />
        </section>
        <section className="w-full md:w-1/2 max-w-150">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 leading-tight">
            Secure storage for what matters most
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed mb-8">
            Discover the top Automation Testing Tools in the market & learn how these tools 
            can help you deliver high-quality software.
          </p>
          <div className="flex gap-5">
            <button 
              className="px-6 py-2.5 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
            >
              Get Started
            </button>
            <button 
              className="px-6 py-2.5 bg-white text-blue-500 border border-blue-500 rounded font-medium hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer" 
            >
              Find Out More
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

