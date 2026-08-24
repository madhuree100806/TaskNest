# TaskNest

A simple student workspace: todos, birthdays, study resources, and a college bag checklist —
styled with [React Bits](https://reactbits.dev) components on its signature dark/violet palette.

## Structure

```
TaskNest/
  backend/     Express API, in-memory data store
  frontend/    Vite + React app
```

## Running it

**Backend** (http://localhost:5000)
```
cd backend
npm install
npm run dev
```

**Frontend** (http://localhost:5173)
```
cd frontend
npm install
npm run dev
```

Start the backend first — the frontend calls `http://localhost:5000/api` directly.

## Pages & components

| Page               | React Bits component |
|--------------------|-----------------------|
| Dashboard          | SpotlightCard (clickable, shows live stats per section) |
| Todo Manager       | CircularGallery |
| Smart Bag Checklist| MagicBento (tap a card to toggle packed) |
| Resource Vault     | ScrollStack (open + delete + a "+ Add" button) |
| Birthday Manager   | AnimatedList (name, date, days-until) |

All buttons use `SpecularButton`.

## Color palette (from reactbits.dev)

| Token | Value |
|---|---|
| Background | `#060010` |
| Surface | `#120f17` |
| Accent | `#5227ff` |
| Accent (light) | `#b19eef` |

Defined once in `frontend/src/styles/theme.css` as CSS variables.

## Notes

- Data is in-memory on the backend (resets on server restart). There's no database wired up —
  `pg`/Postgres was present in the original scaffold but unused, so it's been removed to keep
  things simple. If you want persistence, swap the arrays in `backend/data/*.js` for a real DB.
- Everything under `frontend/src/components/ui/` came from React Bits and is reused as-is;
  only default colors were adjusted to match the palette above.


  
