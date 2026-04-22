import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Copy, Trash2, ExternalLink, BarChart2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/links');
      setLinks(res.data);
      if (res.data.length > 0 && !selectedLink) {
        handleSelectLink(res.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch links', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLink = async (linkId) => {
    setSelectedLink(linkId);
    try {
      const res = await api.get(`/analytics/${linkId}`);
      setAnalytics(res.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
      setAnalytics(null);
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!url) return;
    setError('');
    try {
      await api.post('/links', { originalUrl: url });
      setUrl('');
      fetchLinks();
    } catch (err) {
      console.error('Failed to create link', err);
      setError(err.response?.data?.message || 'Failed to create link');
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await api.delete(`/links/${id}`);
      if (selectedLink === id) {
        setSelectedLink(null);
        setAnalytics(null);
      }
      fetchLinks();
    } catch (error) {
      console.error('Failed to delete link', error);
    }
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  // Transform data for charts
  const getChartData = (dataObj) => {
    if (!dataObj) return [];
    return Object.keys(dataObj).map(key => ({
      name: key,
      value: dataObj[key]
    }));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading your dashboard...</div>;
  }

  const activeLink = links.find(l => l._id === selectedLink);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Manage your links and view performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Link Creator & List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4">Create New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              <input
                type="url"
                required
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Shorten URL
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Your Links ({links.length})</h2>
            </div>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {links.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No links created yet.</div>
              ) : (
                links.map(link => (
                  <div 
                    key={link._id} 
                    onClick={() => handleSelectLink(link._id)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedLink === link._id ? 'bg-indigo-50 border-l-4 border-primary' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="truncate pr-4">
                        <div className="font-medium text-primary truncate">{link.shortUrl}</div>
                        <div className="text-xs text-slate-500 truncate mt-1">{link.originalUrl}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCopy(link.shortUrl); }}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteLink(link._id); }}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                      <BarChart2 className="h-3 w-3" /> {link.clicks} clicks
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & QR */}
        <div className="lg:col-span-2 space-y-6">
          {!activeLink ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <BarChart2 className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No link selected</h3>
              <p className="text-slate-500 mt-2">Select a link from the list to view its analytics and QR code.</p>
            </div>
          ) : (
            <>
              {/* Link Details Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-slate-900 truncate">{activeLink.shortUrl}</h2>
                    <a href={activeLink.shortUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-slate-500 text-sm truncate mb-4">{activeLink.originalUrl}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-primary text-sm font-medium">
                    Total Clicks: {analytics?.totalClicks || activeLink.clicks}
                  </div>
                </div>
                
                {activeLink.qrCode && (
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <img src={activeLink.qrCode} alt="QR Code" className="w-24 h-24" />
                    </div>
                    <a 
                      href={activeLink.qrCode} 
                      download={`qr-${activeLink.shortCode}.png`}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" /> Download QR
                    </a>
                  </div>
                )}
              </div>

              {/* Analytics Charts */}
              {analytics && analytics.totalClicks > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800 mb-6">Clicks by Browser</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getChartData(analytics.browsers)}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {getChartData(analytics.browsers).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {getChartData(analytics.browsers).map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          {entry.name} ({entry.value})
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800 mb-6">Clicks by Device</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getChartData(analytics.devices)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#F1F5F9'}} />
                          <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-800 mb-6">Clicks by Country</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getChartData(analytics.countries)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#F1F5F9'}} />
                          <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
                  <p>No clicks recorded yet for this link.</p>
                  <p className="text-sm mt-1">Share your link to see analytics data here.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
