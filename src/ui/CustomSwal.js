import Swal from "sweetalert2";
import "./CustomSwal.css"; // Import the custom styles

// Function to check if dark mode is active
const isDarkMode = () => {
  return document.documentElement.classList.contains("dark");
};

// Custom SweetAlert2 configuration with theme support
const getCustomSwal = () => {
  return Swal.mixin({
    customClass: {
      confirmButton: "custom-confirm-btn",
      cancelButton: "custom-cancel-btn",
      popup: "custom-popup",
      title: "custom-title",
      content: "custom-content",
      icon: "custom-icon",
    },
    buttonsStyling: false,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
    // Add backdrop class for dark mode
    backdrop: isDarkMode() ? "swal2-backdrop-show" : undefined,
  });
};

// Pre-configured alert types
export const showSuccess = (title, text) => {
  const CustomSwal = getCustomSwal();
  return CustomSwal.fire({
    icon: "success",
    title: title || "Success!",
    text: text,
    confirmButtonText: "OK",
    timer: 3000,
    timerProgressBar: true,
    background: isDarkMode() ? "#393E46" : "#ffffff",
  });
};

export const showError = (title, text) => {
  const CustomSwal = getCustomSwal();
  return CustomSwal.fire({
    icon: "error",
    title: title || "Error!",
    text: text,
    confirmButtonText: "OK",
    background: isDarkMode() ? "#393E46" : "#ffffff",
  });
};

export const showWarning = (title, text) => {
  const CustomSwal = getCustomSwal();
  return CustomSwal.fire({
    icon: "warning",
    title: title || "Warning!",
    text: text,
    confirmButtonText: "OK",
    background: isDarkMode() ? "#393E46" : "#ffffff",
  });
};

export const showInfo = (title, text) => {
  const CustomSwal = getCustomSwal();
  return CustomSwal.fire({
    icon: "info",
    title: title || "Info",
    text: text,
    confirmButtonText: "OK",
    background: isDarkMode() ? "#393E46" : "#ffffff",
  });
};

export const showConfirm = (
  title,
  text,
  confirmText = "Yes",
  cancelText = "No"
) => {
  const CustomSwal = getCustomSwal();
  return CustomSwal.fire({
    title: title || "Are you sure?",
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    background: isDarkMode() ? "#393E46" : "#ffffff",
  });
};

export const showLoading = (title) => {
  const CustomSwal = getCustomSwal();
  return CustomSwal.fire({
    title: title || "Loading...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    background: isDarkMode() ? "#393E46" : "#ffffff",
    didOpen: () => {
      CustomSwal.showLoading();
    },
  });
};

export const showToast = (icon, title) => {
  const CustomSwal = getCustomSwal();
  const Toast = CustomSwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: isDarkMode() ? "#393E46" : "#ffffff",
    color: isDarkMode() ? "#f5f6f7" : "#1f2937",
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", CustomSwal.stopTimer);
      toast.addEventListener("mouseleave", CustomSwal.resumeTimer);
    },
  });

  return Toast.fire({
    icon: icon,
    title: title,
  });
};

// Enhanced input modal with dark mode support
export const showInputModal = (title, inputPlaceholder, inputType = "text") => {
  const CustomSwal = getCustomSwal();
  return CustomSwal.fire({
    title: title,
    input: inputType,
    inputPlaceholder: inputPlaceholder,
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    background: isDarkMode() ? "#393E46" : "#ffffff",
    inputAttributes: {
      style: isDarkMode()
        ? "background-color: #222831; color: #f5f6f7; border: 1px solid #5f6670;"
        : "background-color: #ffffff; color: #1f2937; border: 1px solid #d1d5db;",
    },
  });
};

// Get the base CustomSwal instance
const CustomSwal = getCustomSwal();

export default CustomSwal;
