import React from "react";
import MainLayout from "../MainLayout";
import "../App.css"; // Import your CSS file

const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="center-container">
      <h1>Welcome to the Home Page 1</h1>
      <p>This is a protected page with a sidebar and logout.</p>
      </div>
    </MainLayout>
  );
};

export default Home;