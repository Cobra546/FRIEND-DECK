// Online mode loads Supabase only when requested, so same-device play can start without network access.
// Add your dedicated Supabase project URL and publishable key after running supabase.sql.
// Never put a service_role/secret key in this public browser app.
const SUPABASE_URL = "https://antqqabimhgepykkkmwl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_w6n4kCXq8cJoyd-8PE0HoQ_YBPYoI_7";
let supabase = null;
async function connectSupabase(){
  if(supabase)return supabase;
  if(!SUPABASE_URL||!SUPABASE_PUBLISHABLE_KEY)return null;
  try{const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);return supabase;}
  catch(error){toast("Could not load online services. Check your connection.");return null;}
}

const $ = (id) => document.getElementById(id);
const screens = ["homeScreen","setupScreen","factsScreen","waitingScreen","gameScreen","resultsScreen"];
const palette = ["#ffe88a","#ffb8c8","#a9d9f4","#bce8c8","#d8c7fa","#ffc58e"];
let mode = "offline", roomId = null, roomCode = "", isHost = false, myPlayerId = null, hostToken = null;
let state = { players: [], facts: [], factOrder: [], turnOrder: [], currentFact: 0, currentTurn: 0, phase: "setup", results: [], submitted: [] };
let channel = null, busy = false, soundOn = true, audioContext = null;
let musicTimer = null, musicStep = 0;
const musicChords = [
  [261.63,329.63,392.00,493.88],
  [220.00,261.63,329.63,392.00],
  [174.61,220.00,261.63,329.63],
  [196.00,246.94,293.66,392.00]
];
const musicMelody = [523.25,659.25,587.33,783.99,659.25,587.33,493.88,587.33,523.25,659.25,783.99,659.25,587.33,523.25,493.88,587.33];
const bgMusic = new Audio("https://raw.githubusercontent.com/Cobra546/GUESS-THE-FACTS/main/Friend%20Deck%20%E2%80%93%20Game%20Night.mp3");
bgMusic.loop = true;
bgMusic.preload = "auto";
bgMusic.volume = 0.38;
function startBackgroundMusic(){
  if(!soundOn || !bgMusic.paused)return;
  const attempt=bgMusic.play();
  if(attempt && typeof attempt.catch==="function")attempt.catch(()=>{});
}
function stopBackgroundMusic(){
  bgMusic.pause();
  bgMusic.currentTime=0;
}
function playSound(kind="tap"){
  if(!soundOn)return;
  try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return;
    audioContext=audioContext||new AudioContextClass();
    if(audioContext.state==="suspended")audioContext.resume();
    const notes={tap:[520,0.045],start:[660,0.12],correct:[880,0.18],wrong:[220,0.16],next:[740,0.09]};
    const [frequency,duration]=notes[kind]||notes.tap;
    const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
    oscillator.type="sine";oscillator.frequency.setValueAtTime(frequency,audioContext.currentTime);
    gain.gain.setValueAtTime(0.0001,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12,audioContext.currentTime+0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001,audioContext.currentTime+duration);
    oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration+0.02);
  }catch{}
}
window.FriendDeckPlayArcadeSound = (game, phase) => {
  if(!soundOn)return;
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    audioContext=audioContext||new C();if(audioContext.state==="suspended")audioContext.resume();
    const base={burning_bridges:390,collect_fruits:620,imposter:510,mafia:280,guess_the_facts:740}[game]||520;
    const offset={burn_question:0,burn_pick:80,burn_reveal:180,fruit:120,imposter_cards:-70,imposter_describe:60,imposter_vote:-130,mafia_cards:-90,mafia_kill:-40,mafia_doctor:130,mafia_detective:220,mafia_vote:-110}[phase]||0;
    const osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type=game==="mafia"?"triangle":"sine";osc.frequency.setValueAtTime(Math.max(110,base+offset),audioContext.currentTime);
    gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.075,audioContext.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.11);
    osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.13);
  }catch{}
};

