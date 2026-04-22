import LinkService from '../services/LinkService.js';
import AnalyticsService from '../services/AnalyticsService.js';

class LinkController {
  async createShortUrl(req, res) {
    try {
      const { originalUrl } = req.body;
      const userId = req.user.id;
      
      const link = await LinkService.createShortUrl(userId, originalUrl, req);
      
      // Attach the full shortUrl instead of just the code
      const shortUrl = LinkService.buildShortUrl(link.shortCode, req);
      res.status(201).json({ ...link._doc, shortUrl });
    } catch (error) {
      console.error('Error creating short URL:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async getLinksByUser(req, res) {
    try {
      const userId = req.user.id;
      const links = await LinkService.getLinksByUser(userId);
      
      // Transform response to include full shortUrl
      const transformedLinks = links.map(link => ({
        ...link._doc,
        shortUrl: LinkService.buildShortUrl(link.shortCode, req)
      }));
      
      res.json(transformedLinks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteLink(req, res) {
    try {
      const linkId = req.params.id;
      const userId = req.user.id;
      
      const result = await LinkService.deleteLink(linkId, userId);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async redirectShortUrl(req, res) {
    try {
      const { shortCode } = req.params;
      const link = await LinkService.getLinkByCode(shortCode);
      
      if (!link) {
        return res.status(404).json({ message: 'Link not found or inactive' });
      }

      // Record analytics async
      AnalyticsService.recordClick(link._id, req).catch(err => console.error('Analytics Error:', err));

      res.redirect(link.originalUrl);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new LinkController();
