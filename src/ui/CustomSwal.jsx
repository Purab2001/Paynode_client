/* eslint-disable react-refresh/only-export-components */
import Swal from "sweetalert2";

// Custom SweetAlert2 configuration with blue theme (#3B82F6)
const CustomSwal = Swal.mixin({
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
});

// Pre-configured alert types
export const showSuccess = (title, text) => {
  return CustomSwal.fire({
    icon: "success",
    title: title || "Success!",
    text: text,
    confirmButtonText: "OK",
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showError = (title, text) => {
  return CustomSwal.fire({
    icon: "error",
    title: title || "Error!",
    text: text,
    confirmButtonText: "OK",
  });
};

export const showWarning = (title, text) => {
  return CustomSwal.fire({
    icon: "warning",
    title: title || "Warning!",
    text: text,
    confirmButtonText: "OK",
  });
};

export const showInfo = (title, text) => {
  return CustomSwal.fire({
    icon: "info",
    title: title || "Info",
    text: text,
    confirmButtonText: "OK",
  });
};

export const showConfirm = (
  title,
  text,
  confirmText = "Yes",
  cancelText = "No"
) => {
  return CustomSwal.fire({
    title: title || "Are you sure?",
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
};

export const showLoading = (title) => {
  return CustomSwal.fire({
    title: title || "Loading...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      CustomSwal.showLoading();
    },
  });
};

export const showToast = (icon, title) => {
  const Toast = CustomSwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
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

export default CustomSwal;
