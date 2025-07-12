import { useState, useEffect } from 'react';
import NetInfo from '@react-native-async-storage/async-storage';

/**
 * Custom hook to monitor network connectivity status
 * @returns {Object} Network status information
 */
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState(null);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      setIsInternetReachable(state.isInternetReachable);
    });

    // Get initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return {
    isConnected,
    connectionType,
    isInternetReachable,
    isOnline: isConnected && isInternetReachable
  };
};

export default useNetworkStatus;
