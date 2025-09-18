import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppWrapper } from './store/AppProviders';
import SignIn from './components/Login/SignIn';
import Products from './components/Configuration/ProductType/Products';
import AddProductType from './components/Configuration/ProductType/AddProductType';
//import ApplicationFormPage from "./components/common/ApplicationForm";
import MainLayout from './MainLayout';
import Dashboard from './components/Dashboard';
import NotificationList from './NotificationList';
import Profile from './components/Profile/Profile';
import ProfileUpdate from './components/Profile/ProfileUpdate';
import CrudTable from './components/Curd/CrudTable';
import Product from './components/Configuration/ProductGroup/Product';
import Home from './components/Home';
import VendorList from './components/Vendor/VendorList';
import VendorFormV2 from './components/VendorFormV2/VendorFormV2';
import ChatUI from './components/ChatUI/ChatUI';

const AppContent: React.FC = () => (
  <Routes>
    <Route path="/login" element={<SignIn />} />
    <Route element={<MainLayout />}>
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<ChatUI />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/update" element={<ProfileUpdate />} />
      <Route path="/notifications" element={<NotificationList />} />
      {/* <Route path="/form" element={<ApplicationFormPage onCancel={() => window.history.back()} />} /> */}
      <Route path="/form" element={<CrudTable />} />
      <Route path="/vendorform" element={<VendorFormV2 />} />
      <Route path="/dashboard/analytics" element={<Dashboard />} />
      <Route path="/vendor" element={<VendorList />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<AddProductType />} />
      <Route path="/productGroup" element={<Product />} />
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
