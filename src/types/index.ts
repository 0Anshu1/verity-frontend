/* ═══════════════════════════════════
   TypeScript Type Definitions
   ═══════════════════════════════════ */

// ─── Enums ───
export type CaseStatus =
  | 'pending'
  | 'documents_uploaded'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'on_hold';

export type DocType =
  | 'passport'
  | 'national_id'
  | 'drivers_license'
  | 'utility_bill'
  | 'bank_statement'
  | 'selfie'
  | 'other';

export type CheckType =
  | 'ocr_extraction'
  | 'doc_authenticity'
  | 'face_match'
  | 'liveness'
  | 'watchlist'
  | 'risk_scoring';

export type UserRole = 'admin' | 'reviewer' | 'viewer';

export type VerificationResult = 'pass' | 'fail' | 'pending' | 'review_needed';

// ─── Core Entities ───
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
  settings: Record<string, unknown>;
  created_at: string;
}

export interface User {
  id: string;
  org_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  org_id: string;
  label: string;
  key_preview: string;
  permissions: Record<string, boolean>;
  is_active: boolean;
  created_at: string;
  last_used_at?: string;
}

// ─── KYC ───
export interface KYCCase {
  id: string;
  org_id: string;
  applicant_name: string;
  applicant_email: string;
  status: CaseStatus;
  risk_score: number | null;
  assigned_to?: string;
  documents_count: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  case_id: string;
  doc_type: DocType;
  storage_path: string;
  original_filename: string;
  file_size: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface ExtractionResult {
  id: string;
  document_id: string;
  extracted_data: Record<string, unknown>;
  confidence: number;
  model_version: string;
  created_at: string;
}

export interface VerificationCheck {
  id: string;
  case_id: string;
  check_type: CheckType;
  result: VerificationResult;
  details: Record<string, unknown>;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  org_id: string;
  user_id: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Dashboard ───
export interface DashboardStats {
  total_cases: number;
  cases_today: number;
  approval_rate: number;
  avg_processing_time: number;
  pending_reviews: number;
  high_risk_cases: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

// ─── API Responses ───
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}
