import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SpotlightCard from "../components/ui/SpotlightCard/SpotlightCard";
import { getTodos, getBirthdays, getResources, getBagItems } from "../services/api";

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

      const [todos, birthdays, resources, bag] = results.map((r) =>
        r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []
      );

      setStats({
        todos: `${todos.filter((t) => !t.completed).length} pending / ${todos.length} total`,
        birthdays: `${birthdays.length} saved`,
        resources: `${resources.length} saved`,
        bag: `${bag.filter((i) => i.packed).length} / ${bag.length} packed`,
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
          <Link to={card.to} className="dashboard-link" key={card.to}>
            <SpotlightCard>
              <div className="spotlight-content">
                <div className="card-top">
                  <span className="card-icon">{card.icon}</span>
                  <div style={{ textAlign: "right" }}>
                    <div className="card-stat">
                      {card.stat === null ? "..." : card.stat.split(" ")[0]}
                    </div>
                    <div className="card-stat-label">
                      {card.stat ? card.stat.split(" ").slice(1).join(" ") : "loading"}
                    </div>
                  </div>
                </div>
                <div>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
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
