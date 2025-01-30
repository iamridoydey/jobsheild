import Image from 'next/image'
import React from 'react'
import jobsheildLogo from "@/public/jobsheild_logo.svg"
import { Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <div className="nav_container w-full bg-[#171e2d] py-2 shadow-md">
      <nav className="nav_wrapper w-full max-w-[1400px] mx-auto px-4">
        <ul className="nav_items flex flex-row justify-between items-center">
          <li className="nav_item w-12 h-12">
            <Image
              src={jobsheildLogo}
              alt={"jobsheild logo"}
              className="w-full h-full"
            />
          </li>
          <li className="nav_item w-10 h-10">
            <Menu/>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar