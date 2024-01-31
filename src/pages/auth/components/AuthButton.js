import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../../../components/shared/Button';
import { logout } from '../service';
import { authLogout } from '../../../store/actions';
import { getIsLogged } from '../../../store/selectors';

function AuthButton({ className, onLogout, isLogged }) {
  // const dispatch = useDispatch();

  // const onLogout = () => {
  //   dispatch(authLogout());
  // };

  const handleLogoutClick = async () => {
    await logout();
    onLogout();
  };
  return isLogged ? (
    <Button onClick={handleLogoutClick} className={className}>
      Logout
    </Button>
  ) : (
    <Button as={Link} to="/login" $variant="primary" className={className}>
      Login
    </Button>
  );
}

const mapStateToProps = (state, ownProps) => ({
  isLogged: getIsLogged(state),
});

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onLogout: () => dispatch(authLogout()),
//   };
// };

const mapDispatchToProps = {
  onLogout: authLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);