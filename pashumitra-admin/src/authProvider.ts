import { AuthProvider } from 'react-admin';

// Define the authProvider
const authProvider: AuthProvider = {
  // Login function: Authenticate the user
  login: ({ username, password }) => {
    if (username === 'admin' && password === 'admin123') {
      // If credentials match, return a successful login
      localStorage.setItem('auth', 'true');
      return Promise.resolve();
    }
    // If credentials don't match, reject the login attempt
    return Promise.reject('Invalid username or password');
  },

  // Logout function: Clear authentication data
  logout: () => {
    localStorage.removeItem('auth');
    return Promise.resolve();
  },

  // Check if the user is authenticated
  checkAuth: () => {
    return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
  },

  // Check user permissions (optional for more advanced control)
  checkError: (error) => {
    // Handle errors from the API here
    return Promise.resolve();
  },

  // Get user identity (optional)
  getIdentity: () => {
    return Promise.resolve({ id: 'admin', fullName: 'Admin User' });
  },

  // Get user permissions (optional)
  getPermissions: () => Promise.resolve(),
};

export default authProvider;
