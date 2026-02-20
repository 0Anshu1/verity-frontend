import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/StatusBadge';
import './DocumentReview.css';

export default function DocumentReview() {
  const { session } = useAuth();
  const token = session?.access_token;
  const [cases, setCases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [extraction, setExtraction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get all cases, then get documents for each
        const casesRes = await api.get<any>('/cases?page_size=50', token);
        const allCases = casesRes.data || [];
        setCases(allCases);

        // Collect all documents from all cases
        const allDocs: any[] = [];
        for (const c of allCases) {
          try {
            const docs = await api.get<any>(`/documents/case/${c.id}`, token);
            if (Array.isArray(docs)) {
              allDocs.push(...docs.map((d: any) => ({ ...d, applicant: c.applicant_name })));
            }
          } catch { /* skip */ }
        }
        setDocuments(allDocs);

        // Load extraction for first doc if available
        if (allDocs.length > 0) {
          try {
            const ext = await api.get<any>(`/documents/${allDocs[0].id}/extraction`, token);
            if (!ext.error) setExtraction(ext);
          } catch { /* no extraction */ }
        }
      } catch (err) {
        console.error('Failed to fetch documents:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const handleSelectDoc = async (index: number) => {
    setSelectedDocIndex(index);
    setExtraction(null);
    const doc = documents[index];
    if (doc) {
      try {
        const ext = await api.get<any>(`/documents/${doc.id}/extraction`, token);
        if (!ext.error) setExtraction(ext);
      } catch { /* no extraction */ }
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="login-card__spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  const selectedDoc = documents[selectedDocIndex] || null;

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1 className="page-title">Document Review</h1>
        <p className="page-subtitle">Review AI-extracted data from submitted documents</p>
      </div>

      {documents.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.3 }} />
          <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>No documents to review</p>
          <p style={{ fontSize: 'var(--text-sm)' }}>Upload documents to a KYC case to see them here</p>
        </div>
      ) : (
        <div className="doc-review__layout">
          {/* Queue Panel */}
          <div className="doc-review__queue">
            <h3 className="doc-review__queue-title">Review Queue ({documents.length})</h3>
            <div className="doc-review__queue-list">
              {documents.map((doc, i) => (
                <div
                  key={doc.id}
                  className={`doc-review__queue-item ${i === selectedDocIndex ? 'doc-review__queue-item--active' : ''}`}
                  onClick={() => handleSelectDoc(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <FileText size={16} style={{ color: 'var(--accent-start)', flexShrink: 0 }} />
                  <div className="doc-review__queue-info">
                    <span className="doc-review__queue-type">{doc.doc_type}</span>
                    <span className="doc-review__queue-applicant">{doc.applicant || doc.case_id}</span>
                  </div>
                  <StatusBadge status={doc.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Document Viewer */}
          <div className="doc-review__viewer">
            <div className="doc-review__viewer-header">
              <div className="flex-gap-3">
                <button
                  className="btn btn-ghost btn-icon"
                  disabled={selectedDocIndex <= 0}
                  onClick={() => handleSelectDoc(selectedDocIndex - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {selectedDocIndex + 1} of {documents.length}
                </span>
                <button
                  className="btn btn-ghost btn-icon"
                  disabled={selectedDocIndex >= documents.length - 1}
                  onClick={() => handleSelectDoc(selectedDocIndex + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="doc-review__viewer-canvas">
              {selectedDoc ? (() => {
                const filename = selectedDoc.original_filename?.toLowerCase() || '';
                const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(filename);
                const isPdf = /\.pdf$/i.test(filename);
                const apiBase = import.meta.env.VITE_API_URL || '/api';
                const fileUrl = `${apiBase}${selectedDoc.storage_path}`;

                if (isImage) {
                  return (
                    <img
                      src={fileUrl}
                      alt={selectedDoc.original_filename}
                      className="doc-review__preview-img"
                    />
                  );
                } else if (isPdf) {
                  return (
                    <iframe
                      src={fileUrl}
                      title={selectedDoc.original_filename}
                      className="doc-review__preview-pdf"
                    />
                  );
                } else {
                  return (
                    <div className="doc-review__placeholder">
                      <FileText size={48} />
                      <p>{selectedDoc.original_filename}</p>
                      <span>{selectedDoc.doc_type} — {selectedDoc.applicant || selectedDoc.case_id}</span>
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }}>
                        Download File
                      </a>
                    </div>
                  );
                }
              })() : (
                <div className="doc-review__placeholder">
                  <FileText size={48} />
                  <p>Select a document to preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Extraction Panel */}
          <div className="doc-review__extraction">
            <h3 className="doc-review__extraction-title">Extracted Fields</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              Review and correct AI-extracted data
            </p>

            {extraction?.extracted_data ? (
              <div className="doc-review__fields">
                {Object.entries(extraction.extracted_data).map(([key, fieldData]) => {
                  const isObject = typeof fieldData === 'object' && fieldData !== null && 'value' in (fieldData as any);
                  const value = isObject ? (fieldData as any).value : fieldData;
                  const fieldConfidence = isObject ? (fieldData as any).confidence : extraction.confidence;

                  return (
                    <div key={key} className="doc-review__field">
                      <div className="doc-review__field-header">
                        <span className="doc-review__field-label">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                        {fieldConfidence != null && (
                          <span className="doc-review__field-confidence" style={{
                            color: fieldConfidence > 0.93 ? 'var(--success)' : fieldConfidence > 0.88 ? 'var(--warning)' : '#ef4444'
                          }}>
                            {Math.round(fieldConfidence * 100)}%
                          </span>
                        )}
                      </div>
                      <input
                        className="input"
                        defaultValue={value as string}
                        style={{ fontSize: 'var(--text-sm)' }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                No extraction data available for this document
              </div>
            )}

            <div className="doc-review__actions">
              <button className="btn btn-primary" style={{ flex: 1 }}>
                <CheckCircle size={16} /> Approve
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }}>
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
