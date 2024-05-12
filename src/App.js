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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      console.log('User is signed in');
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
      <Route path="/" element={<NavBar isAuthenticated={isAuthenticated} onSignOut={handleSignOut}/>}>
        {isAuthenticated ? (
      <Route index element={<Dashboard isAuthenticated={isAuthenticated} onSignOut={handleSignOut}/>} />
    ) : (
      <Route index element={<Home isAuthenticated={isAuthenticated} onSignOut={handleSignOut}/>} />
    )}
        <Route path="signin" element={<SignIn />} />
        <Route path="dashboard" element={<Dashboard isAuthenticated={isAuthenticated} onSignOut={handleSignOut}/>} />
        <Route path="tips" element={<Tips isAuthenticated={isAuthenticated} onSignOut={handleSignOut}/>} />
        <Route path="profile" element={<Profile isAuthenticated={isAuthenticated} onSignOut={handleSignOut}/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
};

export default App;