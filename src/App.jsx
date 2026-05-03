import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "cruise-posts-v3";
const USER_KEY = "cruise-user-v3";
const MEETUP_KEY = "cruise-meetup-v3";
const CONFIG_KEY = "cruise-config-v1";
const BUDGET_KEY = "cruise-budget-v1";

const BUDGET_LOCATIONS = ["On Board","Miami, Florida","Harvest Caye, Belize","Roatán, Honduras","Cozumel, Mexico"];
const BUDGET_CATS = ["Food & Drink","Shopping","Excursion","Activity","Tip","Other"];

const ITINERARY = [
  { day: 1, date: "Sun May 24", port: "Miami, Florida", note: "Departs 4:00 PM", emoji: "🌴" },
  { day: 2, date: "Mon May 25", port: "At Sea", note: "Full day on the ship", emoji: "🌊" },
  { day: 3, date: "Tue May 26", port: "Harvest Caye, Belize", note: "Private island paradise", emoji: "🏝️" },
  { day: 4, date: "Wed May 27", port: "Roatán, Honduras", note: "Coral reefs & jungle", emoji: "🤿" },
  { day: 5, date: "Thu May 28", port: "Cozumel, Mexico", note: "Beaches & ancient ruins", emoji: "🐠" },
  { day: 6, date: "Fri May 29", port: "At Sea", note: "Full day on the ship", emoji: "🌊" },
  { day: 7, date: "Sat May 30", port: "At Sea", note: "Full day on the ship", emoji: "☀️" },
  { day: 8, date: "Sun May 31", port: "Miami, Florida", note: "Arrives — journey ends", emoji: "🏙️" },
];

const MEETUP_SPOTS = [
  "Pool Deck (Deck 15)", "Main Bar – Sugarcane", "The Biscayne Bar", "Spice H2O (Adults)",
  "Margaritaville Restaurant", "The Atrium (Deck 6)", "Casino", "Stardust Theater Lobby",
  "Buffet – Garden Café", "Deck 16 Hot Tubs", "Moderno Churrascaria Bar", "Haven Courtyard",
  "Splash Academy Lobby", "O'Sheehan's Bar & Grill", "Headliners Comedy Club",
];

const CHALLENGES_21_PLUS = [
  { emoji: "🎰", title: "Casino Face", desc: "Capture your most dramatic reaction at the casino — win or lose. Poker face NOT allowed.", port: null },
  { emoji: "🍸", title: "Bar Crawl Badge", desc: "Photo at 5 different bars on the Escape. Something different in hand at each one. Sugarcane, Biscayne, Maltings, Spice H2O, O'Sheehan's — go.", port: null },
  { emoji: "🌅", title: "Sunrise Club", desc: "Top deck at sunrise with a drink in hand — Bloody Mary or coffee both count. No noon cheating.", port: null },
  { emoji: "🎤", title: "Karaoke Commit", desc: "PERFORMING. Not watching, not cheering — performing. Worst song choice wins best photo.", port: null },
  { emoji: "🫗", title: "First Sip Reaction", desc: "Order something you've never tried. Someone photographs the exact first sip face. No re-dos.", port: null },
  { emoji: "🕺", title: "Last One Standing", desc: "Be the final person from the group on the dance floor. Photo must show the floor clearing around you.", port: null },
  { emoji: "🌊", title: "Hot Tub After Midnight", desc: "Spice H2O after 11pm, actual stars visible above. Thermometer optional. Proof required.", port: null },
  { emoji: "🥂", title: "Find the Celebration", desc: "Locate strangers celebrating something — toast with them, get the photo, make new friends.", port: null },
  { emoji: "🎲", title: "Superstition Documented", desc: "Film your casino ritual — lucky blow, chip arrangement, whatever it is. Own it publicly.", port: null },
  { emoji: "🌺", title: "Harvest Caye Local Drink", desc: "First drink you order on the private island. Document it in front of actual Caribbean water.", port: "Harvest Caye" },
  { emoji: "🐠", title: "Cozumel Cantina", desc: "Find a local spot in Cozumel (off the ship). Order something that isn't in the drink package.", port: "Cozumel" },
  { emoji: "🤿", title: "Roatán Rum", desc: "Any rum-based drink purchased in Roatán. Photo must include ocean or jungle in background.", port: "Roatán" },
  { emoji: "🍾", title: "Most Extra Drink", desc: "Find the most over-the-top drink on the ship — garnish, smoke, fire, umbrella — photograph it like a magazine cover.", port: null },
  { emoji: "🌙", title: "4AM Evidence", desc: "Prove you were still going at 4am. No context needed. Timestamp and vibe say everything.", port: null },
];

const CHALLENGES_UNDER_21 = [
  { emoji: "💦", title: "Cannonball Championship", desc: "Biggest splash off the pool deck. Mid-air photo required. Height AND form are judged.", port: null },
  { emoji: "🍹", title: "Mocktail Masterclass", desc: "Order the most ridiculous-looking mocktail or specialty drink on the ship. Drink package = no limit.", port: null },
  { emoji: "🍦", title: "Soft Serve Engineering", desc: "Build the most aggressively tall soft serve at the Garden Café. Document it standing, then document the collapse.", port: null },
  { emoji: "🐠", title: "Sea Creature Spotter", desc: "First to photograph a wild sea creature — dolphin, flying fish, turtle, ray. No aquarium cheating.", port: null },
  { emoji: "🏆", title: "Beat an Adult", desc: "Defeat a grown-up at mini golf, shuffleboard, or ping pong. Victory photo is legally required.", port: null },
  { emoji: "🏝️", title: "Harvest Caye First Splash", desc: "Document the exact moment you hit the water at Harvest Caye private island. Pure joy only.", port: "Harvest Caye" },
  { emoji: "🎠", title: "Highest Legal Point", desc: "Find the highest point on the Norwegian Escape you're allowed to access. Show how far up with ocean behind you.", port: null },
  { emoji: "🎯", title: "Arcade Trophy Shot", desc: "Win any prize from the arcade. Any prize. Hold it like it's Olympic gold.", port: null },
  { emoji: "🌄", title: "First Island Sighting", desc: "Be first in the group to spot land from the deck. Photograph that exact moment.", port: null },
  { emoji: "🍽️", title: "Buffet Architecture", desc: "Build the most structurally ambitious plate at Garden Café. Engineering project, not a meal.", port: null },
  { emoji: "🤿", title: "Roatán Wildlife Shot", desc: "Best photo of wild nature in Roatán — reef fish, monkey, tropical bird, anything real.", port: "Roatán" },
  { emoji: "🌊", title: "Wave Timing Master", desc: "Most dramatic ocean wave shot — spray, scale, power. Screensaver quality required.", port: null },
  { emoji: "🌟", title: "Real Stars Shot", desc: "Darkest spot on the Escape at night. Actual stars. No flash. No filter. Pure Caribbean sky.", port: null },
  { emoji: "🎭", title: "Reaction Sequence", desc: "Tell the same joke to 3 different people. Photograph all three reactions in order. Science.", port: null },
];

function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#C8963E", "#2A5F8F", "#1B4332", "#7B2D8B", "#C0392B", "#16697A"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, fontFamily: "'Playfair Display', serif", border: "2px solid rgba(200,150,62,0.35)" }}>
      {initials}
    </div>
  );
}

