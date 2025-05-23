import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [transitionType, setTransitionType] = useState('default');

  const overlayRef = useRef(null);
  const appRef = useRef(null);
  const sliderTrackRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    appRef.current.classList.remove('transition-type-scan', 'transition-type-default', 'transition-type-radial');
    appRef.current.classList.add(`transition-type-${transitionType}`);
  }, [theme, transitionType]);

  const toggleTheme = () => {
    const goingToDark = theme === 'light';
    const newTheme = goingToDark ? 'dark' : 'light';

    if (transitionType === 'default') {
      // Default
      document.documentElement.setAttribute('data-theme', newTheme);
      setTheme(newTheme);
    } else if (transitionType === 'scan') {
      // Scan
      const overlay = overlayRef.current;
      const app = appRef.current;

      overlay.style[goingToDark ? 'left' : 'right'] = '0';
      overlay.style.transformOrigin = goingToDark ? 'left' : 'right';
      app.classList.add('transitioning', goingToDark ? 'to-dark' : 'to-light');

      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });

      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        setTheme(newTheme);
        overlay.classList.remove('active');
        overlay.classList.add('reverse');

        setTimeout(() => {
          overlay.classList.remove('reverse');
          app.classList.remove('transitioning', 'to-dark', 'to-light');
        }, 600);
      }, 1000);
    } else if (transitionType === 'radial') {
      // Radial
      if (
        !sliderTrackRef.current ||
        !document.startViewTransition ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        document.documentElement.setAttribute('data-theme', newTheme);
        setTheme(newTheme);
        return;
      }

      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      }).ready.then(() => {
        const { top, left, width, height } = sliderTrackRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const right = window.innerWidth - left;
        const bottom = window.innerHeight - top;
        const maxRadius = Math.hypot(
          Math.max(left, right),
          Math.max(top, bottom)
        );

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    }
  };

  const handleTransitionChange = (e) => {
    setTransitionType(e.target.value);
  };

  return (
    <div className="app" ref={appRef}>
      <div
        ref={overlayRef}
        className="theme-transition-overlay"
        aria-hidden="true"
      ></div>
      <nav className="navbar" style={{ '--transition-delay': '0s' }}>
        <h1 className="logo">Theme Switcher</h1>
        <div
          className={`theme-slider ${theme === 'dark' ? 'dark' : 'light'}`}
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleTheme();
            }
          }}
        >
          <div className="slider-track" ref={sliderTrackRef}>
            <FiSun className="slider-icon sun" size={20} />
            <FiMoon className="slider-icon moon" size={20} />
          </div>
        </div>
      </nav>
      <header className="hero" style={{ '--transition-delay': '0.1s' }}>
        <h2>Welcome to Theme Switcher</h2>
        <p>Choose your theme transition style</p>
        <select
          value={transitionType}
          onChange={handleTransitionChange}
          className="transition-select"
          aria-label="Select theme transition type"
        >
          <option value="default">Default</option>
          <option value="scan">Scan</option>
          <option value="radial">Radial</option>
        </select>
      </header>
      <section className="features" style={{ '--transition-delay': '0.2s' }}>
        {transitionType === 'default' ? (
          <>
            <div className="feature-card" style={{ '--delay': '0s' }}>
              <h3>Boring</h3>
              <p>Lacks any exciting effects.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.1s' }}>
              <h3>Basic</h3>
              <p>Just a plain theme switch.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.2s' }}>
              <h3>Plain</h3>
              <p>No visual flair or style.</p>
            </div>
          </>
        ) : transitionType === 'scan' ? (
          <>
            <div className="feature-card" style={{ '--delay': '0s' }}>
              <h3>Fluent</h3>
              <p>Smooth, flowing transitions.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.1s' }}>
              <h3>Dynamic</h3>
              <p>Real-time color reveals.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.2s' }}>
              <h3>Modern</h3>
              <p>Polished and elegant UI.</p>
            </div>
          </>
        ) : (
          <>
            <div className="feature-card" style={{ '--delay': '0s' }}>
              <h3>Circular</h3>
              <p>Radiates from the toggle center.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.1s' }}>
              <h3>Expansive</h3>
              <p>Fills the entire page seamlessly.</p>
            </div>
            <div className="feature-card" style={{ '--delay': '0.2s' }}>
              <h3>Vivid</h3>
              <p>Striking and engaging visuals.</p>
            </div>
          </>
        )}
      </section>
      <footer className="footer" style={{ '--transition-delay': '0.3s' }}>
        <p>© 2025 Karthik Nambiar. All rights reserved.</p>
      </footer>
    </div>
  );
}