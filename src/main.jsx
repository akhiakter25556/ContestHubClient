import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import AppLayout from './components/AppLayout.jsx'
import Home from './components/pages/Home.jsx'
import AllContests from './components/pages/AllContests.jsx'
import ContestDetails from './components/pages/ContestDetails.jsx'
import Rankings from './components/Rankings.jsx'
import Leaderboard from './components/pages/Leaderboard.jsx'
import About from './components/pages/About.jsx'
import Help from './components/pages/Help.jsx'
import Packages from './components/pages/Packages.jsx'
import Login from './components/pages/Login.jsx'
import Register from './components/pages/Register.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import NotFound from './components/pages/NotFound.jsx'
import AuthProvider from './components/pages/Context/AuthProvider.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-contests", element: <AllContests /> },
      { path: "contest/:id", element: <ContestDetails /> },
      { path: "rankings", element: <Rankings /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "about", element: <About /> },
      { path: "help", element: <Help /> },
      { path: "packages", element: <Packages /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <AuthProvider>  <RouterProvider router={router} /></AuthProvider>
      <ToastContainer position="top-center" autoClose={2000} />
    </ThemeProvider>
  </StrictMode>
)
