import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  Utensils,
  Leaf
} from 'lucide-react';
import './styles.css';

const BASE = import.meta.env.BASE_URL;

const pages = [
  {
    id: 1,
    title: 'South Indian & Snacks',
    cat: 'South Indian',
    img: `${BASE}assets/menu-1.jpg`
  },
  {
    id: 2,
    title: 'Beverages & Sandwiches',
    cat: 'Beverages',
    img: `${BASE}assets/menu-2.jpg`
  },
  {
    id: 3,
    title: 'Pizza, Pav Bhaji & Salads',
    cat: 'Pizza',
    img: `${BASE}assets/menu-3.jpg`
  },
  {
    id: 4,
    title: 'Continental',
    cat: 'Continental',
    img: `${BASE}assets/menu-4.jpg`
  },
  {
    id: 5,
    title: 'Oriental',
    cat: 'Oriental',
    img: `${BASE}assets/menu-5.jpg`
  },
  {
    id: 6,
    title: 'Rice, Breads & Meals',
    cat: 'Rice & Breads',
    img: `${BASE}assets/menu-6.jpg`
  },
  {
    id: 7,
    title: 'Indian Main Course',
    cat: 'Indian Main Course',
    img: `${BASE}assets/menu-7.jpg`
  }
];

const categories = ['All', ...pages.map((p) => p.cat)];

function Logo() {
  return (
    <div className="logo-wrap" aria-label="Aangan">
      <div className="logo-mark">
        <span className="logo-arch" />
        <span className="logo-bowl" />
        <span className="logo-leaf leaf-a" />
        <span className="logo-leaf leaf-b" />
      </div>

      <div className="logo-copy">
        <strong>Aangan</strong>
        <span>pure veg · good food</span>
      </div>
    </div>
  );
}

function Header({ search, setSearch, onViewMenu }) {
  return (
    <header className="header">
      <a href="#top" className="brand-link">
        <Logo />
      </a>

      <div className="header-actions">
        <label className="search-box">
          <Search size={17} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu"
          />
        </label>

        <button
          className="header-button"
          onClick={onViewMenu}
        >
          View menu
        </button>
      </div>
    </header>
  );
}

function MenuCard({ page, index, onOpen }) {
  return (
    <article
      className="menu-card"
      style={{ '--delay': `${index * 55}ms` }}
      onClick={() => onOpen(page)}
    >
      <div className="card-image">
        <img
          src={page.img}
          alt={page.title}
          loading="lazy"
        />

        <span className="page-badge">
          {String(page.id).padStart(2, '0')}
        </span>
      </div>

      <div className="card-content">
        <div>
          <p className="card-category">
            {page.cat}
          </p>

          <h3>{page.title}</h3>

          <span>
            Menu page {String(page.id).padStart(2, '0')}
          </span>
        </div>

        <button
          aria-label={`Open ${page.title}`}
        >
          <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}

function Viewer({ page, onClose, onChange }) {
  const index = pages.findIndex(
    (p) => p.id === page.id
  );

  const previous =
    pages[(index - 1 + pages.length) % pages.length];

  const next =
    pages[(index + 1) % pages.length];

  useEffect(() => {
    const keyHandler = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft') {
        onChange(previous);
      }

      if (event.key === 'ArrowRight') {
        onChange(next);
      }
    };

    document.addEventListener(
      'keydown',
      keyHandler
    );

    document.body.classList.add('viewer-open');

    return () => {
      document.removeEventListener(
        'keydown',
        keyHandler
      );

      document.body.classList.remove(
        'viewer-open'
      );
    };
  }, [
    previous,
    next,
    onClose,
    onChange
  ]);

  return (
    <div
      className="viewer"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="viewer-close"
        onClick={onClose}
        aria-label="Close"
      >
        <X />
      </button>

      <div className="viewer-panel">
        <div className="viewer-topbar">
          <button onClick={onClose}>
            <ArrowLeft size={18} />
            Menu
          </button>

          <div>
            <strong>{page.title}</strong>

            <span>
              Page {page.id} of {pages.length}
            </span>
          </div>

          <span className="viewer-count">
            {String(page.id).padStart(2, '0')}
          </span>
        </div>

        <div className="viewer-image-wrap">
          <img
            src={page.img}
            alt={page.title}
          />
        </div>

        <div className="viewer-nav">
          <button
            onClick={() => onChange(previous)}
          >
            <ArrowLeft size={17} />
            <span>Previous</span>
          </button>

          <span>
            {page.id} / {pages.length}
          </span>

          <button
            onClick={() => onChange(next)}
          >
            <span>Next</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return pages.filter((page) => {
      const matchesCategory =
        active === 'All' ||
        page.cat === active;

      const matchesSearch =
        !q ||
        `${page.title} ${page.cat}`
          .toLowerCase()
          .includes(q);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [active, search]);

  const openFirst = () => {
    setSelected(
      filtered[0] || pages[0]
    );
  };

  return (
    <>
      <Header
        search={search}
        setSearch={setSearch}
        onViewMenu={openFirst}
      />

      <main id="top">

        <section className="hero">

          <div className="hero-copy">

            <div className="eyebrow">
              <Leaf size={14} />
              PURE VEGETARIAN
            </div>

            <h1>
              Good food,
              <br />
              <em>made simply.</em>
            </h1>

            <p>
              Take a look through our menu,
              choose a section and open the page
              for a clear, easy-to-read view on
              your phone.
            </p>

            <div className="hero-actions">

              <button
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById('menu')
                    ?.scrollIntoView({
                      behavior: 'smooth'
                    })
                }
              >
                <Utensils size={16} />
                Explore menu
              </button>

              <span className="hero-note">
                7 menu pages · mobile friendly
              </span>

            </div>

          </div>

          <div
            className="hero-preview"
            onClick={openFirst}
          >

            <div className="preview-label">
              <span>Today’s menu</span>
              <b>01</b>
            </div>

            <div className="preview-paper">
              <img
                src={pages[0].img}
                alt="South Indian menu preview"
              />
            </div>

            <div className="preview-bottom">
              <span>
                South Indian & Snacks
              </span>

              <ArrowRight size={17} />
            </div>

          </div>

        </section>

        <section
          id="menu"
          className="menu-section"
        >

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                EXPLORE
              </span>

              <h2>Our menu</h2>
            </div>

            <span className="section-count">
              {filtered.length} sections
            </span>

          </div>

          <div className="category-row">

            {categories.map((category) => (
              <button
                key={category}
                className={
                  active === category
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setActive(category)
                }
              >
                {category}
              </button>
            ))}

          </div>

          <div className="menu-grid">

            {filtered.map(
              (page, index) => (
                <MenuCard
                  key={page.id}
                  page={page}
                  index={index}
                  onOpen={setSelected}
                />
              )
            )}

          </div>

        </section>

        <section className="closing-note">

          <div className="closing-icon">
            <Leaf size={19} />
          </div>

          <div>
            <strong>
              Good food, warm moments.
            </strong>

            <span>
              Thank you for dining with us.
            </span>
          </div>

        </section>

      </main>

      <footer className="footer">
        <Logo />
        <span>
          Digital menu · scan, browse & enjoy
        </span>
      </footer>

      {selected && (
        <Viewer
          page={selected}
          onClose={() =>
            setSelected(null)
          }
          onChange={setSelected}
        />
      )}

    </>
  );
}

createRoot(
  document.getElementById('root')
).render(<App />);