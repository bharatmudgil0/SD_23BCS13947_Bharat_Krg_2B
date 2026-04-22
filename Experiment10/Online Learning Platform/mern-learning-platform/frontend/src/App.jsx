import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import VideoPlayer from './pages/VideoPlayer';
import MockCheckout from './pages/MockCheckout';
import MyCourses from './pages/MyCourses';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <div className="pt-20 min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={
              <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                  <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-300/20 blur-3xl" />
                  <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-300/20 blur-3xl" />
                </div>
                
                <div className="text-center max-w-3xl px-4 animate-fade-in-up">
                  <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-medium text-sm">
                    ✨ Version 2.0 is now live
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    Master your craft with <br/><span className="text-gradient">LearnPlatform</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    A premium, highly scalable learning ecosystem designed for modern students and elite instructors.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1">
                      Start Learning Free
                    </Link>
                    <Link to="/catalog" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                      Browse Catalog
                    </Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog" element={<ProtectedRoute><CourseCatalog /></ProtectedRoute>} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
            <Route path="/checkout/:courseId" element={<ProtectedRoute><MockCheckout /></ProtectedRoute>} />
            <Route path="/instructor" element={<ProtectedRoute requireInstructor={true}><InstructorDashboard /></ProtectedRoute>} />
            <Route path="/play/:courseId/:lessonId" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
