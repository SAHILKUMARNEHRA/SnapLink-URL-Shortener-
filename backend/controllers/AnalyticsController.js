import AnalyticsService from '../services/AnalyticsService.js';

class AnalyticsController {
  async getStatsByLink(req, res) {
    try {
      const { linkId } = req.params;
      const userId = req.user.id;
      
      const stats = await AnalyticsService.getStatsByLink(linkId, userId);
      res.json(stats);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export default new AnalyticsController();
