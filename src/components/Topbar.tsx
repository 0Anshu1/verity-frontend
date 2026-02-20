import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Bell, Search, LogOut, ChevronDown, User, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './Topbar.css';

interface TopbarProps {
  collapsed?: boolean;
}

export default function Topbar({ collapsed }: TopbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/cases?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={`topbar ${collapsed ? 'topbar--collapsed' : ''}`}>
      {/* Search */}
      <div className="topbar__search">
        <Search size={16} className="topbar__search-icon" />
        <input
          type="text"
          placeholder="Search cases, documents, applicants..."
          className="topbar__search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <kbd className="topbar__shortcut">⌘K</kbd>
      </div>

      {/* Right Side */}
      <div className="topbar__actions">
        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="topbar__icon-btn"
            title="Notifications"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
          >
            <Bell size={18} />
            <span className="topbar__notification-dot" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="topbar__dropdown"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <div className="topbar__dropdown-header">Notifications</div>
                <div className="topbar__dropdown-empty">
                  No new notifications
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div ref={userRef} style={{ position: 'relative' }}>
          <div
            className="topbar__user"
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
          >
            <div className="topbar__avatar">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="topbar__user-info">
              <span className="topbar__user-name">{user?.full_name || 'User'}</span>
              <span className="topbar__user-role">{user?.role || 'admin'}</span>
            </div>
            <ChevronDown size={14} className="topbar__user-chevron" />
          </div>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="topbar__dropdown"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <div className="topbar__dropdown-header">Account</div>
                <button
                  className="topbar__dropdown-item"
                  onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                >
                  <User size={16} /> Profile
                </button>
                <button
                  className="topbar__dropdown-item"
                  onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                >
                  <Settings size={16} /> Settings
                </button>
                <div className="topbar__dropdown-divider" />
                <button
                  className="topbar__dropdown-item topbar__dropdown-item--danger"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
