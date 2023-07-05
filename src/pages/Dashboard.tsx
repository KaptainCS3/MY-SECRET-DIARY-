import { useAppSelector, useAppDispatch } from '../hooks/hook';
import { RootState } from '../app/store';
import { logoutAll } from '../features/UserSlice';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const user = useAppSelector((state: RootState) => state.user);
    const { displayName, photoURL } = user.user as {
        displayName: string;
        photoURL: string;
    };
    const logout = () => {
        dispatch(logoutAll())
        navigate("/auth/login")
    }
    console.log(user);
    return (
        <div className="w-[90%] mx-8 min-h-[100vh]">
            <nav className="flex justify-between w-full py-4 flex-col">
                <h1 className='text-xl font-bold'>My Diary</h1>
                <div className='flex justify-end'>
                    <div className='flex items-center pr-4'>
                        <p className='pr-4'>Welcome {displayName}</p>
                        <span>
                            <img src={photoURL} alt={displayName} className='w-10 rounded-full' referrerPolicy='no-referrer' />
                        </span>
                    </div>
                    <button className='border outline-none px-1 rounded-lg' onClick={logout}>Logout</button>
                </div>
            </nav>
        </div>
    )
}

export default Dashboard