/**
 * Advanced API service with retry logic, caching, and error handling
 */
import { getCacheService } from './cacheService';
import { getErrorTracker } from './errorTracker';

class ApiService {
  constructor(config = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      enableCaching: config.enableCaching !== false,
      defaultCacheTtl: config.defaultCacheTtl || 300000, // 5 minutes
      enableErrorTracking: config.enableErrorTracking !== false,
      enableRequestInterception: config.enableRequestInterception !== false,
      enableResponseInterception: config.enableResponseInterception !== false,
      ...config
    };

    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.cache = getCacheService();
    this.errorTracker = this.config.enableErrorTracking ? getErrorTracker() : null;
    
    this.setupInterceptors();
  }

  setupInterceptors() {
    if (this.config.enableRequestInterception) {
      this.addRequestInterceptor(this.authInterceptor.bind(this));
      this.addRequestInterceptor(this.loggingInterceptor.bind(this));
    }

    if (this.config.enableResponseInterception) {
      this.addResponseInterceptor(this.errorHandlingInterceptor.bind(this));
      this.addResponseInterceptor(this.cachingInterceptor.bind(this));
    }
  }

  // Interceptor management
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Built-in interceptors
  async authInterceptor(config) {
    const token = await this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  }

  async loggingInterceptor(config) {
    if (this.errorTracker) {
      this.errorTracker.addBreadcrumb({
        type: 'http',
        category: 'request',
        message: `${config.method?.toUpperCase()} ${config.url}`,
        data: {
          url: config.url,
          method: config.method,
          headers: config.headers
        }
      });
    }
    return config;
  }

  async errorHandlingInterceptor(response, error) {
    if (error) {
      if (this.errorTracker) {
        this.errorTracker.trackError(error, {
          source: 'api_request',
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }
    }
    return { response, error };
  }

  async cachingInterceptor(response, error) {
    if (response && this.config.enableCaching) {
      const config = response.config;
      if (config.method === 'GET' && config.cache !== false) {
        const cacheKey = this.generateCacheKey(config);
        await this.cache.set(cacheKey, {
          data: response.data,
          status: response.status,
          headers: response.headers
        }, {
          ttl: config.cacheTtl || this.config.defaultCacheTtl,
          tags: ['api_response']
        });
      }
    }
    return { response, error };
  }

  // Core request method
  async request(config) {
    // Apply request interceptors
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }

    // Check cache for GET requests
    if (processedConfig.method === 'GET' && this.config.enableCaching && processedConfig.cache !== false) {
      const cacheKey = this.generateCacheKey(processedConfig);
      const cachedResponse = await this.cache.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Execute request with retry logic
    let lastError;
    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.executeRequest(processedConfig);
        
        // Apply response interceptors
        let processedResponse = { response, error: null };
        for (const interceptor of this.responseInterceptors) {
          processedResponse = await interceptor(processedResponse.response, processedResponse.error);
        }

        if (processedResponse.error) {
          throw processedResponse.error;
        }

        return processedResponse.response;
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (!this.shouldRetry(error, attempt)) {
          break;
        }

        // Wait before retry
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    // Apply response interceptors for error
    let processedError = { response: null, error: lastError };
    for (const interceptor of this.responseInterceptors) {
      processedError = await interceptor(processedError.response, processedError.error);
    }

    throw processedError.error || lastError;
  }

  async executeRequest(config) {
    const {
      url,
      method = 'GET',
      headers = {},
      data,
      params,
      timeout = this.config.timeout,
      signal
    } = config;

    const fullUrl = this.buildUrl(url, params);
    
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    // Add timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });

    const fetchPromise = fetch(fullUrl, fetchOptions);
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      error.response = response;
      error.status = response.status;
      error.config = config;
      throw error;
    }

    const responseData = await response.json();
    
    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      config
    };
  }

  // HTTP method helpers
  async get(url, config = {}) {
    return this.request({ ...config, method: 'GET', url });
  }

  async post(url, data, config = {}) {
    return this.request({ ...config, method: 'POST', url, data });
  }

  async put(url, data, config = {}) {
    return this.request({ ...config, method: 'PUT', url, data });
  }

  async patch(url, data, config = {}) {
    return this.request({ ...config, method: 'PATCH', url, data });
  }

  async delete(url, config = {}) {
    return this.request({ ...config, method: 'DELETE', url });
  }

  // Utility methods
  buildUrl(url, params) {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      return `${fullUrl}?${searchParams.toString()}`;
    }
    
    return fullUrl;
  }

  generateCacheKey(config) {
    const { url, method, params, data } = config;
    const keyData = { url, method, params, data };
    return `api_${btoa(JSON.stringify(keyData))}`;
  }

  shouldRetry(error, attempt) {
    if (attempt >= this.config.retryAttempts) {
      return false;
    }

    // Don't retry on client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }

    // Don't retry on network abort
    if (error.name === 'AbortError') {
      return false;
    }

    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAuthToken() {
    // This should be implemented based on your auth system
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return await AsyncStorage.getItem('token');
    } catch {
      return localStorage?.getItem('token');
    }
  }

  // Batch requests
  async batch(requests) {
    const results = await Promise.allSettled(
      requests.map(request => this.request(request))
    );

    return results.map((result, index) => ({
      request: requests[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }

  // File upload
  async upload(url, file, config = {}) {
    const formData = new FormData();
    formData.append('file', file);

    if (config.fields) {
      Object.entries(config.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...config.headers,
        // Don't set Content-Type, let browser set it with boundary
      }
    });
  }

  // Download with progress
  async download(url, config = {}) {
    const { onProgress, ...requestConfig } = config;

    if (!onProgress) {
      const response = await this.request({ ...requestConfig, url });
      return response.data;
    }

    // For progress tracking, we need to use fetch directly
    const fullUrl = this.buildUrl(url);
    const response = await fetch(fullUrl, {
      headers: await this.buildHeaders(requestConfig.headers || {})
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        onProgress({ loaded, total, percentage: (loaded / total) * 100 });
      }
    }

    return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
  }

  async buildHeaders(headers = {}) {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers
    };
  }
}

// Singleton instance
let apiServiceInstance = null;

export const initializeApiService = (config) => {
  if (!apiServiceInstance) {
    apiServiceInstance = new ApiService(config);
  }
  return apiServiceInstance;
};

export const getApiService = () => {
  if (!apiServiceInstance) {
    apiServiceInstance = new ApiService();
  }
  return apiServiceInstance;
};

// Convenience functions
export const api = {
  get: (url, config) => getApiService().get(url, config),
  post: (url, data, config) => getApiService().post(url, data, config),
  put: (url, data, config) => getApiService().put(url, data, config),
  patch: (url, data, config) => getApiService().patch(url, data, config),
  delete: (url, config) => getApiService().delete(url, config),
  upload: (url, file, config) => getApiService().upload(url, file, config),
  download: (url, config) => getApiService().download(url, config),
  batch: (requests) => getApiService().batch(requests)
};

export default ApiService;
