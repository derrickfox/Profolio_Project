import { useEffect, useMemo, useState } from "react";

const apps = [
  {
    name: "Deb8",
    category: "AI workspace",
    description:
      "A debate studio for testing arguments, comparing positions, and preserving the thread of a hard conversation.",
    href: "/deb8/",
    route: "/deb8",
    stack: ["React", "Vite", "Firebase", "Gemini"],
    status: "Mounted",
    mode: "Backend",
    accent: "deb8",
  },
  {
    name: "DC Map Layers",
    category: "Civic mapping",
    description:
      "Layered Washington, DC neighborhood analysis with public datasets, map overlays, and spatial filters.",
    href: "/dc_map_layers/",
    route: "/dc_map_layers",
    stack: ["React", "Vite", "Firebase Hosting"],
    status: "Mounted",
    mode: "Static",
    accent: "maps",
  },
  {
    name: "DC Mayoral Primary 2026",
    category: "Civic guide",
    description:
      "A public-facing election guide for exploring candidates, issue positions, and race context.",
    href: "/dc-mayoral-primary-2026/",
    route: "/dc-mayoral-primary-2026",
    stack: ["React", "Vite"],
    status: "Mounted",
    mode: "Static",
    accent: "primary",
  },
  {
    name: "Rent vs. Buy",
    category: "Financial planning",
    description:
      "A scenario calculator for comparing rent, home ownership, equity, cash flow, and long-term tradeoffs.",
    href: "/apps/rent-vs-buy/index.html?mode=rent-buy",
    route: "/apps/rent-vs-buy",
    stack: ["React", "Vite"],
    status: "Mounted",
    mode: "Static",
    accent: "rentbuy",
  },
  {
    name: "World Timeline Explorer",
    category: "History tools",
    description:
      "A timeline workspace for browsing historical events, grouped eras, and chronological patterns.",
    href: "/apps/world-timeline/index.html",
    route: "/apps/world-timeline",
    stack: ["React", "Vite", "Firebase"],
    status: "Mounted",
    mode: "Static",
    accent: "timeline",
  },
  {
    name: "Slime Trails",
    category: "Simulation",
    description:
      "A browser simulation for emergent movement, trail systems, and organic-looking interaction patterns.",
    href: "/apps/slime-trails/index.html",
    route: "/apps/slime-trails",
    stack: ["React", "Vite"],
    status: "Mounted",
    mode: "Static",
    accent: "slime",
  },
  {
    name: "Pathway AI",
    category: "Urban simulation",
    description:
      "A park-planning simulator for drawing entrances, paths, obstacles, and watching human desire paths emerge.",
    href: "/apps/pathway-ai/index.html",
    route: "/apps/pathway-ai",
    stack: ["React", "Vite", "TypeScript"],
    status: "Mounted",
    mode: "Static",
    accent: "pathway",
  },
  {
    name: "Color Relationship Explorer",
    category: "Design tool",
    description:
      "An interactive color theory app for choosing a base color and exploring complementary, triadic, tonal, and neutral palettes.",
    href: "/apps/color-relationship-explorer/index.html",
    route: "/apps/color-relationship-explorer",
    stack: ["React", "Vite", "Design Systems"],
    status: "Mounted",
    mode: "Static",
    accent: "color",
  },
  {
    name: "Political Spectrum 3D",
    category: "3D visualization",
    description:
      "An interactive three-dimensional model for exploring ideological positions and political distance.",
    href: "/apps/political-spectrum-3d/index.html",
    route: "/apps/political-spectrum-3d",
    stack: ["React", "Vite", "Three.js"],
    status: "Mounted",
    mode: "Static",
    accent: "spectrum",
  },
  {
    name: "Acadia Guide",
    category: "National park guide",
    description:
      "An interactive 3D tourist map for exploring Acadia National Park with real elevation data, OSM water shapes, trails, roads, and place-focused navigation.",
    href: "/apps/acadia-guide/index.html",
    route: "/apps/acadia-guide",
    stack: ["React", "Vite", "Three.js", "OpenStreetMap"],
    status: "Mounted",
    mode: "Static",
    accent: "acadia",
  },
  {
    name: "Perfect Pitch",
    category: "Ear training",
    description:
      "A focused ear-training app for note recognition practice with piano samples and quick feedback.",
    href: "/apps/perfect-pitch/index.html",
    route: "/apps/perfect-pitch",
    stack: ["React", "Vite", "TypeScript"],
    status: "Mounted",
    mode: "Static",
    accent: "pitch",
  },
  {
    name: "Tuning Riffs",
    category: "Music catalog",
    description:
      "A guitar-song catalog that groups riffs by tuning, making it easier to batch songs that share standard, Eb, Drop D, Open G, and other setups.",
    href: "/apps/tuning-riffs/index.html",
    route: "/apps/tuning-riffs",
    stack: ["React", "Vite", "LocalStorage"],
    status: "Mounted",
    mode: "Static",
    accent: "music",
  },
  {
    name: "Cookie Simulator",
    category: "Food simulation",
    description:
      "A 3D baking simulator for tuning recipe measurements, oven temperature, and cook time to see how a chocolate chip cookie changes.",
    href: "/apps/cookie-simulator/index.html",
    route: "/apps/cookie-simulator",
    stack: ["React", "Vite", "Three.js"],
    status: "Mounted",
    mode: "Static",
    accent: "cookie",
  },
  {
    name: "Natural Selection Lab",
    category: "Evolution simulation",
    description:
      "A Primer-inspired ecosystem where blobs inherit speed and size, navigate obstacles, compete for food, and evolve across generations.",
    href: "/apps/natural-selection/index.html",
    route: "/apps/natural-selection",
    stack: ["React", "Vite", "Canvas", "Recharts"],
    status: "Mounted",
    mode: "Static",
    accent: "natural",
  },
  {
    name: "Classroom Seating Simulator",
    category: "Education planning",
    description:
      "A teacher-supportive seating planner that balances distraction reduction, inclusion, accessibility, peer supports, and professional judgment.",
    href: "/apps/classroom-seating-simulator/index.html",
    route: "/apps/classroom-seating-simulator",
    stack: ["React", "Vite", "Simulation"],
    status: "Mounted",
    mode: "Static",
    accent: "classroom",
  },
  {
    name: "Lift Logic",
    category: "Strategy simulation",
    description:
      "An elevator dispatch optimization game where you choose algorithms, watch floors fill with riders, and race against wasted wait time.",
    href: "/apps/elevator-game/index.html",
    route: "/apps/elevator-game",
    stack: ["React", "Vite", "Simulation"],
    status: "Mounted",
    mode: "Static",
    accent: "elevator",
  },
  {
    name: "Civics Simulator",
    category: "Civics education",
    description:
      "An interactive civics simulator with animated scenes for each stage. Guide a bill through 10 stages of the legislative process, or fight a constitutional rights case all the way to the Supreme Court.",
    href: "/apps/civics-simulator/index.html",
    route: "/apps/civics-simulator",
    stack: ["React", "Vite", "Simulation"],
    status: "Mounted",
    mode: "Static",
    accent: "civics",
  },
];

