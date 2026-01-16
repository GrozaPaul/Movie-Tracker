import * as userRepository from "./userRepository.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

export const createUser = async (username, email, password) => {
  if (await userRepository.exitsByUsername(username))
    throw new Error("Username already in use!");

  if (await userRepository.existsByEmail(email))
    throw new Error("Email already in use!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// after registering user is sent to login page. generate JWT token only at login.
export const loginUser = async (email, password) => {
  const user = await userRepository.getUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  if (!(await bcrypt.compare(password, user.password)))
    throw new Error("Invalid credentials!");

  const { password: _, ...userWithoutPassword } = user;

  const token = generateToken(user.userId);

  return {
    user: userWithoutPassword,
    token,
  };
};

export const deleteCurrentUser = async (userId, password) => {
  const user = await userRepository.getUserById(userId);

  if (!user) throw new Error("User not found!");

  if (!(await bcrypt.compare(password, user.password)))
    throw new Error("Invalid password!");

  const deleted = await userRepository.deleteCurrentUser(userId);

  if (deleted === false) throw new Error("Failed to delete account.");
  return {
    success: true,
  };
};
