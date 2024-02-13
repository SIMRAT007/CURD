
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import './index.css'
import AdminPanel from './Adminpanel/AdminPanel';
import Home from './Webpages/Home';
import Dashboard from './Adminpanel/Dashboard';

function App() {
  return (
   <>
    <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route  path="/AdminPanel" element={<AdminPanel/>} />
          <Route  path="/Dashboard" element={<Dashboard/>} />
        </Routes>
   </Router>
   </>
  );
}

export default App;
