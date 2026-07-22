import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import {
  RegisterRequestBody,
  LoginRequestBody,
  User,
  PublicUser,
  JwtPayload,
} from '../types';
import { ConflictError, UnauthorizedError } from '../errors/app-error';

const SALT_ROUNDS = 10;
const INVALID_CREDENTIALS_MSG = 'Invalid credentials';

export class AuthService {
  /**
   * Registers a new user.
   * Checks for duplicate email, hashes password, inserts user into Supabase.
   */
  public static async registerUser(payload: RegisterRequestBody): Promise<PublicUser> {
    const { email, password, name } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check for existing user
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // 2. Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Insert new user
    const { data: createdUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: normalizedEmail,
        password_hash,
        name: name.trim(),
      })
      .select('id, email, name, role, created_at')
      .single();

    if (insertError || !createdUser) {
      throw new Error(insertError?.message ?? 'Failed to create user');
    }

    const newUser = createdUser as User;
    return this.toPublicUser(newUser);
  }

  /**
   * Authenticates a user and returns a JWT token + public user profile.
   */
  public static async loginUser(
    payload: LoginRequestBody
  ): Promise<{ token: string; user: PublicUser }> {
    const { email, password } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (fetchError || !user) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MSG);
    }

    const typedUser = user as User;

    // 2. Compare password
    const passwordMatch = await bcrypt.compare(password, typedUser.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MSG);
    }

    // 3. Generate JWT
    const jwtPayload: JwtPayload = {
      userId: typedUser.id,
      email: typedUser.email,
      role: typedUser.role,
    };

    const secret = process.env.JWT_SECRET ?? 'fallback-dev-secret';
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as string;

    const token = jwt.sign(jwtPayload, secret, {
      expiresIn,
    } as jwt.SignOptions);

    return {
      token,
      user: this.toPublicUser(typedUser),
    };
  }

  /**
   * Helper to ensure sensitive fields like `password_hash` are excluded.
   */
  private static toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    };
  }
}
