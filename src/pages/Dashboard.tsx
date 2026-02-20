import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Clock,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  Link as LinkIcon,
  QrCode,
  FileCheck,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import NewCaseModal from '../components/NewCaseModal';
import './Dashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dashboard__tooltip">
      <p className="dashboard__tooltip-label">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="dashboard__tooltip-value" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const RISK_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const token = session?.access_token;

  const [stats, setStats] = useState<any>(null);
  const [casesOverTime, setCasesOverTime] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCase, setShowNewCase] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateCase = async (name: string, email: string) => {
    setCreating(true);
    try {
      await api.post('/cases', { applicant_name: name, applicant_email: email }, token);
      setShowNewCase(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to create case:', err);
    } finally {
      setCreating(false);
    }
  };

  async function fetchData() {
    setLoading(true);
    try {
      const [statsRes, casesOT, riskDist, docTypes, casesRes] = await Promise.all([
        api.get<any>('/analytics/dashboard', token),
        api.get<any>('/analytics/cases-over-time', token),
        api.get<any>('/analytics/risk-distribution', token),
        api.get<any>('/analytics/document-types', token),
        api.get<any>('/cases?page_size=6', token),
      ]);
      setStats(statsRes);
      setCasesOverTime(
        (casesOT.data || []).map((d: any) => ({
          label: d.label,
          value: d.submitted,
          secondary: d.approved,
        }))
      );
      setRiskDistribution(
        (riskDist.data || []).map((d: any, i: number) => ({
          name: d.name,
          value: d.percentage,
          color: RISK_COLORS[i] || '#7c3aed',
        }))
      );
      setDocumentTypes(
        (docTypes.data || []).map((d: any) => ({
          label: d.type,
          value: d.count,
        }))
      );
      setRecentCases((casesRes.data || []).slice(0, 6));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="login-card__spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Overview of your document intelligence operations
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className="grid-4" variants={itemVariants}>
        <StatCard
          title="Total Cases"
          value={stats?.total_cases?.toLocaleString() || '0'}
          change={12.5}
          icon={<FileCheck size={20} />}
          color="violet"
        />
        <StatCard
          title="Processed Today"
          value={stats?.cases_today?.toString() || '0'}
          change={8.2}
          icon={<TrendingUp size={20} />}
          color="blue"
        />
        <StatCard
          title="Avg. Processing"
          value={stats?.avg_processing_time ? `${stats.avg_processing_time}s` : '—'}
          change={-15.3}
          changeLabel="faster"
          icon={<Clock size={20} />}
          color="green"
        />
        <StatCard
          title="High Risk Flagged"
          value={stats?.high_risk_cases?.toString() || '0'}
          change={-4.1}
          icon={<AlertTriangle size={20} />}
          color="orange"
        />
      </motion.div>

      <NewCaseModal 
        isOpen={showNewCase}
        onClose={() => setShowNewCase(false)}
        onSubmit={handleCreateCase}
        creating={creating}
      />

      {/* QR Code Modal (Manual Implementation) */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Scan to Onboard</h3>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
              Scan this QR code on a mobile device to start the KYC process for this organization.
            </p>
            <div style={{ background: 'white', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', display: 'inline-block', marginBottom: 'var(--space-6)' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/onboarding/portal?org=' + (stats?.org_id || 'demo'))}`} 
                alt="QR Code"
                style={{ display: 'block' }}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowQR(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quick Launch */}
      <motion.div className="dashboard__quick-launch" variants={itemVariants}>
        <div className="card dashboard__quick-item" onClick={() => setShowNewCase(true)}>
          <div className="dashboard__quick-icon">
            <PlusCircle size={20} />
          </div>
          <div className="dashboard__quick-text">
            <h4>New KYC Case</h4>
            <p>Start a new verification</p>
          </div>
        </div>
        <div className="card dashboard__quick-item" onClick={() => navigate('/cases')}>
          <div className="dashboard__quick-icon">
            <LinkIcon size={20} />
          </div>
          <div className="dashboard__quick-text">
            <h4>Onboarding Link</h4>
            <p>Generate shareable URL</p>
          </div>
        </div>
        <div className="card dashboard__quick-item" onClick={() => setShowQR(true)}>
          <div className="dashboard__quick-icon">
            <QrCode size={20} />
          </div>
          <div className="dashboard__quick-text">
            <h4>Instant QR</h4>
            <p>Mobile scan for users</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="dashboard__charts">
        {/* Area Chart — Cases Over Time */}
        <motion.div className="card dashboard__chart-card" variants={itemVariants}>
          <div className="dashboard__chart-header">
            <h3 className="dashboard__chart-title">Cases Over Time</h3>
            <div className="dashboard__chart-legend">
              <span className="dashboard__legend-item">
                <span className="dashboard__legend-dot" style={{ background: '#7c3aed' }} />
                Submitted
              </span>
              <span className="dashboard__legend-item">
                <span className="dashboard__legend-dot" style={{ background: '#22c55e' }} />
                Approved
              </span>
            </div>
          </div>
          {casesOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={casesOverTime}>
                <defs>
                  <linearGradient id="gradientSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradientApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Submitted"
                  stroke="#7c3aed"
                  fill="url(#gradientSubmitted)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="secondary"
                  name="Approved"
                  stroke="#22c55e"
                  fill="url(#gradientApproved)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              No data yet — create cases to see trends
            </div>
          )}
        </motion.div>

        {/* Pie Chart — Risk Distribution */}
        <motion.div className="card dashboard__chart-card dashboard__chart-card--sm" variants={itemVariants}>
          <h3 className="dashboard__chart-title">Risk Distribution</h3>
          {riskDistribution.length > 0 ? (
            <>
              <div className="dashboard__pie-wrap">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {riskDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="dashboard__pie-legend">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="dashboard__pie-legend-item">
                    <span className="dashboard__legend-dot" style={{ background: item.color }} />
                    <span>{item.name}</span>
                    <span className="dashboard__pie-legend-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              No risk data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard__bottom">
        {/* Bar Chart — Document Types */}
        <motion.div className="card dashboard__chart-card" variants={itemVariants}>
          <h3 className="dashboard__chart-title">Documents by Type</h3>
          {documentTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={documentTypes} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Documents" fill="#7c3aed" radius={[4, 4, 0, 0]}>
                  {documentTypes.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`rgba(124, 58, 237, ${0.4 + i * 0.15})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              No documents uploaded yet
            </div>
          )}
        </motion.div>

        {/* Recent Cases */}
        <motion.div className="card dashboard__recent" variants={itemVariants}>
          <div className="dashboard__chart-header">
            <h3 className="dashboard__chart-title">Recent Cases</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cases')}>View All</button>
          </div>
          <div className="dashboard__recent-list">
            {recentCases.length > 0 ? (
              recentCases.map((c: any) => (
                <div
                  key={c.id}
                  className="dashboard__recent-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/cases/${c.id}`)}
                >
                  <div className="dashboard__recent-avatar">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="dashboard__recent-info">
                    <span className="dashboard__recent-name">{c.applicant_name}</span>
                    <span className="dashboard__recent-id">{c.id}</span>
                  </div>
                  <StatusBadge status={c.status} size="sm" />
                  <span className="dashboard__recent-time">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                No cases yet — create one from KYC Cases
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
