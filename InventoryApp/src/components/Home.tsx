import React from "react";

import { useLanguages } from "../api/ApiQueries";

const Home: React.FC = () => {
  const { data: languages, isLoading, isError, error } = useLanguages(); 
  if (isLoading) return <p>Loading languages...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  console.log("Languages data:", languages);
  return (
    <div>
      <h2>Available Languages</h2>
      <ul>
        {languages?.map((lang) => (
          <li key={lang.languageCode}>{lang.languageDesc}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;