import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import ErrorPage from "../Pages/ErrorPage";
import HomePage from "../Pages/HomePage";
import UpcomingEvents from "../Pages/UpcomingEvents";
import Register from "../Pages/Register";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import AdminRoute from "../PrivateRoute/AdminRoute";
import Login from "../Pages/Login";
import EventDetails from "../Pages/EventDetails";

// Dashboard Pages
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import CreateEvent from "../Pages/CreateEvent";
import ManageEvents from "../Pages/ManageEvents";
import JoinedEvents from "../Pages/JoinedEvents";
import EditEvent from "../Pages/EditEvent";
import ProfileUpdate from "../Components/ProfileUpdate";

import AllUsers from "../Pages/Dashboard/Admin/AllUsers";
import AllEvents from "../Pages/Dashboard/Admin/AllEvent";

import AboutUs from "../Pages/AboutUs";
import ContactUs from "../Pages/ContactUs";
import AllDonations from "../Pages/Dashboard/Admin/AllDonations";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "upcoming-events", element: <UpcomingEvents /> },
      { path: "event-details/:id", element: <EventDetails /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "contact", element: <ContactUs /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "profile-update",
        element: <ProfileUpdate />,
      },
      {
        path: "joined-events",
        element: <JoinedEvents />,
      },

      // --- Admin/Organizer Routes ---
      {
        path: "create-event",
        element: <CreateEvent />,
      },
      {
        path: "manage-events",
        element: <ManageEvents />,
      },
      {
        path: "edit-event/:id",
        element: <EditEvent />,
      },

      // --- Strict Admin Only Routes (Requirement 7 & Role Logic) ---
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-events",
        element: (
          <AdminRoute>
            <AllEvents />
          </AdminRoute>
        ),
      },
      {
        path: "all-donations",
        element: (
          <AdminRoute>
            <AllDonations />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
