import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";

export class AuthService {
  private userModel: User;

  constructor() {
    this.userModel = new User();
  }

  async register(userData: IUser) {
    const existingUser = await this.userModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(userData.password);
    const user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    return { ...user, password: undefined };
  }

  async login(credentials: { email: string; password: string }) {
    const user = await this.userModel.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await comparePassword(
      credentials.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user);
    return { token, user: { ...user, password: undefined } };
  }
}
