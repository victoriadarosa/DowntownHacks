import React from "react";

const Home = ({ user, onLogout }) => {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Home;