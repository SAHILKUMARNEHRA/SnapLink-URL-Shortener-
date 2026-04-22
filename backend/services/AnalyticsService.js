import geoip from 'geoip-lite';
import Analytics from '../models/Analytics.js';
import Link from '../models/Link.js';

class AnalyticsService {
  parseUserAgent(ua) {
    if (!ua) return { browser: 'Unknown', device: 'Unknown' };
    
    let browser = 'Unknown';
    if (ua.isChrome) browser = 'Chrome';
    else if (ua.isFirefox) browser = 'Firefox';
    else if (ua.isSafari) browser = 'Safari';
    else if (ua.isEdge) browser = 'Edge';
    else if (ua.isOpera) browser = 'Opera';

    let device = 'Desktop';
    if (ua.isMobile) device = 'Mobile';
    else if (ua.isTablet) device = 'Tablet';
    
    return { browser, device };
  }

  getCountryFromIP(ip) {
    if (!ip || ip === '127.0.0.1' || ip === '::1') return 'Localhost';
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'Unknown';
  }

  async recordClick(linkId, req) {
    // Increment link clicks
    await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const country = this.getCountryFromIP(ip);
    
    const { browser, device } = this.parseUserAgent(req.useragent);

    await Analytics.create({
      linkId,
      ipAddress: ip,
      country,
      device,
      browser
    });
  }

  async getStatsByLink(linkId, userId) {
    // Verify link belongs to user
    const link = await Link.findOne({ _id: linkId, userId });
    if (!link) {
      throw new Error('Link not found or unauthorized');
    }

    const analytics = await Analytics.find({ linkId });

    // Aggregate stats
    const stats = {
      totalClicks: link.clicks,
      browsers: {},
      devices: {},
      countries: {}
    };

    analytics.forEach(record => {
      stats.browsers[record.browser] = (stats.browsers[record.browser] || 0) + 1;
      stats.devices[record.device] = (stats.devices[record.device] || 0) + 1;
      stats.countries[record.country] = (stats.countries[record.country] || 0) + 1;
    });

    return stats;
  }
}

export default new AnalyticsService();
