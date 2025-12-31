import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const jwtSign = (id) => {
  console.log(id);
  return jwt.sign({ id }, env.jwt_password, { expiresIn: "1d" });
};

export default jwtSign;
