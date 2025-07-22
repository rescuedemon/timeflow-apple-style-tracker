import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  subprojects: string[];
  category: 'Development' | 'Design' | 'Research';
}

interface TimeTrackerProps {
  onTimeLogged: (entry: any) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ onTimeLogged }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSubproject, setSelectedSubproject] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'frequent'>('frequent');
  const [searchQuery, setSearchQuery] = useState('');

  const projects: Project[] = [
    {
      id: '1',
      name: 'Design',
      subprojects: ['UI/UX Design', 'Prototyping', 'Research'],
      category: 'Design'
    },
    {
      id: '2',
      name: 'Development',
      subprojects: ['Frontend', 'Backend', 'Testing'],
      category: 'Development'
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedProject || !selectedSubproject) {
      alert('Please select a project and subproject first');
      return;
    }
    if (isRunning) {
      alert('A timer is already running. Please stop the current timer first.');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const entry = {
      id: Date.now().toString(),
      date: startTime.toDateString(),
      startTime: startTime.toTimeString().slice(0, 8),
      endTime: endTime.toTimeString().slice(0, 8),
      totalTime: formatTime(time),
      project: selectedProject?.name,
      subproject: selectedSubproject,
      description: ''
    };

    onTimeLogged(entry);
    
    // Reset timer
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setStartTime(null);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  };

  const getTimeZoneTime = (timezone: string) => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Date and World Clocks - Full Width */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between">
              {/* Date Section */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 font-display">{getCurrentDateTime()}</h1>
              </div>
              
              {/* World Clocks - Equal Spacing */}
              <div className="flex gap-16">
                {/* India Time */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-3 mx-auto">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-1 text-sm opacity-90 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="font-medium">India</span>
                  </div>
                  <div className="text-lg font-semibold font-mono">{getTimeZoneTime('Asia/Kolkata')}</div>
                </div>

                {/* UK Time */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-3 mx-auto">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-1 text-sm opacity-90 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="font-medium">UK</span>
                  </div>
                  <div className="text-lg font-semibold font-mono">{getTimeZoneTime('Europe/London')}</div>
                </div>

                {/* USA Time */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-3 mx-auto">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-1 text-sm opacity-90 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="font-medium">USA</span>
                  </div>
                  <div className="text-lg font-semibold font-mono">{getTimeZoneTime('America/New_York')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Same Width as Header */}
      <div className="w-full mt-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            {/* Left Panel - Project Selection */}
            <div className="flex-1">
              <Card className="p-8 bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl h-full">
                {/* Search Bar */}
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 bg-slate-50/50 border-0 rounded-2xl text-base font-medium font-system"
                    />
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-slate-100/80 rounded-2xl p-1 mb-8">
                  <Button
                    variant={activeTab === 'frequent' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('frequent')}
                    className={`flex-1 rounded-xl font-medium font-system transition-all duration-300 ${
                      activeTab === 'frequent' 
                        ? 'bg-white shadow-lg text-purple-600' 
                        : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    Frequently Used
                  </Button>
                  <Button
                    variant={activeTab === 'quick' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('quick')}
                    className={`flex-1 rounded-xl font-medium font-system transition-all duration-300 ${
                      activeTab === 'quick' 
                        ? 'bg-white shadow-lg text-purple-600' 
                        : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    Quick Start
                  </Button>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <Card 
                      key={project.id} 
                      className={`p-6 cursor-pointer transition-all duration-300 border-0 rounded-2xl ${
                        selectedProject?.id === project.id 
                          ? 'bg-purple-50 ring-2 ring-purple-200 shadow-lg' 
                          : 'bg-slate-50/50 hover:bg-white hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 font-display">{project.name}</h3>
                        <div className="space-y-2">
                          {project.subprojects.map((sub, index) => (
                            <Badge 
                              key={index}
                              variant={selectedSubproject === sub ? "default" : "secondary"}
                              className={`cursor-pointer transition-all duration-200 text-xs px-3 py-1 font-system ${
                                selectedSubproject === sub 
                                  ? 'bg-purple-600 text-white shadow-md' 
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubproject(sub);
                              }}
                            >
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Panel - Timer */}
            <div className="flex-1">
              <Card className="p-8 bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl h-full flex flex-col justify-center">
                {/* Timer Display */}
                <div className="text-center mb-12">
                  <div className="text-8xl font-mono font-bold text-purple-600 mb-6 tracking-wider">
                    {formatTime(time)}
                  </div>
                  {isRunning && (
                    <div className="text-lg text-slate-500 mb-4">
                      {isPaused ? (
                        <span className="text-orange-600 font-medium font-system flex items-center justify-center gap-2">
                          <Pause className="w-5 h-5" />
                          Paused
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium font-system flex items-center justify-center gap-2">
                          <Play className="w-5 h-5" />
                          Running
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center gap-4">
                  {!isRunning ? (
                    <Button
                      onClick={handleStart}
                      size="lg"
                      className="h-14 px-12 text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold font-system"
                      disabled={!selectedProject || !selectedSubproject}
                    >
                      <Play className="w-6 h-6 mr-3" />
                      Start
                    </Button>
                  ) : (
                    <>
                      {!isPaused ? (
                        <Button
                          onClick={handlePause}
                          variant="outline"
                          size="lg"
                          className="h-14 px-8 text-lg rounded-2xl border-2 border-slate-300 hover:bg-slate-50 font-semibold font-system"
                        >
                          <Pause className="w-6 h-6 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={handleResume}
                          size="lg"
                          className="h-14 px-8 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl font-semibold font-system"
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Resume
                        </Button>
                      )}
                      
                      <Button
                        onClick={handleStop}
                        variant="outline"
                        size="lg"
                        className="h-14 px-8 text-lg rounded-2xl border-2 border-slate-300 hover:bg-slate-50 font-semibold font-system"
                      >
                        <Square className="w-6 h-6 mr-2" />
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;