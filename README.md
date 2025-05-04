# PocketWise - Student Pocket Money Manager

PocketWise is a comprehensive web application designed to help students manage their pocket money, track expenses, set savings goals, and develop healthy financial habits.

## Features

- **User Authentication**: Secure signup and login
- **Dashboard**: Overview of balance, income, expenses, and savings
- **Transaction Management**: Add and categorize income and expenses
- **Receipt Uploads**: Attach photos of receipts to transactions
- **Custom Categories**: Create personalized spending categories
- **Savings Goals**: Set targets and track progress
- **Budget Alerts**: Get notifications when nearing spending limits
- **Reports**: Generate and export financial reports (CSV/PDF)
- **Multiple Currencies**: Support for USD, EUR, GBP, JPY, and INR
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
pocketwise/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── goalController.js
│   │   ├── notificationController.js
│   │   ├── reportController.js
│   │   └── transactionController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Goal.js
│   │   ├── Notification.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── reportRoutes.js
│   │   └── transactionRoutes.js
│   ├── uploads/
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── favicon.ico
    ├── src/
    │   ├── components/
    │   │   ├── AddCategory.js
    │   │   ├── AddGoal.js
    │   │   ├── AddTransaction.js
    │   │   ├── Footer.js
    │   │   ├── Navbar.js
    │   │   ├── NotificationBar.js
    │   │   ├── ProtectedRoute.js
    │   │   └── Report.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Transactions.js
    │   │   ├── Goals.js
    │   │   ├── Categories.js
    │   │   └── Reports.js
    │   ├── App.js
    │   ├── api.js
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd pocketwise/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
MONGO_URI=mongodb://127.0.0.1:27017/pocketwise
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd pocketwise/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

5. Open your browser and go to:
```
http://localhost:3000
```

## Dependencies

### Backend
- express
- mongoose
- bcryptjs
- jsonwebtoken
- multer
- cors
- dotenv
- json2csv
- pdfkit

### Frontend
- react
- react-router-dom
- axios
- chart.js
- react-chartjs-2
- react-toastify
- font-awesome (via CDN)

## Usage

1. Register a new account
2. Add custom categories for your expenses
3. Add transactions (income and expenses)
4. Create savings goals and track your progress
5. Generate reports for analysis or sharing

## New Features

- **Full-Width Design**: Beautiful, modern UI with edge-to-edge layout
- **Enhanced Password Security**: Visible password toggle for better UX
- **Currency Support**: Choose from 5 major currencies
- **Visual Progress Tracking**: Interactive charts and progress bars
- **Enhanced Notifications**: Real-time budget alerts and progress updates
- **Improved Error Handling**: Better error messages and validation

## Technical Highlights

- **Authentication**: Secure JWT-based authentication
- **File Upload**: Image upload functionality for receipts
- **Responsive Design**: Mobile-first approach using Bootstrap
- **API Integration**: RESTful API with proper error handling
- **Data Visualization**: Beautiful charts using Chart.js
- **Export Functionality**: Generate PDF and CSV reports
- **Budget Management**: Dynamic budget tracking and alerts


## Future Improvements

- Email notifications
- Dark mode
- Group expenses sharing
- Investment tracking
- Deploying online
- Budget planning tools
- Integration with banking APIs
- AI-powered expense categorization