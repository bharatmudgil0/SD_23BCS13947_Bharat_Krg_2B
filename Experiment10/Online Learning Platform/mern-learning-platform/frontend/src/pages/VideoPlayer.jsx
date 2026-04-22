import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { PlayIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const VideoPlayer = () => {
  const { courseId, lessonId } = useParams();
  const [manifestUrl, setManifestUrl] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const { data: manifestData } = await api.get(`/playback/courses/${courseId}/lessons/${lessonId}`);
        setManifestUrl(manifestData.manifestUrl);
        
        const { data: progressData } = await api.get(`/progress/courses/${courseId}/lessons/${lessonId}`);
        setIsCompleted(progressData.completed);
        setProgressPercent(progressData.completed ? 100 : 0);
      } catch (error) {
        console.error(error);
      }
    };
    fetchManifest();
  }, [courseId, lessonId]);

  const toggleCompleted = async () => {
    try {
      const newStatus = !isCompleted;
      await api.put(`/progress/courses/${courseId}/lessons/${lessonId}`, { completed: newStatus });
      setIsCompleted(newStatus);
      setProgressPercent(newStatus ? 100 : 0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 min-h-screen text-slate-300">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/catalog" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-slate-400 hover:text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">Lesson {lessonId}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group flex items-center justify-center">
            
            {/* Mock Player UI */}
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/10 group-hover:bg-indigo-900/30 transition-colors cursor-pointer">
              <div className="w-20 h-20 bg-indigo-600/90 rounded-full flex items-center justify-center shadow-lg shadow-indigo-900/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <PlayIcon className="h-10 w-10 text-white ml-1" />
              </div>
            </div>
            
            <p className="absolute bottom-6 text-sm text-slate-400 font-mono bg-black/60 px-4 py-2 rounded-lg backdrop-blur">
              {manifestUrl ? `Stream loaded: ${manifestUrl.split('/').pop()}` : 'Connecting to CDN...'}
            </p>
            
            {/* Mock Video Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-800">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Understanding the Core Concepts</h2>
              <button 
                onClick={toggleCompleted} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                  isCompleted 
                    ? 'bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/50' 
                    : 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                <CheckCircleIcon className="h-5 w-5" />
                {isCompleted ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>
            <p className="text-slate-400 leading-relaxed">
              In this lesson, we will dive deep into the fundamental building blocks of the platform. Ensure you have completed the prerequisite readings before proceeding with the video.
            </p>
          </div>
        </div>

        {/* Sidebar / Playlist */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50">
            <h3 className="font-bold text-white">Course Content</h3>
            <p className="text-xs text-slate-400 mt-1">{progressPercent}% Completed</p>
          </div>
          <div className="p-2 space-y-1">
            <button className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800 text-left transition-colors">
              <CheckCircleIcon className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300">1. Introduction to the course</p>
                <p className="text-xs text-slate-500 mt-1">5:30</p>
              </div>
            </button>
            
            <button className="w-full flex items-start gap-3 p-3 rounded-xl bg-slate-800 border-l-2 border-indigo-500 text-left">
              <div className="h-5 w-5 rounded-full border-2 border-slate-500 shrink-0 mt-0.5 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">2. Understanding the Core Concepts</p>
                <p className="text-xs text-indigo-400 mt-1">12:45 • Now Playing</p>
              </div>
            </button>
            
            <button className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800 text-left transition-colors opacity-60">
              <div className="h-5 w-5 rounded-full border-2 border-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">3. Building the Architecture</p>
                <p className="text-xs text-slate-500 mt-1">18:20</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;
