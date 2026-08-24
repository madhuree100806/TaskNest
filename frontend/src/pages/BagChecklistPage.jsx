import { useEffect, useState } from "react";

import MagicBento from "../components/ui/MagicBento/MagicBento";
import SpecularButton from "../components/ui/SpecularButton/SpecularButton";

import {
  getBagItems,
  createBagItem,
  updateBagItem,
  deleteBagItem,
} from "../services/api";

function BagChecklistPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     LOAD BAG ITEMS
     ========================================= */

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBagItems();

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load your bag. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  /* =========================================
     ADD ITEM
     ========================================= */

  const handleAdd = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    /* Empty item */

    if (!trimmedName) {
      setError("Please enter an item name.");
      return;
    }

    /* =========================================
       DUPLICATE CHECK
       Case-insensitive
       ========================================= */

    const duplicate = items.some(
      (item) =>
        item.name &&
        item.name.trim().toLowerCase() ===
          trimmedName.toLowerCase()
    );

    if (duplicate) {
      setError(
        `"${trimmedName}" is already present in your bag.`
      );
      return;
    }

    try {
      setError("");

      const newItem = await createBagItem({
        name: trimmedName,
      });

      setItems((prev) => [...prev, newItem]);

      setName("");
    } catch (err) {
      console.error(err);

      /*
        If backend returns 409 Conflict,
        treat it as duplicate.
      */

      if (err?.response?.status === 409) {
        setError(
          `"${trimmedName}" is already present in your bag.`
        );
      } else {
        setError("Unable to add item.");
      }
    }
  };

  /* =========================================
     TOGGLE PACKED STATUS
     ========================================= */

  const handleToggle = async (item) => {
    try {
      setError("");

      const updated = await updateBagItem(item.id, {
        ...item,
        packed: !item.packed,
      });

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? updated : i
        )
      );
    } catch (err) {
      console.error(err);

      setError("Unable to update item.");
    }
  };

  /* =========================================
     DELETE ITEM
     ========================================= */

  const handleDelete = async (item) => {
    try {
      setError("");

      await deleteBagItem(item.id);

      setItems((prev) =>
        prev.filter((i) => i.id !== item.id)
      );
    } catch (err) {
      console.error(err);

      setError("Unable to delete item.");
    }
  };

  /* =========================================
     MAGIC BENTO CARDS
     ========================================= */

  const cards = items.map((item) => ({
    id: item.id,

    title: item.name,

    label: item.packed ? "Packed" : "Not Packed",

    color: item.packed
      ? "#173d24"
      : "#120f17",

    onClick: () => handleToggle(item),

    description: (
      <button
        type="button"
        className="bag-delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(item);
        }}
      >
        Remove
      </button>
    ),
  }));

  /* =========================================
     PAGE
     ========================================= */

  return (
    <div className="page bag-page">

      {/* HEADER */}

      <div className="page-header">
        <h1>Smart Bag Checklist</h1>

        
      </div>

      {/* ADD ITEM FORM */}

      <form
        className="bag-form"
        onSubmit={handleAdd}
      >
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            if (error) {
              setError("");
            }
          }}
        />

        <SpecularButton type="submit">
          + Add Item
        </SpecularButton>
      </form>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="loading">
          Loading your bag...
        </div>

      ) : items.length === 0 ? (

        /* EMPTY */

        <div className="empty-state">
          <h2>Your bag is empty</h2>

          <p>
            Add your first item above.
          </p>
        </div>

      ) : (

        /* CARDS */

        <div className="bag-bento-wrapper">
          <MagicBento
            cards={cards}
            textAutoHide={false}
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
          />
        </div>
      )}
    </div>
  );
}

export default BagChecklistPage;