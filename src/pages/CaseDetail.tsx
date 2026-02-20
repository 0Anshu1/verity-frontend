import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Shield,
  Download,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/StatusBadge';
import RiskGauge from '../components/RiskGauge';
import FileUploader from '../components/FileUploader';
import './CaseDetail.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const DOC_TYPE_OPTIONS = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'pan_card', label: 'PAN Card' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'other', label: 'Other' },
];

const ExtractionSummary = ({ doc, token }: { doc: any, token?: string }) => {
  const [ext, setExt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>(`/documents/${doc.id}/extraction`, token)
      .then(res => { if (!res.error) setExt(res); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [doc.id, token]);

  if (loading) return <div className="extraction-summary__loading">Loading extraction...</div>;
  if (!ext || !ext.extracted_data) return null;

  return (
    <div className="extraction-summary">
      <div className="extraction-summary__header">
        <span className="extraction-summary__doc-type">{doc.doc_type.replace('_', ' ').toUpperCase()}</span>
        <span className="extraction-summary__confidence" style={{ color: ext.confidence > 0.9 ? 'var(--success)' : 'var(--warning)' }}>
          {Math.round(ext.confidence * 100)}% Match
        </span>
      </div>
      <div className="extraction-summary__fields">
        {Object.entries(ext.extracted_data).map(([key, field]: [string, any]) => (
          <div key={key} className="extraction-summary__field">
            <span className="extraction-summary__label">{key.replace(/_/g, ' ')}:</span>
            <span className="extraction-summary__value">{typeof field === 'object' ? field.value : field}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const token = session?.access_token;

  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview');
  const [actionLoading, setActionLoading] = useState('');
  const [uploadDocType, setUploadDocType] = useState('aadhaar');
  const [assignName, setAssignName] = useState('');
  const [showAssign, setShowAssign] = useState(false);

  const fetchCase = useCallback(async () => {
    if (!caseId) return;
    try {
      const [c, docs] = await Promise.all([
        api.get<any>(`/cases/${caseId}`, token),
        api.get<any>(`/documents/case/${caseId}`, token),
      ]);
      setCaseData(c);
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (err) {
      console.error('Error fetching case:', err);
    } finally {
      setLoading(false);
    }
  }, [caseId, token]);

  useEffect(() => { fetchCase(); }, [fetchCase]);

  const handleApprove = async () => {
    setActionLoading('approve');
    try {
      await api.post(`/cases/${caseId}/approve`, {}, token);
      await fetchCase();
    } catch (err) { console.error('Approve error:', err); }
    finally { setActionLoading(''); }
  };

  const handleReject = async () => {
    setActionLoading('reject');
    try {
      await api.post(`/cases/${caseId}/reject`, {}, token);
      await fetchCase();
    } catch (err) { console.error('Reject error:', err); }
    finally { setActionLoading(''); }
  };

  const handleAssign = async () => {
    if (!assignName.trim()) return;
    try {
      await api.post(`/cases/${caseId}/assign`, { assigned_to: assignName.trim() }, token);
      setShowAssign(false);
      setAssignName('');
      await fetchCase();
    } catch (err) { console.error('Assign error:', err); }
  };

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('case_id', caseId || '');
      formData.append('doc_type', uploadDocType);

      try {
        const res = await fetch(`${API_BASE}/documents/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
    await fetchCase();
  };

  const getFileUrl = (doc: any) => {
    if (!doc.storage_path) return '';
    return `${API_BASE}${doc.storage_path}`;
  };

  const isImageFile = (filename: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(filename);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="login-card__spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  if (!caseData || caseData.error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 'var(--space-12)' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Case not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: 'var(--space-4) 0' }}>The case "{caseId}" doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/cases')}>Back to Cases</button>
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
      {/* Header */}
      <div className="case-detail__header">
        <button className="btn btn-ghost" onClick={() => navigate('/cases')}>
          <ArrowLeft size={16} /> Back to Cases
        </button>
        <div className="case-detail__header-main">
          <div>
            <div className="flex-gap-3">
              <h1 className="page-title">{caseData.id}</h1>
              <StatusBadge status={caseData.status} />
            </div>
            <p className="page-subtitle">{caseData.applicant_name} · {caseData.applicant_email}</p>
          </div>
          <div className="case-detail__actions">
            <button className="btn btn-secondary" onClick={() => setShowAssign(!showAssign)}>
              <UserPlus size={16} /> Assign
            </button>
            <button
              className="btn btn-danger"
              onClick={handleReject}
              disabled={actionLoading === 'reject' || caseData.status === 'rejected'}
            >
              <XCircle size={16} /> {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleApprove}
              disabled={actionLoading === 'approve' || caseData.status === 'approved'}
            >
              <CheckCircle size={16} /> {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
            </button>
          </div>
        </div>

        {/* Assignment Bar */}
        {showAssign && (
          <div className="case-detail__assign-bar">
            <input
              className="input"
              placeholder="Enter reviewer name..."
              value={assignName}
              onChange={(e) => setAssignName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAssign()}
              autoFocus
            />
            <button className="btn btn-primary btn-sm" onClick={handleAssign} disabled={!assignName.trim()}>
              Assign
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAssign(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="case-detail__tabs">
        {(['overview', 'documents'] as const).map((tab) => (
          <button
            key={tab}
            className={`case-detail__tab ${activeTab === tab ? 'case-detail__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="case-detail__grid">
          <div className="case-detail__left">
            {/* Applicant Info */}
            <div className="card">
              <h3 className="case-detail__section-title">Applicant Information</h3>
              <div className="case-detail__info-grid">
                <div className="case-detail__info-item">
                  <User size={14} />
                  <span className="case-detail__info-label">Full Name</span>
                  <span className="case-detail__info-value">{caseData.applicant_name}</span>
                </div>
                <div className="case-detail__info-item">
                  <Mail size={14} />
                  <span className="case-detail__info-label">Email</span>
                  <span className="case-detail__info-value">{caseData.applicant_email}</span>
                </div>
                <div className="case-detail__info-item">
                  <Calendar size={14} />
                  <span className="case-detail__info-label">Submitted</span>
                  <span className="case-detail__info-value">{new Date(caseData.created_at).toLocaleString()}</span>
                </div>
                <div className="case-detail__info-item">
                  <Shield size={14} />
                  <span className="case-detail__info-label">Assigned To</span>
                  <span className="case-detail__info-value">
                    {caseData.assigned_to || (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: 0, color: 'var(--accent-start)' }}
                        onClick={() => setShowAssign(true)}
                      >
                        + Assign reviewer
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents with Preview */}
            <div className="card">
              <h3 className="case-detail__section-title">Uploaded Documents ({documents.length})</h3>
              {documents.length > 0 ? (
                <div className="case-detail__docs">
                  {documents.map((d: any) => (
                    <div key={d.id} className="case-detail__doc">
                      {isImageFile(d.original_filename) ? (
                        <img
                          src={getFileUrl(d)}
                          alt={d.original_filename}
                          className="case-detail__doc-thumb"
                        />
                      ) : (
                        <div className="case-detail__doc-icon">
                          <FileText size={20} />
                        </div>
                      )}
                      <div className="case-detail__doc-info">
                        <span className="case-detail__doc-type">{d.doc_type}</span>
                        <span className="case-detail__doc-name">{d.original_filename}</span>
                      </div>
                      <StatusBadge status={d.status} size="sm" />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-4) 0' }}>
                  No documents uploaded yet. Go to the Documents tab to upload.
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="case-detail__right">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 className="case-detail__section-title">Risk Assessment</h3>
              <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-4) 0' }}>
                <RiskGauge score={caseData.risk_score ?? 0} size={140} />
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
                {caseData.risk_score === null
                  ? 'No risk score yet — upload documents to assess'
                  : caseData.risk_score <= 30
                  ? 'Low risk — likely safe'
                  : caseData.risk_score <= 70
                  ? 'Medium risk — manual review recommended'
                  : 'High risk — requires attention'}
              </p>
            </div>

            {/* Data Extractions */}
            {documents.some(d => d.status === 'completed') && (
              <div className="card">
                <h3 className="case-detail__section-title">KYC Data Extractions</h3>
                <div className="case-detail__extractions-summary">
                  {documents
                    .filter(d => d.status === 'completed')
                    .map((doc, idx) => (
                      <ExtractionSummary key={doc.id} doc={doc} token={token} />
                    ))}
                </div>
              </div>
            )}

            <div className="card">
              <h3 className="case-detail__section-title">
                <MessageSquare size={16} /> Notes
              </h3>
              <textarea
                className="input"
                rows={3}
                placeholder="Add a note about this case..."
                style={{ resize: 'vertical' }}
              />
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }}>
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          {/* Doc Type Selector + Uploader */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <label className="input-label" style={{ whiteSpace: 'nowrap', margin: 0 }}>Document Type:</label>
              <select
                className="input"
                value={uploadDocType}
                onChange={(e) => setUploadDocType(e.target.value)}
                style={{ maxWidth: 200 }}
              >
                {DOC_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <FileUploader onUpload={handleFileUpload} />
          </div>

          {/* Document List with Previews */}
          {documents.length > 0 && (
            <div className="card">
              <h3 className="case-detail__section-title">Uploaded Documents</h3>
              <div className="case-detail__doc-grid">
                {documents.map((d: any) => (
                  <div key={d.id} className="case-detail__doc-card">
                    <div className="case-detail__doc-preview">
                      {isImageFile(d.original_filename) ? (
                        <img src={getFileUrl(d)} alt={d.original_filename} />
                      ) : (
                        <div className="case-detail__doc-preview-placeholder">
                          <FileText size={32} />
                        </div>
                      )}
                    </div>
                    <div className="case-detail__doc-card-info">
                      <span className="case-detail__doc-type">{d.doc_type}</span>
                      <span className="case-detail__doc-name">{d.original_filename}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                        <StatusBadge status={d.status} size="sm" />
                        {d.file_size && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {(d.file_size / 1024).toFixed(0)} KB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
