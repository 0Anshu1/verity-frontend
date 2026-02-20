import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Shield,
  User,
  FileText,
  Settings,
  Key,
  ChevronDown,
} from 'lucide-react';
import './AuditLog.css';

interface AuditEntry {
  id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

const mockAuditLog: AuditEntry[] = [
  { id: '1', user_name: 'Alex Morgan', action: 'case.approved', entity_type: 'case', entity_id: 'KYC-2024-001', details: 'Approved with low risk score (12)', ip_address: '192.168.1.42', created_at: '2024-12-10T11:30:00Z' },
  { id: '2', user_name: 'AI Engine', action: 'document.processed', entity_type: 'document', entity_id: 'DOC-4521', details: 'OCR extraction completed (94% confidence)', ip_address: 'system', created_at: '2024-12-10T11:28:00Z' },
  { id: '3', user_name: 'Jordan Lee', action: 'case.assigned', entity_type: 'case', entity_id: 'KYC-2024-004', details: 'Case assigned to Jordan Lee', ip_address: '192.168.1.55', created_at: '2024-12-10T10:45:00Z' },
  { id: '4', user_name: 'System', action: 'case.created', entity_type: 'case', entity_id: 'KYC-2024-003', details: 'New case submitted via API', ip_address: 'api', created_at: '2024-12-10T08:00:00Z' },
  { id: '5', user_name: 'Alex Morgan', action: 'api_key.created', entity_type: 'api_key', entity_id: 'KEY-001', details: 'New production API key generated', ip_address: '192.168.1.42', created_at: '2024-12-09T16:30:00Z' },
  { id: '6', user_name: 'Alex Morgan', action: 'user.invited', entity_type: 'user', entity_id: 'USR-005', details: 'Invited taylor@verityai.com as reviewer', ip_address: '192.168.1.42', created_at: '2024-12-09T15:00:00Z' },
  { id: '7', user_name: 'AI Engine', action: 'risk.flagged', entity_type: 'case', entity_id: 'KYC-2024-004', details: 'High risk score detected (82)', ip_address: 'system', created_at: '2024-12-09T14:45:00Z' },
  { id: '8', user_name: 'Alex Morgan', action: 'case.rejected', entity_type: 'case', entity_id: 'KYC-2024-004', details: 'Rejected due to document tampering', ip_address: '192.168.1.42', created_at: '2024-12-09T14:50:00Z' },
  { id: '9', user_name: 'System', action: 'settings.updated', entity_type: 'organization', entity_id: 'ORG-001', details: 'Webhook URL updated', ip_address: 'system', created_at: '2024-12-09T12:00:00Z' },
  { id: '10', user_name: 'Sam Patel', action: 'document.uploaded', entity_type: 'document', entity_id: 'DOC-4520', details: 'Passport uploaded for KYC-2024-006', ip_address: '192.168.1.67', created_at: '2024-12-09T11:30:00Z' },
];

const getActionIcon = (action: string) => {
  if (action.startsWith('case')) return <Shield size={14} />;
  if (action.startsWith('document')) return <FileText size={14} />;
  if (action.startsWith('user') || action.startsWith('api_key')) return <Key size={14} />;
  if (action.startsWith('settings') || action.startsWith('risk')) return <Settings size={14} />;
  return <User size={14} />;
};

const getActionColor = (action: string) => {
  if (action.includes('approved') || action.includes('created')) return 'var(--success)';
  if (action.includes('rejected') || action.includes('flagged')) return 'var(--danger)';
  if (action.includes('assigned') || action.includes('updated') || action.includes('invited')) return 'var(--info)';
  return 'var(--text-muted)';
};

export default function AuditLog() {
  const [search, setSearch] = useState('');

  const filtered = mockAuditLog.filter(
    (e) =>
      e.user_name.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.entity_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Audit Log</h1>
          <p className="page-subtitle">Complete activity history for your organization</p>
        </div>
        <button className="btn btn-secondary">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="audit__filters">
        <div className="audit__search">
          <Search size={16} className="audit__search-icon" />
          <input
            type="text"
            className="input audit__search-input"
            placeholder="Search by user, action, or entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary btn-sm">
          <Filter size={14} /> Filter <ChevronDown size={14} />
        </button>
      </div>

      {/* Log Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </td>
                <td>
                  <div className="flex-gap-2">
                    <div className="audit__user-avatar">
                      {entry.user_name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{entry.user_name}</span>
                  </div>
                </td>
                <td>
                  <span className="audit__action" style={{ color: getActionColor(entry.action) }}>
                    {getActionIcon(entry.action)}
                    <code>{entry.action}</code>
                  </span>
                </td>
                <td>
                  <code style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {entry.entity_id}
                  </code>
                </td>
                <td>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {entry.details}
                  </span>
                </td>
                <td>
                  <code style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {entry.ip_address}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
