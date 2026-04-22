import { useState, useEffect } from 'react';
import api from '../api/axios';
import { PlusCircleIcon, DocumentTextIcon, FolderIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const InstructorDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('99.99');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalEnrollments: 0 });
  const [myCourses, setMyCourses] = useState([]);
  
  // Lesson Form State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          api.get('/instructor/courses/stats'),
          api.get('/instructor/courses')
        ]);
        setStats(statsRes.data);
        setMyCourses(coursesRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/instructor/courses/${selectedCourse}/modules/123/lessons`, {
        title: lessonTitle,
        video_url: videoUrl,
        duration: 600, // mock duration
        order_index: 1
      });
      alert('Lesson added successfully!');
      setLessonTitle('');
      setVideoUrl('');
      setSelectedCourse(null);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to add lesson');
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/instructor/courses', { title, description, category, price: Number(price) });
      alert('Course created successfully! ID: ' + data._id);
      setTitle(''); setDescription(''); setCategory(''); setPrice('99.99');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Instructor Dashboard</h2>
        <p className="text-slate-500 mt-1">Manage your courses and view your performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <PlusCircleIcon className="h-5 w-5 text-indigo-600" />
                Create New Course
              </h3>
            </div>
            
            <form onSubmit={createCourse} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Advanced React Patterns" 
                    className="pl-10 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Description</label>
                <textarea 
                  placeholder="What will your students learn?" 
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FolderIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Web Development" 
                      className="pl-10 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price (USD)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="99.99"
                      className="pl-10 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Set your course price</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center gap-2"
                >
                  {isLoading ? 'Creating...' : 'Publish Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
            <div className="text-4xl font-extrabold mb-4">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-indigo-200 text-sm">You have {stats.totalEnrollments} student enrollment(s).</p>
          </div>
          
          {myCourses.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add Lesson</h3>
              <form onSubmit={handleAddLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                  <select
                    className="block w-full border-slate-200 rounded-lg py-2.5 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a course...</option>
                    {myCourses.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                {selectedCourse && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Title</label>
                      <input
                        type="text"
                        className="block w-full border-slate-200 rounded-lg py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
                      <input
                        type="text"
                        placeholder="https://mock-cdn.com/video.mp4"
                        className="block w-full border-slate-200 rounded-lg py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add Lesson
                    </button>
                  </>
                )}
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span> Use high quality microphones.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span> Keep lessons under 10 minutes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
