import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MoreVertical, Shield, Mail, Trash2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';
import './TeamManagement.css';

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status?: 'active' | 'invited';
  avatar_url?: string;
  created_at: string;
}

const roleColors: Record<UserRole, string> = {
  admin: 'var(--accent-start)',
  reviewer: 'var(--info)',
  viewer: 'var(--text-muted)',
};

export default function TeamManagement() {
  const { session } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('reviewer');
  const [inviteName, setInviteName] = useState('');

  const token = session?.access_token;

  const fetchTeam = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.get<TeamMember[]>('/users', token);
      setTeam(data || []);
    } catch (err) {
      console.error('Failed to fetch team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [token]);

  const handleInvite = async () => {
    if (!token || !inviteEmail || !inviteName) return;
    try {
      await api.post('/users/invite', {
        email: inviteEmail,
        full_name: inviteName,
        role: inviteRole
      }, token);
      setShowInvite(false);
      setInviteEmail('');
      setInviteName('');
      fetchTeam();
    } catch (err) {
      console.error('Failed to invite user:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex-center">
        <div className="login-card__spinner" />
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Team Management</h1>
          <p className="page-subtitle">Manage your organization members and roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInvite(!showInvite)}>
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <motion.div
          className="card team__invite-form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)', fontWeight: 600 }}>
            Invite a Team Member
          </h3>
          <div className="team__invite-fields">
            <div className="input-group" style={{ flex: 1.5, marginBottom: 0 }}>
              <label className="input-label">Full Name</label>
              <input
                className="input"
                placeholder="John Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="input-group" style={{ flex: 2, marginBottom: 0 }}>
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input"
                  style={{ paddingLeft: 36 }}
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label">Role</label>
              <select
                className="input"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
              >
                <option value="reviewer">Reviewer</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={handleInvite}>
              Send Invite
            </button>
          </div>
        </motion.div>
      )}

      {/* Team Cards */}
      <div className="team__grid">
        {team.map((member) => (
          <motion.div
            key={member.id}
            className="card team__card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
          >
            <div className="team__card-header">
              <div className="team__avatar" style={{ background: `linear-gradient(135deg, ${roleColors[member.role]}, var(--accent-end))` }}>
                {member.full_name?.charAt(0) || 'U'}
              </div>
              <button className="btn btn-ghost btn-icon">
                <MoreVertical size={16} />
              </button>
            </div>
            <h4 className="team__card-name">{member.full_name}</h4>
            <p className="team__card-email">{member.email}</p>
            <div className="team__card-role">
              <Shield size={12} style={{ color: roleColors[member.role] }} />
              <span style={{ color: roleColors[member.role], textTransform: 'capitalize' }}>{member.role}</span>
              {member.status === 'invited' && <StatusBadge status="pending" size="sm" />}
            </div>
            <div className="team__card-stats">
              <div className="team__card-stat" style={{ flex: 1 }}>
                <span className="team__card-stat-label">Joined</span>
                <span className="team__card-stat-value" style={{ fontSize: 'var(--text-xs)' }}>
                  {new Date(member.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
