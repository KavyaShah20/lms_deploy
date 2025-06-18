
import './App.css'
import { Button } from './components/ui/button'
import Navbar from './components/Navbar'
import Login from './Pages/Login'
import HeroSection from './Pages/student/HeroSection'
import MainLayout from './layout/MainLayout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Courses from './Pages/student/Courses'
import MyLearning from './Pages/student/MyLearning'
import Profile from './Pages/student/Profile'
import Sidebar from './Pages/admin/Sidebar'
import Dashboard from './Pages/admin/Dashboard'
import CourseTable from './Pages/admin/course/CourseTable'
import AddCourse from './Pages/admin/course/AddCourse'
import EditCourse from './Pages/admin/course/EditCourse'
import CreateLecture from './Pages/admin/lecture/CreateLecture'
import EditLecture from './Pages/admin/lecture/EditLecture'
import CourseDetail from './Pages/student/CourseDetail'
import CourseProgress from './Pages/student/CourseProgress'
import SearchPage from './Pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectRoute } from './components/ProtectedRoutes'
import { ThemeProvider } from './components/ThemeProvider.jsx'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: 'login',
        element: <AuthenticatedUser><Login /></AuthenticatedUser>
      },
      {
        path: 'my-learning',
        element: <ProtectRoute><MyLearning /></ProtectRoute>
      },
      {
        path: 'profile',
        element: <ProtectRoute><Profile /></ProtectRoute>
      },
      {
        path: 'course/search',
        element: <ProtectRoute><SearchPage /></ProtectRoute>
      },
      {
        path: 'course-detail/:courseId',
        element: <ProtectRoute><CourseDetail /></ProtectRoute>
      },
      {
        path: 'course-progress/:courseId',
        element: <ProtectRoute><CourseProgress /></ProtectRoute>
      },

      //Admin
      {
        path: 'admin',
        element: <AdminRoute><Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: 'courses',
            element: <CourseTable />
          },
          {
            path: 'courses/create',
            element: <AddCourse />
          },
          {
            path: 'courses/:courseId',
            element: <EditCourse />
          },
          {
            path: 'courses/:courseId/lecture',
            element: <CreateLecture />
          },
          {
            path: 'courses/:courseId/lecture/:lectureId',
            element: <EditLecture />
          },
        ]
      }
    ],
  }
])
function App() {


  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
