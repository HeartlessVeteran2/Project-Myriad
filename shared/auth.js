// Shared authentication logic for web and mobile
export const saveToken = token => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('jwt', token);
  } else if (typeof global !== 'undefined') {
    global.jwt = token;
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('jwt');
  } else if (typeof global !== 'undefined') {
    return global.jwt;
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('jwt');
  } else if (typeof global !== 'undefined') {
    global.jwt = null;
  }
};
