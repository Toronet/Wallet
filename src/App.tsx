import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/landing';
import NotFound from './pages/404';
import Dashboard from './pages/dashboard';
import Tokens from './pages/dashboard/tokens';
import Invites from './pages/dashboard/invites';
import FiatCoins from './pages/dashboard/fiat-coins';
import PlatformCoins from './pages/dashboard/platform-coins';
import CryptoCurrencies from './pages/dashboard/crypto-currencies';

import ScrollReset from './components/utils/ScrollReset';
import PrivateRoute from './components/utils/PrivateRoute';

import { useAppSelector } from './hooks/redux';

const App: React.FC = (): JSX.Element => {
  const { user } = useAppSelector(state => state.auth);
  return (
    <Router>
      <ScrollReset />

      <Routes>
        <Route index element={<Navigate to="/home" replace={true} />} />
        <Route path="/home" element={<Landing />} />

        <Route path="dashboard" element={<PrivateRoute user={user} />}>
          <Route index element={<Dashboard />} />
          <Route path="tokens" element={<Tokens />} />
          <Route path="fiat-coins" element={<FiatCoins />} />
          <Route path="platform-coins" element={<PlatformCoins />} />
          <Route path="crypto-currencies" element={<CryptoCurrencies />} />
          <Route path="invites" element={<Invites />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>

  )
}

export default App;