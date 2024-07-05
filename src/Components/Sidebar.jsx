
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({
    xva: false,
    cva: false,
    fva: false,
  });

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubMenu = (menu) => {
    setSubMenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleMainMenuClick = (menu) => {
    navigate(`/${menu}`);
    setIsOpen(false); // Close sidebar after navigation
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleSidebar}>
        ☰
      </div>
      <div className={`sidebar-content ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="close-icon" onClick={toggleSidebar}>
            ×
          </span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <div className="menu-item">
                <span onClick={() => handleMainMenuClick('xva')}>XVA</span>
                <span onClick={() => toggleSubMenu('xva')}>{subMenuOpen.xva ? '▲' : '▼'}</span>
              </div>
              <div className={`submenu-toggle ${subMenuOpen.xva ? 'open' : ''}`}>
                {subMenuOpen.xva && (
                  <ul className="submenu">
                    <li>
                      <Link to="/xva/apple">Apple</Link>
                    </li>
                    <li>
                      <Link to="/xva/banana">Banana</Link>
                    </li>
                    <li>
                      <Link to="/xva/cherry">Cherry</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div className="menu-item">
                <span onClick={() => handleMainMenuClick('cva')}>CVA</span>
                <span onClick={() => toggleSubMenu('cva')}>{subMenuOpen.cva ? '▲' : '▼'}</span>
              </div>
              <div className={`submenu-toggle ${subMenuOpen.cva ? 'open' : ''}`}>
                {subMenuOpen.cva && (
                  <ul className="submenu">
                    <li>
                      <Link to="/cva/durian">Durian</Link>
                    </li>
                    <li>
                      <Link to="/cva/elderberry">Elderberry</Link>
                    </li>
                    <li>
                      <Link to="/cva/fig">Fig</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div className="menu-item">
                <span onClick={() => handleMainMenuClick('fva')}>FVA</span>
                <span onClick={() => toggleSubMenu('fva')}>{subMenuOpen.fva ? '▲' : '▼'}</span>
              </div>
              <div className={`submenu-toggle ${subMenuOpen.fva ? 'open' : ''}`}>
                {subMenuOpen.fva && (
                  <ul className="submenu">
                    <li>
                      <Link to="/fva/grape">Grape</Link>
                    </li>
                    <li>
                      <Link to="/fva/honeydew">Honeydew</Link>
                    </li>
                    <li>
                      <Link to="/fva/kiwi">Kiwi</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
