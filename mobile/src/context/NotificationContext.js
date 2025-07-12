import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Action types
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION'
};

// Initial state
const initialState = {
  notifications: []
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload.id
        )
      };

    case NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload.updates }
            : notification
        )
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: []
      };

    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Generate unique ID for notifications
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = generateId();
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      autoClose: true,
      duration: 5000,
      createdAt: Date.now(),
      ...notification
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: newNotification
    });

    // Auto-remove notification if autoClose is enabled
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: { id }
    });
  }, []);

  // Update notification
  const updateNotification = useCallback((id, updates) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION,
      payload: { id, updates }
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title: 'Success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title: 'Error',
      message,
      autoClose: false, // Errors should be manually dismissed
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title: 'Warning',
      message,
      duration: 7000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title: 'Info',
      message,
      ...options
    });
  }, [addNotification]);

  // Show loading notification with update capability
  const showLoading = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title: 'Loading...',
      message,
      autoClose: false,
      showSpinner: true,
      ...options
    });
  }, [addNotification]);

  // Update loading notification to success/error
  const updateLoading = useCallback((id, type, message, options = {}) => {
    updateNotification(id, {
      type,
      title: type === NOTIFICATION_TYPES.SUCCESS ? 'Success' : 'Error',
      message,
      showSpinner: false,
      autoClose: type === NOTIFICATION_TYPES.SUCCESS,
      duration: type === NOTIFICATION_TYPES.SUCCESS ? 3000 : undefined,
      ...options
    });
  }, [updateNotification]);

  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    updateNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateLoading,
    // Utility getters
    hasNotifications: state.notifications.length > 0,
    errorCount: state.notifications.filter(n => n.type === NOTIFICATION_TYPES.ERROR).length,
    warningCount: state.notifications.filter(n => n.type === NOTIFICATION_TYPES.WARNING).length
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
