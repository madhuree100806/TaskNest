import { useEffect, useState } from "react";
import AnimatedList from "../components/ui/AnimatedList/AnimatedList";
import SpecularButton from "../components/ui/SpecularButton/SpecularButton";
import {
  getBirthdays,
  createBirthday,
  deleteBirthday,
} from "../services/api";

function daysUntilNextBirthday(dateStr) {
  if (!dateStr) return null;

  const today = new Date();
  const birth = new Date(dateStr);

  if (Number.isNaN(birth.getTime())) return null;

  const next = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );

  if (next < today) {
    next.setFullYear(today.getFullYear() + 1);
  }

  const diff = Math.ceil(
    (next - today) / (1000 * 60 * 60 * 24)
  );

  return diff;
}

function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

function BirthdayPage() {
  const [birthdays, setBirthdays] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBirthdays();

      setBirthdays(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load birthdays.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBirthdays();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !date) {
      return;
    }

    try {
      setError("");

      const birthday = await createBirthday({
        name: name.trim(),
        date,
      });

      setBirthdays((prev) => [...prev, birthday]);

      setName("");
      setDate("");
    } catch (err) {
      setError("Unable to add birthday.");
      console.error(err);
    }
  };

  const handleDelete = async (birthday) => {
    // Confirmation before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${birthday.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBirthday(birthday.id);

      setBirthdays((prev) =>
        prev.filter((item) => item.id !== birthday.id)
      );
    } catch (err) {
      setError("Unable to delete birthday.");
      console.error(err);
    }
  };

  const sorted = [...birthdays].sort(
    (a, b) =>
      daysUntilNextBirthday(a.date) -
      daysUntilNextBirthday(b.date)
  );

  const listItems = sorted.map((birthday) => {
    const days = daysUntilNextBirthday(birthday.date);

    return (
      <div
        className="birthday-item-row"
        key={birthday.id}
      >
        <div className="birthday-item-info">
          <h3>{birthday.name}</h3>

          <p>{formatDate(birthday.date)}</p>

          {days !== null && (
            <p className="days-away">
              {days === 0
                ? "Today! 🎉"
                : `${days} day${
                    days === 1 ? "" : "s"
                  } away`}
            </p>
          )}
        </div>

        <button
          type="button"
          className="birthday-delete-button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(birthday);
          }}
        >
          Delete
        </button>
      </div>
    );
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Birthday Manager</h1>
        <p></p>
      </div>

      <form
        className="birthday-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Person's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <SpecularButton type="submit">
          Add Birthday
        </SpecularButton>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading birthdays...
        </div>
      ) : birthdays.length === 0 ? (
        <div className="empty-state">
          <h2>No birthdays added</h2>
          <p></p>
        </div>
      ) : (
        <AnimatedList
          items={listItems}
          showGradients
          enableArrowNavigation={false}
        />
      )}
    </div>
  );
}

export default BirthdayPage;