import React from "react";
import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ProfileImage from "../ui/ProfileImage";
import DashboardLayout from "../layouts/DashboardLayout";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateUserProfile({
        displayName: data.displayName,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Profile update error:", error);
    }
  };

  const { role, roleLoading } = useUserRole();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile information and settings
          </p>
        </div>

        {/* Single Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Profile Picture
              </h2>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4">
                  <ProfileImage user={user} size={128} />
                </div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Your profile picture is managed through your authentication
                  provider.
                </p>
                {user?.providerData?.[0]?.providerId === "google.com" && (
                  <p className="text-xs text-gray-500 text-center">
                    To change your photo, update it in your Google account.
                  </p>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    {...register("displayName", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.displayName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed as it's managed by your
                    authentication provider.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <div className="mt-1">
                      <span className="inline-block px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100/60 rounded-full">
                        {roleLoading ? "..." : role}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Authentication Provider
                    </label>
                    <div className="mt-1">
                      <span className="inline-block px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                        {user?.providerData?.[0]?.providerId === "google.com"
                          ? "Google"
                          : "Email/Password"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-[#3B82F6] text-white px-6 py-2 rounded-md hover:opacity-90 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Created
                </label>
                <p className="text-sm text-gray-600">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Sign In
                </label>
                <p className="text-sm text-gray-600">
                  {user?.metadata?.lastSignInTime
                    ? new Date(
                        user.metadata.lastSignInTime
                      ).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
