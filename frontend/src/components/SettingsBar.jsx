import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../api";
import { ThemeContext } from "./ThemeContext";

const SettingsBar = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [shortBreakSeconds, setShortBreakSeconds] = useState(0);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [longBreakSeconds, setLongBreakSeconds] = useState(0);
  const [longBreakAfterLimit, setLongBreakAfterLimit] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);

  // Fetch settings when component mounts
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle clicks outside the sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        // Only close if the click is not on the open settings button
        if (!event.target.closest(".open-settings-btn")) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/pomodoro/settings/");
      const settings = response.data;

      // Update state with fetched settings
      setPomodoroMinutes(settings.pomodoro_minutes);
      setPomodoroSeconds(settings.pomodoro_seconds);
      setShortBreakMinutes(settings.short_break_minutes);
      setShortBreakSeconds(settings.short_break_seconds);
      setLongBreakMinutes(settings.long_break_minutes);
      setLongBreakSeconds(settings.long_break_seconds);
      setLongBreakAfterLimit(settings.long_break_after_limit);
      updateTheme(settings.theme);


      setLoading(false);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Failed to load settings");
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await api.put("/api/pomodoro/settings/", {
        pomodoro_minutes: pomodoroMinutes,
        pomodoro_seconds: pomodoroSeconds,
        short_break_minutes: shortBreakMinutes,
        short_break_seconds: shortBreakSeconds,
        long_break_minutes: longBreakMinutes,
        long_break_seconds: longBreakSeconds,
        long_break_after_limit: longBreakAfterLimit,
        theme: theme.toLowerCase(),
      });
      setLoading(false);
    } catch (err) {
      console.error("Error saving settings:", err);
      console.error('Error details:', err.response?.data);
      setError("Failed to save settings");
      setLoading(false);
    }
  };

  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    saveSettings();
    setIsOpen(false);
  };

  const logOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        className="fixed top-5 right-5 bg-[var(--bg-button)] text-white py-2 px-4 rounded hover:bg-[var(--bg-button-hover)] z-40 open-settings-btn"
        onClick={toggleSettings}
      >
        Open Settings
      </button>

      {/* Settings Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-[350px] bg-[var(--bg-sidebar)] text-[var(--text-primary)] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button
              onClick={handleClose}
              className="bg-[var(--bg-button)] text-white w-8 h-8 rounded flex items-center justify-center hover:bg-[var(--bg-button-hover)]"
            >
              x
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={saveSettings}
              className="bg-[var(--bg-button)] text-white py-2 px-6 rounded hover:bg-[var(--bg-button-hover)]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button 
              className="flex-1 bg-[var(--bg-button)] text-white py-1 px-4 rounded hover:bg-[var(--bg-button-hover)]"
              onClick={logOut}  
            >
              Log out
            </button>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 mb-4 rounded">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="flex items-center flex-wrap gap-2">
              <label className="min-w-[160px]">
                Pomodoro Length (Minutes):
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={pomodoroMinutes}
                onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                className="bg-[var(--bg-button)] text-white rounded w-16 p-2 text-center"
              />
              <label>Seconds:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={pomodoroSeconds}
                onChange={(e) => setPomodoroSeconds(Number(e.target.value))}
                className="bg-[var(--bg-button)] text-white rounded w-16 p-2 text-center"
              />
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <label className="min-w-[160px]">Break Length (Minutes):</label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakMinutes}
                onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                className="bg-[var(--bg-button)] text-white rounded w-16 p-2 text-center"
              />
              <label>Seconds:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={shortBreakSeconds}
                onChange={(e) => setShortBreakSeconds(Number(e.target.value))}
                className="bg-[var(--bg-button)] text-white rounded w-16 p-2 text-center"
              />
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <label className="min-w-[160px]">
                Long Break Length (Minutes):
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreakMinutes}
                onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                className="bg-[var(--bg-button)] text-white rounded w-16 p-2 text-center"
              />
              <label>Seconds:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={longBreakSeconds}
                onChange={(e) => setLongBreakSeconds(Number(e.target.value))}
                className="bg-[var(--bg-button)] text-white rounded w-16 p-2 text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="min-w-[160px]">Long Break Interval:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={longBreakAfterLimit}
                onChange={(e) => setLongBreakAfterLimit(Number(e.target.value))}
                className="bg-[var(--bg-button)] text-white rounded p-2 w-full text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="min-w-[160px]">Theme:</label>
              <select
                value={theme}
                onChange={(e) => updateTheme(e.target.value)}
                className="bg-[var(--bg-button)] text-white rounded p-2 w-32"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end"></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;
