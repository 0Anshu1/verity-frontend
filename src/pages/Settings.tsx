import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Globe,
  Key,
  Copy,
  Plus,
  Trash2,
  Bell,
  Webhook,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import './Settings.css';

const mockApiKeys = [
  { id: '1', label: 'Production API', preview: 'vfy_prod_...x8k2', created: '2024-11-15', last_used: '2 hours ago', active: true },
  { id: '2', label: 'Staging API', preview: 'vfy_stg_...m4p9', created: '2024-10-22', last_used: '5 days ago', active: true },
  { id: '3', label: 'Development', preview: 'vfy_dev_...q1w3', created: '2024-09-10', last_used: '2 weeks ago', active: false },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('organization');
  const [showKey, setShowKey] = useState<string | null>(null);

  const sections = [
    { id: 'organization', label: 'Organization', icon: <Building2 size={16} /> },
    { id: 'api-keys', label: 'API Keys', icon: <Key size={16} /> },
    { id: 'webhooks', label: 'Webhooks', icon: <Webhook size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your organization and integrations</p>
      </div>

      <div className="settings__layout">
        {/* Nav */}
        <div className="settings__nav">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`settings__nav-item ${activeSection === s.id ? 'settings__nav-item--active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings__content">
          {activeSection === 'organization' && (
            <div className="card">
              <h3 className="settings__section-title">Organization Profile</h3>
              <div className="settings__form">
                <div className="input-group">
                  <label className="input-label">Organization Name</label>
                  <input className="input" defaultValue="Acme Corporation" />
                </div>
                <div className="input-group">
                  <label className="input-label">Slug</label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input" style={{ paddingLeft: 36 }} defaultValue="acme-corp" />
                  </div>
                </div>
                <div className="settings__form-row">
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Industry</label>
                    <select className="input">
                      <option>Financial Services</option>
                      <option>Healthcare</option>
                      <option>Technology</option>
                      <option>Real Estate</option>
                      <option>Legal</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Plan</label>
                    <div className="settings__plan-badge">
                      <span className="badge badge-info">Enterprise</span>
                      <button className="btn btn-ghost btn-sm">Upgrade</button>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Webhook URL</label>
                  <input className="input" placeholder="https://your-app.com/webhooks/verity" />
                </div>
                <button className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'api-keys' && (
            <div className="card">
              <div className="flex-between" style={{ marginBottom: 'var(--space-5)' }}>
                <div>
                  <h3 className="settings__section-title" style={{ marginBottom: 'var(--space-1)' }}>API Keys</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Manage API keys for programmatic access
                  </p>
                </div>
                <button className="btn btn-primary btn-sm">
                  <Plus size={14} /> Generate Key
                </button>
              </div>

              <div className="settings__keys">
                {mockApiKeys.map((key) => (
                  <div key={key.id} className="settings__key">
                    <div className="settings__key-info">
                      <div className="flex-gap-2">
                        <Key size={14} style={{ color: key.active ? 'var(--success)' : 'var(--text-muted)' }} />
                        <span className="settings__key-label">{key.label}</span>
                        {!key.active && <span className="badge badge-neutral">Disabled</span>}
                      </div>
                      <div className="settings__key-code">
                        <code>{showKey === key.id ? 'vfy_prod_sk_1a2b3c4d5e6f7g8h9i0j' : key.preview}</code>
                        <button className="btn btn-ghost btn-icon" onClick={() => setShowKey(showKey === key.id ? null : key.id)}>
                          {showKey === key.id ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button className="btn btn-ghost btn-icon" title="Copy">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="settings__key-meta">
                      <span>Created: {key.created}</span>
                      <span>Last used: {key.last_used}</span>
                    </div>
                    <button className="btn btn-ghost btn-icon" title="Delete key">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'webhooks' && (
            <div className="card">
              <h3 className="settings__section-title">Webhook Configuration</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
                Receive real-time notifications when events occur
              </p>
              <div className="input-group">
                <label className="input-label">Endpoint URL</label>
                <input className="input" placeholder="https://your-app.com/api/webhooks" />
              </div>
              <div className="input-group">
                <label className="input-label">Events</label>
                <div className="settings__webhook-events">
                  {['case.created', 'case.approved', 'case.rejected', 'document.processed', 'risk.flagged'].map((event) => (
                    <label key={event} className="settings__checkbox-label">
                      <input type="checkbox" defaultChecked className="settings__checkbox" />
                      <code style={{ fontSize: 'var(--text-sm)' }}>{event}</code>
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary">
                <Save size={16} /> Save Webhook
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card">
              <h3 className="settings__section-title">Notification Preferences</h3>
              <div className="settings__notifications">
                {[
                  { label: 'New case submitted', desc: 'When a new KYC case is created' },
                  { label: 'High risk flagged', desc: 'When a case exceeds risk threshold' },
                  { label: 'Document processing complete', desc: 'When AI finishes analyzing a document' },
                  { label: 'Case requires review', desc: 'When a case needs manual review' },
                  { label: 'Weekly summary', desc: 'Weekly digest of all KYC activity' },
                ].map((n, i) => (
                  <div key={i} className="settings__notification-row">
                    <div>
                      <span className="settings__notification-label">{n.label}</span>
                      <span className="settings__notification-desc">{n.desc}</span>
                    </div>
                    <label className="settings__toggle">
                      <input type="checkbox" defaultChecked={i < 3} />
                      <span className="settings__toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
