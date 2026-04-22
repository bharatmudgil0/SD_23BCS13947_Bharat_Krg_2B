import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireInstructor }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (requireInstructor && userInfo.role !== 'instructor' && userInfo.role !== 'admin') {
    return <Navigate to="/catalog" replace />;
  }

  return children;
};

export default ProtectedRoute;
