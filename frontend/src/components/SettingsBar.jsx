import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SettingsBar() {
  const [settings, setSettings] = useState({
    theme: "light",
    sound: "alarm",
    autoStart: "false",
    sessionStatus: "active",
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakAfter: 4,
  });

  useEffect(() => {
    fetch("/api/pomodoro/settings")
      .then((response) => response.json())
      .then((data) => setSettings(data))
      .catch((error) => console.error("Error fetching settings:", error));
  }, []);

  return (
    <div className="settings-bar">
      <h2>Settings</h2>
      <form>
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select id="theme" name="theme" value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value })}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="sound">Sound</label>
          <select id="sound" name="sound" value={settings.sound} onChange={(e) => setSettings({ ...settings, sound: e.target.value })}>
            <option value="alarm">Alarm</option>
            <option value="melody">Melody</option>
            <option value="chime">Chime</option>
            <option value="silence">Silence</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="auto-start">Auto Start</label>
          <select id="auto-start" name="auto-start" value={settings.autoStart} onChange={(e) => setSettings({ ...settings, autoStart: e.target.value })}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="session-status">Session Status</label>
          <select id="session-status" name="session-status" value={settings.sessionStatus} onChange={(e) => setSettings({ ...settings, sessionStatus: e.target.value })}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pomodoro-time">Pomodoro Time (minutes)</label>
          <input type="number" id="pomodoro-time" name="pomodoro-time" min="0" value={settings.pomodoroTime} onChange={(e) => setSettings({ ...settings, pomodoroTime: e.target.value })} />
        </div>
        <div className="form-group">
          <label htmlFor="short-break-time">Short Break Time (minutes)</label>
          <input type="number" id="short-break-time" name="short-break-time" min="0" value={settings.shortBreakTime} onChange={(e) => setSettings({ ...settings, shortBreakTime: e.target.value })} />
        </div>
        <div className="form-group">
          <label htmlFor="long-break-time">Long Break Time (minutes)</label>
          <input type="number" id="long-break-time" name="long-break-time" min="0" value={settings.longBreakTime} onChange={(e) => setSettings({ ...settings, longBreakTime: e.target.value })} />
        </div>
        <div className="form-group">
          <label htmlFor="long-break-after">Long Break After (sessions)</label>
          <input type="number" id="long-break-after" name="long-break-after" min="1" value={settings.longBreakAfter} onChange={(e) => setSettings({ ...settings, longBreakAfter: e.target.value })} />
        </div>
      </form>
      <div className="auth-buttons">
        <Link to="/Login">
          <button type="button">Login</button>
        </Link>
        <Link to="/register">
          <button type="button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default SettingsBar;