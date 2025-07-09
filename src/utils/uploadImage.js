// Image upload utility using ImgBB API
const IMGBB_API_KEY = import.meta.env.VITE_image_upload_key;

export const uploadImageToImgBB = async (imageFile) => {
  if (!imageFile) {
    throw new Error("No image file provided");
  }

  if (!IMGBB_API_KEY) {
    throw new Error(
      "ImgBB API key is not configured. Please add VITE_image_upload_key to your environment variables."
    );
  }

  // Validate file type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedTypes.includes(imageFile.type)) {
    throw new Error(
      "Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WebP)."
    );
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (imageFile.size > maxSize) {
    throw new Error(
      "File size is too large. Please upload an image smaller than 5MB."
    );
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || "Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);

    if (error.message.includes("network")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    } else if (error.message.includes("key")) {
      throw new Error(
        "Invalid API key. Please check your ImgBB configuration."
      );
    }

    throw new Error(
      error.message || "Failed to upload image. Please try again."
    );
  }
};
