import React, { useState, useEffect } from 'react';
import api from '../api';

const PomodoroTimer = () => {
  const [timerMode, setTimerMode] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [settings, setSettings] = useState({
    pomodoroMinutes: 25,
    pomodoroSeconds: 0,
    shortBreakMinutes: 5,
    shortBreakSeconds: 0,
    longBreakMinutes: 15,
    longBreakSeconds: 0,
    longBreakAfterLimit: 4
  });

  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/pomodoro/settings/');
        const settingsData = response.data;
        
        setSettings({
          pomodoroMinutes: settingsData.pomodoro_minutes,
          pomodoroSeconds: settingsData.pomodoro_seconds,
          shortBreakMinutes: settingsData.short_break_minutes,
          shortBreakSeconds: settingsData.short_break_seconds,
          longBreakMinutes: settingsData.long_break_minutes,
          longBreakSeconds: settingsData.long_break_seconds,
          longBreakAfterLimit: settingsData.long_break_after_limit
        });
        
        // Initialize timer with fetched pomodoro duration
        setTimeLeft({ 
          minutes: settingsData.pomodoro_minutes, 
          seconds: settingsData.pomodoro_seconds 
        });
      } catch (err) {
        console.error('Error fetching settings:', err);
        // Use default values if settings can't be fetched
      }
    };
    
    fetchSettings();
  }, []);

  // Timer logic
  useEffect(() => {
    let intervalId;
    
    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          // If time is up
          if (prev.minutes === 0 && prev.seconds === 0) {
            // Stop the timer
            setIsRunning(false);
            
            // Handle session completion
            if (timerMode === 'pomodoro') {
              const newSessionsCompleted = sessionsCompleted + 1;
              setSessionsCompleted(newSessionsCompleted);
              
              // Determine next timer mode
              if (newSessionsCompleted % settings.longBreakAfterLimit === 0) {
                setTimerMode('longBreak');
                setTimeLeft({ 
                  minutes: settings.longBreakMinutes, 
                  seconds: settings.longBreakSeconds 
                });
              } else {
                setTimerMode('shortBreak');
                setTimeLeft({ 
                  minutes: settings.shortBreakMinutes, 
                  seconds: settings.shortBreakSeconds 
                });
              }
            } else {
              // After a break, go back to pomodoro
              setTimerMode('pomodoro');
              setTimeLeft({ 
                minutes: settings.pomodoroMinutes, 
                seconds: settings.pomodoroSeconds 
              });
            }
            
            // Play notification sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            
            return prev;
          }
          
          // Normal time decrement
          if (prev.seconds === 0) {
            return { minutes: prev.minutes - 1, seconds: 59 };
          }
          return { minutes: prev.minutes, seconds: prev.seconds - 1 };
        });
      }, 1000);
    }
    
    return () => clearInterval(intervalId);
  }, [isRunning, timerMode, sessionsCompleted, settings]);

  const handleModeChange = (mode) => {
    setIsRunning(false);
    setTimerMode(mode);
    
    // Reset timer based on mode
    if (mode === 'pomodoro') {
      setTimeLeft({ 
        minutes: settings.pomodoroMinutes, 
        seconds: settings.pomodoroSeconds 
      });
    } else if (mode === 'shortBreak') {
      setTimeLeft({ 
        minutes: settings.shortBreakMinutes, 
        seconds: settings.shortBreakSeconds 
      });
    } else if (mode === 'longBreak') {
      setTimeLeft({ 
        minutes: settings.longBreakMinutes, 
        seconds: settings.longBreakSeconds 
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    
    // Reset to current mode's initial time
    if (timerMode === 'pomodoro') {
      setTimeLeft({ 
        minutes: settings.pomodoroMinutes, 
        seconds: settings.pomodoroSeconds 
      });
    } else if (timerMode === 'shortBreak') {
      setTimeLeft({ 
        minutes: settings.shortBreakMinutes, 
        seconds: settings.shortBreakSeconds 
      });
    } else if (timerMode === 'longBreak') {
      setTimeLeft({ 
        minutes: settings.longBreakMinutes, 
        seconds: settings.longBreakSeconds 
      });
    }
  };

  // Format time as MM:SS
  const formattedTime = `${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-4">PomodoroTasks</h1>
      
      <p className="text-center text-lg mb-10 max-w-lg">
        The Pomodoro technique is a time management method where you set a specific 
        amount of time to work on a task. After the time is up, you take a short break! You 
        repeat this process for a certain number of cycles, followed by a longer break.
      </p>
      
      <h2 className="text-3xl mb-4">Time to work!</h2>
      
      <div className="flex gap-4 mb-8">
        <button 
          className={`px-4 py-2 rounded ${timerMode === 'pomodoro' ? 'bg-[#2c6152]' : 'bg-[#3a3b45]'} hover:bg-[#2a7a67]`}
          onClick={() => handleModeChange('pomodoro')}
        >
          Pomodoro
        </button>
        <button 
          className={`px-4 py-2 rounded ${timerMode === 'shortBreak' ? 'bg-[#2c6152]' : 'bg-[#3a3b45]'} hover:bg-[#2a7a67]`}
          onClick={() => handleModeChange('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={`px-4 py-2 rounded ${timerMode === 'longBreak' ? 'bg-[#2c6152]' : 'bg-[#3a3b45]'} hover:bg-[#2a7a67]`}
          onClick={() => handleModeChange('longBreak')}
        >
          Long Break
        </button>
      </div>
      
      <div className="text-8xl font-bold mb-8">
        {formattedTime}
      </div>
      
      <div className="flex gap-4 mb-10">
        <button 
          className="px-6 py-2 bg-[#2c6152] rounded hover:bg-[#2a7a67]"
          onClick={toggleTimer}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
          className="px-6 py-2 bg-[#2c6152] rounded hover:bg-[#2a7a67]"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      
      <div className="text-2xl">
        Sessions Completed: {sessionsCompleted}
      </div>
    </div>
  );
};

export default PomodoroTimer;