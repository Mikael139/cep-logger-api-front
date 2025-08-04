import { useState } from 'react';
import LoginRegistrationView from './components/LoginRegistrationView';
import CepSearchView from './components/CepSearchView';
import FavoritesView from './components/FavoritesView';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginRegistrationView
          setAuth={setAuth}
          auth={auth}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentView={setCurrentView}
          message={message}
          setMessage={setMessage}
        />;
      case 'cep-search':
        return <CepSearchView
          auth={auth}
          isLoggedIn={isLoggedIn}
          setCurrentView={setCurrentView}
          setMessage={setMessage}
        />;
      case 'favorites':
        return <FavoritesView
          auth={auth}
          setCurrentView={setCurrentView}
          setMessage={setMessage}
        />;
      default:
        return <LoginRegistrationView />;
    }
  };

  return (
    <div className="bg-light vh-100 d-flex justify-content-center align-items-center p-4">
      {renderView()}
    </div>
  );
}
