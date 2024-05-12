import React from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard";
import Tips from "./components/Tips";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Profile from "./components/Profile";
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { useEffect, useState } from "react";
import { fetchAuthSession } from 'aws-amplify/auth';
import { get, post } from 'aws-amplify/api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const checkOrSendEmailVerification = async () => {
      try {
        if (email) {
          const restOperation = get({
            apiName: 'webPresenceCloud',
            path: '/user-profile/check-email-verification',
            options: {
              queryParams: {
                email: email,
              }
            }
          });

          const { body } = await restOperation.response;
          const response = await body.json();
          if (response.isVerified) {
            setIsVerified(response.isVerified);
          } else {
            console.log('User is not verified');
          }
        }
      } catch (error) {
        console.error('Error fetching user preferences');
      }
    }
    checkOrSendEmailVerification();
  }, [email]);


  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      const email = idToken ? idToken['payload']['email'] : null;
      setEmail(email);
    } catch (error) {
      setIsAuthenticated(false);
      console.error('User is not signed in');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />}>
          {isAuthenticated ? (
            <Route index element={<Dashboard isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />} />
          ) : (
            <Route index element={<Home isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />} />
          )}
          <Route path="signin" element={<SignIn />} />
          <Route path="dashboard" element={<Dashboard isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />} />
          <Route path="tips" element={<Tips isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />} />
          <Route path="profile" element={<Profile isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;