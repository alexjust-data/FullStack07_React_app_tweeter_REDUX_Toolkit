import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';
import { getIsLogged } from '../../../store/selectors';

function RequireAuth({ children }) {
  const location = useLocation();
  const isLogged = useSelector(getIsLogged);

  return isLogged ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}

export default RequireAuth;
