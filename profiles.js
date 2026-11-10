// Friend Deck profiles: guest mode stays local; portable profiles use Supabase Auth.
(() => {
  const URL = "https://antqqabimhgepykkkmwl.supabase.co";
  const KEY = "sb_publishable_w6n4kCXq8cJoyd-8PE0HoQ_YBPYoI_7";
  const GUEST_KEY = "frienddeck_guest_profile_v1";
  const AVATARS = ["🎴","🦊","🐼","🐸","🐯","🐧","🐱","🐻","🐨","🐰","🦄","🐙"];
  let client = null, current = null, mode = "guest";
  const $ = (id) => document.getElementById(id);
  const safe = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const blankStats = () => ({games_played:0,wins:0,losses:0,points:0,achievements:[]});
  function getGuest(){try{return JSON.parse(localStorage.getItem(GUEST_KEY)||"null")}catch{return null}}
  function saveGuest(p){localStorage.setItem(GUEST_KEY,JSON.stringify(p))}
  async function db(){if(client)return client;const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");client=createClient(URL,KEY);return client}
  function ensureGuest(){
    let p=getGuest();
    if(!p){p={id:crypto.randomUUID(),username:"Guest Player",avatar:"🎴",...blankStats()};saveGuest(p)}
    return p;
  }
  function badgeList(stats){
    const a=[];
    if(stats.games_played>=1)a.push("🎮 First Game");
    if(stats.wins>=1)a.push("🏆 First Win");
    if(stats.games_played>=10)a.push("🔥 Regular Player");
    if(stats.wins>=10)a.push("👑 Winner x10");
    if(stats.games_played>=50)a.push("💎 Party Legend");
    return a;
  }
  function statsMarkup(p){
    const s=p||blankStats();
    return '<div class="fd-stat-grid"><div><b>'+Number(s.games_played||0)+'</b><small>Games</small></div><div><b>'+Number(s.wins||0)+'</b><small>Wins</small></div><div><b>'+Number(s.losses||0)+'</b><small>Losses</small></div><div><b>'+Number(s.points||0)+'</b><small>Points</small></div></div>';
  }
  function modal(){
    let root=$("friendProfileModal");
    if(root)return root;
    root=document.createElement("div");root.id="friendProfileModal";root.className="fd-modal";root.hidden=true;
    root.innerHTML='<div class="fd-modal-backdrop" data-close></div><section class="fd-modal-card" role="dialog" aria-modal="true" aria-labelledby="fdTitle"><button class="fd-close" data-close aria-label="Close">×</button><div class="fd-eyebrow">YOUR PLAYER IDENTITY</div><h2 id="fdTitle">Friend Deck Profile</h2><div id="fdProfileBody"></div></section>';
    document.body.append(root);
    root.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>root.hidden=true));
    return root;
  }
  function open(){const m=modal();m.hidden=false;render();}
  function render(){
    const host=$("fdProfileBody");if(!host)return;
    const p=current||ensureGuest();
    host.innerHTML='<div class="fd-profile-head"><div class="fd-avatar">'+safe(p.avatar||"🎴")+'</div><div><strong>'+safe(p.username||"Guest Player")+'</strong><small>'+(mode==="guest"?"Guest profile · This device only":"Portable profile · Synced account")+'</small></div></div>'+
      statsMarkup(p)+'<h3>Achievements</h3><div class="fd-achievements">'+(badgeList(p).length?badgeList(p).map(x=>'<span>'+safe(x)+'</span>').join(""):'<small>Play a game to unlock your first badge.</small>')+'</div>'+
      (mode==="guest"?'<div class="fd-form"><label>Display name</label><input id="fdGuestName" maxlength="22" value="'+safe(p.username)+'" placeholder="Your player name"><label>Choose an avatar</label><div class="fd-avatars">'+AVATARS.map(x=>'<button type="button" data-avatar="'+x+'" class="'+(x===p.avatar?"selected":"")+'">'+x+'</button>').join("")+'</div><button class="btn btn-dark" id="fdSaveGuest">Save guest profile</button></div><div class="fd-divider">OR SYNC YOUR PROFILE</div><div class="fd-form"><label>Email</label><input id="fdEmail" type="email" autocomplete="email" placeholder="you@example.com"><label>Password</label><input id="fdPassword" type="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters"><button class="btn btn-dark" id="fdSignUp">Create portable profile</button><button class="btn btn-light" id="fdSignIn">Sign in to existing profile</button></div>':
      '<div class="fd-form"><label>Display name</label><input id="fdGuestName" maxlength="22" value="'+safe(p.username)+'"><label>Choose an avatar</label><div class="fd-avatars">'+AVATARS.map(x=>'<button type="button" data-avatar="'+x+'" class="'+(x===p.avatar?"selected":"")+'">'+x+'</button>').join("")+'</div><button class="btn btn-dark" id="fdSavePortable">Save profile</button><button class="btn btn-light" id="fdSignOut">Sign out</button></div>')+
      '<div class="fd-leaderboard"><h3>🏆 Global leaderboard</h3><div id="fdLeaderboard"><small>Loading leaderboard…</small></div></div><p class="fd-note">Guest stats stay on this device. Sign up to sync your profile across devices.</p>';
    host.querySelectorAll("[data-avatar]").forEach(b=>b.onclick=()=>{host.querySelectorAll("[data-avatar]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");});
    $("fdSaveGuest")?.addEventListener("click",()=>{const name=$("fdGuestName").value.trim();if(name.length<2)return alert("Use a name with at least 2 characters.");p.username=name;p.avatar=host.querySelector("[data-avatar].selected")?.dataset.avatar||p.avatar;saveGuest(p);current=p;render();});
    $("fdSavePortable")?.addEventListener("click",savePortable);
    $("fdSignUp")?.addEventListener("click",signUp);
    $("fdSignIn")?.addEventListener("click",signIn);
    $("fdSignOut")?.addEventListener("click",signOut);
    loadLeaderboard();
  }
  async function savePortable(){
    const name=$("fdGuestName").value.trim();if(name.length<2)return alert("Use a name with at least 2 characters.");
    const avatar=$("fdProfileBody").querySelector("[data-avatar].selected")?.dataset.avatar||current.avatar;
    const c=await db(),{data:{user}}=await c.auth.getUser();if(!user)return alert("Please sign in again.");
    const {error}=await c.from("friend_deck_profiles").update({username:name,avatar}).eq("user_id",user.id);
    if(error)return alert(error.message);current={...current,username:name,avatar};render();
  }
  async function signUp(){
    const email=$("fdEmail").value.trim(),password=$("fdPassword").value;
    if(!email||password.length<8)return alert("Enter a valid email and a password of at least 8 characters.");
    try{
      const c=await db(),guest=ensureGuest(),{data,error}=await c.auth.signUp({email,password});
      if(error)throw error;
      if(!data.session){alert("Check your email to confirm the account, then sign in here to finish syncing.");return;}
      const user=data.user;
      const {error:saveError}=await c.from("friend_deck_profiles").upsert({user_id:user.id,username:guest.username,avatar:guest.avatar,games_played:guest.games_played||0,wins:guest.wins||0,losses:guest.losses||0,points:guest.points||0,achievements:badgeList(guest)},{onConflict:"user_id"});
      if(saveError)throw saveError;
      current={...guest};mode="portable";render();
    }catch(e){alert(e.message||"Could not create the profile.");}
  }
  async function signIn(){
    const email=$("fdEmail").value.trim(),password=$("fdPassword").value;
    if(!email||!password)return alert("Enter your email and password.");
    try{
      const c=await db(),{data,error}=await c.auth.signInWithPassword({email,password});if(error)throw error;
      const {data:profile,error:readError}=await c.from("friend_deck_profiles").select("*").eq("user_id",data.user.id).maybeSingle();if(readError)throw readError;
      if(!profile)throw new Error("No Friend Deck profile found for this account.");
      current=profile;mode="portable";render();
    }catch(e){alert(e.message||"Could not sign in.");}
  }
  async function signOut(){try{const c=await db();await c.auth.signOut()}catch{}current=ensureGuest();mode="guest";render()}
  async function loadLeaderboard(){
    const el=$("fdLeaderboard");if(!el)return;
    try{const c=await db(),{data,error}=await c.from("friend_deck_profiles").select("username,avatar,wins,games_played,points").order("wins",{ascending:false}).order("points",{ascending:false}).limit(10);if(error)throw error;
      el.innerHTML=data?.length?data.map((p,i)=>'<div class="fd-leader-row"><span>'+(i+1)+'</span><b>'+safe(p.avatar)+' '+safe(p.username)+'</b><small>'+Number(p.wins)+' wins · '+Number(p.games_played)+' games</small></div>').join(""):'<small>No players yet. Be the first!</small>';
    }catch(e){el.innerHTML='<small>Leaderboard is temporarily unavailable.</small>'}
  }
  window.FriendDeckStats={
    async recordGame({won=false,points=0}={}){
      const p=current||ensureGuest();p.games_played=(p.games_played||0)+1;p.wins=(p.wins||0)+(won?1:0);p.losses=(p.losses||0)+(won?0:1);p.points=(p.points||0)+Math.max(0,Number(points)||0);p.achievements=badgeList(p);
      if(mode==="guest"){saveGuest(p);current=p;return;}
      try{const c=await db(),{data:{user}}=await c.auth.getUser();if(user){const {error}=await c.from("friend_deck_profiles").update({games_played:p.games_played,wins:p.wins,losses:p.losses,points:p.points,achievements:p.achievements}).eq("user_id",user.id);if(error)throw error;}current=p;}catch(e){console.warn("Could not sync Friend Deck stats",e);}
    },
    getProfile:()=>current||ensureGuest()
  };
  window.addEventListener("DOMContentLoaded",()=>{
    const actions=document.querySelector(".top-actions");
    if(actions&&!$("profileButton")){const b=document.createElement("button");b.id="profileButton";b.className="icon-btn fd-profile-trigger";b.textContent="👤";b.setAttribute("aria-label","Open Friend Deck profile");b.onclick=open;actions.insertBefore(b,actions.firstChild);}
    current=ensureGuest();
    db().then(async c=>{const {data:{session}}=await c.auth.getSession();if(session){const {data}=await c.from("friend_deck_profiles").select("*").eq("user_id",session.user.id).maybeSingle();if(data){current=data;mode="portable";}}}).catch(()=>{});
  });
})();