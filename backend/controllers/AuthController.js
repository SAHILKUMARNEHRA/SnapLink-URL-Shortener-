import AuthService from '../services/AuthService.js';
import User from '../models/User.js';

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register(name, email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async googleLogin(req, res) {
    try {
      const { token } = req.body;
      const result = await AuthService.googleLogin(token);
      res.json(result);
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.status(401).json({ message: 'Google authentication failed' });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new AuthController();
