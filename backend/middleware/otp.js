let resetAttempts = {};

export const generateOTP = (email) => {
  const OTP = Math.random().toString(36).substring(2, 8);
  const expirationTime = Date.now(15000);
  resetAttempts[email] = { OTP, expirationTime, attempts: 0, locked: false };
  return OTP;
};

export const validateOTP = (email, inputOTP) => {
  const resetData = resetAttempts[email];
  if (!resetData) return false;
  const { OTP } = resetData;
  return OTP === inputOTP;
};

export const incrementAttempts = (email) => {
  if (resetAttempts[email]) {
    resetAttempts[email].attempts += 1;
    if (resetAttempts[email].attempts > 3) {
      resetAttempts[email].locked = true;
    }
  }
};