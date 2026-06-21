import axios from 'axios';

const API_BASE_URL = 'https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper function to assign random role
const getRandomRole = () => {
  const roles = ['Admin', 'Editor', 'Viewer'];
  return roles[Math.floor(Math.random() * roles.length)];
};

// Generate sample users with different dates
const generateSampleUsers = () => {
  const names = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh',
    'Ananya Gupta', 'Kiran Rao', 'Deepak Nair', 'Meera Iyer', 'Arjun Reddy',
    'Divya Menon', 'Suresh Babu', 'Lakshmi Nair', 'Gopal Krishna', 'Radha Devi',
    'Karthik Raj', 'Swathi Nair', 'Manoj Kumar', 'Anjali Menon', 'Ravi Teja'
  ];
  
  const roles = ['Admin', 'Editor', 'Viewer'];
  
  return names.map((name, index) => {
    // Create dates spread over last 30 days
    const date = new Date();
    date.setDate(date.getDate() - (index * 1.5));
    
    return {
      id: `${index + 100}`,
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      role: roles[index % 3],
      avatar: index % 2 === 0 ? `https://i.pravatar.cc/150?img=${index + 1}` : '',
      createdAt: date.toISOString()
    };
  });
};

export const userService = {
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      // Add role field to each user
      const usersWithRoles = response.data.map(user => ({
        ...user,
        role: user.role || getRandomRole(),
        createdAt: user.createdAt || new Date().toISOString()
      }));
      
      // If less than 10 users, add sample users
      if (usersWithRoles.length < 10) {
        const sampleUsers = generateSampleUsers();
        return [...usersWithRoles, ...sampleUsers];
      }
      
      return usersWithRoles;
    } catch (error) {
      // If API fails, return mock data with roles
      return generateSampleUsers();
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return {
        ...response.data,
        role: response.data.role || getRandomRole()
      };
    } catch (error) {
      throw new Error(`Failed to fetch user ${id}: ${error.message}`);
    }
  },

  async createUser(userData) {
    try {
      const newUser = {
        ...userData,
        role: userData.role || getRandomRole(),
        createdAt: new Date().toISOString()
      };
      const response = await api.post('/users', newUser);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user ${id}: ${error.message}`);
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete user ${id}: ${error.message}`);
    }
  }
};

export default api;