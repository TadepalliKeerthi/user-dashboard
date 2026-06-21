# User Analytics Dashboard

A comprehensive React.js dashboard application for user analytics and management, built with modern web technologies and responsive design.

## 🚀 Features

### Dashboard Analytics
- **Total Users KPI**: Real-time count of all users
- **Daily Signups Chart**: Interactive line chart showing user growth over the last 30 days
- **Users by Role**: Pie chart displaying Admin/Editor/Viewer distribution
- **Avatar Distribution**: Pie chart displaying profile picture completion rates
- **Signup Time Heatmap**: Visual representation of peak signup hours
- **Recent Users**: List of the 5 newest user registrations

### User Management
- **User List**: Paginated table with search and sorting capabilities
- **User Details**: Comprehensive user profile view with avatar preview
- **Create/Edit Users**: Modal-based user creation and editing
- **Role Filters**: Filter users by Admin, Editor, or Viewer roles
- **Export CSV**: Export user data to CSV format
- **Search & Filter**: Real-time search by name or email
- **Responsive Design**: Mobile-friendly interface

### Technical Features
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Toast Notifications**: User-friendly success and error messages
- **Loading Skeletons**: Smooth loading states for better UX
- **In-Memory Pagination**: Fast client-side pagination
- **Real-time Search**: Instant filtering as you type
- **Sorting**: Multiple sort options (name, date, etc.)
- **Error Handling**: Graceful error states and loading indicators
- **Modern UI**: Clean, professional design with smooth animations

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Modern React with hooks |
| **React Router** | Client-side routing |
| **Recharts** | Beautiful, responsive charts |
| **Axios** | HTTP client for API calls |
| **Date-fns** | Date manipulation utilities |
| **React Toastify** | Toast notifications |
| **React Loading Skeleton** | Loading placeholders |
| **CSS3** | Custom styling with modern features |


## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TadepalliKeerthi/user-dashboard.git
   cd user-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`


## 🚀 Deployment Options

You can deploy this project on any of these platforms:

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"scripts": {
  "deploy": "gh-pages -d build"
}

# Deploy
npm run build
npm run deploy
```

### Netlify

```bash
# Build the project
npm run build

# Drag and drop 'build' folder to Netlify
```

### Vercel

```bash
# Connect GitHub repository to Vercel
# Vercel will auto-deploy on every push to main branch
```
## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.js          # Main dashboard component
│   ├── Dashboard.css         # Dashboard styles
│   ├── MetricCard.js         # KPI metric cards
│   ├── MetricCard.css        # Metric card styles
│   ├── RecentUsers.js        # Recent users list
│   ├── RecentUsers.css       # Recent users styles
│   ├── UserList.js           # User management table
│   ├── UserList.css          # User list styles
│   ├── UserDetail.js         # User detail page
│   ├── UserDetail.css        # User detail styles
│   ├── UserModal.js          # User create/edit modal
│   └── UserModal.css         # Modal styles
├── context/
│   └── ThemeContext.js       # Dark/Light mode context
├── services/
│   └── api.js                # API service layer
├── App.js                    # Main app component
├── App.css                   # Global styles
├── index.js                  # App entry point
└── index.css                 # Base styles
```

## 🔧 API Integration

The application integrates with the MockAPI service for data persistence:

- **Base URL**: `https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1`
- **Endpoints**:
  - `GET /users` - Fetch all users
  - `GET /users/:id` - Fetch single user
  - `POST /users` - Create new user
  - `PUT /users/:id` - Update user
  - `DELETE /users/:id` - Delete user

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with minimal design
- **Responsive Design**: Works seamlessly on all device sizes
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Smooth Animations**: Subtle hover effects and transition animations
- **Toast Notifications**: User-friendly success, error, and warning messages
- **Loading Skeletons**: Smooth placeholder animations while data loads
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: User-friendly loading indicators and spinners
- **Error Handling**: Graceful error messages with actionable fallbacks
- **Search & Filter**: Real-time search with visual filter indicators
- **Pagination**: User-friendly page navigation with page size options
- **Icons**: Visual icons for better user understanding and navigation
- **Color Coding**: Role-based color differentiation (Admin/Editor/Viewer)
- **Focus States**: Clear visual indicators for keyboard navigation
  

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px


## 🧪 Testing

To run the test suite:
```bash
npm test
```

## 📝 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## 📄 License
This project is open source and available under the MIT License.

