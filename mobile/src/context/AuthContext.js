import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action types
export const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  RESTORE_SESSION: 'RESTORE_SESSION'
};

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionExpiry: null
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        sessionExpiry: action.payload.sessionExpiry,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        sessionExpiry: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState
      };

    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        sessionExpiry: action.payload.sessionExpiry,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user }
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        sessionExpiry: action.payload.sessionExpiry,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children, apiService }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [
          storedUser,
          storedToken,
          storedRefreshToken,
          storedExpiry
        ] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('refreshToken'),
          AsyncStorage.getItem('sessionExpiry')
        ]);

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          const sessionExpiry = storedExpiry ? parseInt(storedExpiry) : null;
          const isTokenValid = !sessionExpiry || Date.now() < sessionExpiry;

          if (isTokenValid) {
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: {
                user,
                token: storedToken,
                refreshToken: storedRefreshToken,
                sessionExpiry,
                isAuthenticated: true
              }
            });
          } else {
            // Token expired, try to refresh
            if (storedRefreshToken) {
              await refreshToken(storedRefreshToken);
            } else {
              await logout();
            }
          }
        } else {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: {
              user: null,
              token: null,
              refreshToken: null,
              sessionExpiry: null,
              isAuthenticated: false
            }
          });
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: {
            user: null,
            token: null,
            refreshToken: null,
            sessionExpiry: null,
            isAuthenticated: false
          }
        });
      }
    };

    restoreSession();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (state.sessionExpiry && state.refreshToken) {
      const timeUntilExpiry = state.sessionExpiry - Date.now();
      const refreshTime = Math.max(timeUntilExpiry - 300000, 60000); // Refresh 5 minutes before expiry

      const timer = setTimeout(() => {
        refreshToken(state.refreshToken);
      }, refreshTime);

      return () => clearTimeout(timer);
    }
  }, [state.sessionExpiry, state.refreshToken]);

  // Auth actions
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await apiService.login(credentials);
      const { user, token, refreshToken, expiresIn } = response;
      
      const sessionExpiry = Date.now() + (expiresIn * 1000);

      // Store session data
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(user)),
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('refreshToken', refreshToken),
        AsyncStorage.setItem('sessionExpiry', sessionExpiry.toString())
      ]);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token, refreshToken, sessionExpiry }
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if available
      if (apiService.logout && state.token) {
        await apiService.logout(state.token);
      }
    } catch (error) {
      console.error('Error during logout API call:', error);
    } finally {
      // Clear stored data
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('refreshToken'),
        AsyncStorage.removeItem('sessionExpiry')
      ]);

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const refreshToken = async (refresh_token) => {
    try {
      const response = await apiService.refreshToken(refresh_token);
      const { token, expiresIn } = response;
      
      const sessionExpiry = Date.now() + (expiresIn * 1000);

      await Promise.all([
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('sessionExpiry', sessionExpiry.toString())
      ]);

      dispatch({
        type: AUTH_ACTIONS.REFRESH_TOKEN,
        payload: { token, sessionExpiry }
      });

      return response;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await logout();
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiService.updateProfile(profileData, state.token);
      const { user } = response;

      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: { user }
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await apiService.register(userData);
      // Auto-login after successful registration
      if (response.autoLogin) {
        const { user, token, refreshToken, expiresIn } = response;
        const sessionExpiry = Date.now() + (expiresIn * 1000);

        await Promise.all([
          AsyncStorage.setItem('user', JSON.stringify(user)),
          AsyncStorage.setItem('token', token),
          AsyncStorage.setItem('refreshToken', refreshToken),
          AsyncStorage.setItem('sessionExpiry', sessionExpiry.toString())
        ]);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token, refreshToken, sessionExpiry }
        });
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: null }
        });
      }

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    refreshToken,
    updateProfile,
    isTokenExpired: state.sessionExpiry ? Date.now() >= state.sessionExpiry : false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
