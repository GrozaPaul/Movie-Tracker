import { createUserDto, loginUserDto } from "./user.dto.js";
import * as userService from "./user.service.js";

export const createUser = async (req, res) => {
  try {
    const { error, value } = createUserDto.validate(req.body);

    if (error) {
      return res.status(400).json({
        errors: error.details.map((detail) => detail.message),
      });
    }

    const user = await userService.createUser(
      value.username,
      value.email,
      value.password,
    );

    res.status(201).json({
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { error, value } = loginUserDto.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message),
      });
    }

    const { user, token } = await userService.loginUser(
      value.email,
      value.password,
    );

    res.status(200).json({
      message: "Login successful!",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: "Password confirmation is required!",
      });
    }

    await userService.deleteCurrentUser(userId, password);

    res.status(200).json({
      message: "Account successfully deleted!",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
