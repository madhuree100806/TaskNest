import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import TodoPage from "./pages/TodoPage";
import BirthdayPage from "./pages/BirthdayPage";
import ResourcePage from "./pages/ResourcePage";
import BagChecklistPage from "./pages/BagChecklistPage";

import { getBirthdays } from "./services/api";
import { requestNotificationPermission } from "./utils/notifications";
import { checkBirthdayReminders } from "./utils/birthdayReminder";

import "./App.css";

function BirthdayNotificationManager() {
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    requestNotificationPermission();

    const loadBirthdays = async () => {
      try {
        const data = await getBirthdays();

        setBirthdays(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Unable to load birthdays for reminders:",
          error
        );
      }
    };

    loadBirthdays();

    const interval = setInterval(
      loadBirthdays,
      60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (birthdays.length > 0) {
      checkBirthdayReminders(birthdays);
    }
  }, [birthdays]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <BirthdayNotificationManager />

      <div className="app">
        <header className="navbar">
          <NavLink to="/" className="logo">
            TaskNest
          </NavLink>

          <nav className="nav-links">
            <NavLink to="/" end>
              Dashboard
            </NavLink>

            <NavLink to="/todos">
              Todos
            </NavLink>

            <NavLink to="/birthdays">
              Birthdays
            </NavLink>

            <NavLink to="/resources">
              Resources
            </NavLink>

            <NavLink to="/bag">
              Bag
            </NavLink>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/todos"
              element={<TodoPage />}
            />

            <Route
              path="/birthdays"
              element={<BirthdayPage />}
            />

            <Route
              path="/resources"
              element={<ResourcePage />}
            />

            <Route
              path="/bag"
              element={<BagChecklistPage />}
            />

            <Route
              path="*"
              element={
                <div className="not-found">
                  <h1>404</h1>
                  <p>Page not found.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;