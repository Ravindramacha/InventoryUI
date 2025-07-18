import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./components/SignIn"; // Import your SignIn component
import "./App.css"; // Import your CSS file
import ProductTable from "./components/Product/ProductTable";
import MaterialForm from "./components/Product/MaterialForm";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} /> {/* Centered SignIn */}
          <Route path="/home" element={<ProductTable />} />
           <Route path="/Product" element={<MaterialForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
