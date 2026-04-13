import { hashPassword, comparePassword } from "../../utils/password.js";

const passwordPlugin = (schema) => {
  schema.pre("save", hashPassword);
  schema.methods.comparePassword = comparePassword;
};

export default passwordPlugin;
