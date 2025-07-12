import { Link } from "react-router";
import { Button } from "@material-tailwind/react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const Banner = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="">
        <main className="flex flex-col md:flex-row items-center max-md:text-center justify-between py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto min-h-full lg:min-h-[calc(100vh-88px)]">
          <div className="flex flex-col items-center md:items-start">
            <button
              className="mb-6 flex items-center space-x-2 border border-blue-500 text-blue-500 text-xs rounded-full px-4 pr-1.5 py-1.5 hover:bg-blue-50 transition"
              type="button"
              data-aos="fade-down"
            >
              <span>Streamline your workforce management.</span>
              <span className="flex items-center justify-center size-6 p-1 rounded-full bg-blue-500">
                <FiArrowUpRight size={16} color="#fff" />
              </span>
            </button>
            <h1
              className="text-gray-900 font-bold text-3xl sm:text-4xl md:text-5xl max-w-xl leading-tight"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Complete Employee Management
              <span className="text-blue-500"> Solution</span>
            </h1>
            <p
              className="mt-4 text-gray-600 max-w-md text-sm sm:text-lg leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Monitor workload, track salaries, manage contracts, and enable
              seamless communication between employees and HR executives.
            </p>
            <div
              className="flex flex-col md:flex-row items-center mt-8 gap-3"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Link to="/overview">
                <Button
                  color="blue"
                  ripple={true}
                  className="rounded-full flex items-center gap-2 normal-case text-sm shadow-none"
                  type="button"
                >
                  Start Managing Today
                  <FiArrowRight size={15} color="#fff" />
                </Button>
              </Link>
              {user ? (
                <Link to="/dashboard">
                  <Button
                    className="rounded-full normal-case text-sm shadow-none"
                    type="button"
                    ripple={true}
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button
                    className="rounded-full normal-case text-sm shadow-none"
                    type="button"
                    ripple={true}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div
            aria-label="Employee management workplace"
            className="mt-12 grid grid-cols-2 gap-6 pb-6"
          >
            <img
              alt="Employee working on computer"
              className="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg"
              height="140"
              src="https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=726&auto=format&fit=crop"
              width="120"
              data-aos="zoom-in"
              data-aos-delay="100"
            />
            <img
              alt="HR professional reviewing documents"
              className="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg"
              height="140"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop"
              width="120"
              data-aos="zoom-in"
              data-aos-delay="200"
            />
            <img
              alt="Team collaboration meeting"
              className="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg"
              height="140"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1171&auto=format&fit=crop"
              width="120"
              data-aos="zoom-in"
              data-aos-delay="300"
            />
            <img
              alt="Professional using dashboard"
              className="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg"
              height="140"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1170&auto=format&fit=crop"
              width="120"
              data-aos="zoom-in"
              data-aos-delay="400"
            />
          </div>
        </main>
      </section>
    </div>
  );
};

export default Banner;
