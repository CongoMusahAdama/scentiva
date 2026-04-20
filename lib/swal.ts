import Swal from "sweetalert2";

const ScentivaSwal = Swal.mixin({
  customClass: {
    popup: "scentiva-swal-popup",
    title: "scentiva-swal-title",
    htmlContainer: "scentiva-swal-content",
    confirmButton: "scentiva-swal-confirm",
    cancelButton: "scentiva-swal-cancel",
    icon: "scentiva-swal-icon",
  },
  buttonsStyling: false,
  background: "#FFFFFF",
  color: "#1A1B23",
});

export const showSuccess = (title: string, text?: string) => {
  return ScentivaSwal.fire({
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    iconColor: "#D8B34B",
  });
};

export const showError = (title: string, text?: string) => {
  return ScentivaSwal.fire({
    icon: "error",
    title,
    text,
    iconColor: "#DC2626",
    confirmButtonText: "Close",
  });
};

export const showConfirm = (title: string, text: string, confirmText = "Confirm") => {
  return ScentivaSwal.fire({
    title,
    text,
    icon: "warning",
    iconColor: "#D8B34B",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
  });
};

export const showLoading = (title: string) => {
  ScentivaSwal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export default ScentivaSwal;
