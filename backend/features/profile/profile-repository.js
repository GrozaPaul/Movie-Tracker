import { userRepository } from "../user/user-repository.js";
import { watchedRepository } from "../watched/watched-repository.js";
import { uploadImageFromBuffer, getImageUrl } from "../../minio.js";

export const noOfMoviesWatched = async (userId) => {
  return await watchedRepository.count({
    where: { userId },
  });
};

export const getDescription = async (userId) => {
  return await userRepository.findOne({
    where: { userId },
    select: { description: true },
  });
};

export const updateDescription = async (userId, newDescription) => {
  return await userRepository.update(
    { userId },
    { description: newDescription },
  );
};

export const updateProfilePicture = async (userId, fileBuffer, contentType) => {
  const objectName = `avatars/${userId}_avatar.jpg`;
  const url = await uploadImageFromBuffer(objectName, fileBuffer, contentType);

  await userRepository.update({ userId }, { profilePicture: url });
  return url;
};
