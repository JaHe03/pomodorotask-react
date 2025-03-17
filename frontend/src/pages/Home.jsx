import React from 'react';
import Tasks from '../components/tasks';
import Settings from '../components/SettingsBar';
import PomodoroTimer from '../components/Timer';
import { ThemeProvider } from '../components/ThemeContext';


const Home = () => {
  return (
    <ThemeProvider>
      <div>

        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">Home Page</h1>
          <Tasks />
        </div>

        <div>
          <Settings />
        </div>
        
        <div>

          <PomodoroTimer />
        </div>

      </div>
    </ThemeProvider>
  );
}

export default Home;