import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PlayCircleIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/payments/my-courses');
        setEnrollments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Courses</h2>
        <p className="text-slate-500 mt-1">Continue learning and tracking your progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {enrollments.map(({ course, _id }) => (
          <div key={_id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            <div className="relative h-48 bg-slate-200 overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-green-700 shadow-sm border border-green-200">
                Enrolled
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">{course.description}</p>
              
              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <Link 
                  to={`/play/${course._id}/1`}
                  className="flex items-center justify-center space-x-2 w-full px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  <span>Resume Learning</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {enrollments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <AcademicCapIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No enrollments yet</h3>
          <p className="text-slate-500 mb-6">You haven't enrolled in any courses.</p>
          <Link to="/catalog" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold transition-colors">
            Browse Catalog
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
