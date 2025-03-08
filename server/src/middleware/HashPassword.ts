import crypto from "crypto";

class HashPassword {
  // Function to salt and hash a password securely
  static saltPassword(password: string) {
    const salt = crypto.randomBytes(32).toString("hex"); // Generate a 32-byte salt
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha256") // Use PBKDF2 with 10k iterations
      .toString("hex");
    return { salt, hash };
  }

  // Function to verify the password
  static verifyPassword(password: string, salt: string, hash: string) {
    const newHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha256")
      .toString("hex");
    return newHash === hash;
  }
}

export default HashPassword;
// Example usage
// const { salt, hash } = HashPassword.saltPassword("mySecurePassword123");
// console.log("Salt:", salt);
// console.log("Hash:", hash);

// const isValid = HashPassword.verifyPassword("mySecurePassword123", salt, hash);
// console.log("Password valid:", isValid);
