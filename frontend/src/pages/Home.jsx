import React from 'react';
import Tasks from '../components/tasks';

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      <Tasks />
    </div>
  );
};

export default Home;