const uid = () => crypto.randomUUID();
const shuffle = (arr) => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const escapeHtml = (s) => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function showScreen(id){screens.forEach(s=>$(s).classList.toggle("active",s===id));window.scrollTo({top:0,behavior:"smooth"});}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2400);}
function setConnection(){const p=$("connectionPill");p.innerHTML=mode==="online"?(supabase?"<i></i> Online room":"<i></i> Online setup needed"):"<i></i> Offline ready";}
function sortedPlayers(){return [...state.players].sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));}
function persistLocal(){localStorage.setItem("gtf_last_game",JSON.stringify({mode,state,roomCode}));}
function getMe(){return state.players.find(p=>p.id===myPlayerId);}
function makePlayer(name){return {id:uid(),name:name.trim(),score:0,submitted:false,facts:[]};}
function renderPlayers(){const host=$("setupPlayers");$("addPlayerRow").classList.toggle("hidden",mode==="online");host.innerHTML=state.players.map((p,i)=>`<div class="player-item"><span class="player-avatar" style="background:${palette[i%palette.length]}">${escapeHtml(p.name.slice(0,1).toUpperCase())}</span><strong>${escapeHtml(p.name)}</strong>${mode==="online"&&!isHost?"":`<button class="remove-player" data-remove="${p.id}" aria-label="Remove ${escapeHtml(p.name)}">×</button>`}</div>`).join("");$("playerCount").textContent=state.players.length+" / 10";$("setupHint").textContent=state.players.length<3?(mode==="online"?"Waiting for at least 3 players to join.":"Add at least 3 players to continue."):state.players.length>=10?"Room is full.":"Looking good — add more or continue.";host.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{if(mode==="online"&&!isHost)return;state.players=state.players.filter(p=>p.id!==b.dataset.remove);renderPlayers();if(mode==="online")syncRoom();});}
async function startSetup(selectedMode){mode=selectedMode;roomId=null;roomCode="";isHost=selectedMode==="online";myPlayerId=null;hostToken=uid();state={gameId:uid(),players:[],facts:[],factOrder:[],turnOrder:[],currentFact:0,currentTurn:0,phase:"setup",results:[],submitted:[]};$("setupTitle").innerHTML=selectedMode==="online"?"Create your <em>room.</em>":"Build your <em>line-up.</em>";$("setupDesc").textContent=selectedMode==="online"?"Share the room code. Friends join from their own devices.":"Add each player who’s joining on this device."; $("setupEyebrow").textContent=selectedMode==="online"?"PLAY TOGETHER, FROM ANYWHERE":"EVERYONE IN ONE PLACE";$("roomCodePanel").classList.add("hidden");$("setupHint").textContent="Add 3–10 players to continue.";setConnection();renderPlayers();showScreen("setupScreen");if(selectedMode==="online"&&!supabase)toast("Online needs Supabase setup — offline mode is ready.");}
async function createOnlineRoom(){if(!await connectSupabase()){toast("Online mode needs its Supabase project configured first.");return;}const entry=window.__friendDeckEntry||{};window.__friendDeckEntry=null;const first=(entry.name||prompt("Your player name?"));if(!first?.trim())return;await startSetup("online");const p=makePlayer(first);state.players.push(p);myPlayerId=p.id;const code=Math.random().toString(36).slice(2,8).toUpperCase();roomCode=code;const payload={mode:"online",gameId:state.gameId,hostId:p.id,hostToken,phase:"setup",players:state.players,facts:[],factOrder:[],turnOrder:[],currentFact:0,currentTurn:0,results:[],submitted:[]};const {data,error}=await supabase.from("game_rooms").insert({code,state:payload}).select("id").single();if(error){toast("Room creation failed: "+error.message);return;}roomId=data.id;state=payload;$("roomCodeText").textContent=roomCode;$("roomCodePanel").classList.remove("hidden");renderPlayers();subscribeRoom();toast("Room created! Share the code.");}
async function joinOnlineRoom(){if(!await connectSupabase()){toast("Online mode needs its Supabase project configured first.");return;}const entry=window.__friendDeckEntry||{};window.__friendDeckEntry=null;const code=(entry.code||prompt("Enter the 6-character room code:"))?.trim().toUpperCase();if(!code)return;const name=(entry.name||prompt("Your player name?"))?.trim();if(!name)return;const {data,error}=await supabase.from("game_rooms").select("id,state").eq("code",code).maybeSingle();if(error||!data){toast("Room not found. Check the code.");return;}const s=data.state;if(s.phase!=="setup"){toast("This game has already started.");return;}if(s.players.length>=10){toast("This room is full.");return;}if(s.players.some(p=>p.name.toLowerCase()===name.toLowerCase())){toast("That name is already taken.");return;}mode="online";roomId=data.id;roomCode=code;isHost=false;hostToken=null;state=s;const p=makePlayer(name);state.players.push(p);myPlayerId=p.id;const ok=await syncRoom();if(!ok)return;$("setupTitle").innerHTML="You’re <em>in!</em>";$("setupDesc").textContent="Wait for everyone to join, then add your five facts."; $("setupEyebrow").textContent="ROOM "+roomCode;$("roomCodeText").textContent=roomCode;$("roomCodePanel").classList.remove("hidden");$("roomCodePanel").querySelector("small").textContent="Share this code with friends.";renderPlayers();$("continueSetup").textContent="Continue to facts →";setConnection();subscribeRoom();showScreen("setupScreen");}
async function syncRoom(){if(mode!=="online"||!supabase||!roomId)return true;const {data,error}=await supabase.rpc("sync_game_room",{p_room_id:roomId,p_state:state});if(error){toast("Sync error: "+error.message);return false;}if(data)state=data;return true;}
function subscribeRoom(){if(!supabase||!roomId)return;if(channel)supabase.removeChannel(channel);channel=supabase.channel("gtf-room-"+roomId).on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_rooms",filter:"id=eq."+roomId},payload=>{const incoming=payload.new.state;if(!incoming)return;state=incoming;renderRemoteState();}).subscribe();}
function renderRemoteState(){if(mode!=="online")return;renderPlayers();if(state.phase==="setup"){if($("setupScreen").classList.contains("active"))return;showScreen("setupScreen");}else if(state.phase==="facts"){if(state.players.find(p=>p.id===myPlayerId)?.submitted){showScreen("waitingScreen");renderWaiting();}else if(!$("factsScreen").classList.contains("active")){showFactsForMe();}}else if(state.phase==="waiting"){showScreen("waitingScreen");renderWaiting();}else if(state.phase==="playing"){showScreen("gameScreen");renderGame();}else if(state.phase==="reveal"){showScreen("gameScreen");renderReveal();}else if(state.phase==="done"){showScreen("resultsScreen");renderResults();}}
$("onlineCreate").onclick=createOnlineRoom;$("offlineCreate").onclick=()=>startSetup("offline");$("addPlayerBtn").onclick=()=>{if(mode==="online")return toast("Friends join online rooms with the room code.");playSound("tap");const input=$("playerNameInput"),name=input.value.trim();if(!name)return toast("Enter a name first.");if(state.players.length>=10)return toast("Maximum 10 players.");if(state.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))return toast("That name is already in the game.");const p=makePlayer(name);state.players.push(p);if(!myPlayerId)myPlayerId=p.id;input.value="";renderPlayers();if(mode==="online")syncRoom();};
$("playerNameInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("addPlayerBtn").click();});
$("copyRoomCode").onclick=async()=>{try{await navigator.clipboard.writeText(roomCode);toast("Room code copied!");}catch{toast("Room code: "+roomCode);}};
$("continueSetup").onclick=async()=>{if(state.players.length<3)return toast("You need at least 3 players.");if(mode==="online"){if(!isHost){showFactsForMe();return;}state.phase="facts";await syncRoom();showFactsForMe();}else{state.phase="facts";state.factWriter=0;showFactsForMe();}};
function showFactsForMe(){const player=mode==="online"?getMe():state.players[state.factWriter];if(!player){toast("Player not found.");return;}if(player.submitted){showScreen("waitingScreen");renderWaiting();return;}$("factsPlayerName").textContent=player.name;$("factsProgress").textContent=(player.facts?.length||0)+" / 5";$("factInputs").innerHTML=Array.from({length:5},(_,i)=>`<label class="fact-row"><span class="fact-number">${i+1}</span><input class="fact-input" maxlength="140" data-fact="${i}" placeholder="${["Something I’m secretly good at…","A place I’ve always wanted to visit…","My most unusual food combo…","A childhood memory…","Something most people don’t know…"][i]}" value="${escapeHtml(player.facts?.[i]||"")}"></label>`).join("");$("factInputs").querySelectorAll("input").forEach(inp=>inp.addEventListener("input",()=>{$("factsProgress").textContent=[...$("factInputs").querySelectorAll("input")].filter(x=>x.value.trim()).length+" / 5";}));$("factsHint").textContent="All five facts are required. Keep them fun!";showScreen("factsScreen");}
$("saveFactsBtn").onclick=async()=>{const values=[...$("factInputs").querySelectorAll("input")].map(x=>x.value.trim());if(values.some(x=>!x))return toast("Please fill in all five facts.");if(new Set(values.map(x=>x.toLowerCase())).size!==5)return toast("Make all five facts different.");const p=mode==="online"?getMe():state.players[state.factWriter];p.facts=values;p.submitted=true;if(mode==="offline"){state.factWriter++;if(state.factWriter<state.players.length){showFactsForMe();toast("Facts saved! Pass the device.");}else{state.phase="waiting";await syncRoom();showScreen("waitingScreen");renderWaiting();}}else{await syncRoom();if(state.players.every(x=>x.submitted)){state.phase="waiting";await syncRoom();showScreen("waitingScreen");renderWaiting();}else{showScreen("waitingScreen");renderWaiting();}}persistLocal();};
function renderWaiting(){$("waitingText").textContent=state.players.filter(p=>p.submitted).length+" of "+state.players.length+" players have submitted their five facts."; $("waitingPlayers").innerHTML=state.players.map((p,i)=>`<span class="avatar-chip">${p.submitted?"✓":"…"} ${escapeHtml(p.name)}</span>`).join("");$("startGameBtn").classList.toggle("hidden",mode==="online"&&!isHost);$("waitingHint").textContent=mode==="online"?(isHost?"Everyone’s ready? Start the game when all facts are in.":"Waiting for the host to shuffle the facts."):"All facts are ready. Let’s play!";}
$("startGameBtn").onclick=async()=>{playSound("start");if(state.players.some(p=>!p.submitted))return toast("Wait until everyone has submitted.");state.turnOrder=shuffle(state.players.map(p=>p.id));state.factOrder=shuffle(state.players.flatMap(p=>p.facts.map(body=>({id:uid(),playerId:p.id,body}))));state.currentFact=0;state.currentTurn=0;state.results=[];state.phase="playing";await syncRoom();showScreen("gameScreen");renderGame();};
function currentGuesser(){const fact=state.factOrder[state.currentFact];const count=state.turnOrder.length;for(let offset=0;offset<count;offset++){const id=state.turnOrder[(state.currentTurn+offset)%count];if(!fact||id!==fact.playerId)return state.players.find(p=>p.id===id);}return state.players.find(p=>p.id===state.turnOrder[state.currentTurn%count]);}
function renderGame(){const fact=state.factOrder[state.currentFact];if(!fact){state.phase="done";syncRoom();renderResults();showScreen("resultsScreen");return;}const guesser=currentGuesser();$("roundLabel").textContent="FACT "+String(state.currentFact+1).padStart(2,"0")+" / "+state.factOrder.length;$("turnPill").textContent=guesser.name+"’s turn";$("activeFactText").textContent=fact.body;$("activeFactNote").className="sticky active-note "+["note-yellow","note-pink","note-blue","note-green","note-lilac","note-orange"][state.currentFact%6];const canGuess=mode==="offline"||guesser.id===myPlayerId;$("guessPrompt").textContent=canGuess?"Who do you think wrote this?":guesser.name+" is choosing…";$("guessOptions").innerHTML=state.players.map((p,i)=>`<button class="guess-option" data-guess="${p.id}" ${!canGuess||p.id===guesser.id?"disabled":""}>${escapeHtml(p.name)}</button>`).join("");$("guessOptions").querySelectorAll("button:not(:disabled)").forEach(b=>b.onclick=()=>submitGuess(b.dataset.guess));$("guessArea").classList.remove("hidden");$("revealArea").classList.add("hidden");renderScores($("liveScores"));if(mode==="offline"&&!canGuess)$("guessPrompt").textContent="Pass the device to "+guesser.name+".";}
async function submitGuess(guessId){if(busy)return;busy=true;const fact=state.factOrder[state.currentFact],guesser=currentGuesser(),correct=guessId===fact.playerId;playSound(correct?"correct":"wrong");if(correct)guesser.score++;state.results.push({factId:fact.id,guesserId:guesser.id,guessId,ownerId:fact.playerId,correct});state.phase="reveal";await syncRoom();renderReveal();persistLocal();busy=false;}
function renderReveal(){const result=state.results[state.results.length-1];if(!result)return;const guesser=state.players.find(p=>p.id===result.guesserId),owner=state.players.find(p=>p.id===result.ownerId),chosen=state.players.find(p=>p.id===result.guessId);$("guessArea").classList.add("hidden");$("revealArea").classList.remove("hidden");$("resultBanner").className="result-banner "+(result.correct?"correct":"wrong");$("resultBanner").textContent=result.correct?"✓ Correct! +1 point":"✕ Not quite!";$("factOwnerReveal").innerHTML=(result.correct?"CORRECT ANSWER: ":"THE FACT WAS BY: ")+`<strong style="color:${result.correct?"#23834b":"#d84e62"}">${escapeHtml(owner.name)}</strong>`; $("revealMessage").innerHTML=result.correct?`Nice one, ${escapeHtml(guesser.name)}! ${escapeHtml(owner.name)} wrote this fact.`:`The correct answer was ${escapeHtml(owner.name)}. ${escapeHtml(chosen.name)} was your guess.`;$("nextFactBtn").textContent=state.currentFact===state.factOrder.length-1?"See final results →":"Next fact →";renderScores($("liveScores"));if(mode==="online")$("nextFactBtn").classList.toggle("hidden",!isHost);else $("nextFactBtn").classList.remove("hidden");}
$("nextFactBtn").onclick=async()=>{if(mode==="online"&&!isHost)return;playSound("next");const previousGuesser=currentGuesser();state.currentFact++;state.currentTurn=(state.turnOrder.indexOf(previousGuesser.id)+1)%state.turnOrder.length;if(state.currentFact>=state.factOrder.length){state.phase="done";await syncRoom();renderResults();showScreen("resultsScreen");}else{state.phase="playing";await syncRoom();renderGame();}};
function renderScores(el){el.innerHTML=sortedPlayers().map((p,i)=>`<div class="score-row"><span class="score-rank">${i+1}</span><span class="score-name">${escapeHtml(p.name)}</span><strong class="score-points">${p.score}</strong></div>`).join("");}
$("scoreboardBtn").onclick=()=>{renderScores($("liveScores"));toast(sortedPlayers().map((p,i)=>(i+1)+". "+p.name+" — "+p.score).join("  •  "));};
function renderResults(){const ranked=sortedPlayers(),slots=[ranked[1],ranked[0],ranked[2]],classes=["second","first","third"],medals=["🥈","🥇","🥉"];$("podium").innerHTML=slots.map((p,i)=>p?`<div class="podium-place ${classes[i]}"><div class="medal">${medals[i]}</div><div class="podium-name">${escapeHtml(p.name)}</div><div class="podium-points">${p.score} POINTS</div><div class="podium-block">${classes[i]==="first"?"1":classes[i]==="second"?"2":"3"}</div></div>`:"").join("");renderScores($("finalScores"));if(window.FriendDeckStats){const profile=window.FriendDeckStats.getProfile(),me=mode==="online"?state.players.find(p=>p.id===myPlayerId):state.players.find(p=>p.name.toLowerCase()===String(profile.username||"").toLowerCase());if(me)window.FriendDeckStats.recordGame({gameKey:"guess-facts-"+(roomId||state.gameId||Date.now()),won:ranked[0]?.id===me.id,points:me.score||0});}$("playAgainBtn").classList.toggle("hidden",mode==="online"&&!isHost);$("playAgainBtn").textContent=mode==="online"?"Play Again With Same Players":"Play Again";}
$("playAgainBtn").onclick=async()=>{if(mode==="online"&&!isHost)return toast("Only the host can restart the room.");state.gameId=uid();state.players.forEach(p=>{p.score=0;p.submitted=false;p.facts=[];});state.facts=[];state.factOrder=[];state.turnOrder=[];state.currentFact=0;state.currentTurn=0;state.results=[];state.submitted=[];state.phase="setup";state.factWriter=0;const continueBtn=$("continueSetup");continueBtn.textContent="Continue to facts →";if(mode==="online"){await syncRoom();}renderPlayers();$("setupHint").textContent="Same players, fresh round! Everyone can add five new facts.";showScreen("setupScreen");};
$("homeBtn").onclick=()=>{if(channel&&supabase)supabase.removeChannel(channel);showScreen("homeScreen");};
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>{if(mode==="online"&&roomId){toast("You’re in a room. Continue setup or return home.");return;}showScreen("setupScreen");});
$("soundToggle").onclick=()=>{soundOn=!soundOn;$("soundToggle").textContent=soundOn?"♫":"♪";$("soundToggle").setAttribute("aria-label",soundOn?"Turn music and sound effects off":"Turn music and sound effects on");if(soundOn){startBackgroundMusic();playSound("tap");}else{stopBackgroundMusic();}toast(soundOn?"Music and sound effects on":"Music and sound effects off");};
document.addEventListener("pointerdown",()=>{if(soundOn)startBackgroundMusic();},{once:true});
document.addEventListener("keydown",()=>{if(soundOn)startBackgroundMusic();},{once:true});
$("onlineCreate").addEventListener("contextmenu",e=>e.preventDefault());
// A joining player can use the room code from the home screen.
const joinBtn=document.createElement("button");joinBtn.className="btn btn-light";joinBtn.id="onlineJoin";joinBtn.textContent="Join a room";$("homeScreen").querySelector(".hero-actions").append(joinBtn);joinBtn.onclick=joinOnlineRoom;
setConnection();
