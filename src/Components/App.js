
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HighchartsGraph from './Components/Graph';
import CustomSidebar from './Components/Sidebar';
import Topbar from './Components/Topbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar /> {/* Ensure the Topbar is always visible */}
        <CustomSidebar />
        <div className="main-content">
          <Routes>
            <Route path="/xva" element={<HighchartsGraph />} />
            <Route path="/xva/burger" element={<div>Burger</div>} />
            <Route path="/xva/pizza" element={<div>Pizza</div>} />
            <Route path="/xva/sushi" element={<div>Sushi</div>} />
            <Route path="/cva" element={<div>CVA Component</div>} />
            <Route path="/cva/taco" element={<div>Taco</div>} />
            <Route path="/cva/salad" element={<div>Salad</div>} />
            <Route path="/cva/steak" element={<div>Steak</div>} />
            <Route path="/fva" element={<div>FVA Component</div>} />
            <Route path="/fva/pasta" element={<div>Pasta</div>} />
            <Route path="/fva/ramen" element={<div>Ramen</div>} />
            <Route path="/fva/bbq" element={<div>BBQ</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

