import logo from "../assets/logo.png";
import { Link } from "react-router";
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-4 pt-8 md:px-16 lg:px-24 xl:px-32  flex flex-col md:flex-row justify-between gap-10 border-b border-gray-500 pb-10">
        <div className="md:max-w-96">
          <Link to="/" className="flex items-center gap-2">
            <img className="h-9" src={logo} alt="logo" />
            <span className="text-xl font-bold">PayNode</span>
          </Link>
          <p className="mt-6 text-sm">
            A well-renowned company wants to monitor the workload of the
            employees and keep records of salary, contracts, and more. This
            platform allows employees to post workflow updates, while HR
            Executives can monitor progress, manage payments, and oversee
            contracts efficiently.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Link to="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="text-2xl hover:text-blue-400 transition-colors" />
            </Link>
            <Link to="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub className="text-2xl hover:text-gray-100 transition-colors" />
            </Link>
            <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="text-2xl hover:text-blue-500 transition-colors" />
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>paynode@example.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © PayNode. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
