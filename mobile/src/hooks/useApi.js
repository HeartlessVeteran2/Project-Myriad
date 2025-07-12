import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for API calls with loading, error, and retry functionality
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} API call utilities
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCallTime, setLastCallTime] = useState(null);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      setLastCallTime(Date.now());

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      const result = await apiFunction(...args, {
        signal: abortControllerRef.current.signal
      });
      
      setData(result);
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        throw err;
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiFunction]);

  const retry = useCallback(() => {
    if (lastCallTime) {
      return execute();
    }
  }, [execute, lastCallTime]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setLastCallTime(null);
    cancel();
  }, [cancel]);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    cancel,
    reset,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null,
    isIdle: !loading && !error && data === null
  };
};

/**
 * Custom hook for paginated API calls
 * @param {Function} apiFunction - The API function that supports pagination
 * @param {Object} options - Configuration options
 * @returns {Object} Paginated API utilities
 */
export const usePaginatedApi = (apiFunction, options = {}) => {
  const {
    pageSize = 20,
    initialPage = 1,
    enableInfiniteScroll = false
  } = options;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  
  const api = useApi(apiFunction);

  const fetchPage = useCallback(async (page = currentPage, append = false) => {
    try {
      const result = await api.execute({
        page,
        pageSize,
        ...options.params
      });

      if (result) {
        const newData = append ? [...data, ...result.data] : result.data;
        setData(newData);
        setCurrentPage(page);
        setTotalPages(result.totalPages || 0);
        setTotalCount(result.totalCount || 0);
        setHasNextPage(page < (result.totalPages || 0));
        setHasPreviousPage(page > 1);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }, [api, currentPage, pageSize, data, options.params]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      return fetchPage(currentPage + 1, enableInfiniteScroll);
    }
  }, [hasNextPage, currentPage, fetchPage, enableInfiniteScroll]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      return fetchPage(currentPage - 1, false);
    }
  }, [hasPreviousPage, currentPage, fetchPage]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      return fetchPage(page, false);
    }
  }, [totalPages, fetchPage]);

  const refresh = useCallback(() => {
    setData([]);
    return fetchPage(initialPage, false);
  }, [fetchPage, initialPage]);

  const loadMore = useCallback(() => {
    if (enableInfiniteScroll && hasNextPage) {
      return nextPage();
    }
  }, [enableInfiniteScroll, hasNextPage, nextPage]);

  return {
    ...api,
    data,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    pageSize,
    fetchPage,
    nextPage,
    previousPage,
    goToPage,
    refresh,
    loadMore,
    isLastPage: currentPage === totalPages,
    isFirstPage: currentPage === 1
  };
};

export default { useApi, usePaginatedApi };