const goldBtn = { background: "linear-gradient(135deg,#C8963E,#a07030)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em", fontFamily: "'Lato', sans-serif" };
const blueBtn = { background: "linear-gradient(135deg,#1a6aaa,#0d4a7a)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Lato', sans-serif" };
const redBtn = { background: "linear-gradient(135deg,#c0392b,#922b21)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Lato', sans-serif" };
const ghostBtn = { background: "rgba(255,255,255,0.04)", color: "#8ab0d4", border: "1px solid rgba(200,150,62,0.18)", borderRadius: 10, padding: "12px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Lato', sans-serif" };
const inp = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,150,62,0.22)", borderRadius: 10, padding: "12px 14px", color: "#e8dfc8", fontSize: 15, width: "100%", fontFamily: "'Lato', sans-serif", outline: "none", boxSizing: "border-box" };

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [meetup, setMeetup] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  // Setup screen fields
  const [setupShip, setSetupShip] = useState("");
  const [setupDates, setSetupDates] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [setupPorts, setSetupPorts] = useState("");
  const [setupError, setSetupError] = useState("");
  const [setupRole, setSetupRole] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [caption, setCaption] = useState("");
  const [locationTag, setLocationTag] = useState("");
  const [image, setImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [locating, setLocating] = useState(false);
  const [ageGroup, setAgeGroup] = useState("21plus");
  const [spotlight, setSpotlight] = useState(null);
  // Meetup modal
  const [showMeetupModal, setShowMeetupModal] = useState(false);
  const [meetupSpot, setMeetupSpot] = useState(MEETUP_SPOTS[0]);
  const [meetupNote, setMeetupNote] = useState("");
  // Budget tracker state
  const [budget, setBudget] = useState({ expenses: [], kids: [], tripBudget: null });
  const [showAddExp, setShowAddExp] = useState(false);
  const [expAmt, setExpAmt] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expLoc, setExpLoc] = useState("On Board");
  const [expCat, setExpCat] = useState("Food & Drink");
  const [expFor, setExpFor] = useState("me");
  const [budgetView, setBudgetView] = useState("adults");
  const [showKidModal, setShowKidModal] = useState(false);
  const [kidName, setKidName] = useState("");
  const [kidAllowance, setKidAllowance] = useState("");
  const [showSetBudget, setShowSetBudget] = useState(false);
  const [tripBudgetInput, setTripBudgetInput] = useState("");
  const fileRef = useRef();
  const pollRef = useRef();

  useEffect(() => {
    const su = localStorage.getItem(USER_KEY);
    if (su) setUser(JSON.parse(su));
    const sc = localStorage.getItem(CONFIG_KEY);
    if (sc) setConfig(JSON.parse(sc));
    const sb = localStorage.getItem(BUDGET_KEY);
    if (sb) setBudget(JSON.parse(sb));
    loadPosts();
    loadMeetup();
    setSpotlight(CHALLENGES_21_PLUS[Math.floor(Math.random() * CHALLENGES_21_PLUS.length)]);
    setTimeout(() => {
      const cfg = localStorage.getItem(CONFIG_KEY);
      const usr = localStorage.getItem(USER_KEY);
      if (!cfg) { setScreen("setup"); return; }
      setScreen(usr ? "app" : "join");
    }, 1600);
    pollRef.current = setInterval(loadMeetup, 15000);
    return () => clearInterval(pollRef.current);
  }, []);

  async function loadPosts() {
    try { const r = await window.storage.get(STORAGE_KEY, true); if (r) setPosts(JSON.parse(r.value)); } catch { setPosts([]); }
  }

  async function loadMeetup() {
    try { const r = await window.storage.get(MEETUP_KEY, true); setMeetup(r ? JSON.parse(r.value) : null); } catch { setMeetup(null); }
  }

  async function savePosts(updated) {
    setPosts(updated);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(updated), true); } catch {}
  }

  async function postMeetup() {
    const m = { spot: meetupSpot, note: meetupNote.trim(), caller: user.name, time: new Date().toISOString() };
    try { await window.storage.set(MEETUP_KEY, JSON.stringify(m), true); } catch {}
    setMeetup(m); setShowMeetupModal(false); setMeetupNote("");
  }

  async function clearMeetup() {
    try { await window.storage.delete(MEETUP_KEY, true); } catch {}
    setMeetup(null);
  }

  function saveBudget(updated) {
    setBudget(updated);
    localStorage.setItem(BUDGET_KEY, JSON.stringify(updated));
  }

  function addExpense() {
    const amt = parseFloat(expAmt);
    if (!amt || amt <= 0) return;
    const exp = { id: Date.now().toString(), amount: amt, desc: expDesc.trim(), location: expLoc, category: expCat, whoFor: expFor, date: new Date().toISOString() };
    saveBudget({ ...budget, expenses: [exp, ...budget.expenses] });
    setExpAmt(""); setExpDesc(""); setExpLoc("On Board"); setExpCat("Food & Drink"); setExpFor("me"); setShowAddExp(false);
  }

  function deleteExpense(id) {
    saveBudget({ ...budget, expenses: budget.expenses.filter(e => e.id !== id) });
  }

  function addKid() {
    if (!kidName.trim()) return;
    const allowance = parseFloat(kidAllowance) || 0;
    saveBudget({ ...budget, kids: [...budget.kids, { id: Date.now().toString(), name: kidName.trim(), allowance }] });
    setKidName(""); setKidAllowance(""); setShowKidModal(false);
  }

  function removeKid(kidId) {
    saveBudget({ ...budget, kids: budget.kids.filter(k => k.id !== kidId), expenses: budget.expenses.filter(e => e.whoFor !== budget.kids.find(k => k.id === kidId)?.name) });
  }

  function setTripBudget() {
    const val = parseFloat(tripBudgetInput);
    saveBudget({ ...budget, tripBudget: val > 0 ? val : null });
    setTripBudgetInput(""); setShowSetBudget(false);
  }

  function handleJoin() {
    if (codeInput.trim().toUpperCase() !== (config?.inviteCode || "").toUpperCase()) { setCodeError("Invalid code — ask your organizer!"); return; }
    if (!nameInput.trim()) { setCodeError("Enter your name first."); return; }
    const u = { name: nameInput.trim(), joined: new Date().toISOString() };
    setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); setScreen("app");
  }

  function handleSetupSave() {
    if (!setupShip.trim()) { setSetupError("Enter the ship name."); return; }
    if (!setupDates.trim()) { setSetupError("Enter the cruise dates."); return; }
    if (!setupCode.trim()) { setSetupError("Create an invite code for your guests."); return; }
    const cfg = {
      ship: setupShip.trim(),
      dates: setupDates.trim(),
      inviteCode: setupCode.trim().toUpperCase(),
      ports: setupPorts.trim() || "",
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    setConfig(cfg);
    if (setupRole === "organizer") {
      const u = { name: "Organizer", joined: new Date().toISOString() };
      setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); setScreen("app");
    } else {
      setScreen("join");
    }
  }

  function pickImage(e) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => setImage(ev.target.result); r.readAsDataURL(file);
  }

  function geoLocate() {
    setLocating(true);
    if (!navigator.geolocation) { setLocationTag("Unavailable"); setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      p => { setLocationTag(`${p.coords.latitude.toFixed(4)}°, ${p.coords.longitude.toFixed(4)}°`); setLocating(false); },
      () => { setLocationTag("Unavailable"); setLocating(false); }
    );
  }

  async function handlePost() {
    if (!image && !caption.trim()) return;
    const post = { id: Date.now().toString(), author: user.name, caption: caption.trim(), location: locationTag.trim(), image, timestamp: new Date().toISOString(), likes: [], comments: [] };
    await savePosts([post, ...posts]);
    setImage(null); setCaption(""); setLocationTag(""); setActiveTab("feed");
  }

  async function toggleLike(id) {
    await savePosts(posts.map(p => p.id !== id ? p : { ...p, likes: p.likes.includes(user.name) ? p.likes.filter(n => n !== user.name) : [...p.likes, user.name] }));
  }

  async function addComment(postId) {
    const text = (commentInputs[postId] || "").trim(); if (!text) return;
    await savePosts(posts.map(p => p.id !== postId ? p : { ...p, comments: [...p.comments, { author: user.name, text, time: new Date().toISOString() }] }));
    setCommentInputs(c => ({ ...c, [postId]: "" }));
  }

  const fmt = iso => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const fmtShort = iso => { const d = new Date(iso); return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); };
  const challenges = ageGroup === "21plus" ? CHALLENGES_21_PLUS : CHALLENGES_UNDER_21;

  const fonts = <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet" />;
  const cardStyle = { background: "linear-gradient(180deg,#0e1e38 0%,#0a1628 100%)", borderRadius: 16, margin: "10px 13px", border: "1px solid rgba(200,150,62,0.12)", overflow: "hidden" };
  const tabStyle = a => ({ flex: 1, padding: "10px 0", textAlign: "center", cursor: "pointer", fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: a ? "#C8963E" : "#1a3a5a", background: "none", border: "none", borderBottom: `2px solid ${a ? "#C8963E" : "transparent"}`, transition: "all 0.2s", fontFamily: "'Lato', sans-serif", fontWeight: a ? 700 : 400 });

  if (screen === "splash") return (
    <div style={{ minHeight: "100vh", background: "#080f1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lato', sans-serif" }}>
      {fonts}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72 }}>🛳️</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#C8963E", marginTop: 14 }}>Bon Voyage</div>
        <div style={{ fontSize: 11, color: "#1a3a5a", letterSpacing: "0.18em", marginTop: 10, textTransform: "uppercase" }}>{config?.ship || "Norwegian Escape"} · {config?.dates || ""}</div>
      </div>
    </div>
  );

  if (screen === "setup") return (
    <div style={{ minHeight: "100vh", background: "#080f1e", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Lato', sans-serif" }}>
      {fonts}
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 56 }}>🧭</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#C8963E", marginTop: 12 }}>Set Up Your Voyage</div>
          <div style={{ fontSize: 13, color: "#4a6a8a", marginTop: 6, fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>First time here — let's get your group app ready.</div>
        </div>

        {!setupRole && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: "#3a5a7a", textAlign: "center", marginBottom: 4 }}>Who are you?</div>
            <button onClick={() => setSetupRole("organizer")} style={{ ...goldBtn, width: "100%", padding: 16, fontSize: 15 }}>
              🎩 I'm the Organizer
            </button>
            <button onClick={() => setSetupRole("guest")} style={{ ...ghostBtn, width: "100%", padding: 16, fontSize: 15 }}>
              🧳 I'm a Guest
            </button>
            <div style={{ fontSize: 11, color: "#1a3a5a", textAlign: "center", marginTop: 4 }}>
              Guests will be asked for the invite code the organizer creates.
            </div>
          </div>
        )}

        {setupRole === "guest" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#4a6a8a", marginBottom: 20, lineHeight: 1.7 }}>
              The organizer needs to set up the app first.<br/>Ask them to open it and create the invite code.
            </div>
            <button onClick={() => setSetupRole(null)} style={{ ...ghostBtn }}>← Go back</button>
          </div>
        )}

        {setupRole === "organizer" && (
          <div style={{ background: "rgba(200,150,62,0.06)", border: "1px solid rgba(200,150,62,0.2)", borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 11, color: "#C8963E", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Trip Details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 6, letterSpacing: "0.08em" }}>SHIP NAME</div>
                <input style={inp} placeholder="e.g. Norwegian Escape" value={setupShip} onChange={e => setSetupShip(e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 6, letterSpacing: "0.08em" }}>CRUISE DATES</div>
                <input style={inp} placeholder="e.g. May 24 – 31, 2026" value={setupDates} onChange={e => setSetupDates(e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 6, letterSpacing: "0.08em" }}>PORTS (optional)</div>
                <input style={inp} placeholder="e.g. Cozumel · Belize · Roatán" value={setupPorts} onChange={e => setSetupPorts(e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 6, letterSpacing: "0.08em" }}>CREATE AN INVITE CODE</div>
                <input style={{ ...inp, letterSpacing: "0.2em", textTransform: "uppercase" }} placeholder="e.g. MYSHIP2026"
                  value={setupCode} onChange={e => setSetupCode(e.target.value)} />
                <div style={{ fontSize: 11, color: "#1a3a5a", marginTop: 6 }}>Share this code with your guests so they can join.</div>
              </div>
              {setupError && <div style={{ color: "#e07070", fontSize: 13, textAlign: "center" }}>{setupError}</div>}
              <button style={{ ...goldBtn, width: "100%", padding: 16, fontSize: 15, marginTop: 4 }} onClick={handleSetupSave}>
                Launch App ⚓
              </button>
              <button onClick={() => { setSetupRole(null); setSetupError(""); }} style={{ background: "none", border: "none", color: "#1a3a5a", fontSize: 12, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (screen === "join") return (
    <div style={{ minHeight: "100vh", background: "#080f1e", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Lato', sans-serif" }}>
      {fonts}
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 60 }}>⚓</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#C8963E", marginTop: 12 }}>{config?.ship || "Norwegian Escape"}</div>
          <div style={{ fontSize: 13, color: "#4a6a8a", marginTop: 4, fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>Private Group · Come Aboard</div>
          <div style={{ fontSize: 11, color: "#1a3a5a", marginTop: 5, letterSpacing: "0.1em" }}>{config?.dates}{config?.ports ? ` · ${config.ports}` : ""}</div>
        </div>
        <div style={{ background: "rgba(200,150,62,0.06)", border: "1px solid rgba(200,150,62,0.18)", borderRadius: 18, padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input style={inp} placeholder="Your full name" value={nameInput} onChange={e => setNameInput(e.target.value)} />
            <input style={{ ...inp, letterSpacing: "0.2em", textTransform: "uppercase" }} placeholder="INVITE CODE"
              value={codeInput} onChange={e => { setCodeInput(e.target.value); setCodeError(""); }}
              onKeyDown={e => e.key === "Enter" && handleJoin()} />
            {codeError && <div style={{ color: "#e07070", fontSize: 13, textAlign: "center" }}>{codeError}</div>}
            <button style={{ ...goldBtn, width: "100%", padding: 16, fontSize: 15, marginTop: 4 }} onClick={handleJoin}>Come Aboard ⚓</button>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 11, color: "#1a3a5a", marginTop: 14 }}>Don't have the code? Ask your trip organizer.</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080f1e", fontFamily: "'Lato', sans-serif", color: "#e8dfc8", maxWidth: 480, margin: "0 auto" }}>
      {fonts}

      {/* MEETUP MODAL */}
      {showMeetupModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "linear-gradient(180deg,#0e1e38,#080f1e)", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 480, border: "1px solid rgba(200,150,62,0.25)", borderBottom: "none" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C8963E", marginBottom: 4 }}>📍 Call a Meet-Up</div>
            <div style={{ fontSize: 13, color: "#3a5a7a", marginBottom: 20 }}>Everyone will see your alert immediately on their feed.</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#3a5a7a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Pick a spot on the ship</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, maxHeight: 220, overflowY: "auto" }}>
                {MEETUP_SPOTS.map(s => (
                  <button key={s} onClick={() => setMeetupSpot(s)}
                    style={{ padding: "9px 10px", borderRadius: 10, fontSize: 12, cursor: "pointer", fontFamily: "'Lato', sans-serif", textAlign: "left", lineHeight: 1.3, background: meetupSpot === s ? "linear-gradient(135deg,#C8963E,#a07030)" : "rgba(255,255,255,0.04)", color: meetupSpot === s ? "#fff" : "#5a7a9a", border: meetupSpot === s ? "none" : "1px solid rgba(200,150,62,0.12)", transition: "all 0.15s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <input style={{ ...inp, marginBottom: 14 }} placeholder="Optional note (e.g. 'Grab a drink!' or '10 mins!')"
              value={meetupNote} onChange={e => setMeetupNote(e.target.value)} />

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...ghostBtn, flex: 1 }} onClick={() => setShowMeetupModal(false)}>Cancel</button>
              <button style={{ ...redBtn, flex: 2, padding: "13px 0", fontSize: 15 }} onClick={postMeetup}>
                🚨 Alert the Crew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0b1a32,#162d4a)", borderBottom: "1px solid rgba(200,150,62,0.28)", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#C8963E" }}>🛳️ {config?.ship || "Norwegian Escape"}</div>
            <div style={{ fontSize: 10, color: "#1a3a5a", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>{config?.dates || ""}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* MEET UP BUTTON */}
            <button onClick={() => setShowMeetupModal(true)}
              style={{ background: "linear-gradient(135deg,#c0392b,#922b21)", border: "none", borderRadius: 10, padding: "8px 12px", color: "#fff", fontWeight: 900, fontSize: 12, cursor: "pointer", fontFamily: "'Lato', sans-serif", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 5, animation: "pulse 2s infinite" }}>
              📍 Meet Up!
            </button>
            <Avatar name={user.name} size={32} />
          </div>
        </div>
      </div>

      {/* LIVE MEETUP BANNER */}
      {meetup && (
        <div style={{ margin: "10px 13px 0", background: "linear-gradient(135deg,rgba(192,57,43,0.2),rgba(192,57,43,0.08))", border: "1px solid rgba(192,57,43,0.5)", borderRadius: 14, padding: "13px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ fontSize: 28, lineHeight: 1 }}>🚨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: "#e07070", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>Meet-Up Alert · {fmtShort(meetup.time)}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#fff", marginBottom: 2 }}>{meetup.spot}</div>
            {meetup.note && <div style={{ fontSize: 13, color: "#a0b0c0", marginBottom: 3 }}>"{meetup.note}"</div>}
            <div style={{ fontSize: 11, color: "#4a6a8a" }}>Called by {meetup.caller}</div>
          </div>
          <button onClick={clearMeetup} style={{ background: "none", border: "none", color: "#3a5a7a", cursor: "pointer", fontSize: 18, padding: 0 }}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", background: "#0b1828", borderBottom: "1px solid rgba(200,150,62,0.1)", marginTop: meetup ? 10 : 0 }}>
        {[["feed","📸","Feed"],["post","➕","Share"],["challenges","🎯","Missions"],["leaderboard","🏆","Ranks"],["budget","💰","Budget"],["trip","🗺️","Trip"]].map(([id,emoji,label]) => (
          <button key={id} style={{ ...tabStyle(activeTab === id), display:"flex", flexDirection:"column", alignItems:"center", gap:1, padding:"7px 0" }} onClick={() => setActiveTab(id)}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* FEED */}
      {activeTab === "feed" && (
        <div style={{ paddingBottom: 80 }}>
          {posts.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 24px" }}>
              <div style={{ fontSize: 54 }}>🌊</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C8963E", margin: "14px 0 8px" }}>No memories yet!</div>
              <div style={{ color: "#1a3a5a", fontSize: 14, lineHeight: 1.6 }}>Be the first to share a moment from the voyage.</div>
              <button style={{ ...goldBtn, marginTop: 20 }} onClick={() => setActiveTab("post")}>Share First 📸</button>
            </div>
          )}
          {posts.map(post => (
            <div key={post.id} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
                <Avatar name={post.author} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#e8dfc8" }}>{post.author}</div>
                  <div style={{ fontSize: 11, color: "#1a3a5a" }}>{fmt(post.timestamp)}</div>
                </div>
                {post.location && <div style={{ fontSize: 11, color: "#4a6a8a", maxWidth: 120, textAlign: "right", lineHeight: 1.3 }}>📍 {post.location}</div>}
              </div>
              {post.image && <img src={post.image} alt="" style={{ width: "100%", maxHeight: 380, objectFit: "cover", display: "block" }} />}
              {post.caption && <div style={{ padding: "12px 14px 8px", fontSize: 15, lineHeight: 1.55, color: "#b0c8e0" }}>{post.caption}</div>}
              <div style={{ display: "flex", gap: 18, padding: "8px 14px 13px" }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0, color: post.likes.includes(user.name) ? "#C8963E" : "#1a3a5a", fontSize: 20 }} onClick={() => toggleLike(post.id)}>
                  {post.likes.includes(user.name) ? "❤️" : "🤍"} <span style={{ fontSize: 13 }}>{post.likes.length}</span>
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0, color: "#1a3a5a", fontSize: 20 }} onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                  💬 <span style={{ fontSize: 13 }}>{post.comments.length}</span>
                </button>
              </div>
              {expandedPost === post.id && (
                <div style={{ borderTop: "1px solid rgba(200,150,62,0.09)", padding: "12px 14px" }}>
                  {post.comments.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <Avatar name={c.author} size={28} />
                      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "7px 12px", flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#C8963E", marginBottom: 2 }}>{c.author}</div>
                        <div style={{ fontSize: 13, color: "#a0b8d0" }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <input style={{ ...inp, fontSize: 13, padding: "8px 12px", flex: 1 }} placeholder="Add a comment…"
                      value={commentInputs[post.id] || ""} onChange={e => setCommentInputs(c => ({ ...c, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && addComment(post.id)} />
                    <button style={{ ...goldBtn, padding: "8px 14px" }} onClick={() => addComment(post.id)}>➤</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POST */}
      {activeTab === "post" && (
        <div style={{ padding: 16, paddingBottom: 80 }}>
          {spotlight && (
            <div style={{ background: "linear-gradient(135deg,rgba(200,150,62,0.12),rgba(200,150,62,0.03))", border: "1px solid rgba(200,150,62,0.22)", borderRadius: 14, padding: "13px 15px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#3a5a7a", letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: 4 }}>✨ Mission Spotlight</div>
              <div style={{ fontSize: 22, marginBottom: 3 }}>{spotlight.emoji}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#C8963E", marginBottom: 4 }}>{spotlight.title}</div>
              <div style={{ fontSize: 12, color: "#4a6a8a", lineHeight: 1.55 }}>{spotlight.desc}</div>
              {spotlight.port && <div style={{ fontSize: 11, color: "#2a4a6a", marginTop: 5 }}>📍 Port challenge: {spotlight.port}</div>}
              <button style={{ background: "none", border: "none", color: "#1a3a5a", fontSize: 12, cursor: "pointer", marginTop: 6, padding: 0, fontFamily: "'Lato', sans-serif" }}
                onClick={() => { const p = ageGroup === "21plus" ? CHALLENGES_21_PLUS : CHALLENGES_UNDER_21; setSpotlight(p[Math.floor(Math.random() * p.length)]); }}>
                🔀 Swap mission
              </button>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={pickImage} />
          {image ? (
            <div style={{ position: "relative", marginBottom: 14, borderRadius: 14, overflow: "hidden" }}>
              <img src={image} alt="" style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }} />
              <button onClick={() => setImage(null)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
          ) : (
            <button style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "2px dashed rgba(200,150,62,0.22)", borderRadius: 14, padding: "32px 0", cursor: "pointer", marginBottom: 14, color: "#2a4a6a", fontSize: 14, fontFamily: "'Lato', sans-serif" }}
              onClick={() => fileRef.current.click()}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
              <div>Tap to take or choose a photo</div>
            </button>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <textarea style={{ ...inp, minHeight: 80, resize: "none" }} placeholder="Tell the story… add a caption"
              value={caption} onChange={e => setCaption(e.target.value)} />
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inp, flex: 1 }} placeholder="📍 e.g. Cozumel, Spice H2O, Roatán…"
                value={locationTag} onChange={e => setLocationTag(e.target.value)} />
              <button style={{ ...ghostBtn, padding: "12px 14px", fontSize: 18 }} onClick={geoLocate} disabled={locating}>{locating ? "…" : "📡"}</button>
            </div>
            <button style={{ ...goldBtn, width: "100%", padding: 15, fontSize: 15, opacity: (!image && !caption.trim()) ? 0.4 : 1 }} onClick={handlePost} disabled={!image && !caption.trim()}>
              🌊 Share with the Crew
            </button>
          </div>
        </div>
      )}

      {/* CHALLENGES */}
      {activeTab === "challenges" && (
        <div style={{ paddingBottom: 80 }}>
          <div style={{ padding: "18px 16px 8px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C8963E" }}>Photo Missions</div>
            <div style={{ fontSize: 11, color: "#1a3a5a", marginTop: 4 }}>Everyone has the drink package — use it 🍹</div>
          </div>

          <div style={{ display: "flex", gap: 8, padding: "10px 14px 13px" }}>
            <button onClick={() => setAgeGroup("21plus")} style={{ flex: 1, padding: "11px 0", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Lato', sans-serif", ...(ageGroup === "21plus" ? goldBtn : ghostBtn), width: "auto" }}>🍸 21+ Crew</button>
            <button onClick={() => setAgeGroup("under21")} style={{ flex: 1, padding: "11px 0", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Lato', sans-serif", ...(ageGroup === "under21" ? blueBtn : ghostBtn), width: "auto" }}>🏄 Under 21</button>
          </div>

          <div style={{ padding: "0 13px", display: "flex", flexDirection: "column", gap: 9 }}>
            {challenges.map((c, i) => (
              <div key={i} style={{ background: "linear-gradient(135deg,#0e1e38,#0a1628)", border: `1px solid ${c.port ? "rgba(26,170,106,0.22)" : (ageGroup === "21plus" ? "rgba(200,150,62,0.13)" : "rgba(26,106,170,0.17)")}`, borderRadius: 14, padding: "12px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ fontSize: 24, lineHeight: 1, paddingTop: 3, flexShrink: 0 }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: ageGroup === "21plus" ? "#C8963E" : "#4aA0d8" }}>{c.title}</div>
                    {c.port && <div style={{ fontSize: 10, background: "rgba(26,170,106,0.15)", color: "#4aaa7a", borderRadius: 99, padding: "2px 7px", letterSpacing: "0.06em", flexShrink: 0 }}>{c.port}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: "#2a4a6a", lineHeight: 1.5 }}>{c.desc}</div>
                </div>
                <button style={{ ...(ageGroup === "21plus" ? goldBtn : blueBtn), padding: "7px 12px", fontSize: 12, flexShrink: 0, alignSelf: "center" }}
                  onClick={() => { setSpotlight(c); setActiveTab("post"); }}>Go</button>
              </div>
            ))}
          </div>

          <div style={{ margin: "14px 13px 20px", background: "rgba(200,150,62,0.06)", border: "1px solid rgba(200,150,62,0.15)", borderRadius: 16, padding: 18, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#C8963E", marginBottom: 5 }}>🏆 Group Goal</div>
            <div style={{ fontSize: 13, color: "#2a4a6a", lineHeight: 1.7 }}>50 photos across 8 days. Every moment counts.</div>
            <div style={{ fontSize: 30, fontFamily: "'Playfair Display', serif", color: "#C8963E", margin: "8px 0 5px" }}>
              {posts.filter(p => p.image).length} <span style={{ fontSize: 14, color: "#1a3a5a" }}>/ 50</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 99, height: 7, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#C8963E,#f0c060)", width: `${Math.min(100, (posts.filter(p => p.image).length / 50) * 100)}%`, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD */}
      {activeTab === "leaderboard" && (() => {
        const photoPosts = posts.filter(p => p.image);
        const tally = {};
        photoPosts.forEach(p => {
          if (!tally[p.author]) tally[p.author] = { photos: 0, likes: 0, latest: p.timestamp };
          tally[p.author].photos += 1;
          tally[p.author].likes += p.likes.length;
          if (p.timestamp > tally[p.author].latest) tally[p.author].latest = p.timestamp;
        });
        const ranked = Object.entries(tally)
          .map(([name, s]) => ({ name, ...s }))
          .sort((a, b) => b.photos - a.photos || b.likes - a.likes);
        const podiumOrder = ranked.length >= 3 ? [ranked[1], ranked[0], ranked[2]] : ranked.length === 2 ? [ranked[1], ranked[0]] : ranked;
        const podiumHeight = ["70px", "100px", "50px"];
        const podiumColor = ["rgba(180,180,200,0.18)", "linear-gradient(180deg,rgba(200,150,62,0.32),rgba(200,150,62,0.08))", "rgba(180,130,80,0.15)"];
        const podiumBorder = ["rgba(180,180,200,0.25)", "rgba(200,150,62,0.55)", "rgba(180,130,80,0.3)"];
        const podiumLabel = ["🥈 2nd", "🥇 1st", "🥉 3rd"];
        const podiumIdx = ranked.length >= 3 ? [1, 0, 2] : ranked.length === 2 ? [1, 0] : [0];

        return (
          <div style={{ paddingBottom: 80 }}>
            <div style={{ padding: "20px 16px 6px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C8963E" }}>🏆 Photo Leaderboard</div>
              <div style={{ fontSize: 11, color: "#1a3a5a", marginTop: 4, letterSpacing: "0.05em" }}>Ranked by photos posted · ties broken by likes</div>
            </div>

            {ranked.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 24px" }}>
                <div style={{ fontSize: 54 }}>📷</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#C8963E", margin: "14px 0 8px" }}>No shots posted yet</div>
                <div style={{ color: "#1a3a5a", fontSize: 13, lineHeight: 1.6 }}>Be the first — post a photo to claim the top spot.</div>
                <button style={{ ...goldBtn, marginTop: 20 }} onClick={() => setActiveTab("post")}>Post a Photo 📸</button>
              </div>
            ) : (
              <>
                {/* PODIUM */}
                {ranked.length >= 2 && (
                  <div style={{ margin: "24px 13px 8px", background: "linear-gradient(180deg,#0e1e38,#0a1628)", border: "1px solid rgba(200,150,62,0.12)", borderRadius: 20, padding: "24px 16px 0", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10 }}>
                      {podiumOrder.map((person, i) => {
                        const realRank = podiumIdx[i];
                        const isFirst = realRank === 0;
                        return (
                          <div key={person.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 130 }}>
                            {isFirst && (
                              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>👑</div>
                            )}
                            <Avatar name={person.name} size={isFirst ? 52 : 40} />
                            <div style={{ fontSize: isFirst ? 13 : 11, fontWeight: 700, color: isFirst ? "#e8dfc8" : "#8ab0d4", marginTop: 6, textAlign: "center", lineHeight: 1.3, maxWidth: "100%" }}>
                              {person.name.split(" ")[0]}
                            </div>
                            <div style={{ fontSize: 11, color: "#C8963E", marginTop: 2 }}>
                              {person.photos} photo{person.photos !== 1 ? "s" : ""}
                            </div>
                            <div style={{
                              width: "100%", marginTop: 10,
                              height: podiumHeight[i],
                              background: podiumColor[i],
                              border: `1px solid ${podiumBorder[i]}`,
                              borderBottom: "none",
                              borderRadius: "10px 10px 0 0",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <div style={{ fontSize: isFirst ? 14 : 12, fontWeight: 700, color: isFirst ? "#C8963E" : "#4a6a8a", fontFamily: "'Lato', sans-serif" }}>
                                {podiumLabel[i]}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* RANKED LIST */}
                <div style={{ padding: "14px 13px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                  {ranked.map((person, i) => {
                    const rankColors = ["#C8963E", "#9aabb8", "#b07a40"];
                    const rankBg = i === 0
                      ? "linear-gradient(135deg,#0e1e38,#1a2e48)"
                      : "linear-gradient(135deg,#0e1e38,#0a1628)";
                    const rankBorder = i === 0
                      ? "rgba(200,150,62,0.35)"
                      : i === 1 ? "rgba(154,171,184,0.2)"
                      : i === 2 ? "rgba(176,122,64,0.2)"
                      : "rgba(200,150,62,0.08)";
                    return (
                      <div key={person.name} style={{ background: rankBg, border: `1px solid ${rankBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < 3 ? `${rankColors[i]}22` : "rgba(255,255,255,0.04)", border: `1px solid ${i < 3 ? rankColors[i] : "rgba(200,150,62,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: i < 3 ? rankColors[i] : "#2a4a6a" }}>
                            {i + 1}
                          </span>
                        </div>
                        <Avatar name={person.name} size={38} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#e8dfc8" : "#8ab0d4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {person.name} {person.name === user.name ? <span style={{ fontSize: 10, color: "#C8963E", fontStyle: "italic" }}>(you)</span> : ""}
                          </div>
                          <div style={{ fontSize: 11, color: "#2a4a6a", marginTop: 2 }}>
                            ❤️ {person.likes} like{person.likes !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: i === 0 ? "#C8963E" : i === 1 ? "#9aabb8" : i === 2 ? "#b07a40" : "#2a4a6a" }}>
                            {person.photos}
                          </div>
                          <div style={{ fontSize: 10, color: "#1a3a5a", letterSpacing: "0.06em" }}>PHOTO{person.photos !== 1 ? "S" : ""}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* MY RANK CALLOUT */}
                {(() => {
                  const myRank = ranked.findIndex(p => p.name === user.name);
                  const myStats = tally[user.name];
                  if (myRank === -1) return (
                    <div style={{ margin: "14px 13px 0", background: "rgba(200,150,62,0.05)", border: "1px solid rgba(200,150,62,0.12)", borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 13, color: "#1a3a5a", lineHeight: 1.7 }}>You haven't posted a photo yet.</div>
                      <button style={{ ...goldBtn, marginTop: 10, padding: "10px 20px", fontSize: 13 }} onClick={() => setActiveTab("post")}>Get on the board 📸</button>
                    </div>
                  );
                  const next = ranked[myRank - 1];
                  const gap = next ? next.photos - myStats.photos : 0;
                  return (
                    <div style={{ margin: "14px 13px 0", background: "rgba(200,150,62,0.06)", border: "1px solid rgba(200,150,62,0.18)", borderRadius: 14, padding: "14px 16px" }}>
                      <div style={{ fontSize: 11, color: "#C8963E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Your Standing</div>
                      {myRank === 0 ? (
                        <div style={{ fontSize: 13, color: "#8ab0d4", lineHeight: 1.7 }}>
                          👑 You're <strong style={{ color: "#C8963E" }}>in first place</strong> with {myStats.photos} photo{myStats.photos !== 1 ? "s" : ""}. Keep going.
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: "#8ab0d4", lineHeight: 1.7 }}>
                          You're <strong style={{ color: "#C8963E" }}>#{myRank + 1}</strong> with {myStats.photos} photo{myStats.photos !== 1 ? "s" : ""}.
                          {gap > 0 && <> Post <strong style={{ color: "#C8963E" }}>{gap} more</strong> to pass {next.name.split(" ")[0]}.</>}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        );
      })()}

      {/* BUDGET TRACKER */}
      {activeTab === "budget" && (() => {
        const fmt$ = n => `$${n.toFixed(2)}`;
        const adultExp = budget.expenses.filter(e => e.whoFor === "me");
        const adultTotal = adultExp.reduce((s, e) => s + e.amount, 0);
        const allTotal = budget.expenses.reduce((s, e) => s + e.amount, 0);
        const cap = budget.tripBudget;

        // Per-location totals (adults)
        const byLoc = {};
        BUDGET_LOCATIONS.forEach(l => { byLoc[l] = adultExp.filter(e => e.location === l).reduce((s, e) => s + e.amount, 0); });

        const catColor = { "Food & Drink":"#C8963E", "Shopping":"#4a9adf", "Excursion":"#3aaa7a", "Activity":"#9a6adf", "Tip":"#df8a3a", "Other":"#4a6a8a" };

        return (
          <div style={{ paddingBottom: 100 }}>

            {/* ADD EXPENSE MODAL */}
            {showAddExp && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                <div style={{ background:"linear-gradient(180deg,#0e1e38,#080f1e)", borderRadius:"24px 24px 0 0", padding:24, width:"100%", maxWidth:480, border:"1px solid rgba(200,150,62,0.25)", borderBottom:"none" }}>
                  <div style={{ fontFamily:"'Playfair Display', serif", fontSize:20, color:"#C8963E", marginBottom:18 }}>💸 Log an Expense</div>

                  <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.08em", marginBottom:6 }}>AMOUNT ($)</div>
                      <input style={{ ...inp, fontSize:20, fontWeight:700, color:"#C8963E" }} type="number" inputMode="decimal" placeholder="0.00"
                        value={expAmt} onChange={e => setExpAmt(e.target.value)} />
                    </div>
                    <div style={{ flex:2 }}>
                      <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.08em", marginBottom:6 }}>DESCRIPTION</div>
                      <input style={inp} placeholder="e.g. Souvenir hat" value={expDesc} onChange={e => setExpDesc(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.08em", marginBottom:6 }}>LOCATION</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {BUDGET_LOCATIONS.map(l => (
                        <button key={l} onClick={() => setExpLoc(l)} style={{ padding:"7px 11px", borderRadius:10, fontSize:11, cursor:"pointer", fontFamily:"'Lato', sans-serif", background: expLoc===l ? "linear-gradient(135deg,#C8963E,#a07030)" : "rgba(255,255,255,0.04)", color: expLoc===l ? "#fff" : "#5a7a9a", border: expLoc===l ? "none" : "1px solid rgba(200,150,62,0.15)" }}>
                          {l === "On Board" ? "🛳️ On Board" : l.split(",")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.08em", marginBottom:6 }}>CATEGORY</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {BUDGET_CATS.map(c => (
                        <button key={c} onClick={() => setExpCat(c)} style={{ padding:"7px 11px", borderRadius:10, fontSize:11, cursor:"pointer", fontFamily:"'Lato', sans-serif", background: expCat===c ? (catColor[c]+"33") : "rgba(255,255,255,0.04)", color: expCat===c ? catColor[c] : "#5a7a9a", border:`1px solid ${expCat===c ? catColor[c]+"66" : "rgba(200,150,62,0.15)"}` }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {budget.kids.length > 0 && (
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.08em", marginBottom:6 }}>FOR</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {[{id:"me", name:"Me (Adults)"},...budget.kids].map(k => (
                          <button key={k.id||k.name} onClick={() => setExpFor(k.id||k.name)} style={{ padding:"7px 11px", borderRadius:10, fontSize:11, cursor:"pointer", fontFamily:"'Lato', sans-serif", background: expFor===(k.id||k.name) ? "linear-gradient(135deg,#1a6aaa,#0d4a7a)" : "rgba(255,255,255,0.04)", color: expFor===(k.id||k.name) ? "#fff" : "#5a7a9a", border:`1px solid ${expFor===(k.id||k.name) ? "transparent" : "rgba(200,150,62,0.15)"}` }}>
                            {k.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display:"flex", gap:10 }}>
                    <button style={{ ...ghostBtn, flex:1 }} onClick={() => { setShowAddExp(false); setExpAmt(""); setExpDesc(""); }}>Cancel</button>
                    <button style={{ ...goldBtn, flex:2, padding:"13px 0", fontSize:15 }} onClick={addExpense} disabled={!expAmt || parseFloat(expAmt) <= 0}>
                      ✓ Add Expense
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADD KID MODAL */}
            {showKidModal && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                <div style={{ background:"linear-gradient(180deg,#0e1e38,#080f1e)", borderRadius:"24px 24px 0 0", padding:24, width:"100%", maxWidth:480, border:"1px solid rgba(200,150,62,0.25)", borderBottom:"none" }}>
                  <div style={{ fontFamily:"'Playfair Display', serif", fontSize:20, color:"#C8963E", marginBottom:18 }}>👧 Add a Kid's Wallet</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:18 }}>
                    <div>
                      <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.08em", marginBottom:6 }}>KID'S NAME</div>
                      <input style={inp} placeholder="e.g. Emma" value={kidName} onChange={e => setKidName(e.target.value)} />
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.08em", marginBottom:6 }}>TOTAL ALLOWANCE ($)</div>
                      <input style={{ ...inp, fontSize:18, fontWeight:700, color:"#4a9adf" }} type="number" inputMode="decimal" placeholder="0.00"
                        value={kidAllowance} onChange={e => setKidAllowance(e.target.value)} />
                      <div style={{ fontSize:11, color:"#1a3a5a", marginTop:5 }}>Set $0 for no spending limit.</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    <button style={{ ...ghostBtn, flex:1 }} onClick={() => { setShowKidModal(false); setKidName(""); setKidAllowance(""); }}>Cancel</button>
                    <button style={{ ...blueBtn, flex:2, padding:"13px 0", fontSize:15 }} onClick={addKid}>Add Wallet 👛</button>
                  </div>
                </div>
              </div>
            )}

            {/* SET TRIP BUDGET MODAL */}
            {showSetBudget && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                <div style={{ background:"linear-gradient(180deg,#0e1e38,#080f1e)", borderRadius:"24px 24px 0 0", padding:24, width:"100%", maxWidth:480, border:"1px solid rgba(200,150,62,0.25)", borderBottom:"none" }}>
                  <div style={{ fontFamily:"'Playfair Display', serif", fontSize:20, color:"#C8963E", marginBottom:6 }}>🎯 Set Trip Budget</div>
                  <div style={{ fontSize:13, color:"#3a5a7a", marginBottom:18 }}>Your total spending target for adults (excludes kids' allowances).</div>
                  <input style={{ ...inp, fontSize:22, fontWeight:700, color:"#C8963E", marginBottom:16 }} type="number" inputMode="decimal" placeholder="e.g. 500.00"
                    value={tripBudgetInput} onChange={e => setTripBudgetInput(e.target.value)} />
                  <div style={{ display:"flex", gap:10 }}>
                    <button style={{ ...ghostBtn, flex:1 }} onClick={() => setShowSetBudget(false)}>Cancel</button>
                    <button style={{ ...goldBtn, flex:2, padding:"13px 0", fontSize:15 }} onClick={setTripBudget}>Save Budget</button>
                  </div>
                </div>
              </div>
            )}

            {/* HEADER SUMMARY CARD */}
            <div style={{ margin:"14px 13px 0", background:"linear-gradient(135deg,#0e1e38,#0a1628)", border:"1px solid rgba(200,150,62,0.25)", borderRadius:18, padding:"18px 18px 14px", overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Total Spent This Trip</div>
                  <div style={{ fontFamily:"'Playfair Display', serif", fontSize:36, color:"#C8963E", lineHeight:1 }}>{fmt$(allTotal)}</div>
                  {cap && <div style={{ fontSize:11, color: adultTotal > cap ? "#e07070" : "#3a7a5a", marginTop:4 }}>{adultTotal > cap ? "⚠️ Over budget" : `${fmt$(cap - adultTotal)} remaining of ${fmt$(cap)} target`}</div>}
                </div>
                <button onClick={() => setShowSetBudget(true)} style={{ background:"rgba(200,150,62,0.1)", border:"1px solid rgba(200,150,62,0.22)", borderRadius:10, padding:"7px 12px", color:"#C8963E", fontSize:11, cursor:"pointer", fontFamily:"'Lato', sans-serif", fontWeight:700, letterSpacing:"0.06em", flexShrink:0 }}>
                  {cap ? "Edit Budget" : "Set Budget"}
                </button>
              </div>
              {cap && (
                <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:8, overflow:"hidden", marginBottom:10 }}>
                  <div style={{ height:"100%", borderRadius:99, background: adultTotal > cap ? "linear-gradient(90deg,#c0392b,#e07070)" : "linear-gradient(90deg,#C8963E,#f0c060)", width:`${Math.min(100,(adultTotal/cap)*100)}%`, transition:"width 0.5s" }} />
                </div>
              )}

              {/* Mini per-location strip */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:6 }}>
                {BUDGET_LOCATIONS.filter(l => byLoc[l] > 0).map(l => (
                  <div key={l} style={{ background:"rgba(200,150,62,0.07)", border:"1px solid rgba(200,150,62,0.14)", borderRadius:8, padding:"4px 9px" }}>
                    <div style={{ fontSize:10, color:"#3a5a7a" }}>{l === "On Board" ? "🛳️ On Board" : l.split(",")[0]}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#C8963E" }}>{fmt$(byLoc[l])}</div>
                  </div>
                ))}
                {Object.values(byLoc).every(v => v === 0) && (
                  <div style={{ fontSize:12, color:"#1a3a5a" }}>No expenses yet — log your first one below.</div>
                )}
              </div>
            </div>

            {/* VIEW TOGGLE: Adults | Kids */}
            <div style={{ display:"flex", gap:8, padding:"12px 13px 4px" }}>
              <button onClick={() => setBudgetView("adults")} style={{ flex:1, padding:"10px 0", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Lato', sans-serif", ...(budgetView==="adults" ? goldBtn : ghostBtn), width:"auto" }}>
                👤 Adults
              </button>
              <button onClick={() => setBudgetView("kids")} style={{ flex:1, padding:"10px 0", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Lato', sans-serif", ...(budgetView==="kids" ? blueBtn : ghostBtn), width:"auto" }}>
                👧 Kids {budget.kids.length > 0 && `(${budget.kids.length})`}
              </button>
            </div>

            {/* ADULTS VIEW */}
            {budgetView === "adults" && (
              <div>
                {/* Per-location breakdown */}
                <div style={{ padding:"10px 13px 0" }}>
                  {BUDGET_LOCATIONS.map(loc => {
                    const locExps = adultExp.filter(e => e.location === loc);
                    if (locExps.length === 0) return null;
                    const locTotal = locExps.reduce((s,e) => s+e.amount, 0);
                    return (
                      <div key={loc} style={{ background:"linear-gradient(135deg,#0e1e38,#0a1628)", border:"1px solid rgba(200,150,62,0.12)", borderRadius:14, marginBottom:10, overflow:"hidden" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 14px 9px", borderBottom:"1px solid rgba(200,150,62,0.08)" }}>
                          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:14, color:"#e8dfc8" }}>{loc === "On Board" ? "🛳️ On Board" : `📍 ${loc.split(",")[0]}`}</div>
                          <div style={{ fontWeight:700, fontSize:15, color:"#C8963E" }}>{fmt$(locTotal)}</div>
                        </div>
                        {locExps.map(e => (
                          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background: catColor[e.category]||"#4a6a8a", flexShrink:0 }} />
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:13, color:"#b0c8e0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.desc || e.category}</div>
                              <div style={{ fontSize:10, color:"#2a4a6a", marginTop:1 }}>{e.category} · {new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                            </div>
                            <div style={{ fontSize:14, fontWeight:700, color:"#C8963E", flexShrink:0 }}>{fmt$(e.amount)}</div>
                            <button onClick={() => deleteExpense(e.id)} style={{ background:"none", border:"none", color:"#2a3a5a", cursor:"pointer", fontSize:16, padding:"0 0 0 4px", lineHeight:1 }}>✕</button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {adultExp.length === 0 && (
                  <div style={{ textAlign:"center", padding:"30px 24px 10px" }}>
                    <div style={{ fontSize:40 }}>💸</div>
                    <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:"#C8963E", margin:"10px 0 6px" }}>Nothing logged yet</div>
                    <div style={{ fontSize:13, color:"#1a3a5a" }}>Tap the button below to add your first expense.</div>
                  </div>
                )}

                <div style={{ padding:"12px 13px 0" }}>
                  <button style={{ ...goldBtn, width:"100%", padding:15, fontSize:15 }} onClick={() => { setExpFor("me"); setShowAddExp(true); }}>
                    + Log an Expense
                  </button>
                </div>
              </div>
            )}

            {/* KIDS VIEW */}
            {budgetView === "kids" && (
              <div style={{ padding:"10px 13px 0" }}>
                {budget.kids.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"30px 24px" }}>
                    <div style={{ fontSize:44 }}>👛</div>
                    <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:"#C8963E", margin:"10px 0 6px" }}>No kids' wallets yet</div>
                    <div style={{ fontSize:13, color:"#1a3a5a", lineHeight:1.7 }}>Add a wallet for each kid to set their allowance and track what they spend.</div>
                  </div>
                ) : (
                  budget.kids.map(kid => {
                    const kidExps = budget.expenses.filter(e => e.whoFor === kid.name);
                    const kidSpent = kidExps.reduce((s,e) => s+e.amount, 0);
                    const remaining = kid.allowance > 0 ? kid.allowance - kidSpent : null;
                    const pct = kid.allowance > 0 ? Math.min(100, (kidSpent / kid.allowance) * 100) : 0;
                    const overBudget = remaining !== null && remaining < 0;
                    return (
                      <div key={kid.id} style={{ background:"linear-gradient(135deg,#0e1e38,#0a1628)", border:`1px solid ${overBudget ? "rgba(192,57,43,0.4)" : "rgba(26,106,170,0.2)"}`, borderRadius:16, marginBottom:12, overflow:"hidden" }}>
                        <div style={{ padding:"13px 14px 10px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                            <div>
                              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:17, color:"#e8dfc8" }}>{kid.name}</div>
                              {kid.allowance > 0 && <div style={{ fontSize:11, color:"#3a5a7a", marginTop:2 }}>Allowance: {fmt$(kid.allowance)}</div>}
                            </div>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color: overBudget ? "#e07070" : "#4a9adf", lineHeight:1 }}>{fmt$(kidSpent)}</div>
                              <div style={{ fontSize:10, color:"#2a4a6a", marginTop:2 }}>spent</div>
                            </div>
                          </div>
                          {kid.allowance > 0 && (
                            <>
                              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:7, overflow:"hidden", marginBottom:5 }}>
                                <div style={{ height:"100%", borderRadius:99, background: overBudget ? "linear-gradient(90deg,#c0392b,#e07070)" : "linear-gradient(90deg,#1a6aaa,#4a9adf)", width:`${pct}%`, transition:"width 0.5s" }} />
                              </div>
                              <div style={{ fontSize:11, color: overBudget ? "#e07070" : "#2a7a5a" }}>
                                {overBudget ? `⚠️ $${Math.abs(remaining).toFixed(2)} over allowance` : `${fmt$(remaining)} remaining`}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Kid's expense log */}
                        {kidExps.length > 0 && (
                          <div style={{ borderTop:"1px solid rgba(26,106,170,0.1)" }}>
                            {kidExps.map(e => (
                              <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                                <div style={{ width:7, height:7, borderRadius:"50%", background:catColor[e.category]||"#4a6a8a", flexShrink:0 }} />
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ fontSize:12, color:"#8ab0d4", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.desc || e.category}</div>
                                  <div style={{ fontSize:10, color:"#2a4a6a" }}>{e.location === "On Board" ? "🛳️ On Board" : e.location.split(",")[0]} · {e.category}</div>
                                </div>
                                <div style={{ fontSize:13, fontWeight:700, color:"#4a9adf", flexShrink:0 }}>{fmt$(e.amount)}</div>
                                <button onClick={() => deleteExpense(e.id)} style={{ background:"none", border:"none", color:"#2a3a5a", cursor:"pointer", fontSize:14, padding:"0 0 0 4px" }}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ display:"flex", gap:8, padding:"10px 14px", borderTop:"1px solid rgba(26,106,170,0.08)" }}>
                          <button style={{ ...blueBtn, flex:1, padding:"9px 0", fontSize:12 }} onClick={() => { setExpFor(kid.name); setShowAddExp(true); }}>
                            + Add Expense
                          </button>
                          <button onClick={() => removeKid(kid.id)} style={{ background:"none", border:"1px solid rgba(192,57,43,0.2)", borderRadius:10, padding:"9px 14px", color:"#c0392b", fontSize:12, cursor:"pointer", fontFamily:"'Lato', sans-serif" }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                <button style={{ ...blueBtn, width:"100%", padding:14, fontSize:14, marginTop: budget.kids.length > 0 ? 4 : 0 }} onClick={() => setShowKidModal(true)}>
                  + Add Kid's Wallet
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* TRIP ITINERARY */}
      {activeTab === "trip" && (
        <div style={{ padding: "16px 13px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C8963E" }}>{config?.dates || "Your Cruise"}</div>
            <div style={{ fontSize: 12, color: "#1a3a5a", marginTop: 3 }}>{config?.ship || "Norwegian Escape"}</div>
          </div>

          <div style={{ background: "rgba(200,150,62,0.06)", border: "1px solid rgba(200,150,62,0.15)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#3a5a7a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>🍹 Drink Package</div>
            <div style={{ fontSize: 13, color: "#8ab0d4", lineHeight: 1.7 }}>
              <strong style={{ color: "#C8963E" }}>Everyone</strong> — specialty sodas, juices, mocktails, non-alcoholic cocktails, coffee & more.<br />
              <strong style={{ color: "#C8963E" }}>Adults (21+)</strong> — full open bar included. Cocktails, beer, wine, spirits — all covered.
            </div>
          </div>

          {ITINERARY.map((stop, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: stop.port === "At Sea" ? "rgba(26,106,170,0.2)" : "linear-gradient(135deg,rgba(200,150,62,0.3),rgba(200,150,62,0.1))", border: `1px solid ${stop.port === "At Sea" ? "rgba(26,106,170,0.3)" : "rgba(200,150,62,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {stop.emoji}
                </div>
                {i < ITINERARY.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 16, background: "rgba(200,150,62,0.1)", marginTop: 4 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: stop.port === "At Sea" ? "#4a6aaa" : "#e8dfc8" }}>{stop.port}</div>
                  <div style={{ fontSize: 10, color: "#1a3a5a", letterSpacing: "0.08em" }}>Day {stop.day}</div>
                </div>
                <div style={{ fontSize: 11, color: "#2a4a6a", marginTop: 2 }}>{stop.date}</div>
                <div style={{ fontSize: 12, color: "#1a3a5a", marginTop: 2 }}>{stop.note}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 10, background: "rgba(26,106,170,0.08)", border: "1px solid rgba(26,106,170,0.2)", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#2a4a6a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>📋 Booking Info</div>
            <div style={{ fontSize: 13, color: "#4a6a8a", lineHeight: 1.9 }}>
              Ship: <span style={{ color: "#8ab0d4" }}>{config?.ship || "Norwegian Escape"}</span><br />
              Stateroom: <span style={{ color: "#8ab0d4" }}>#10718</span><br />
              Reservation: <span style={{ color: "#8ab0d4" }}>64629136</span>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,0.4)}50%{box-shadow:0 0 0 6px rgba(192,57,43,0)}}`}</style>
    </div>
  );
}
