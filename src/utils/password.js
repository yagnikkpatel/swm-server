import bcrypt from "bcrypt";

/**
 * Pre-save middleware to hash the password before saving it to the database.
 * Used with Mongoose Schema.pre("save", ...)
 */
export async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
}

/**
 * Method to compare a candidate password with the stored hashed password.
 * Used with Mongoose Schema.methods.comparePassword = ...
 * 
 * @param {string} candidatePassword - The plain text password to check.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
export async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}
