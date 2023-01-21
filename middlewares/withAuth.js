import { useAuthContext } from '../context/AuthContext';
import Router from 'next/router';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { currentUser } = useAuthContext();
    if (!currentUser) {
      Router.push('/login');
      return null;
    }
    return <WrappedComponent {...props} />;
  }
}

export default withAuth;
