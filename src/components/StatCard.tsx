import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: 'violet' | 'blue' | 'green' | 'orange' | 'red';
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last week',
  icon,
  color = 'violet',
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!change) return <Minus size={14} />;
    return change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
  };

  const getTrendClass = () => {
    if (!change) return 'stat-card__trend--neutral';
    return change > 0 ? 'stat-card__trend--up' : 'stat-card__trend--down';
  };

  return (
    <motion.div
      className={`stat-card stat-card--${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        <div className="stat-card__icon">{icon}</div>
      </div>
      <div className="stat-card__value">{value}</div>
      {change !== undefined && (
        <div className={`stat-card__trend ${getTrendClass()}`}>
          {getTrendIcon()}
          <span>{Math.abs(change)}% {changeLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
