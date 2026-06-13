import React from 'react';
import { BsRobot, BsGithub, BsLinkedin, BsTwitter, BsEnvelope } from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900 pt-20 pb-8 overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-violet-500/20">
                <BsRobot size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">AI-Interview</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
              AI-powered interview preparation platform designed to improve communication skills, 
              technical depth, and professional confidence. Master your interviews with realistic 
              AI agents and personalized feedback.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 
                  p-2.5 rounded-lg transition-all duration-300 text-slate-300 hover:text-white
                  hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <BsGithub size={18} />
              </a>
              <a 
                href="#" 
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 
                  p-2.5 rounded-lg transition-all duration-300 text-slate-300 hover:text-white
                  hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <BsLinkedin size={18} />
              </a>
              <a 
                href="#" 
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 
                  p-2.5 rounded-lg transition-all duration-300 text-slate-300 hover:text-white
                  hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <BsTwitter size={18} />
              </a>
              <a 
                href="#" 
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 
                  p-2.5 rounded-lg transition-all duration-300 text-slate-300 hover:text-white
                  hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <BsEnvelope size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Home', 'Start Interview', 'History', 'Features', 'About Us'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-slate-400 hover:text-violet-400 text-sm transition-colors duration-200
                      hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Support', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-slate-400 hover:text-violet-400 text-sm transition-colors duration-200
                      hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AI-Interview. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Made with</span>
            <HiSparkles className="text-violet-400" size={16} />
            <span> ashukv94</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
