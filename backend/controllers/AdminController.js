import User from '../models/User.js';
import Link from '../models/Link.js';
import Analytics from '../models/Analytics.js';

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalLinks = await Link.countDocuments();
      
      const clicksResult = await Link.aggregate([
        { $group: { _id: null, total: { $sum: '$clicks' } } }
      ]);
      const totalClicks = clicksResult.length > 0 ? clicksResult[0].total : 0;

      res.json({
        totalUsers,
        totalLinks,
        totalClicks
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllLinks(req, res) {
    try {
      const links = await Link.find().populate('userId', 'name email').sort({ createdAt: -1 });
      
      // Map to include full shortUrl if needed
      const protocol = req.protocol;
      const host = req.get('host');
      
      const mappedLinks = links.map(link => ({
        ...link._doc,
        shortUrl: `${protocol}://${host}/${link.shortCode}`
      }));

      res.json(mappedLinks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AdminController();
