import Joi from "joi";
const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(14).required(),
});
export default authSchema;
