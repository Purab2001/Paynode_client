import React, { useEffect } from 'react'
import Banner from '../components/Home/Banner'
import OurServices from '../components/Home/OurServices'
import StatsHighlight from '../components/Home/StatsHighlight'
import HowItWorks from '../components/Home/HowItWorks'
import Testimonial from '../components/Home/Testimonial'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Contact from '../components/Home/Contact'
import FAQ from '../components/Home/FAQ'

const Home = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <div className='pt-10 md:pt-0'>
      <Banner />
      <OurServices />
      <StatsHighlight />
      <HowItWorks />
      <Testimonial />
      <FAQ />
      <Contact />
    </div>
  );
}

export default Home