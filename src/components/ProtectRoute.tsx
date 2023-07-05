import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/hook';
import { RootState } from '../app/store';
import Dashboard from '../pages/Dashboard';

//! define children props type
type Props = {
    children: ReactNode;
};
const ProtectRoute = ({ children }: Props) => {
    console.log(children);
    const user = useAppSelector((state: RootState) => state.user);
    //! redirect user which is not authenticated
    if (!user.user) {
        return <Navigate to="/auth/login" />
    }
    return <Dashboard />
}

export default ProtectRoute