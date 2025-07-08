import React from 'react'
import Banner from '../components/Home/Banner'
import OurServices from '../components/Home/OurServices'
import StatsHighlight from '../components/Home/StatsHighlight'
import HowItWorks from '../components/Home/HowItWorks'
import Testimonial from '../components/Home/Testimonial'

const Home = () => {
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