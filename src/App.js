import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import BookingPage from "./pages/Booking/Book";
import Notfound from "./pages/Notfound/Notfound";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import OwnerDashboard from "./pages/OwnerDashboard/OwnerDashboard";
import AddCourtPage from "./pages/OwnerDashboard/AddCourtPage";
import EditCourtPage from "./pages/OwnerDashboard/EditCourtPage";
import Explore from "./pages/Explore";
import CourtDetails from "./pages/CourtDetails/CourtDetails";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import MyBookings from "./pages/MyBookings";

const router = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },

      {
        path: "bookings",
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },

      { path: "explore", element: <Explore /> },

      { path: "courts/:id", element: <CourtDetails /> },

      {
        path: "book/:courtId",
        element: (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // Owner Dashboard
      {
        path: "owner",
        element: (
          <ProtectedRoute allowedRoles={["Owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/add-court",
        element: (
          <ProtectedRoute allowedRoles={["Owner"]}>
            <AddCourtPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/edit-court/:courtId",
        element: (
          <ProtectedRoute allowedRoles={["Owner"]}>
            <EditCourtPage />
          </ProtectedRoute>
        ),
      },

      // Auth
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // 404
      { path: "*", element: <Notfound /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;