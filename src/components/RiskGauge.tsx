import React from 'react';
import { motion } from 'framer-motion';
import './RiskGauge.css';

interface RiskGaugeProps {
  score: number; // 0-100
  size?: number;
  label?: string;
}

export default function RiskGauge({ score, size = 120, label = 'Risk Score' }: RiskGaugeProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = () => {
    if (score <= 30) return '#22c55e';
    if (score <= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = () => {
    if (score <= 30) return 'Low';
    if (score <= 60) return 'Medium';
    return 'High';
  };

  return (
    <div className="risk-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ filter: `drop-shadow(0 0 6px ${getColor()}40)` }}
        />
      </svg>
      <div className="risk-gauge__content">
        <span className="risk-gauge__score" style={{ color: getColor() }}>
          {score}
        </span>
        <span className="risk-gauge__label">{label}</span>
        <span className="risk-gauge__level" style={{ color: getColor() }}>
          {getLabel()}
        </span>
      </div>
    </div>
  );
}
