import React from 'react';
import Tasks from '../components/tasks';
import Settings from '../components/SettingsBar';
import PomodoroTimer from '../components/Timer';
import { ThemeProvider } from '../components/ThemeContext';


const Home = () => {
  return (
    <ThemeProvider>
      <div>

        <div>
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