const filters = ["All", ...Array.from(new Set(apps.flatMap((app) => app.stack)))];

function AppPreview({ accent }) {
  const previewContent = {
    deb8: (
      <>
        <span className="deb8-prompt" />
        <span className="deb8-card deb8-left">
          <i />
          <i />
          <i />
        </span>
        <span className="deb8-card deb8-right">
          <i />
          <i />
          <i />
        </span>
        <span className="deb8-meter" />
      </>
    ),
    maps: (
      <>
        <span className="dc-river" />
        <span className="dc-park" />
        <span className="dc-zone dc-zone-a" />
        <span className="dc-zone dc-zone-b" />
        <span className="dc-route" />
        <span className="dc-pin" />
        <span className="dc-layer-list">
          <i />
          <i />
          <i />
        </span>
      </>
    ),
    primary: (
      <>
        <span className="ballot-card ballot-card-a">
          <i />
          <i />
          <i />
        </span>
        <span className="ballot-card ballot-card-b">
          <i />
          <i />
        </span>
        <span className="vote-check" />
        <span className="poll-bars">
          <i />
          <i />
          <i />
        </span>
      </>
    ),
    rentbuy: (
      <>
        <span className="house rent-house">
          <i />
        </span>
        <span className="house buy-house">
          <i />
        </span>
        <span className="finance-panel">
          <i />
          <i />
          <i />
        </span>
        <span className="equity-line" />
      </>
    ),
    timeline: (
      <>
        <span className="timeline-axis" />
        <span className="timeline-year year-a">1200</span>
        <span className="timeline-year year-b">1600</span>
        <span className="timeline-year year-c">2000</span>
        <span className="timeline-event event-a">Rome</span>
        <span className="timeline-event event-b">Print</span>
        <span className="timeline-event event-c">Moon</span>
        <span className="timeline-track track-a" />
        <span className="timeline-track track-b" />
      </>
    ),
    slime: (
      <>
        <span className="trail trail-a" />
        <span className="trail trail-b" />
        <span className="trail trail-c" />
        <span className="particle particle-a" />
        <span className="particle particle-b" />
        <span className="particle particle-c" />
        <span className="particle particle-d" />
        <span className="sim-panel">
          <i />
          <i />
        </span>
      </>
    ),
    pathway: (
      <>
        <span className="park-grass" />
        <span className="park-path paved-path-a" />
        <span className="park-path paved-path-b" />
        <span className="desire-path desire-path-a" />
        <span className="desire-path desire-path-b" />
        <span className="park-gate gate-a" />
        <span className="park-gate gate-b" />
        <span className="park-gate gate-c" />
        <span className="park-obstacle obstacle-a" />
        <span className="park-obstacle obstacle-b" />
      </>
    ),
    color: (
      <>
        <span className="color-wheel-preview" />
        <span className="color-wheel-dot" />
        <span className="color-card color-card-a" />
        <span className="color-card color-card-b" />
        <span className="color-card color-card-c" />
        <span className="color-label-strip" />
      </>
    ),
    spectrum: (
      <>
        <span className="spectrum-floor" />
        <span className="spectrum-axis x-axis" />
        <span className="spectrum-axis y-axis" />
        <span className="spectrum-axis z-axis" />
        <span className="spectrum-point point-a" />
        <span className="spectrum-point point-b" />
        <span className="spectrum-point point-c" />
        <span className="spectrum-card" />
      </>
    ),
    pitch: (
      <>
        <span className="speaker-core" />
        <span className="sound-wave wave-a" />
        <span className="sound-wave wave-b" />
        <span className="piano-key key-c">C</span>
        <span className="piano-key key-d">D</span>
        <span className="piano-key key-e">E</span>
        <span className="piano-key key-f">F</span>
        <span className="black-key black-a" />
        <span className="black-key black-b" />
      </>
    ),
    music: (
      <>
        <span className="riff-neck" />
        <span className="riff-nut" />
        <span className="riff-fret fret-one" />
        <span className="riff-fret fret-two" />
        <span className="riff-fret fret-three" />
        <span className="riff-string string-one" />
        <span className="riff-string string-two" />
        <span className="riff-string string-three" />
        <span className="riff-string string-four" />
        <span className="riff-string string-five" />
        <span className="riff-string string-six" />
        <span className="riff-tuning tuning-eb">Eb</span>
        <span className="riff-tuning tuning-drop">Drop D</span>
        <span className="riff-card card-a" />
        <span className="riff-card card-b" />
      </>
    ),
    cookie: (
      <>
        <span className="cookie-pan" />
        <span className="cookie-disc" />
        <span className="cookie-edge" />
        <span className="cookie-chip chip-a" />
        <span className="cookie-chip chip-b" />
        <span className="cookie-chip chip-c" />
        <span className="cookie-chip chip-d" />
        <span className="cookie-chip chip-e" />
        <span className="cookie-crack crack-a" />
        <span className="cookie-crack crack-b" />
        <span className="cookie-controls">
          <i />
          <i />
          <i />
        </span>
      </>
    ),
    natural: (
      <>
        <span className="natural-grid" />
        <span className="natural-obstacle obstacle-one" />
        <span className="natural-obstacle obstacle-two" />
        <span className="natural-food food-one" />
        <span className="natural-food food-two" />
        <span className="natural-food food-three" />
        <span className="natural-blob blob-slow" />
        <span className="natural-blob blob-mid" />
        <span className="natural-blob blob-fast" />
        <span className="natural-chart">
          <i />
          <i />
        </span>
      </>
    ),
    classroom: (
      <>
        <span className="classroom-front" />
        <span className="classroom-teacher" />
        <span className="classroom-desk desk-one" />
        <span className="classroom-desk desk-two support" />
        <span className="classroom-desk desk-three peer" />
        <span className="classroom-desk desk-four" />
        <span className="classroom-desk desk-five support" />
        <span className="classroom-desk desk-six peer" />
        <span className="classroom-score">
          <i />
          <i />
          <i />
        </span>
      </>
    ),
    acadia: (
      <>
        <span className="acadia-ocean" />
        <span className="acadia-island island-main" />
        <span className="acadia-island island-schoodic" />
        <span className="acadia-peak peak-cadillac" />
        <span className="acadia-peak peak-bubbles" />
        <span className="acadia-lake lake-jordan" />
        <span className="acadia-lake lake-eagle" />
        <span className="acadia-road road-loop" />
        <span className="acadia-trail trail-ridge" />
        <span className="acadia-pin" />
      </>
    ),
    elevator: (
      <>
        <span className="elev-building" />
        <span className="elev-shaft shaft-a">
          <span className="elev-car car-a" />
        </span>
        <span className="elev-shaft shaft-b">
          <span className="elev-car car-b" />
        </span>
        <span className="elev-shaft shaft-c">
          <span className="elev-car car-c" />
        </span>
        <span className="elev-floor floor-1" />
        <span className="elev-floor floor-2" />
        <span className="elev-floor floor-3" />
        <span className="elev-rider rider-a" />
        <span className="elev-rider rider-b" />
        <span className="elev-rider rider-c" />
        <span className="elev-score">
          <i />
          <i />
        </span>
      </>
    ),
    civics: (
      <>
        <span className="civ-sky" />
        <span className="civ-capitol">
          <i className="civ-dome" />
          <i className="civ-body" />
          <i className="civ-steps" />
        </span>
        <span className="civ-road">
          <i className="civ-crosswalk" />
          <i className="civ-car car-one" />
          <i className="civ-car car-two" />
        </span>
        <span className="civ-scales">
          <i className="civ-scales-beam" />
          <i className="civ-scales-pan pan-left" />
          <i className="civ-scales-pan pan-right" />
          <i className="civ-scales-post" />
        </span>
        <span className="civ-bill">
          <i /><i /><i />
        </span>
        <span className="civ-stage-dots">
          <i className="civ-dot dot-done" />
          <i className="civ-dot dot-done" />
          <i className="civ-dot dot-active" />
          <i className="civ-dot" />
          <i className="civ-dot" />
        </span>
      </>
    ),
  }[accent];

  return (
    <div className={`app-preview ${accent}`} aria-hidden="true">
      <span className="preview-grid" />
      {previewContent}
    </div>
  );
}

