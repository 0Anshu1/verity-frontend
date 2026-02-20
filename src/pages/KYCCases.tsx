import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Link as LinkIcon,
  Check,
  X,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/StatusBadge';
import NewCaseModal from '../components/NewCaseModal';
import type { CaseStatus } from '../types';
import './KYCCases.css';

interface KYCCaseData {
  id: string;
  applicant_name: string;
  applicant_email: string;
  status: CaseStatus;
  risk_score: number | null;
  documents_count: number;
  created_at: string;
  assigned_to: string | null;
}

const statusFilters: { label: string; value: CaseStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'On Hold', value: 'on_hold' },
];

export default function KYCCases() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [cases, setCases] = useState<KYCCaseData[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showNewCase, setShowNewCase] = useState(false);
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const { session } = useAuth();
  const token = session?.access_token;

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), page_size: '20' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await api.get<any>(`/cases?${params}`, token);
      setCases(res.data || []);
      setTotalCases(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, token]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const filteredCases = search
    ? cases.filter(
        (c) =>
          c.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase())
      )
    : cases;

  const getRiskColor = (score: number | null) => {
    if (score === null) return 'var(--text-muted)';
    if (score <= 30) return 'var(--success)';
    if (score <= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const handleCreateCase = async (name: string, email: string) => {
    setCreating(true);
    try {
      await api.post('/cases', { applicant_name: name, applicant_email: email }, token);
      setShowNewCase(false);
      await fetchCases();
    } catch (err) {
      console.error('Failed to create case:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">KYC Cases</h1>
          <p className="page-subtitle">Manage and review verification cases</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewCase(true)}>
          <Plus size={16} /> New Case
        </button>
      </div>

      {/* New Case Modal */}
      <NewCaseModal 
        isOpen={showNewCase}
        onClose={() => setShowNewCase(false)}
        onSubmit={handleCreateCase}
        creating={creating}
      />

      {/* Filters */}
      <div className="kyc-cases__filters">
        <div className="kyc-cases__search">
          <Search size={16} className="kyc-cases__search-icon" />
          <input
            type="text"
            className="input kyc-cases__search-input"
            placeholder="Search by name or case ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="kyc-cases__status-filters">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              className={`kyc-cases__filter-btn ${statusFilter === f.value ? 'kyc-cases__filter-btn--active' : ''}`}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="login-card__spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>No cases found</p>
          <p style={{ fontSize: 'var(--text-sm)' }}>Create a new KYC case to get started</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th><span className="flex-gap-2">Case ID <ArrowUpDown size={12} /></span></th>
                <th>Applicant</th>
                <th>Status</th>
                <th><span className="flex-gap-2">Risk <ArrowUpDown size={12} /></span></th>
                <th>Documents</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.id}</span>
                  </td>
                  <td>
                    <div>
                      <span style={{ display: 'block', fontWeight: 500, color: 'var(--text-primary)' }}>{c.applicant_name}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.applicant_email}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <span style={{ fontWeight: 600, color: getRiskColor(c.risk_score) }}>
                      {c.risk_score !== null ? c.risk_score : '—'}
                    </span>
                  </td>
                  <td>{c.documents_count}</td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{c.assigned_to || 'Unassigned'}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="flex-gap-2">
                      <button 
                        className="btn btn-ghost btn-icon" 
                        title="Copy onboarding link"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${window.location.origin}/onboard/${c.id}`;
                          navigator.clipboard.writeText(url);
                        }}
                      >
                        <LinkIcon size={16} />
                      </button>
                      <button className="btn btn-ghost btn-icon" title="View case">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalCases > 0 && (
        <div className="kyc-cases__pagination">
          <span className="kyc-cases__pagination-info">
            Showing {filteredCases.length} of {totalCases} cases
          </span>
          <div className="kyc-cases__pagination-btns">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
