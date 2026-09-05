import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SpotlightCard from "../components/ui/SpotlightCard/SpotlightCard";
import {
  getTodos,
  getBirthdays,
  getResources,
  getBagItems,
} from "../services/api";

function daysUntilNextBirthday(dateStr) {
  if (!dateStr) return null;

  const parts = dateStr.split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some((part) => Number.isNaN(part))
  ) {
    return null;
  }

  const [, month, day] = parts;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next = new Date(
    today.getFullYear(),
    month - 1,
    day
  );

  next.setHours(0, 0, 0, 0);

  if (next < today) {
    next.setFullYear(next.getFullYear() + 1);
  }

  return Math.round(
    (next - today) /
      (1000 * 60 * 60 * 24)
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    todos: null,
    birthdays: null,
    resources: null,
    bag: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      const results = await Promise.allSettled([
        getTodos(),
        getBirthdays(),
        getResources(),
        getBagItems(),
      ]);

      if (cancelled) return;

      const [
        todos,
        birthdays,
        resources,
        bag,
      ] = results.map((r) =>
        r.status === "fulfilled" &&
        Array.isArray(r.value)
          ? r.value
          : []
      );

      // Find the nearest upcoming birthday
      const upcomingBirthday = birthdays
        .map((birthday) => ({
          ...birthday,
          days: daysUntilNextBirthday(
            birthday.date
          ),
        }))
        .filter(
          (birthday) =>
            birthday.days !== null
        )
        .sort(
          (a, b) =>
            a.days - b.days
        )[0];

      let birthdayMessage =
        "No upcoming birthdays";

      if (upcomingBirthday) {
        if (upcomingBirthday.days === 0) {
          birthdayMessage = `🎂 ${upcomingBirthday.name}'s bday is today!`;
        } else if (
          upcomingBirthday.days === 1
        ) {
          birthdayMessage = `🎂 ${upcomingBirthday.name}'s bday tomorrow`;
        } else {
          birthdayMessage = `🎂 ${upcomingBirthday.name}'s bday in ${upcomingBirthday.days} days`;
        }
      }

      setStats({
        todos: `${todos.filter(
          (t) => !t.completed
        ).length} pending / ${todos.length} total`,

        birthdays: `${birthdays.length} saved`,

        resources: `${resources.length} saved`,

        bag: `${bag.filter(
          (i) => i.packed
        ).length} / ${bag.length} packed`,

        birthdayMessage,
      });
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      to: "/todos",
      icon: "\u2713",
      title: "Todo Manager",
      stat: stats.todos,
    },
    {
      to: "/birthdays",
      icon: "\uD83C\uDF82",
      title: "Birthday Manager",
      stat: stats.birthdays,
      description:
        stats.birthdayMessage,
    },
    {
      to: "/resources",
      icon: "\uD83D\uDCDA",
      title: "Resource Vault",
      stat: stats.resources,
    },
    {
      to: "/bag",
      icon: "\uD83C\uDF92",
      title: "Smart Bag Checklist",
      stat: stats.bag,
    },
  ];

  return (
    <div className="page dashboard-page">
      <div className="dashboard-grid">
        {cards.map((card) => (
          <Link
            to={card.to}
            className="dashboard-link"
            key={card.to}
          >
            <SpotlightCard>
              <div className="spotlight-content">
                <div className="card-top">
                  <span className="card-icon">
                    {card.icon}
                  </span>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <div className="card-stat">
                      {card.stat === null
                        ? "..."
                        : card.stat.split(" ")[0]}
                    </div>

                    <div className="card-stat-label">
                      {card.stat
                        ? card.stat
                            .split(" ")
                            .slice(1)
                            .join(" ")
                        : "loading"}
                    </div>
                  </div>
                </div>

                <div>
                  <h2>{card.title}</h2>

                  <p>
                    {card.description}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;