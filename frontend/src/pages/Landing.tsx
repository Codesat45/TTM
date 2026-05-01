import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20 animate-pulse" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25"
          >
            Sign In
          </Link>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent animate-fade-in">
            Manage Tasks Like
            <span className="block text-red-500">Never Before</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl animate-slide-up">
            Experience the future of team collaboration with our Netflix-inspired task management platform. 
            Streamline your workflow, boost productivity, and achieve more together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
            <Link
              to="/signup"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-600/25 flex items-center justify-center group"
            >
              <PlayIcon className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-600 flex items-center justify-center"
            >
              Sign In
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute top-20 left-10 w-64 h-40 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl backdrop-blur-sm border border-red-500/20 animate-float delay-1000 flex items-center justify-center">
          <div className="text-center">
            <UsersIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Team Collaboration</p>
          </div>
        </div>
        <div className="absolute top-40 right-10 w-64 h-40 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-xl backdrop-blur-sm border border-blue-500/20 animate-float delay-2000 flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Advanced Analytics</p>
          </div>
        </div>
        <div className="absolute bottom-20 left-20 w-64 h-40 bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-xl backdrop-blur-sm border border-green-500/20 animate-float delay-3000 flex items-center justify-center">
          <div className="text-center">
            <ClockIcon className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Time Tracking</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 px-8 py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Why Teams Love TaskFlow
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: UsersIcon,
                title: "Real-time Collaboration",
                description: "Work together seamlessly with instant updates and live task tracking.",
                gradient: "from-blue-600 to-blue-500"
              },
              {
                icon: ChartBarIcon,
                title: "Powerful Analytics",
                description: "Get insights into your team's performance with detailed dashboards.",
                gradient: "from-purple-600 to-purple-500"
              },
              {
                icon: ClockIcon,
                title: "Smart Time Management",
                description: "Optimize your workflow with intelligent scheduling and deadline tracking.",
                gradient: "from-green-600 to-green-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-red-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-red-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-20 px-8 py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Trusted by Teams Worldwide
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Active Teams" },
              { number: "12K+", label: "Tasks Completed" },
              { number: "99.8%", label: "Uptime" },
              { number: "Real-time", label: "Collaboration" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-20 px-8 py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of teams already using TaskFlow to achieve more.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-600/25 group"
          >
            Start Your Free Trial
            <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 px-8 py-12 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              TaskFlow
            </h3>
          </div>
          <p className="text-gray-400">
            © 2024 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
