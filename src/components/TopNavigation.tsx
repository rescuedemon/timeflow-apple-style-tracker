import React from 'react';
import { Timer, FileText, CheckSquare, Calendar } from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'time-tracker',
      label: 'Time Tracker',
      icon: Timer,
    },
    {
      id: 'timesheet',
      label: 'Timesheet',
      icon: FileText,
    },
    {
      id: 'my-tasks',
      label: 'My Tasks',
      icon: CheckSquare,
    },
    {
      id: 'holidays',
      label: 'Holidays',
      icon: Calendar,
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 text-base font-semibold transition-all duration-300 relative ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg" />
                )}
                
                <div className="relative flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`} />
                  <span className={`font-semibold ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}>
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TopNavigation;