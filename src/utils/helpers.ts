// Utility functions for Project Myriad

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const isMangaFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName);
  return ['cbz', 'cbr', 'zip', 'rar'].includes(extension);
};

export const isVideoFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName);
  return ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension);
};

export const calculateReadingProgress = (currentPage: number, totalPages: number): number => {
  if (totalPages === 0) return 0;
  return Math.round((currentPage / totalPages) * 100);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
