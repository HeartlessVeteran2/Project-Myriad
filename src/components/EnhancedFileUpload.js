'use client';

import { useState, useRef } from 'react';
import { validateFileType, validateFileSize } from '../lib/errors';

const ALLOWED_FILE_TYPES = ['cbz', 'zip'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function EnhancedFileUpload({ onUpload, onError }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const validateFile = (file) => {
    try {
      // Check file type
      const fileName = file.name.toLowerCase();
      const extension = fileName.split('.').pop();
      if (!ALLOWED_FILE_TYPES.includes(extension)) {
        throw new Error(`File type .${extension} is not supported. Please upload .cbz or .zip files.`);
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        const maxSizeMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
        throw new Error(`File size exceeds ${maxSizeMB}MB limit. Current size: ${Math.round(file.size / (1024 * 1024))}MB`);
      }

      return true;
    } catch (error) {
      setError(error.message);
      if (onError) onError(error);
      return false;
    }
  };

  const handleUpload = async (file) => {
    if (!validateFile(file)) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        throw new Error('Please log in to upload files');
      }

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        setUploading(false);
        setProgress(0);
        
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              if (onUpload) onUpload(response.series);
            } else {
              throw new Error(response.error?.message || 'Upload failed');
            }
          } catch (e) {
            setError('Invalid response from server');
            if (onError) onError(new Error('Invalid response from server'));
          }
        } else {
          try {
            const response = JSON.parse(xhr.responseText);
            throw new Error(response.error?.message || `Upload failed (${xhr.status})`);
          } catch (e) {
            throw new Error(`Upload failed (${xhr.status})`);
          }
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploading(false);
        setProgress(0);
        const errorMessage = 'Network error during upload';
        setError(errorMessage);
        if (onError) onError(new Error(errorMessage));
      });

      // Handle timeout
      xhr.addEventListener('timeout', () => {
        setUploading(false);
        setProgress(0);
        const errorMessage = 'Upload timeout - file may be too large';
        setError(errorMessage);
        if (onError) onError(new Error(errorMessage));
      });

      xhr.open('POST', '/api/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
      xhr.timeout = 300000; // 5 minutes
      xhr.send(formData);

    } catch (error) {
      setUploading(false);
      setProgress(0);
      setError(error.message);
      if (onError) onError(error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`upload-area ${dragActive ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? openFileDialog : undefined}
        style={{
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.7 : 1
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".cbz,.zip"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-4" style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                Uploading... {progress}%
              </p>
              <div className="progress-bar" style={{ maxWidth: '300px', margin: '0 auto' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                {dragActive ? 'Drop your file here' : 'Click to upload or drag and drop'}
              </p>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                Supports .cbz and .zip files up to {Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger">
          <strong>Upload Error:</strong> {error}
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setError(null)}
            style={{ marginLeft: '1rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* File Requirements */}
      <div className="card">
        <div className="card-body">
          <h3 style={{ marginBottom: '1rem' }}>File Requirements</h3>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-gray-600)' }}>
            <li>Supported formats: .cbz, .zip</li>
            <li>Maximum file size: {Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB</li>
            <li>Archive should contain image files (JPG, PNG, GIF, WebP)</li>
            <li>Images will be sorted naturally (1.jpg, 2.jpg, 10.jpg)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
