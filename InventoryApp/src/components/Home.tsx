import React from "react";
import MainLayout from "../MainLayout";
import "../App.css"; // Import your CSS file
import ProductTable from "./Product/ProductTable";

const Home: React.FC = () => {
  return (
    <MainLayout>
      {/* Removed centering div to align ProductTable flush with main content */}
      <ProductTable />
    </MainLayout>
  );
};

export default Home;