import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MagnifyingGlassIcon, PlayCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          api.get(`/catalog/search?q=${search}`),
          api.get('/payments/my-courses')
        ]);
        setCourses(courseRes.data);
        setEnrollments(enrollRes.data.map(e => e.course._id));
      } catch (error) {
        console.error(error);
      }
    };
    const timer = setTimeout(() => fetchCourses(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const checkout = async (courseId, courseName) => {
    try {
      const { data } = await api.post('/payments/checkout', { courseId, courseName, amount: 99.99 });
      if (data.url) {
          window.location.href = data.url; // Redirect to Stripe
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed.');
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Courses</h2>
          <p className="text-slate-500 mt-1">Discover premium content from elite instructors.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Search courses by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course._id} onClick={() => navigate(`/course/${course._id}`)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer">
            <div className="relative h-48 bg-slate-200 overflow-hidden">
              {/* Placeholder image - normally course.thumbnail_url */}
              <img 
                src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-indigo-700 shadow-sm">
                {course.category}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">{course.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Price</span>
                  <span className="text-xl font-extrabold text-slate-900">${course.price}</span>
                </div>
                
                <button 
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {courses.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <VideoCameraIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No courses found</h3>
          <p className="text-slate-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
