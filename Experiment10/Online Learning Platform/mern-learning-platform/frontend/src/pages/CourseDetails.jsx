import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { PlayCircleIcon, AcademicCapIcon, InformationCircleIcon, CurrencyDollarIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, enrollmentsRes] = await Promise.all([
          api.get(`/catalog/courses/${id}`),
          api.get('/payments/my-courses')
        ]);
        
        setCourse(courseRes.data);
        const enrolledCourseIds = enrollmentsRes.data.map(e => e.course._id);
        setIsEnrolled(enrolledCourseIds.includes(courseRes.data._id));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const { data } = await api.post('/payments/checkout', { 
        courseId: course._id, 
        courseName: course.title, 
        amount: course.price 
      });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed.');
    }
  };

  const handleResumeLearning = () => {
    // Navigate safely to the first lesson if it exists
    if (course.modules && course.modules.length > 0 && course.modules[0].lessons && course.modules[0].lessons.length > 0) {
      const firstLessonId = course.modules[0].lessons[0]._id;
      navigate(`/play/${course._id}/${firstLessonId}`);
    } else {
      alert('The instructor has not uploaded any lessons yet. Please check back later!');
    }
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen text-slate-500">Loading course details...</div>;
  }

  if (!course) {
    return <div className="flex-1 flex items-center justify-center min-h-screen text-slate-500">Course not found.</div>;
  }

  const isInstructorAndOwner = userInfo?.role === 'instructor' && course.instructor?._id === userInfo?._id;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        
        {/* Header Hero Area */}
        <div className="relative h-72 bg-slate-900 overflow-hidden">
          <img 
            src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`} 
            alt={course.title}
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              {course.category}
            </span>
            <h1 className="text-4xl font-extrabold text-white mb-2">{course.title}</h1>
            <p className="text-slate-300 flex items-center gap-2">
              <AcademicCapIcon className="h-5 w-5" />
              Instructed by <span className="font-semibold text-white">{course.instructor?.name || 'Unknown Instructor'}</span>
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <InformationCircleIcon className="h-6 w-6 text-indigo-600" />
                About This Course
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Course Content</h3>
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.modules.map((module, mIdx) => (
                    <div key={mIdx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-2">{module.title}</h4>
                      <ul className="space-y-2">
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lIdx) => (
                            <li key={lIdx} className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2 rounded border border-slate-100">
                              <PlayCircleIcon className="h-4 w-4 text-indigo-500" />
                              {lesson.title} <span className="text-xs text-slate-400 ml-auto">{(lesson.duration / 60).toFixed(1)} mins</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-slate-500 italic">No lessons added yet.</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  Syllabus is currently being drafted by the instructor.
                </p>
              )}
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
              <div className="text-center mb-6">
                <span className="text-sm text-slate-500 uppercase tracking-wide font-semibold block mb-1">One-time payment</span>
                <span className="text-5xl font-extrabold text-slate-900">${course.price}</span>
              </div>
              
              {isInstructorAndOwner ? (
                <div className="space-y-3">
                  <div className="bg-indigo-50 text-indigo-800 p-3 rounded-lg text-sm text-center border border-indigo-100 font-medium">
                    You are the owner of this course.
                  </div>
                  <button 
                    onClick={() => navigate('/instructor')}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    <PresentationChartLineIcon className="h-5 w-5" />
                    <span>Manage Course</span>
                  </button>
                </div>
              ) : isEnrolled ? (
                <div className="space-y-3">
                  <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm text-center border border-green-100 font-medium">
                    You are already enrolled!
                  </div>
                  <button 
                    onClick={handleResumeLearning}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    <PlayCircleIcon className="h-5 w-5" />
                    <span>Resume Learning</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleEnroll}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  <CurrencyDollarIcon className="h-5 w-5" />
                  <span>Enroll Now</span>
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
