import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./components/SignIn"; // Import your SignIn component
import Products from "./components/Product/Products"; // Import your Products component
import ApplicationFormPage from "./components/ApplicationForm";
import Home from "./components/Home"; // Import your Home component
import MainLayout from "./MainLayout";
import Dashboard from "./components/Dashboard"; // Import your Dashboard component
import NotificationList from "./NotificationList";
import Profile from "./components/Profile";
import ProfileUpdate from "./components/ProfileUpdate";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/update" element={<ProfileUpdate />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/form" element={<ApplicationFormPage />} />
            <Route path="/dashboard/analytics" element={<Dashboard/>} />
            <Route path="/dashboard/reports" element={<Dashboard/>} />
            <Route path="/products" element={<Products/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