function PythonDecorations() {
  return (
    <div className="python-decorations" aria-hidden="true">
      <span className="paper-sun paper-float">
        <i />
      </span>
      <span className="pointing-hand paper-slide">
        <i />
      </span>
      <span className="paper-crown paper-wiggle">
        <i />
        <i />
        <i />
      </span>
      <span className="tiny-knight paper-shudder">
        <i className="helm" />
        <i className="body" />
        <i className="leg leg-a" />
        <i className="leg leg-b" />
        <i className="sword" />
      </span>
      <span className="castle-scrap" />
      <span className="marginalia marginalia-left" />
      <span className="marginalia marginalia-right" />
    </div>
  );
}

function AppCard({ app, isPython }) {
  const canLaunch = Boolean(app.href);

  return (
    <article className={`app-card ${app.accent}`}>
      <span className="card-pin" aria-hidden="true" />
      <span className="card-creature" aria-hidden="true" />
      <AppPreview accent={app.accent} />
      <div className="app-content">
        <div className="app-meta">
          <span>{app.category}</span>
          <strong>{app.status}</strong>
        </div>
        <h2>{app.name}</h2>
        <p>{app.description}</p>
        <div className="stack-list" aria-label={`${app.name} stack`}>
          {isPython && <b>Tools of the Trade</b>}
          {app.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <span>{app.route}</span>
        {canLaunch ? (
          <a className="launch-link" href={app.href}>
            {isPython ? "View Quest" : "Open"}
          </a>
        ) : (
          <button className="launch-link muted" type="button" disabled>
            {isPython ? "Unwritten" : "Queue"}
          </button>
        )}
      </div>
    </article>
  );
}

function App() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "default";
    }

    return window.localStorage.getItem("portfolio-theme") || "default";
  });

  const isPython = theme === "python";

  const visibleApps = useMemo(() => {
    if (activeFilter === "All") {
      return apps;
    }

    return apps.filter((app) => app.stack.includes(activeFilter));
  }, [activeFilter]);

  useEffect(() => {
    document.body.classList.toggle("theme-python", isPython);
    window.localStorage.setItem("portfolio-theme", theme);

    return () => {
      document.body.classList.remove("theme-python");
    };
  }, [isPython, theme]);

  return (
    <main className={`shell ${isPython ? "theme-python" : "theme-default"}`}>
      {isPython && <PythonDecorations />}
      <button
        className="corner-mark"
        type="button"
        aria-pressed={isPython}
        aria-label={isPython ? "Return to default mode" : "Enter Python Mode"}
        title={isPython ? "Return to default mode" : "Enter Python Mode"}
        onClick={() => setTheme(isPython ? "default" : "python")}
      >
        <img
          src="/round_rabbit_icon_centered.svg"
          alt=""
          aria-hidden="true"
        />
      </button>
      <span className="mode-label" aria-hidden="true">
        {isPython ? "Python Mode" : "Click for Python Mode"}
      </span>
      <span className="stage-curtains is-active" aria-hidden="true">
        <span className="curtain-panel curtain-left" />
        <span className="curtain-panel curtain-right" />
        <span className="curtain-valance" />
      </span>
      <section className="hero" aria-labelledby="page-title">
        <span className="hero-flourish hero-flourish-left" aria-hidden="true" />
        <span className="hero-flourish hero-flourish-right" aria-hidden="true" />
        <span className="scroll-strip paper-pop" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">Derrick Fox presents</p>
          <h1 id="page-title">The Profolio</h1>
          <p>
            A single public front door for the apps, experiments, dashboards,
            simulations, and civic tools built across this workspace.
          </p>
        </div>
      </section>

      <section className="toolbar" aria-label="Application filters">
        <div>
          <span>{isPython ? "Archives" : "Catalog"}</span>
          <strong>
            {visibleApps.length} {isPython ? "quests" : "shown"}
          </strong>
        </div>
        <div className="filter-list">
          {filters.map((filter) => (
            <button
              className={filter === activeFilter ? "active" : ""}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="app-grid" aria-label="Applications">
        {visibleApps.map((app) => (
          <AppCard app={app} isPython={isPython} key={app.name} />
        ))}
      </section>

      {visibleApps.length === 0 && (
        <p className="empty-archive">No such quest is recorded in the archives.</p>
      )}
    </main>
  );
}

export default App;
