import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FileUploader.css';

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  label?: string;
}

export default function FileUploader({
  onUpload,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxFiles = 5,
  label = 'Upload Documents',
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles).slice(0, maxFiles - files.length);
      const uploaded: UploadedFile[] = fileArray.map((f) => ({
        file: f,
        id: crypto.randomUUID(),
        progress: 100,
        status: 'done',
      }));
      setFiles((prev) => [...prev, ...uploaded]);
      onUpload(fileArray);
    },
    [files.length, maxFiles, onUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="file-uploader">
      <div
        className={`file-uploader__dropzone ${isDragging ? 'file-uploader__dropzone--active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <div className="file-uploader__dropzone-icon">
          <Upload size={24} />
        </div>
        <p className="file-uploader__dropzone-title">{label}</p>
        <p className="file-uploader__dropzone-hint">
          Drag & drop files here or click to browse
        </p>
        <p className="file-uploader__dropzone-formats">
          PDF, JPG, PNG • Max {maxFiles} files
        </p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <div className="file-uploader__list">
            {files.map((f) => (
              <motion.div
                key={f.id}
                className="file-uploader__item"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <File size={16} className="file-uploader__item-icon" />
                <div className="file-uploader__item-info">
                  <span className="file-uploader__item-name">{f.file.name}</span>
                  <span className="file-uploader__item-size">{formatSize(f.file.size)}</span>
                </div>
                {f.status === 'done' && (
                  <CheckCircle size={16} className="file-uploader__item-done" />
                )}
                <button
                  className="file-uploader__item-remove"
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
