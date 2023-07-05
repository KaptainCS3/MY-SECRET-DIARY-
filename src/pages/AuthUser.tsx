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

  return (
    <div className='w-full px-10'>
      <LoginBTN handleLogin={handleSignInWithGoogle} btnText="Sign in with Google" imgSrc="/assets/google.png" />
      <LoginBTN handleLogin={handleSignInWithFacebook} btnText="Sign in with Facebook" imgSrc="/assets/facebook.png" />
    </div>
  )
}

export default AuthUser