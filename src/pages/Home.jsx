import React, { useEffect } from 'react'
import Banner from '../components/Home/Banner'
import OurServices from '../components/Home/OurServices'
import StatsHighlight from '../components/Home/StatsHighlight'
import HowItWorks from '../components/Home/HowItWorks'
import Testimonial from '../components/Home/Testimonial'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Home = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <div>
      <Banner />
      <OurServices />
      <StatsHighlight />
      <HowItWorks />
      <Testimonial />
    </div>
  );
}

export default Home