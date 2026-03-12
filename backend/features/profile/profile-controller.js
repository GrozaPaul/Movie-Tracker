import * as profileService from "./profile-service.js";
import * as profileRepository from "./profile-repository.js";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    const profileData = await profileService.getProfile(parseInt(userId));

    res.status(200).json(profileData);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const updateDescription = async (req, res) => {
  try {
    const { userId, newDescription } = req.body;

    const updated = await profileRepository.updateDescription(
      userId,
      newDescription,
    );

    const response = updated.affected
      ? `description updated with "${newDescription}"`
      : "error in updating description";

    res.status(200).json({ response });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    const url = await profileRepository.updateProfilePicture(
      userId,
      file.buffer,
      file.mimetype,
    );

    res.status(200).json({ profilePicture: url });
  } catch (error) {
    res.json({ error: error.message });
  }
};
