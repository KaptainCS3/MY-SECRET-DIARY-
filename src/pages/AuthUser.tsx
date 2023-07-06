import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hook';
import { RootState } from '../app/store';
import { signInWithFacebook, signInWithGoogle } from '../features/UserSlice';
import LoginBTN from '../components/LoginBTN';
import { useNavigate } from 'react-router-dom';
const AuthUser = () => {

  const user = useAppSelector((state: RootState) => state.user);
  const navigate = useNavigate()
  const dispatch = useAppDispatch();

  const handleSignInWithFacebook = () => {
    dispatch(signInWithFacebook());
  };

  const handleSignInWithGoogle = () => {
    dispatch(signInWithGoogle());
  };

  useEffect(() => {
    if (user.user !== null) {
      navigate('/dashboard');
    }
  }, [user.user, navigate]);
// imgSrc = "/assets/google.png";
// imgSrc = "/assets/facebook.png"; 
  return (
    <div className='w-full'>
      <LoginBTN handleLogin={handleSignInWithFacebook} btnText="Sign in with Facebook" />
      <LoginBTN handleLogin={handleSignInWithGoogle} btnText="Sign in with Google" />
    </div>
  )
}

export default AuthUser