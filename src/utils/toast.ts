import toast from 'react-hot-toast';

/**
 * Display a success toast notification
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

/**
 * Display an error toast notification
 */
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

/**
 * Display an info toast notification
 */
export const showInfo = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: 'ℹ️',
  });
};

/**
 * Display a loading toast notification
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

/**
 * Dismiss a specific toast by id
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
