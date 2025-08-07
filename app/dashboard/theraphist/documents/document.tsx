"use client"

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { Upload, FileText, Music, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FileUploadStepProps {
  title: string;
  description: string;
  acceptedTypes: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  icon: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
}

const FileUploadStep: React.FC<FileUploadStepProps> = ({
  title,
  description,
  acceptedTypes,
  files,
  onFilesChange,
  icon,
  isCompleted,
  isActive
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList) => {
    const fileArray = Array.from(newFiles);
    onFilesChange([...files, ...fileArray]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFiles(event.target.files);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className={`p-6 transition-all duration-300 ${isActive ? 'ring-2 ring-primary' : ''} ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {isCompleted ? <CheckCircle className="h-5 w-5" /> : icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : isCompleted 
            ? 'border-green-300 bg-green-50' 
            : 'border-border hover:border-primary/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-sm font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-muted-foreground">
          Accepted formats: {acceptedTypes}
        </p>
      </motion.div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files:</h4>
          {files.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

interface EEGSessionUploaderProps {
  onUploadComplete?: (data: {
    preSessionEEG: File[];
    sessionAudio: File[];
    postSessionEEG: File[];
  }) => void;
}

const EEGSessionUploader: React.FC<EEGSessionUploaderProps> = ({ 
  onUploadComplete = () => {} 
}) => {
  const [preSessionEEG, setPreSessionEEG] = useState<File[]>([]);
  const [sessionAudio, setSessionAudio] = useState<File[]>([]);
  const [postSessionEEG, setPostSessionEEG] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const steps = [
    {
      title: "Pre-Session EEG Data",
      description: "Upload EEG signal data recorded before the session",
      acceptedTypes: ".csv",
      files: preSessionEEG,
      onFilesChange: setPreSessionEEG,
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Session Audio Recordings",
      description: "Upload audio files recorded during the session",
      acceptedTypes: ".mp3,.wav,.m4a,.aac",
      files: sessionAudio,
      onFilesChange: setSessionAudio,
      icon: <Music className="h-5 w-5" />
    },
    {
      title: "Post-Session EEG Data",
      description: "Upload EEG signal data recorded after the session",
      acceptedTypes: ".csv",
      files: postSessionEEG,
      onFilesChange: setPostSessionEEG,
      icon: <FileText className="h-5 w-5" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData to send files
      const formData = new FormData();
      
      // Add user_id (you might want to get this from user context or props)
      formData.append('user_id', 'User003'); // Always send User003
      
      // Add csv_file_1 (pre-session EEG files)
      if (preSessionEEG.length > 0) {
        formData.append('csv_file_1', preSessionEEG[0]); // Take the first file
      }
      
      // Add csv_file_2 (post-session EEG files)
      if (postSessionEEG.length > 0) {
        formData.append('csv_file_2', postSessionEEG[0]); // Take the first file
      }
      
      // Add audio_file (session audio files) - optional
      if (sessionAudio.length > 0) {
        formData.append('audio_file', sessionAudio[0]); // Take the first file
      }

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Send files to ngrok API
      const response = await fetch('http://localhost:8000/process-csv-files', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Wait a moment to show 100% progress
      setTimeout(() => {
        setIsUploading(false);
        setIsUploadComplete(true);
        onUploadComplete({
          preSessionEEG,
          sessionAudio,
          postSessionEEG
        });
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      // You might want to show an error message to the user here
      alert('Upload failed. Please try again.');
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    return steps[stepIndex].files.length > 0;
  };

  const canProceed = () => {
    return steps[currentStep].files.length > 0;
  };

  const allStepsCompleted = () => {
    return steps.every((_, index) => isStepCompleted(index));
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      // Create a link that directly points to the PDF download URL
      const downloadUrl = process.env.BASE_URL + '/download-eeg-report/user001';
      
      // Create a temporary link element and trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'eeg_report_user001.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Download failed: ' + errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">EEG Session Data Upload</h1>
        <p className="text-muted-foreground">
          Upload your EEG signals and session audio files in the correct sequence
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isStepCompleted(index) 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {isStepCompleted(index) ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${
                isStepCompleted(index) ? 'bg-green-500' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <FileUploadStep
        {...steps[currentStep]}
        isCompleted={isStepCompleted(currentStep)}
        isActive={true}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
          </Button>
        ) : isUploadComplete ? (
          <Button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="min-w-[120px]"
          >
            {isDownloading ? 'Downloading...' : 'Download Report'}
          </Button>
        ) : (
          <Button
            onClick={handleUpload}
            disabled={!allStepsCompleted() || isUploading}
            className="min-w-[120px]"
          >
            {isUploading ? 'Uploading...' : 'Complete Upload'}
          </Button>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading files...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        </Card>
      )}

      {/* Summary */}
      {allStepsCompleted() && !isUploading && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              {isUploadComplete ? 'Upload completed! Report ready for download.' : 'All files uploaded successfully!'}
            </span>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <p>Pre-session EEG: {preSessionEEG.length} files</p>
            <p>Session Audio: {sessionAudio.length} files</p>
            <p>Post-session EEG: {postSessionEEG.length} files</p>
            {isUploadComplete && (
              <p className="mt-2 font-medium">Click "Download Report" to get your EEG analysis report.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default function EEGSessionUploaderDemo() {
  const handleUploadComplete = (data: {
    preSessionEEG: File[];
    sessionAudio: File[];
    postSessionEEG: File[];
  }) => {
    console.log('Upload completed:', data);
  };

  return <EEGSessionUploader onUploadComplete={handleUploadComplete} />;
}
