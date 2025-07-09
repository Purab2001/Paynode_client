import React from 'react'
import { Typography, Button } from "@material-tailwind/react";
import { FaFlag } from "react-icons/fa6";
import { Link } from 'react-router';

// Project primary color: #3B82F6 (Tailwind: bg-blue-500, text-blue-600)
const Error = () => {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8 bg-white">
      <div>
        <FaFlag className="w-20 h-20 mx-auto text-blue-500" />
        <Typography
          variant="h1"
          className="mt-10 !text-3xl !leading-snug md:!text-4xl font-bold"
        >
          Error 404 <br /> It looks like something went wrong.
        </Typography>
        <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          Don't worry, our team is already on it. Please try refreshing the
          page or come back later.
        </Typography>
        <Link to="/">
          <Button className="w-full px-4 md:w-[8rem] bg-blue-500 hover:bg-blue-600 text-white">
            back home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Error