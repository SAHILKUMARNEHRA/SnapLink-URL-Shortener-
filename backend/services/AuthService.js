import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d'
    });
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  }

  async register(name, email, password) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = this.generateToken(user._id);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user._id);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    };
  }

  async googleLogin(idToken) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        googleId
      });
    } else if (!user.googleId) {
      // If user exists but hasn't linked google, link it now
      user.googleId = googleId;
      await user.save();
    }

    const token = this.generateToken(user._id);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    };
  }
}

export default new AuthService();
