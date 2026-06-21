# User Dashboard

Practical Assessment Test FE – Zymr Interview Process

A comprehensive React.js dashboard application for user analytics and management, built with modern web technologies and responsive design. This project was implemented as part of the Frontend practical assessment for the Zymr interview process.

## 🚀 Features

### Dashboard Analytics
- **Total Users KPI**: Real-time count of all users
- **Daily Signups Chart**: Interactive line chart showing user growth over the last 30 days
- **Avatar Distribution**: Pie chart displaying profile picture completion rates
- **Signup Time Heatmap**: Visual representation of peak signup hours
- **Recent Users**: List of the 5 newest user registrations

### User Management
- **User List**: Paginated table with search and sorting capabilities
- **User Details**: Comprehensive user profile view with avatar preview
- **Create/Edit Users**: Modal-based user creation and editing
- **Search & Filter**: Real-time search by name or email
- **Responsive Design**: Mobile-friendly interface

### Technical Features
- **In-Memory Pagination**: Fast client-side pagination
- **Real-time Search**: Instant filtering as you type
- **Sorting**: Multiple sort options (name, date, etc.)
- **Error Handling**: Graceful error states and loading indicators
- **Modern UI**: Clean, professional design with smooth animations

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Recharts** - Beautiful, responsive charts
- **Axios** - HTTP client for API calls
- **Date-fns** - Date manipulation utilities
- **CSS3** - Custom styling with modern features

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
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

## 🚀 Deployment

### GitHub Pages
1. Install gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add deploy script to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d build"
   }
   ```

3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

### Netlify
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to Netlify

### Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch

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
├── services/
│   └── api.js                # API service layer
├── App.js                    # Main app component
├── App.css                   # Global styles
├── index.js                  # App entry point
└── index.css                 # Base styles
```

## 🔧 API Integration

The application integrates with the MockAPI service:
- **Base URL**: `https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1`
- **Endpoints**:
  - `GET /users` - Fetch all users
  - `GET /users/:id` - Fetch single user
  - `POST /users` - Create new user
  - `PUT /users/:id` - Update user
  - `DELETE /users/:id` - Delete user

## 🎨 Design Features

- **Modern UI**: Clean, professional interface
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Subtle hover effects and transitions
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages and fallbacks

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🚀 Performance Features

- **Code Splitting**: Lazy loading of components
- **Optimized Images**: Proper image handling and fallbacks
- **Efficient Rendering**: React.memo and useMemo optimizations
- **Bundle Optimization**: Tree shaking and minification

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

