import { useState, useEffect, useRef } from "react";

// ── Supabase ─────────────────────────────────────────────────────
const SB_URL = "https://czbfofndyunizkswwkzz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YmZvZm5keXVuaXprc3d3a3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTQyMzYsImV4cCI6MjA5Mzc5MDIzNn0.4_j--y2qrT_clnzR3G73QXUqRc8jQqKRX-z-vgt4H_o";

async function sb(path, opts = {}) {
  try {
    const res = await fetch(`${SB_URL}/rest/v1${path}`, {
      headers: {
        "apikey": SB_KEY,
        "Authorization": `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
        ...(opts.headers || {}),
      },
      ...opts,
    });
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch { return null; }
}

// ── Constants ────────────────────────────────────────────────────
const GUEST_CODE    = "NCL2026";
const ORGANIZER_CODE = "Indigo";
const SHIP          = "Norwegian Escape";
const CRUISE_DATES  = "May 24 – 31, 2026";
const USER_KEY      = "cruise-user-v4";

const ITINERARY = [
  { day:1, date:"Sun May 24", port:"Miami, Florida",       note:"Departs 4:00 PM",        emoji:"🌴" },
  { day:2, date:"Mon May 25", port:"At Sea",               note:"Full day on the ship",    emoji:"🌊" },
  { day:3, date:"Tue May 26", port:"Harvest Caye, Belize", note:"Private island paradise", emoji:"🏝️" },
  { day:4, date:"Wed May 27", port:"Roatán, Honduras",     note:"Coral reefs & jungle",    emoji:"🤿" },
  { day:5, date:"Thu May 28", port:"Cozumel, Mexico",      note:"Beaches & ancient ruins", emoji:"🐠" },
  { day:6, date:"Fri May 29", port:"At Sea",               note:"Full day on the ship",    emoji:"🌊" },
  { day:7, date:"Sat May 30", port:"At Sea",               note:"Full day on the ship",    emoji:"☀️" },
  { day:8, date:"Sun May 31", port:"Miami, Florida",       note:"Arrives — journey ends",  emoji:"🏙️" },
];

const MEETUP_SPOTS = [
  "Pool Deck (Deck 15)", "Main Bar – Sugarcane", "The Biscayne Bar", "Spice H2O (Adults)",
  "Margaritaville Restaurant", "The Atrium (Deck 6)", "Casino", "Stardust Theater Lobby",
  "Buffet – Garden Café", "Deck 16 Hot Tubs", "Moderno Churrascaria Bar", "Haven Courtyard",
  "Splash Academy Lobby", "O'Sheehan's Bar & Grill", "Headliners Comedy Club",
];

const CHALLENGES_21_PLUS = [
  { emoji:"🎰", title:"Casino Face",            desc:"Capture your most dramatic reaction at the casino — win or lose. Poker face NOT allowed.", port:null },
  { emoji:"🍸", title:"Bar Crawl Badge",         desc:"Photo at 5 different bars on the Escape. Something different in hand at each one.", port:null },
  { emoji:"🌅", title:"Sunrise Club",            desc:"Top deck at sunrise with a drink in hand — Bloody Mary or coffee both count.", port:null },
  { emoji:"🎤", title:"Karaoke Commit",          desc:"PERFORMING. Not watching, not cheering. Worst song choice wins best photo.", port:null },
  { emoji:"🫗", title:"First Sip Reaction",      desc:"Order something you've never tried. Someone photographs the exact first sip face.", port:null },
  { emoji:"🕺", title:"Last One Standing",       desc:"Be the final person from the group on the dance floor. Floor must be clearing around you.", port:null },
  { emoji:"🌊", title:"Hot Tub After Midnight",  desc:"Spice H2O after 11pm, actual stars visible above. Proof required.", port:null },
  { emoji:"🥂", title:"Find the Celebration",    desc:"Locate strangers celebrating something — toast with them, get the photo.", port:null },
  { emoji:"🎲", title:"Superstition Documented", desc:"Show your casino ritual — lucky blow, chip arrangement, whatever. Own it.", port:null },
  { emoji:"🌺", title:"Harvest Caye Drink",      desc:"First drink you order on the private island, in front of actual Caribbean water.", port:"Harvest Caye" },
  { emoji:"🐠", title:"Cozumel Cantina",         desc:"Find a local spot in Cozumel off the ship. Order something not in the drink package.", port:"Cozumel" },
  { emoji:"🤿", title:"Roatán Rum",              desc:"Any rum-based drink in Roatán. Photo must include ocean or jungle in background.", port:"Roatán" },
  { emoji:"🍾", title:"Most Extra Drink",         desc:"Find the most over-the-top drink on the ship — smoke, fire, umbrella — shoot it like a magazine cover.", port:null },
  { emoji:"🌙", title:"4AM Evidence",            desc:"Prove you were still going at 4am. No context needed. Timestamp and vibe say everything.", port:null },
];

const CHALLENGES_UNDER_21 = [
  { emoji:"💦", title:"Cannonball Championship",    desc:"Biggest splash off the pool deck. Mid-air photo required.", port:null },
  { emoji:"🍹", title:"Mocktail Masterclass",       desc:"Order the most ridiculous-looking mocktail on the ship. Drink package = no limit.", port:null },
  { emoji:"🍦", title:"Soft Serve Engineering",     desc:"Build the tallest soft serve at Garden Café. Document it standing, then the collapse.", port:null },
  { emoji:"🐠", title:"Sea Creature Spotter",       desc:"First to photograph a wild sea creature — dolphin, turtle, ray. No aquarium cheating.", port:null },
  { emoji:"🏆", title:"Beat an Adult",              desc:"Defeat a grown-up at mini golf, shuffleboard, or ping pong. Victory photo required.", port:null },
  { emoji:"🏝️", title:"Harvest Caye First Splash", desc:"Document the exact moment you hit the water at Harvest Caye private island.", port:"Harvest Caye" },
  { emoji:"🎠", title:"Highest Legal Point",        desc:"Find the highest accessible point on the Norwegian Escape. Show the ocean below.", port:null },
  { emoji:"🎯", title:"Arcade Trophy Shot",         desc:"Win any prize from the arcade. Hold it like it's Olympic gold.", port:null },
  { emoji:"🌄", title:"First Island Sighting",      desc:"Be first in the group to spot land from the deck. Photograph that exact moment.", port:null },
  { emoji:"🍽️", title:"Buffet Architecture",        desc:"Build the most structurally ambitious plate at Garden Café. Engineering, not eating.", port:null },
  { emoji:"🤿", title:"Roatán Wildlife Shot",       desc:"Best photo of wild nature in Roatán — reef fish, monkey, tropical bird.", port:"Roatán" },
  { emoji:"🌊", title:"Wave Timing Master",         desc:"Most dramatic ocean wave shot — spray, scale, power. Screensaver quality only.", port:null },
  { emoji:"🌟", title:"Real Stars Shot",            desc:"Darkest spot on the Escape at night. Actual stars. No flash. No filter.", port:null },
  { emoji:"🎭", title:"Reaction Sequence",          desc:"Tell the same joke to 3 different people. Photograph all three reactions in order.", port:null },
];

// ── Small components ─────────────────────────────────────────────
function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#C8963E","#2A5F8F","#1B4332","#7B2D8B","#C0392B","#16697A"];
  const color  = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:size*0.38, flexShrink:0, fontFamily:"'Playfair Display',serif", border:"2px solid rgba(200,150,62,0.35)" }}>
      {initials}
    </div>
  );
}

function WaveBar() {
  return (
    <div style={{ overflow:"hidden", lineHeight:0 }}>
      <svg viewBox="0 0 1200 50" preserveAspectRatio="none" style={{ display:"block", width:"100%", height:22 }}>
        <path d="M0,25 C200,45 400,5 600,25 C800,45 1000,5 1200,25 L1200,50 L0,50 Z" fill="#C8963E" opacity="0.13"/>
        <path d="M0,35 C300,10 600,48 900,18 C1050,6 1150,38 1200,30 L1200,50 L0,50 Z" fill="#1a3a5c" opacity="0.09"/>
      </svg>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const inp      = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(200,150,62,0.22)", borderRadius:10, padding:"12px 14px", color:"#e8dfc8", fontSize:15, width:"100%", fontFamily:"'Lato',sans-serif", outline:"none", boxSizing:"border-box" };
const goldBtn  = { background:"linear-gradient(135deg,#C8963E,#a07030)", color:"#fff", border:"none", borderRadius:10, padding:"12px 22px", fontWeight:700, fontSize:14, cursor:"pointer", letterSpacing:"0.04em", fontFamily:"'Lato',sans-serif" };
const blueBtn  = { background:"linear-gradient(135deg,#1a6aaa,#0d4a7a)", color:"#fff", border:"none", borderRadius:10, padding:"12px 22px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Lato',sans-serif" };
const redBtn   = { background:"linear-gradient(135deg,#c0392b,#922b21)", color:"#fff", border:"none", borderRadius:10, padding:"12px 22px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Lato',sans-serif" };
const ghostBtn = { background:"rgba(255,255,255,0.04)", color:"#8ab0d4", border:"1px solid rgba(200,150,62,0.18)", borderRadius:10, padding:"12px 22px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Lato',sans-serif" };
const cardStyle= { background:"linear-gradient(180deg,#0e1e38 0%,#0a1628 100%)", borderRadius:16, margin:"10px 13px", border:"1px solid rgba(200,150,62,0.12)", overflow:"hidden" };

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [screen,    setScreen]    = useState("splash");
  const [joinMode,  setJoinMode]  = useState(null); // "guest" | "organizer"
  const [codeInput, setCodeInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [user,      setUser]      = useState(null); // { name, role: "organizer"|"guest" }

  const [posts,    setPosts]   = useState([]);
  const [meetup,   setMeetup]  = useState(null);
  const [activeTab,setActiveTab] = useState("feed");
  const [caption,  setCaption]  = useState("");
  const [locationTag,setLocationTag] = useState("");
  const [image,    setImage]    = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedPost,  setExpandedPost]  = useState(null);
  const [locating, setLocating] = useState(false);
  const [ageGroup, setAgeGroup] = useState("21plus");
  const [spotlight,setSpotlight]= useState(null);
  const [showMeetupModal, setShowMeetupModal] = useState(false);
  const [meetupSpot, setMeetupSpot] = useState(MEETUP_SPOTS[0]);
  const [meetupNote, setMeetupNote] = useState("");
  const [posting,  setPosting]  = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const fileRef = useRef();
  const pollRef = useRef();

  const challenges = ageGroup === "21plus" ? CHALLENGES_21_PLUS : CHALLENGES_UNDER_21;
  const isOrganizer = user?.role === "organizer";

  // ── Init ────────────────────────────────────────────────────────
  useEffect(() => {
    const su = localStorage.getItem(USER_KEY);
    if (su) setUser(JSON.parse(su));
    setSpotlight(CHALLENGES_21_PLUS[Math.floor(Math.random() * CHALLENGES_21_PLUS.length)]);
    setTimeout(() => setScreen(su ? "app" : "join"), 1600);
  }, []);

  useEffect(() => {
    if (screen !== "app") return;
    loadPosts(); loadMeetup();
    pollRef.current = setInterval(() => { loadPosts(); loadMeetup(); }, 10000);
    return () => clearInterval(pollRef.current);
  }, [screen]);

  // ── Data ────────────────────────────────────────────────────────
  async function loadPosts() {
    const data = await sb("/posts?order=timestamp.desc");
    if (data) setPosts(data);
  }

  async function loadMeetup() {
    const data = await sb("/meetup?active=eq.true&limit=1");
    setMeetup(data && data.length > 0 ? data[0] : null);
  }

  // ── Join ────────────────────────────────────────────────────────
  function handleJoin() {
    if (!nameInput.trim()) { setCodeError("Please enter a screen name!"); return; }
    if (joinMode === "organizer") {
      if (codeInput.trim() !== ORGANIZER_CODE) { setCodeError("Incorrect organizer code."); return; }
      const u = { name: nameInput.trim(), role: "organizer", joined: new Date().toISOString() };
      setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); setScreen("app");
    } else {
      if (codeInput.trim().toUpperCase() !== GUEST_CODE) { setCodeError("Invalid invite code — ask the organizer!"); return; }
      const u = { name: nameInput.trim(), role: "guest", joined: new Date().toISOString() };
      setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); setScreen("app");
    }
  }

  function handleLogout() {
    localStorage.removeItem(USER_KEY);
    setUser(null); setScreen("join"); setJoinMode(null);
    setCodeInput(""); setNameInput(""); setCodeError("");
  }

  // ── Photo ────────────────────────────────────────────────────────
  function pickImage(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 1200; let w = img.width, h = img.height;
        if (w > MAX) { h = (h*MAX)/w; w = MAX; }
        if (h > MAX) { w = (w*MAX)/h; h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        setImage(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
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
    setPosting(true);
    await sb("/posts", { method:"POST", body: JSON.stringify({
      id: Date.now().toString(), author: user.name,
      caption: caption.trim(), location: locationTag.trim(),
      image: image || "", timestamp: new Date().toISOString(),
      likes: [], comments: [],
    })});
    setImage(null); setCaption(""); setLocationTag("");
    setPosting(false); setActiveTab("feed"); loadPosts();
  }

  async function toggleLike(postId) {
    const post = posts.find(p => p.id === postId); if (!post) return;
    const newLikes = post.likes.includes(user.name)
      ? post.likes.filter(n => n !== user.name)
      : [...post.likes, user.name];
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: newLikes } : p));
    await sb(`/posts?id=eq.${postId}`, { method:"PATCH", body: JSON.stringify({ likes: newLikes }) });
  }

  async function addComment(postId) {
    const text = (commentInputs[postId]||"").trim(); if (!text) return;
    const post = posts.find(p => p.id === postId); if (!post) return;
    const newComments = [...post.comments, { author: user.name, text, time: new Date().toISOString() }];
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: newComments } : p));
    setCommentInputs(c => ({ ...c, [postId]:"" }));
    await sb(`/posts?id=eq.${postId}`, { method:"PATCH", body: JSON.stringify({ comments: newComments }) });
  }

  async function deletePost(postId) {
    if (!isOrganizer) return;
    await sb(`/posts?id=eq.${postId}`, { method:"DELETE", headers:{ "Prefer":"" } });
    setPosts(posts.filter(p => p.id !== postId));
  }

  async function postMeetup() {
    await sb("/meetup?active=eq.true", { method:"PATCH", body: JSON.stringify({ active:false }) });
    await sb("/meetup", { method:"POST", body: JSON.stringify({
      spot: meetupSpot, note: meetupNote.trim(),
      caller: user.name, time: new Date().toISOString(), active: true,
    })});
    setShowMeetupModal(false); setMeetupNote(""); loadMeetup();
  }

  async function clearMeetup() {
    await sb("/meetup?active=eq.true", { method:"PATCH", body: JSON.stringify({ active:false }) });
    setMeetup(null);
  }

  async function clearAllPosts() {
    if (!isOrganizer) return;
    if (!window.confirm("Delete ALL posts? This cannot be undone.")) return;
    await sb("/posts?id=neq.NONE", { method:"DELETE", headers:{ "Prefer":"" } });
    setPosts([]);
  }

  const fmt      = iso => new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" });
  const fmtShort = iso => new Date(iso).toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" });
  const tabStyle = a => ({ flex:1, padding:"11px 0", textAlign:"center", cursor:"pointer", fontSize:11, letterSpacing:"0.07em", textTransform:"uppercase", color: a?"#C8963E":"#1a3a5a", background:"none", border:"none", borderBottom:`2px solid ${a?"#C8963E":"transparent"}`, transition:"all 0.2s", fontFamily:"'Lato',sans-serif", fontWeight: a?700:400 });
  const fonts = <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet" />;

  // ── SPLASH ──────────────────────────────────────────────────────
  if (screen === "splash") return (
    <div style={{ minHeight:"100vh", background:"#080f1e", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {fonts}
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:72 }}>🛳️</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:"#C8963E", marginTop:14 }}>Bon Voyage</div>
        <div style={{ fontSize:11, color:"#1a3a5a", letterSpacing:"0.18em", marginTop:10, textTransform:"uppercase" }}>Norwegian Escape · {CRUISE_DATES}</div>
      </div>
    </div>
  );

  // ── JOIN ────────────────────────────────────────────────────────
  if (screen === "join") return (
    <div style={{ minHeight:"100vh", background:"#080f1e", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Lato',sans-serif" }}>
      {fonts}
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ fontSize:60 }}>⚓</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:"#C8963E", marginTop:12 }}>Norwegian Escape</div>
          <div style={{ fontSize:13, color:"#4a6a8a", marginTop:4, fontStyle:"italic", fontFamily:"'Playfair Display',serif" }}>7-Day Caribbean · Private Group</div>
          <div style={{ fontSize:11, color:"#1a3a5a", marginTop:5, letterSpacing:"0.1em" }}>{CRUISE_DATES}</div>
        </div>

        {/* Mode picker */}
        {!joinMode && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <button style={{ ...goldBtn, width:"100%", padding:16, fontSize:15 }} onClick={() => setJoinMode("guest")}>
              🧳 I'm a Guest
            </button>
            <button style={{ ...ghostBtn, width:"100%", padding:14, fontSize:14 }} onClick={() => setJoinMode("organizer")}>
              ⚓ Organizer Login
            </button>
          </div>
        )}

        {/* Guest or Organizer form */}
        {joinMode && (
          <div style={{ background:"rgba(200,150,62,0.06)", border:"1px solid rgba(200,150,62,0.18)", borderRadius:18, padding:24 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#C8963E", marginBottom:16, textAlign:"center" }}>
              {joinMode === "guest" ? "🧳 Join as Guest" : "⚓ Organizer Login"}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input style={inp} placeholder="Choose a screen name" value={nameInput} onChange={e => setNameInput(e.target.value)} />
              <input
                style={{ ...inp, letterSpacing: joinMode==="guest" ? "0.2em" : "0.05em", textTransform: joinMode==="guest" ? "uppercase" : "none" }}
                placeholder={joinMode === "guest" ? "INVITE CODE" : "Organizer password"}
                type={joinMode === "organizer" ? "password" : "text"}
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value); setCodeError(""); }}
                onKeyDown={e => e.key === "Enter" && handleJoin()}
              />
              {codeError && <div style={{ color:"#e07070", fontSize:13, textAlign:"center" }}>{codeError}</div>}
              <button style={{ ...goldBtn, width:"100%", padding:16, fontSize:15, marginTop:4 }} onClick={handleJoin}>
                Come Aboard ⚓
              </button>
              <button style={{ background:"none", border:"none", color:"#2a4a6a", fontSize:13, cursor:"pointer", fontFamily:"'Lato',sans-serif", padding:0, textAlign:"center" }}
                onClick={() => { setJoinMode(null); setCodeInput(""); setNameInput(""); setCodeError(""); }}>
                ← Back
              </button>
            </div>
          </div>
        )}
        <div style={{ textAlign:"center", fontSize:11, color:"#1a3a5a", marginTop:14 }}>
          {joinMode === "guest" ? "Don't have the code? Ask your trip organizer." : ""}
        </div>
      </div>
    </div>
  );

  // ── ADMIN PANEL ──────────────────────────────────────────────────
  if (showAdmin) return (
    <div style={{ minHeight:"100vh", background:"#080f1e", fontFamily:"'Lato',sans-serif", color:"#e8dfc8", maxWidth:480, margin:"0 auto", padding:20 }}>
      {fonts}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={() => setShowAdmin(false)} style={{ background:"none", border:"none", color:"#C8963E", fontSize:22, cursor:"pointer", padding:0 }}>←</button>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#C8963E" }}>⚓ Admin Controls</div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

        {/* Stats */}
        <div style={{ background:"rgba(200,150,62,0.07)", border:"1px solid rgba(200,150,62,0.18)", borderRadius:14, padding:18 }}>
          <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>📊 Current Stats</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              ["Total Posts", posts.length],
              ["Photos Shared", posts.filter(p=>p.image).length],
              ["Total Likes", posts.reduce((a,p)=>a+p.likes.length,0)],
              ["Total Comments", posts.reduce((a,p)=>a+p.comments.length,0)],
            ].map(([label, val]) => (
              <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#C8963E" }}>{val}</div>
                <div style={{ fontSize:11, color:"#3a5a7a", marginTop:3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Meetup control */}
        <div style={{ background:"rgba(192,57,43,0.08)", border:"1px solid rgba(192,57,43,0.2)", borderRadius:14, padding:18 }}>
          <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>🚨 Meet-Up Alert</div>
          {meetup ? (
            <>
              <div style={{ fontSize:14, color:"#e8dfc8", marginBottom:10 }}>Active: <strong style={{ color:"#e07070" }}>{meetup.spot}</strong></div>
              <button style={{ ...redBtn, width:"100%", padding:12 }} onClick={clearMeetup}>Clear Alert</button>
            </>
          ) : (
            <button style={{ ...redBtn, width:"100%", padding:12 }} onClick={() => { setShowAdmin(false); setShowMeetupModal(true); }}>
              📍 Send Meet-Up Alert
            </button>
          )}
        </div>

        {/* Post management */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(200,150,62,0.12)", borderRadius:14, padding:18 }}>
          <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>🗑️ Post Management</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {posts.slice(0,8).map(post => (
              <div key={post.id} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px" }}>
                <Avatar name={post.author} size={28} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#8ab0d4" }}>{post.author}</div>
                  <div style={{ fontSize:11, color:"#2a4a6a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{post.caption || "(photo)"}</div>
                </div>
                <button onClick={() => deletePost(post.id)} style={{ background:"rgba(192,57,43,0.2)", border:"1px solid rgba(192,57,43,0.3)", borderRadius:8, color:"#e07070", cursor:"pointer", padding:"5px 10px", fontSize:12, fontFamily:"'Lato',sans-serif" }}>
                  Delete
                </button>
              </div>
            ))}
            {posts.length > 8 && <div style={{ fontSize:12, color:"#2a4a6a", textAlign:"center" }}>...and {posts.length - 8} more posts</div>}
          </div>
          {posts.length > 0 && (
            <button style={{ ...redBtn, width:"100%", padding:12, marginTop:14, fontSize:13 }} onClick={clearAllPosts}>
              🗑️ Delete ALL Posts
            </button>
          )}
        </div>

        {/* Invite info */}
        <div style={{ background:"rgba(26,106,170,0.08)", border:"1px solid rgba(26,106,170,0.2)", borderRadius:14, padding:18 }}>
          <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>🔑 Invite Code</div>
          <div style={{ fontSize:28, fontFamily:"'Playfair Display',serif", color:"#C8963E", letterSpacing:"0.15em", textAlign:"center", padding:"10px 0" }}>{GUEST_CODE}</div>
          <div style={{ fontSize:12, color:"#2a4a6a", textAlign:"center" }}>Share this with your group to join the app</div>
        </div>

        {/* Logout */}
        <button style={{ ...ghostBtn, width:"100%", padding:14, marginTop:4 }} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );

  // ── MAIN APP ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#080f1e", fontFamily:"'Lato',sans-serif", color:"#e8dfc8", maxWidth:480, margin:"0 auto" }}>
      {fonts}

      {/* MEETUP MODAL */}
      {showMeetupModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ background:"linear-gradient(180deg,#0e1e38,#080f1e)", borderRadius:"24px 24px 0 0", padding:24, width:"100%", maxWidth:480, border:"1px solid rgba(200,150,62,0.25)", borderBottom:"none" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#C8963E", marginBottom:4 }}>📍 Call a Meet-Up</div>
            <div style={{ fontSize:13, color:"#3a5a7a", marginBottom:20 }}>Everyone will see your alert on their screen instantly.</div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Pick a spot</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, maxHeight:220, overflowY:"auto" }}>
                {MEETUP_SPOTS.map(s => (
                  <button key={s} onClick={() => setMeetupSpot(s)}
                    style={{ padding:"9px 10px", borderRadius:10, fontSize:12, cursor:"pointer", fontFamily:"'Lato',sans-serif", textAlign:"left", lineHeight:1.3, background: meetupSpot===s?"linear-gradient(135deg,#C8963E,#a07030)":"rgba(255,255,255,0.04)", color: meetupSpot===s?"#fff":"#5a7a9a", border: meetupSpot===s?"none":"1px solid rgba(200,150,62,0.12)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <input style={{ ...inp, marginBottom:14 }} placeholder="Optional note (e.g. 'Grab a drink! 10 mins!')" value={meetupNote} onChange={e => setMeetupNote(e.target.value)} />
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...ghostBtn, flex:1 }} onClick={() => setShowMeetupModal(false)}>Cancel</button>
              <button style={{ ...redBtn, flex:2, padding:"13px 0", fontSize:15 }} onClick={postMeetup}>🚨 Alert the Crew</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#0b1a32,#162d4a)", borderBottom:"1px solid rgba(200,150,62,0.28)", padding:"12px 16px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#C8963E" }}>🛳️ {SHIP}</div>
            <div style={{ fontSize:10, color:"#1a3a5a", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:1 }}>{CRUISE_DATES}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => setShowMeetupModal(true)}
              style={{ ...redBtn, padding:"8px 12px", fontSize:12, display:"flex", alignItems:"center", gap:5, animation:"pulse 2s infinite" }}>
              📍 Meet Up!
            </button>
            {isOrganizer && (
              <button onClick={() => setShowAdmin(true)}
                style={{ background:"rgba(200,150,62,0.15)", border:"1px solid rgba(200,150,62,0.3)", borderRadius:10, padding:"8px 10px", color:"#C8963E", fontSize:16, cursor:"pointer" }}>
                ⚙️
              </button>
            )}
            <Avatar name={user.name} size={32} />
          </div>
        </div>
      </div>

      {/* MEETUP BANNER */}
      {meetup && (
        <div style={{ margin:"10px 13px 0", background:"linear-gradient(135deg,rgba(192,57,43,0.2),rgba(192,57,43,0.08))", border:"1px solid rgba(192,57,43,0.5)", borderRadius:14, padding:"13px 14px", display:"flex", alignItems:"flex-start", gap:10 }}>
          <div style={{ fontSize:28, lineHeight:1 }}>🚨</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:900, fontSize:13, color:"#e07070", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:3 }}>Meet-Up Alert · {fmtShort(meetup.time)}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:"#fff", marginBottom:2 }}>{meetup.spot}</div>
            {meetup.note && <div style={{ fontSize:13, color:"#a0b0c0", marginBottom:3 }}>"{meetup.note}"</div>}
            <div style={{ fontSize:11, color:"#4a6a8a" }}>Called by {meetup.caller}</div>
          </div>
          {isOrganizer && <button onClick={clearMeetup} style={{ background:"none", border:"none", color:"#3a5a7a", cursor:"pointer", fontSize:18, padding:0 }}>✕</button>}
        </div>
      )}

      {/* TABS */}
      <div style={{ display:"flex", background:"#0b1828", borderBottom:"1px solid rgba(200,150,62,0.1)", marginTop: meetup?10:0 }}>
        {[["feed","📸 Feed"],["post","➕ Share"],["challenges","🎯 Missions"],["trip","🗺️ Trip"]].map(([id,label]) => (
          <button key={id} style={tabStyle(activeTab===id)} onClick={() => setActiveTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── FEED ─────────────────────────────────────────────────── */}
      {activeTab === "feed" && (
        <div style={{ paddingBottom:80 }}>
          {posts.length === 0 && (
            <div style={{ textAlign:"center", padding:"50px 24px" }}>
              <div style={{ fontSize:54 }}>🌊</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#C8963E", margin:"14px 0 8px" }}>No memories yet!</div>
              <div style={{ color:"#1a3a5a", fontSize:14, lineHeight:1.6 }}>Be the first to share a moment from the voyage.</div>
              <button style={{ ...goldBtn, marginTop:20 }} onClick={() => setActiveTab("post")}>Share First 📸</button>
            </div>
          )}
          {posts.map(post => (
            <div key={post.id} style={cardStyle}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px" }}>
                <Avatar name={post.author} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#e8dfc8" }}>{post.author}</div>
                  <div style={{ fontSize:11, color:"#1a3a5a" }}>{fmt(post.timestamp)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {post.location && <div style={{ fontSize:11, color:"#4a6a8a", maxWidth:100, textAlign:"right", lineHeight:1.3 }}>📍 {post.location}</div>}
                  {isOrganizer && (
                    <button onClick={() => deletePost(post.id)} style={{ background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.25)", borderRadius:7, color:"#e07070", cursor:"pointer", padding:"4px 8px", fontSize:11, fontFamily:"'Lato',sans-serif" }}>
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              {post.image && <img src={post.image} alt="" style={{ width:"100%", maxHeight:380, objectFit:"cover", display:"block" }} />}
              {post.caption && <div style={{ padding:"12px 14px 8px", fontSize:15, lineHeight:1.55, color:"#b0c8e0" }}>{post.caption}</div>}
              <div style={{ display:"flex", gap:18, padding:"8px 14px 13px" }}>
                <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, padding:0, color: post.likes.includes(user.name)?"#C8963E":"#1a3a5a", fontSize:20 }} onClick={() => toggleLike(post.id)}>
                  {post.likes.includes(user.name)?"❤️":"🤍"} <span style={{ fontSize:13 }}>{post.likes.length}</span>
                </button>
                <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, padding:0, color:"#1a3a5a", fontSize:20 }} onClick={() => setExpandedPost(expandedPost===post.id?null:post.id)}>
                  💬 <span style={{ fontSize:13 }}>{post.comments.length}</span>
                </button>
              </div>
              {expandedPost === post.id && (
                <div style={{ borderTop:"1px solid rgba(200,150,62,0.09)", padding:"12px 14px" }}>
                  {post.comments.map((c,i) => (
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:10 }}>
                      <Avatar name={c.author} size={28} />
                      <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"7px 12px", flex:1 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#C8963E", marginBottom:2 }}>{c.author}</div>
                        <div style={{ fontSize:13, color:"#a0b8d0" }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display:"flex", gap:8, marginTop:6 }}>
                    <input style={{ ...inp, fontSize:13, padding:"8px 12px", flex:1 }} placeholder="Add a comment…"
                      value={commentInputs[post.id]||""} onChange={e => setCommentInputs(c => ({ ...c, [post.id]:e.target.value }))}
                      onKeyDown={e => e.key==="Enter" && addComment(post.id)} />
                    <button style={{ ...goldBtn, padding:"8px 14px" }} onClick={() => addComment(post.id)}>➤</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── POST ─────────────────────────────────────────────────── */}
      {activeTab === "post" && (
        <div style={{ padding:16, paddingBottom:80 }}>
          {spotlight && (
            <div style={{ background:"linear-gradient(135deg,rgba(200,150,62,0.12),rgba(200,150,62,0.03))", border:"1px solid rgba(200,150,62,0.22)", borderRadius:14, padding:"13px 15px", marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#3a5a7a", letterSpacing:"0.13em", textTransform:"uppercase", marginBottom:4 }}>✨ Mission Spotlight</div>
              <div style={{ fontSize:22, marginBottom:3 }}>{spotlight.emoji}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#C8963E", marginBottom:4 }}>{spotlight.title}</div>
              <div style={{ fontSize:12, color:"#4a6a8a", lineHeight:1.55 }}>{spotlight.desc}</div>
              {spotlight.port && <div style={{ fontSize:11, color:"#2a4a6a", marginTop:5 }}>📍 Port challenge: {spotlight.port}</div>}
              <button style={{ background:"none", border:"none", color:"#1a3a5a", fontSize:12, cursor:"pointer", marginTop:6, padding:0, fontFamily:"'Lato',sans-serif" }}
                onClick={() => { const p=ageGroup==="21plus"?CHALLENGES_21_PLUS:CHALLENGES_UNDER_21; setSpotlight(p[Math.floor(Math.random()*p.length)]); }}>
                🔀 Swap mission
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={pickImage} />
          {image ? (
            <div style={{ position:"relative", marginBottom:14, borderRadius:14, overflow:"hidden" }}>
              <img src={image} alt="" style={{ width:"100%", maxHeight:300, objectFit:"cover", display:"block" }} />
              <button onClick={() => setImage(null)} style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer", fontSize:14 }}>✕</button>
            </div>
          ) : (
            <button style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"2px dashed rgba(200,150,62,0.22)", borderRadius:14, padding:"32px 0", cursor:"pointer", marginBottom:14, color:"#2a4a6a", fontSize:14, fontFamily:"'Lato',sans-serif" }}
              onClick={() => fileRef.current.click()}>
              <div style={{ fontSize:40, marginBottom:8 }}>📷</div>
              <div>Tap to take or choose a photo</div>
            </button>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <textarea style={{ ...inp, minHeight:80, resize:"none" }} placeholder="Tell the story… add a caption" value={caption} onChange={e => setCaption(e.target.value)} />
            <div style={{ display:"flex", gap:8 }}>
              <input style={{ ...inp, flex:1 }} placeholder="📍 e.g. Cozumel, Spice H2O, Roatán…" value={locationTag} onChange={e => setLocationTag(e.target.value)} />
              <button style={{ ...ghostBtn, padding:"12px 14px", fontSize:18 }} onClick={geoLocate} disabled={locating}>{locating?"…":"📡"}</button>
            </div>
            <button style={{ ...goldBtn, width:"100%", padding:15, fontSize:15, opacity:(!image&&!caption.trim())||posting?0.5:1 }} onClick={handlePost} disabled={(!image&&!caption.trim())||posting}>
              {posting?"Sharing…":"🌊 Share with the Crew"}
            </button>
          </div>
        </div>
      )}

      {/* ── CHALLENGES ───────────────────────────────────────────── */}
      {activeTab === "challenges" && (
        <div style={{ paddingBottom:80 }}>
          <div style={{ padding:"18px 16px 8px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#C8963E" }}>Photo Missions</div>
            <div style={{ fontSize:11, color:"#1a3a5a", marginTop:4 }}>Everyone has the drink package — use it 🍹</div>
          </div>
          <div style={{ display:"flex", gap:8, padding:"10px 14px 13px" }}>
            <button onClick={() => setAgeGroup("21plus")} style={{ flex:1, padding:"11px 0", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Lato',sans-serif", ...(ageGroup==="21plus"?goldBtn:ghostBtn), width:"auto" }}>🍸 21+ Crew</button>
            <button onClick={() => setAgeGroup("under21")} style={{ flex:1, padding:"11px 0", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Lato',sans-serif", ...(ageGroup==="under21"?blueBtn:ghostBtn), width:"auto" }}>🏄 Under 21</button>
          </div>
          <WaveBar />
          <div style={{ padding:"0 13px", display:"flex", flexDirection:"column", gap:9 }}>
            {challenges.map((c,i) => (
              <div key={i} style={{ background:"linear-gradient(135deg,#0e1e38,#0a1628)", border:`1px solid ${c.port?"rgba(26,170,106,0.22)":(ageGroup==="21plus"?"rgba(200,150,62,0.13)":"rgba(26,106,170,0.17)")}`, borderRadius:14, padding:"12px 12px", display:"flex", gap:10, alignItems:"flex-start" }}>
                <div style={{ fontSize:24, lineHeight:1, paddingTop:3, flexShrink:0 }}>{c.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:ageGroup==="21plus"?"#C8963E":"#4aA0d8" }}>{c.title}</div>
                    {c.port && <div style={{ fontSize:10, background:"rgba(26,170,106,0.15)", color:"#4aaa7a", borderRadius:99, padding:"2px 7px", letterSpacing:"0.06em", flexShrink:0 }}>{c.port}</div>}
                  </div>
                  <div style={{ fontSize:12, color:"#2a4a6a", lineHeight:1.5 }}>{c.desc}</div>
                </div>
                <button style={{ ...(ageGroup==="21plus"?goldBtn:blueBtn), padding:"7px 12px", fontSize:12, flexShrink:0, alignSelf:"center" }}
                  onClick={() => { setSpotlight(c); setActiveTab("post"); }}>Go</button>
              </div>
            ))}
          </div>
          <div style={{ margin:"14px 13px 20px", background:"rgba(200,150,62,0.06)", border:"1px solid rgba(200,150,62,0.15)", borderRadius:16, padding:18, textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#C8963E", marginBottom:5 }}>🏆 Group Goal</div>
            <div style={{ fontSize:13, color:"#2a4a6a", lineHeight:1.7 }}>50 photos across 8 days. Every moment counts.</div>
            <div style={{ fontSize:30, fontFamily:"'Playfair Display',serif", color:"#C8963E", margin:"8px 0 5px" }}>
              {posts.filter(p=>p.image).length} <span style={{ fontSize:14, color:"#1a3a5a" }}>/ 50</span>
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:99, height:7, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#C8963E,#f0c060)", width:`${Math.min(100,(posts.filter(p=>p.image).length/50)*100)}%`, transition:"width 0.5s" }} />
            </div>
          </div>
        </div>
      )}

      {/* ── TRIP ─────────────────────────────────────────────────── */}
      {activeTab === "trip" && (
        <div style={{ padding:"16px 13px 80px" }}>
          <div style={{ textAlign:"center", marginBottom:18 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#C8963E" }}>7-Day Caribbean</div>
            <div style={{ fontSize:12, color:"#1a3a5a", marginTop:3 }}>Round-Trip Miami · Norwegian Escape</div>
          </div>
          <div style={{ background:"rgba(200,150,62,0.06)", border:"1px solid rgba(200,150,62,0.15)", borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#3a5a7a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>🍹 Drink Package</div>
            <div style={{ fontSize:13, color:"#8ab0d4", lineHeight:1.7 }}>
              <strong style={{ color:"#C8963E" }}>Everyone</strong> — specialty sodas, juices, mocktails, coffee & more.<br/>
              <strong style={{ color:"#C8963E" }}>Adults (21+)</strong> — full open bar included. All covered.
            </div>
          </div>
          {ITINERARY.map((stop,i) => (
            <div key={i} style={{ display:"flex", gap:12, marginBottom:10 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:36 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:stop.port==="At Sea"?"rgba(26,106,170,0.2)":"linear-gradient(135deg,rgba(200,150,62,0.3),rgba(200,150,62,0.1))", border:`1px solid ${stop.port==="At Sea"?"rgba(26,106,170,0.3)":"rgba(200,150,62,0.35)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                  {stop.emoji}
                </div>
                {i < ITINERARY.length-1 && <div style={{ width:1, flex:1, minHeight:16, background:"rgba(200,150,62,0.1)", marginTop:4 }} />}
              </div>
              <div style={{ flex:1, paddingBottom:12 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:stop.port==="At Sea"?"#4a6aaa":"#e8dfc8" }}>{stop.port}</div>
                  <div style={{ fontSize:10, color:"#1a3a5a", letterSpacing:"0.08em" }}>Day {stop.day}</div>
                </div>
                <div style={{ fontSize:11, color:"#2a4a6a", marginTop:2 }}>{stop.date}</div>
                <div style={{ fontSize:12, color:"#1a3a5a", marginTop:2 }}>{stop.note}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:10, background:"rgba(26,106,170,0.08)", border:"1px solid rgba(26,106,170,0.2)", borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:11, color:"#2a4a6a", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>📋 Booking Info</div>
            <div style={{ fontSize:13, color:"#4a6a8a", lineHeight:1.9 }}>
              Ship: <span style={{ color:"#8ab0d4" }}>Norwegian Escape</span><br/>
              Stateroom: <span style={{ color:"#8ab0d4" }}>#10718</span><br/>
              Reservation: <span style={{ color:"#8ab0d4" }}>64629136</span>
            </div>
          </div>
          <button style={{ ...ghostBtn, width:"100%", padding:13, marginTop:16, fontSize:13 }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,0.4)}50%{box-shadow:0 0 0 6px rgba(192,57,43,0)}}`}</style>
    </div>
  );
}
