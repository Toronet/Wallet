import React from 'react';
import { Navigate, Outlet, To } from 'react-router-dom';

import { IAuthUser } from '../../redux/auth/auth-slice-types';

type TProps = {
    user: IAuthUser | null,
    redirectPath?: To,
}

const PrivateRoute: React.FC<TProps> = ({ user, redirectPath = "/" }): JSX.Element => {
    return user ? <Outlet /> : <Navigate to={redirectPath} replace />
}

export default PrivateRoute;