import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Link2, QrCode, BarChart3 } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
          Shorten Links, Generate QR Codes & <span className="text-primary">Track Performance</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          SnapLink provides a complete solution to manage your URLs. Shorten long links, automatically generate downloadable QR codes, and gain insights with our advanced analytics dashboard.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="group inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary text-white hover:bg-indigo-700 hover:text-slate-100 active:bg-indigo-800 active:text-indigo-300 focus-visible:outline-indigo-900"
          >
            {user ? 'Go to Dashboard' : 'Get Started for Free'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          {!user && (
            <Link
              to="/login"
              className="group inline-flex ring-1 items-center justify-center rounded-full py-3 px-6 text-sm font-semibold focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <Link2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Short Links</h3>
            <p className="text-slate-600">Turn long, messy URLs into clean, branded short links that are easy to share and remember.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <QrCode className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">QR Code Generation</h3>
            <p className="text-slate-600">Automatically generate a custom QR code for every link you create. Download and use it anywhere.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Detailed Analytics</h3>
            <p className="text-slate-600">Track exactly who is clicking your links with real-time data on devices, browsers, and countries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
