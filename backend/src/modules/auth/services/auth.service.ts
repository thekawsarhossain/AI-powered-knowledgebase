import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/environment';
import {
  IUserRepository,
  UserRepository,
} from '../repositories/user.repository';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  AuthPayload,
} from '../types/auth.types';

export class AuthService {
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.create(email, hashedPassword);

    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    const userWithPassword = await this.userRepository.findByEmail(email);
    if (!userWithPassword) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userWithPassword.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...user } = userWithPassword;

    const token = this.generateToken(user.id);

    return { user, token };
  }

  async validateToken(token: string): Promise<AuthPayload> {
    try {
      return jwt.verify(token, config.jwtSecret) as AuthPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  private generateToken(userId: string): string {
    const payload: AuthPayload = { userId };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '7d',
      issuer: 'knowledgebase-api',
    });
  }
}
