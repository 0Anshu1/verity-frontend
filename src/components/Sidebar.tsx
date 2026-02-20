import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileSearch,
  Users,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Shield,
  Key,
} from 'lucide-react';
import './Sidebar.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/cases', label: 'KYC Cases', icon: <FileSearch size={20} /> },
  { path: '/documents', label: 'Doc Review', icon: <ScrollText size={20} /> },
  { path: '/team', label: 'Team', icon: <Users size={20} /> },
  { path: '/api-keys', label: 'API Keys', icon: <Key size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  { path: '/audit', label: 'Audit Log', icon: <Shield size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="sidebar__logo">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.span
              className="sidebar__logo-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              verity
            </motion.span>
          ) : (
            <motion.span
              className="sidebar__logo-text sidebar__logo-text--short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              V
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    className="sidebar__link-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span className="sidebar__badge">{item.badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        className="sidebar__toggle"
        onClick={onToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
