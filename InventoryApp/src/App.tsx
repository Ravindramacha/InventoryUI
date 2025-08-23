import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppWrapper } from './store/AppProviders';
import SignIn from "./components/Login/SignIn";
import Products from "./components/Product/Products";
import ApplicationFormPage from "./components/common/ApplicationForm";
import MainLayout from "./MainLayout";
import Dashboard from "./components/Dashboard";
import NotificationList from "./NotificationList";
import Profile from "./components/Profile/Profile";
import ProfileUpdate from "./components/Profile/ProfileUpdate";
import VendorForm from "./components/common/VendorForm";
import CrudTable from "./components/Curd/CrudTable";
import Product from "./components/Configuration/Product/Product";


const AppContent: React.FC = () => (
  <Routes>
    <Route path="/" element={<SignIn />} />
    <Route element={<MainLayout />}>
      <Route path="/home" element={<CrudTable />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/update" element={<ProfileUpdate />} />
      <Route path="/notifications" element={<NotificationList />} />
      <Route path="/form" element={<ApplicationFormPage onCancel={() => window.history.back()} />} />
      <Route path="/dashboard/analytics" element={<Dashboard/>} />
      <Route path="/vendor" element={<VendorForm/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/productGroup" element={<Product/>} />
    </Route>
  </Routes>
);

const App: React.FC = () => {
  return (
    <AppWrapper>
      <AppContent />
    </AppWrapper>
  );
};

export default App;
