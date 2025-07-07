import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router'
import Footer from '../components/Footer';

const RootLayout = () => {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div>
      {!hideNavAndFooter && <Navbar />}
      <Outlet />
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

export default RootLayout