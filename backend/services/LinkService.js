import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import Link from '../models/Link.js';

class LinkService {
  generateShortCode() {
    return nanoid(8);
  }

  async generateQRCode(url) {
    try {
      return await QRCode.toDataURL(url);
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (err) {
      try {
        new URL('http://' + url);
        return true;
      } catch (err2) {
        return false;
      }
    }
  }

  buildShortUrl(code, req) {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/${code}`;
  }

  async createShortUrl(userId, originalUrl, req) {
    if (!this.validateUrl(originalUrl)) {
      throw new Error('Invalid URL format');
    }

    // Ensure it starts with http/https
    if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = 'http://' + originalUrl;
    }

    const shortCode = this.generateShortCode();
    const shortUrl = this.buildShortUrl(shortCode, req);
    const qrCode = await this.generateQRCode(shortUrl);

    const link = await Link.create({
      userId,
      originalUrl,
      shortCode,
      qrCode
    });

    return link;
  }

  async deleteLink(linkId, userId) {
    const link = await Link.findOne({ _id: linkId, userId });
    if (!link) {
      throw new Error('Link not found or unauthorized');
    }
    await link.deleteOne();
    return { message: 'Link deleted successfully' };
  }

  async getLinksByUser(userId) {
    return Link.find({ userId }).sort({ createdAt: -1 });
  }

  async getLinkByCode(shortCode) {
    return Link.findOne({ shortCode, isActive: true });
  }
}

export default new LinkService();
