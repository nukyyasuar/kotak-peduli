let confirmationResult = null;

export const setConfirmationResult = (result) => {
  confirmationResult = result;
};

export const getConfirmationResult = () => {
  return confirmationResult;
};

export const clearConfirmationResult = () => {
  confirmationResult = null;
};