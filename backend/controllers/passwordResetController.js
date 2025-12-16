import { generateOTP, validateOTP, incrementAttempts } from "../middleware/otp.js";
import Users from "../models/users.js";

export const initiatePasswordReset = async (req, res) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
  const user = Users.find({ email }).toArray;

  if (!user) {
    return res.status(400).send("User does not exist");
  }

  if (oldPassword !== user.password) {
    return res.status(400).send("Invalid old password");
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).send("New passwords do not match");
  }
  const OTP = generateOTP();

  console.log(`Password reset OTP for ${email}: ${OTP}`);

  res.status(200).send(`Password reset OTP for ${email}: ${OTP}`);
};

export const verifyResetOTP = (req, res) => {
  const { email, OTP, resetAttempts } = req.body;

  if (resetAttempts.locked) {
    return res.status(400).send("Password reset is temporarily locked. Please try again later.");
  }

  if (!validateOTP(email, OTP)) {
    incrementAttempts(email);
    return res.status(400).send("Invalid or expired OTP");
  }

  res.status(200).send("OTP is valid");
};

export const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await Users.find({ email }).toArray;

  if (!user) {
    return res.status(400).send("User does not exist");
  }

  user.password = newPassword;
  await Users.save(user);

  delete resetAttempts[email];

  res.status(200).send("Password reset successfully");
};