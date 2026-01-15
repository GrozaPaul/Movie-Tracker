import Joi from "joi";

export const createUserDto = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginUserDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
