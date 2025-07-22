import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, Search } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'quick' | 'frequent'>('quick');
  const [searchQuery, setSearchQuery] = useState('');

  const projects: Project[] = [
    {
      id: '1',
      name: 'Frontend Development',
      subprojects: ['React Components', 'API Integration', 'UI Polish'],
      category: 'Development'
    },
    {
      id: '2',
      name: 'Design System',
      subprojects: ['Component Library', 'Style Guide', 'Documentation'],
      category: 'Design'
    },
    {
      id: '3',
      name: 'User Research',
      subprojects: ['Interviews', 'Surveys', 'Analysis'],
      category: 'Research'
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <div className="h-full flex flex-col animate-fade-up">
      {/* Info Bar */}
      <div className="surface rounded-2xl p-6 mb-6" style={{ background: 'var(--gradient-primary)' }}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Time Tracker</h2>
              <p className="text-purple-100 text-sm">{getCurrentDateTime()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatTime(time)}</div>
            {isRunning && (
              <div className="text-purple-200 text-sm">
                {isPaused ? 'Paused' : 'Running'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search projects or tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white/80 backdrop-blur-lg border-white/20 rounded-2xl text-lg"
          />
        </div>
      </div>

      {/* Quick Start / Frequently Used Tabs */}
      <div className="mb-6">
        <div className="flex bg-white/50 backdrop-blur-lg rounded-2xl p-2 mb-4">
          <Button
            variant={activeTab === 'quick' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('quick')}
            className={`flex-1 rounded-xl transition-all duration-300 ${
              activeTab === 'quick' 
                ? 'bg-white shadow-lg text-primary' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            Quick Start
          </Button>
          <Button
            variant={activeTab === 'frequent' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('frequent')}
            className={`flex-1 rounded-xl transition-all duration-300 ${
              activeTab === 'frequent' 
                ? 'bg-white shadow-lg text-primary' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            Frequently Used
          </Button>
        </div>

        {/* Project List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className={`p-4 cursor-pointer transition-all duration-300 hover-lift ${
                selectedProject?.id === project.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'bg-white/70 backdrop-blur-lg hover:bg-white/90'
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-700">{project.name}</h3>
                  <div className="flex gap-2 mt-2">
                    {project.subprojects.map((sub, index) => (
                      <Badge 
                        key={index}
                        variant={selectedSubproject === sub ? "default" : "secondary"}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedSubproject === sub 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-slate-200'
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
                <Badge variant="outline" className="bg-white/50">
                  {project.category}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="mt-auto">
        <Card className="p-8 bg-white/80 backdrop-blur-lg">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-slate-700 mb-8 tracking-wider">
              {formatTime(time)}
            </div>
            
            {!isRunning ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="h-16 px-12 text-lg rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!selectedProject || !selectedSubproject}
              >
                <Play className="w-6 h-6 mr-2" />
                Start
              </Button>
            ) : (
              <div className="flex gap-4 justify-center">
                {!isPaused ? (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="lg"
                    className="h-16 px-8 text-lg rounded-2xl border-2 hover:bg-orange-50 hover:border-orange-200"
                  >
                    <Pause className="w-6 h-6 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={handleResume}
                    size="lg"
                    className="h-16 px-8 text-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Resume
                  </Button>
                )}
                
                <Button
                  onClick={handleStop}
                  variant="destructive"
                  size="lg"
                  className="h-16 px-8 text-lg rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                >
                  <Square className="w-6 h-6 mr-2" />
                  Stop
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimeTracker;