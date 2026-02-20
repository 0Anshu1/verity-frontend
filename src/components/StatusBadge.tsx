import React from 'react';
import type { CaseStatus, VerificationResult } from '../types';

interface StatusBadgeProps {
  status: CaseStatus | VerificationResult | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'badge badge-neutral' },
  documents_uploaded: { label: 'Docs Uploaded', className: 'badge badge-info' },
  under_review: { label: 'Under Review', className: 'badge badge-warning' },
  approved: { label: 'Approved', className: 'badge badge-success' },
  rejected: { label: 'Rejected', className: 'badge badge-danger' },
  on_hold: { label: 'On Hold', className: 'badge badge-warning' },
  pass: { label: 'Pass', className: 'badge badge-success' },
  fail: { label: 'Fail', className: 'badge badge-danger' },
  review_needed: { label: 'Review Needed', className: 'badge badge-warning' },
  processing: { label: 'Processing', className: 'badge badge-info' },
  completed: { label: 'Completed', className: 'badge badge-success' },
  failed: { label: 'Failed', className: 'badge badge-danger' },
  uploading: { label: 'Uploading', className: 'badge badge-info' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'badge badge-neutral',
  };

  return (
    <span
      className={config.className}
      style={size === 'sm' ? { fontSize: '10px', padding: '1px 6px' } : undefined}
    >
      {config.label}
    </span>
  );
}
