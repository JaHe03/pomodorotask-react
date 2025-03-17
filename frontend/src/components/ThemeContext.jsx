import { createContext, useState, useEffect } from "react";
import api from "../api";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTheme = async () => {
          try {
            setLoading(true);
            const response = await api.get('/api/pomodoro/settings/');
            const settings = response.data;
            
            const savedTheme = settings.theme || 'light';
            setTheme(savedTheme);
            document.body.dataset.theme = savedTheme.toLowerCase();
            
            setLoading(false);
          } catch (err) {
            console.error('Error fetching theme settings:', err);
            // Fallback to Light theme if fetch fails
            setTheme('light');
            document.body.dataset.theme = 'light';
            setLoading(false);
          }
        };
        
        fetchTheme();
      }, []);

      const updateTheme = async (newTheme) => { 
        try {
          setTheme(newTheme);
          document.body.dataset.theme = newTheme.toLowerCase();

          const currentSettings = await api.get('/api/pomodoro/settings/');
          const settings = currentSettings.data;

          // Send update with all required fields
          const res = await api.put('/api/pomodoro/settings/', {
            pomodoro_minutes: settings.pomodoro_minutes,
            pomodoro_seconds: settings.pomodoro_seconds,
            short_break_minutes: settings.short_break_minutes,
            short_break_seconds: settings.short_break_seconds,
            long_break_minutes: settings.long_break_minutes,
            long_break_seconds: settings.long_break_seconds,
            long_break_after_limit: settings.long_break_after_limit,
            theme: newTheme.toLowerCase(),
          });

          if(res.status === 200){
            console.log('Theme updated successfully');
          }else{
              console.error('Failed to update theme');
            }
          }catch(err){
            console.error('Error updating theme:', err);
            console.error('Error details:', err.response?.data);
          }
        };



    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
  )
}