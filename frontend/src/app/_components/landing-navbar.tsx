"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { NavContent } from "./landing-banner-content";

export default function Navbar() {
  return (
    <main>
      <div className="pl-3 grid grid-cols-3 items-center shadow-sm bg-white-70">
        <div className="col-span-1">
          <Link href="/">
            {" "}
            {/* Set your desired URL here */}
            <Image
              src="/assets/logo/devops-assignment-logo.png"
              alt="Logo"
              width={150}
              height={40}
              className="cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex col-span-2 justify-end pr-8">
          <NavContent />
        </div>
      </div>
    </main>
  );
}
