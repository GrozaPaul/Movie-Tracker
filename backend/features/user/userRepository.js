import { AppDataSource } from "../../typeorm-config.js";
import { User } from "./userEntity.js";

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async () => {
  return await userRepository.find();
};

export const getUserById = async (userId) => {
  return await userRepository.findOne({
    where: { userId: parseInt(userId) },
  });
};

export const getUserByUsername = async (username) => {
  return await userRepository.findOne({
    where: { username },
  });
};

export const getUserByEmail = async (email) => {
  return await userRepository.findOne({
    where: { email },
  });
};

export const exitsByUsername = async (username) => {
  return await userRepository.existsBy({ username: username });
};

export const existsByEmail = async (email) => {
  return await userRepository.existsBy({ email: email });
};

export const createUser = async (userData) => {
  const user = userRepository.create(userData);
  return await userRepository.save(user);
};

export const updateUser = async (userId, userData) => {
  await userRepository.update({ userId: parseInt(userId) }, userData);
  return await getUserById(userId);
};

export const deleteCurrentUser = async (userId) => {
  const result = await userRepository.delete({ userId: parseInt(userId) });
  return result.affected > 0;
};
