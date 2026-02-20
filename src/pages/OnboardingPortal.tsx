import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';
import './OnboardingPortal.css';

type OnboardingStep = 'welcome' | 'select_type' | 'upload' | 'verifying' | 'success';

export default function OnboardingPortal() {
  const { caseId } = useParams<{ caseId: string }>();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [docType, setDocType] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseInfo, setCaseInfo] = useState<any>(null);

  useEffect(() => {
    if (caseId) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL || '/api'}/public/cases/${caseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error);
          else setCaseInfo(data);
        })
        .catch(err => setError('Failed to load case information'))
        .finally(() => setLoading(false));
    }
  }, [caseId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !caseId) return;
    setLoading(true);
    setError(null);
    try {
      setStep('verifying');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('case_id', caseId);
      formData.append('doc_type', docType);

      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/public/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(errData.detail || 'Upload failed');
      }
      
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 'welcome') {
    return (
      <div className="onboard flex-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="onboard">
      <header className="onboard__header">
        <div className="onboard__logo gradient-text">Verity AI</div>
        <div className="flex-gap-2">
          <ShieldCheck size={18} className="text-success" />
          <span className="text-sm font-medium">Secure Verification</span>
        </div>
      </header>

      <main className="onboard__content">
        {step !== 'success' && step !== 'verifying' && (
          <div className="onboard__stepper">
            <div className={`onboard__step-dot ${step === 'welcome' || step === 'select_type' || step === 'upload' ? 'onboard__step-dot--active' : ''}`} />
            <div className={`onboard__step-dot ${step === 'select_type' || step === 'upload' ? 'onboard__step-dot--active' : ''}`} />
            <div className={`onboard__step-dot ${step === 'upload' ? 'onboard__step-dot--active' : ''}`} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-glass onboard__card"
            >
              <h1 className="onboard__title">Welcome, {caseInfo?.applicant_name || 'there'}</h1>
              <p className="onboard__subtitle">
                To complete your onboarding, we need to verify your identity documents. 
                This process is end-to-end encrypted and takes less than 2 minutes.
              </p>
              <div className="onboard__actions">
                <button className="btn btn-primary btn-lg" onClick={() => setStep('select_type')}>
                  Start Verification <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'select_type' && (
            <motion.div 
              key="select_type"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-glass onboard__card"
            >
              <button className="btn btn-ghost btn-sm mb-4" onClick={() => setStep('welcome')}>
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className="onboard__title">Select Document Type</h2>
              <p className="onboard__subtitle">Choose the document you want to upload for verification.</p>
              
              <div className="grid-2">
                {[
                  { id: 'passport', name: 'Passport', icon: '🌍' },
                  { id: 'national_id', name: 'National ID', icon: '🪪' },
                  { id: 'drivers_license', name: 'Driver\'s License', icon: '🚗' },
                  { id: 'utility_bill', name: 'Utility Bill', icon: '📄' },
                ].map((type) => (
                  <button 
                    key={type.id}
                    className={`card onboard__type-card ${docType === type.id ? 'border-active' : ''}`}
                    onClick={() => { setDocType(type.id); setStep('upload'); }}
                    style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    <span style={{ fontSize: '24px' }}>{type.icon}</span>
                    <span className="font-semibold">{type.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-glass onboard__card"
            >
              <button className="btn btn-ghost btn-sm mb-4" onClick={() => setStep('select_type')}>
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className="onboard__title">Upload {docType.replace('_', ' ')}</h2>
              <p className="onboard__subtitle">Make sure the document is clear and all four corners are visible.</p>

              <label className="onboard__upload-zone">
                <input type="file" hidden onChange={handleFileChange} accept="image/*,application/pdf" />
                <Upload size={40} className="onboard__upload-icon" />
                <div className="text-center">
                  <p className="font-semibold">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted mt-1">SVG, PNG, JPG or PDF (MAX. 10MB)</p>
                </div>
              </label>

              {file && (
                <div className="onboard__file-preview">
                  <FileText size={20} className="text-accent" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button className="btn btn-ghost btn-icon" onClick={() => setFile(null)}>
                    <AlertCircle size={16} />
                  </button>
                </div>
              )}

              {error && (
                <div className="badge badge-danger mt-4 w-full justify-start p-3">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="onboard__actions">
                <button 
                  className="btn btn-primary btn-lg w-full" 
                  disabled={!file || loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Processing...' : 'Verify Document'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'verifying' && (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="onboard__success"
            >
              <div className="flex-center flex-direction-column gap-6">
                <div className="relative">
                  <Loader2 className="animate-spin text-accent" size={64} />
                  <div className="absolute inset-0 flex-center">
                    <ShieldCheck size={24} className="text-accent" />
                  </div>
                </div>
                <div>
                  <h2 className="onboard__title">AI is Verifying</h2>
                  <p className="onboard__subtitle">We're checking for authenticity and extracting data...</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="onboard__success"
            >
              <CheckCircle size={80} className="onboard__success-icon mx-auto" />
              <h2 className="onboard__title">Verification Complete!</h2>
              <p className="onboard__subtitle">
                Thank you. Your documents have been securely uploaded and are being reviewed. 
                You will be notified once the process is finalized.
              </p>
              <div className="mt-10">
                <button className="btn btn-secondary" onClick={() => window.close()}>
                  Close Window
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-6 text-center text-xs text-muted border-t border-subtle">
        Powered by <span className="gradient-text font-bold">Verity AI</span> · Bank-grade Security
      </footer>
    </div>
  );
}
