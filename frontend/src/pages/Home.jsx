import React from 'react';
import Tasks from '../components/tasks';
import Settings from '../components/SettingsBar';


const Home = () => {
  return (
    <div>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Home Page</h1>
        <Tasks />
      </div>
      
      <div>
        <Settings />
      </div>
    </div>
  );
};

export default Home;