import { useForm } from "react-hook-form";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { Button } from "@material-tailwind/react";
import {Link} from "react-router";

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Handle form submission here
      console.log("Contact form submitted:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      reset();
      alert("Thank you for your message! We'll get back to you soon.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error sending your message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FF] to-[#E6EFFF] py-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-lg text-blue-600 font-medium mb-2">
            Contact PayNode
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch with Our Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about employee management solutions? Need help with
            implementation? Our team is here to assist you in transforming your
            HR operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FiMapPin className="text-blue-500 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Office Address
                  </h3>
                  <p className="text-gray-600">
                    PayNode Solutions Ltd.
                    <br />
                    123 Business District, Suite 456
                    <br />
                    Tech City, TC 12345
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiPhone className="text-blue-500 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiMail className="text-blue-500 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">support@paynode.com</p>
                  <p className="text-gray-600">sales@paynode.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiClock className="text-blue-500 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tell us about your employee management needs, questions, or feedback..."
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                color="blue"
                size="lg"
                disabled={isSubmitting}
                className="w-full normal-case shadow-none"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-4 md:mt-8 bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-600 mb-6">
            For urgent support or sales inquiries, don't hesitate to reach out
            directly. Our team is committed to helping you succeed with PayNode.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="tel:+15551234567">
              <Button
                color="blue"
                size="lg"
                className="normal-case shadow-none rounded-full"
              >
                Call Support
              </Button>
            </Link>
            <Link to="mailto:support@paynode.com">
              <Button color="blue" size="lg" variant="outlined" className="normal-case shadow-none rounded-full">Email Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
