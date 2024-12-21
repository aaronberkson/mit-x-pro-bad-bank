import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from './components/Context.jsx';
import NavBar from './components/NavBar.jsx';
import CreateAccount from './components/CreateAccount.jsx';
import Deposit from './components/Deposit.jsx';
import Withdraw from './components/Withdraw.jsx';
import AllData from './components/AllData.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import './css/BadBankStyles.css';
import { auth } from './firebaseConfig'; // Ensure auth import
import { onAuthStateChanged } from 'firebase/auth';

const initBadBankAccounts = {
  users: []
};

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
    });
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={initBadBankAccounts}>
        <div className="container-fluid" style={{ margin: 0, padding: 0 }}>
          {authenticated && <NavBar />}
          <Routes>
            <Route path="/" element={authenticated ? <Home /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createAccount" element={authenticated ? <CreateAccount /> : <Login />} />
            <Route path="/deposit" element={authenticated ? <Deposit /> : <Login />} />
            <Route path="/withdraw" element={authenticated ? <Withdraw /> : <Login />} />
            <Route path="/alldata" element={authenticated ? <AllData /> : <Login />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

root.render(<App />);
