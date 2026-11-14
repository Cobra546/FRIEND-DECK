(() => {
const app=document.getElementById('app');if(!app||document.getElementById('arcadeHub'))return;
const maxKillers=n=>n>=20?5:n>=17?4:Math.max(1,Math.min(3,n-3));
const games=[['burning_bridges','🔥','Burning Bridges',5,15],['guess_the_facts','✦','Guess the Facts',3,10],['collect_fruits','🍉','Collect Fruits',4,20],['imposter','🕵️','Who Is the Imposter',4,14],['mafia','🌙','Who Is Mafia',5,20],['draw_guess','🎨','Draw & Guess',2,15]];
const css=document.createElement('style');css.textContent=`
#arcadeHub{--deck-ink:#24222a;--deck-muted:#77717d}
#arcadeHub .deck-hero{position:relative;overflow:hidden;border-radius:28px;padding:34px 30px 30px;background:linear-gradient(135deg,#211e2b 0%,#34283d 55%,#56374e 100%);color:#fff;margin:28px 0 25px;box-shadow:0 22px 50px #30223825}
#arcadeHub .deck-hero:before,#arcadeHub .deck-hero:after{content:"";position:absolute;border:1px solid #ffffff24;border-radius:50%;pointer-events:none}
#arcadeHub .deck-hero:before{width:330px;height:330px;right:-90px;top:-170px}
#arcadeHub .deck-hero:after{width:240px;height:240px;right:35px;bottom:-190px}
#arcadeHub .deck-kicker{font-size:10px;letter-spacing:.22em;font-weight:800;color:#eac5d9}
#arcadeHub .deck-hero h1{font-size:clamp(38px,6vw,64px);max-width:580px;margin:13px 0 10px;color:#fff}
#arcadeHub .deck-hero h1 em{color:#ffc4d7}
#arcadeHub .deck-hero p{max-width:490px;color:#e5dce7;font-size:14px;line-height:1.7;margin:0}
#arcadeHub .deck-preview{position:relative;min-height:210px;margin:25px 0 5px;display:flex;align-items:center;justify-content:center;gap:12px}
#arcadeHub .flash-card{position:relative;width:min(31%,205px);min-height:165px;padding:17px 15px;border-radius:7px;color:#28232a;box-shadow:0 12px 28px #120d1a55;display:flex;flex-direction:column;justify-content:space-between}
#arcadeHub .flash-card:nth-child(1){background:#ffe78c;transform:rotate(-8deg) translateY(8px)}
#arcadeHub .flash-card:nth-child(2){background:#ffc3d2;transform:rotate(4deg) translateY(-7px);z-index:2}
#arcadeHub .flash-card:nth-child(3){background:#b8e2f4;transform:rotate(9deg) translateY(10px)}
#arcadeHub .flash-card small{font-size:9px;font-weight:800;letter-spacing:.14em;opacity:.62}
#arcadeHub .flash-card b{font:600 16px/1.25 Fredoka,sans-serif;margin:13px 0}
#arcadeHub .flash-card span{font-size:9px;font-weight:800;opacity:.58;text-align:right}
#arcadeHub .deck-chits{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:13px}
#arcadeHub .deck-chit{background:#ffffff18;border:1px dashed #ffffff65;color:#fff;border-radius:30px;padding:8px 13px;font-size:10px;font-weight:800;letter-spacing:.04em;transform:rotate(var(--tilt))}
#arcadeHub .deck-section-head{text-align:center;margin:34px 0 12px}
#arcadeHub .deck-section-head .eyebrow{color:#9a8296}
#arcadeHub .deck-section-head h2{font-size:30px;margin:8px 0}
#arcadeHub .deck-section-head p{font-size:12px;color:#81796d}
#arcadeHub .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:14px;margin:20px 0 34px}
#arcadeHub .card{position:relative;overflow:hidden;background:#fff;border:1px solid #e9e1d3;border-radius:18px;padding:19px;display:flex;flex-direction:column;min-height:215px;box-shadow:0 8px 22px #3325150b;transition:transform .2s,box-shadow .2s}
#arcadeHub .card:hover{transform:translateY(-4px);box-shadow:0 15px 30px #33251516}
#arcadeHub .card .game-icon{width:48px;height:48px;border-radius:15px;background:#f7edf4;display:grid;place-items:center;font-size:27px}
#arcadeHub .card h2{font-size:21px;margin:12px 0 8px}
#arcadeHub .card p{font-size:12px;color:#81796d;flex:1;line-height:1.6;margin-bottom:14px}
#arcadeHub .how-to-btn{align-self:flex-start;border:0;background:#f5edf7;color:#76518a;border-radius:9px;padding:8px 11px;margin:0 0 11px;font:800 10px 'DM Sans';cursor:pointer}
#arcadeHub .how-to-btn:hover{background:#eadcf1}
.fd-guide-overlay{position:fixed;inset:0;z-index:100000;background:#211a2dcc;display:grid;place-items:center;padding:16px}
.fd-guide-dialog{position:relative;width:min(100%,520px);max-height:86vh;overflow:auto;background:#fffaf1;color:#28232a;border:1px solid #eadfce;border-radius:22px;padding:25px;box-shadow:0 24px 70px #100b1680}
.fd-guide-dialog h2{font:700 29px Fredoka,sans-serif;margin:7px 38px 8px 0}
.fd-guide-dialog .guide-kicker{font-size:9px;letter-spacing:.18em;font-weight:900;color:#946c9b}
.fd-guide-dialog .guide-intro,.fd-guide-dialog .guide-win{font-size:12px;line-height:1.7;color:#756d65}
.fd-guide-dialog ol{padding-left:22px;margin:16px 0}
.fd-guide-dialog li{font-size:13px;line-height:1.65;padding:0 0 10px 4px}
.fd-guide-dialog li::marker{font-weight:900;color:#9869ad}
.fd-guide-dialog .guide-win{background:#f2eaf6;border-radius:12px;padding:12px;margin:14px 0}
.fd-guide-dialog .guide-close-x{position:absolute;right:17px;top:15px;border:0;background:#f1e9f2;color:#60486b;border-radius:50%;width:34px;height:34px;font-size:21px;cursor:pointer}
.fd-guide-dialog .guide-done{width:100%;background:#28232a;color:#fff;border:0;border-radius:11px;padding:13px;font-weight:800;cursor:pointer}
#arcadeHub .card small{font-size:10px;color:#888;margin:0 0 12px}
#arcadeHub .card .open-game{width:100%;justify-content:space-between;background:#27232d;color:#fff}
#arcadeHub .arcHead{text-align:center;padding:20px 0}
#arcadeHub .arcHead h1{font-size:clamp(38px,6vw,60px)}
\n#arcadePlay .fruit-chit-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:13px;margin:20px 0}\n#arcadePlay .fruit-chit{min-height:132px;border:2px solid #d8c9e7;border-radius:18px;background:linear-gradient(145deg,#f7efff,#e8dcf5);color:#30243b;display:flex;align-items:center;justify-content:center;padding:12px;box-shadow:0 5px 0 #cbb9dc;cursor:pointer;transition:transform .15s,box-shadow .15s}\n#arcadePlay .fruit-chit:active{transform:translateY(2px);box-shadow:0 2px 0 #cbb9dc}\n#arcadePlay .fruit-chit.selected{outline:4px solid #8d55ba;background:#f1e4ff}\n#arcadePlay .fruit-chit-cover,#arcadePlay .fruit-chit-face{display:flex;flex-direction:column;align-items:center;gap:8px}\n#arcadePlay [hidden]{display:none!important}\n#arcadePlay .fruit-chit-cover{font-size:38px}\n#arcadePlay .fruit-chit-face strong{font-size:54px;line-height:1.1}\n#arcadePlay .fruit-chit-face small,#arcadePlay .fruit-chit-cover small{font-size:14px;font-weight:700}\n#arcadePlay .private-flip-card{width:min(100%,360px);min-height:190px;margin:18px auto!important;border:3px solid #9b6ac0;border-radius:22px;background:linear-gradient(145deg,#30243b,#5e3c79);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 0 #d8c5e8;cursor:pointer;padding:20px}\n#arcadePlay .private-card-back,#arcadePlay .private-card-secret{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-size:52px;font-weight:900;text-align:center}\n#arcadePlay .private-card-back small{font-size:13px;letter-spacing:.12em}\n#arcadePlay .private-card-secret{font-size:30px;min-height:120px}\n#arcadePlay .private-flip-card.is-revealed{background:linear-gradient(145deg,#f2e5ff,#fff7e9);color:#30243b;border-color:#9b6ac0}\n#arcadePlay [hidden]{display:none!important}\n#arcadePlay .offline-turn-banner{margin:0 auto 18px;max-width:560px;padding:15px 18px;border:2px solid #9b6ac0;border-radius:18px;background:linear-gradient(135deg,#f3e7ff,#fff8ed);box-shadow:0 5px 0 #d8c5e8;text-align:center}\n#arcadePlay .offline-turn-banner span{display:block;font-size:11px;font-weight:900;letter-spacing:.16em;color:#80509f;margin-bottom:5px}\n#arcadePlay .offline-turn-banner strong{display:block;font-size:clamp(24px,6vw,34px);line-height:1.15;color:#2c2334;overflow-wrap:anywhere}
#arcadePlay .burn-player-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0}
#arcadePlay .burn-player-card{padding:16px 10px;border:2px solid #cbb3df;border-radius:17px;background:linear-gradient(145deg,#f4eaff,#fff8ed);text-align:center;min-width:0;box-shadow:0 4px 0 #e0d2eb}
#arcadePlay .burn-player-card.target{border-color:#e4b8c8;background:linear-gradient(145deg,#fff0f5,#fff8ed)}
#arcadePlay .burn-player-card small{display:block;font-size:10px;letter-spacing:.1em;font-weight:900;color:#80509f;margin-bottom:7px}
#arcadePlay .burn-player-card strong{display:block;font-size:clamp(21px,5.5vw,30px);line-height:1.15;overflow-wrap:anywhere;color:#30243b}
@media(max-width:380px){#arcadePlay .burn-player-grid{grid-template-columns:1fr}}\n#arcadePlay .arcHead.turn-active h1{font-size:clamp(25px,5vw,38px);margin:4px 0}\n#arcadePlay{max-width:720px;margin:auto}
#arcadePlay .box{background:#fff;border:1px solid #e9e1d3;border-radius:16px;padding:20px;margin:14px 0}
#arcadePlay button{margin:4px}
#arcadePlay input,#arcadePlay textarea{width:100%;padding:12px;border:1px solid #e9e1d3;border-radius:10px;font:inherit}
#arcadePlay .choice{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
#arcadePlay .choice button{padding:12px;border:1px solid #e9e1d3;border-radius:10px;background:#fffaf1;font-weight:700}
#arcadePlay .secret{padding:25px;background:#fff0c5;text-align:center;border-radius:12px;font:700 28px Fredoka;margin:12px 0}
#arcadePlay .muted{font-size:12px;color:#81796d;line-height:1.6}
#arcadePlay .result{padding:13px;background:#eaf4e8;border-radius:10px;margin:8px 0;text-align:center;font-weight:700}
#arcadePlay .players{display:grid;gap:7px}
#arcadePlay .players div{padding:10px;background:#fffaf1;border-radius:9px}
#arcadePlay .setup-player-list{display:grid;gap:9px;margin:16px 0}
#arcadePlay .setup-player-row{display:flex;align-items:center;gap:11px;padding:10px 12px!important;border:1px solid #e8d9f1;background:linear-gradient(110deg,#fbf6ff,#fff8f5)!important;border-radius:15px!important;min-width:0;box-shadow:0 3px 0 #eee4f3}
#arcadePlay .setup-player-number{flex:0 0 30px;width:30px;height:30px;display:grid;place-items:center;border-radius:10px;background:#eadcf6;color:#75449a;font-size:12px;font-weight:900}
#arcadePlay .setup-player-name{flex:1;min-width:0;font-weight:800;color:#33263d;overflow-wrap:anywhere}
#arcadePlay .player-remove-btn{flex:0 0 auto;margin:0!important;padding:7px 10px!important;border:1px solid #f0cbd7!important;border-radius:999px!important;background:#fff0f4!important;color:#a34462!important;font-size:11px!important;font-weight:800!important;line-height:1.1;box-shadow:none!important}
#arcadePlay .player-remove-btn:active{transform:scale(.96);background:#ffe2eb!important}
#arcadePlay .mode-wrap{max-width:560px;margin:0 auto}
#arcadePlay .mode-card{background:#fff;border:1px solid #e9e1d3;border-radius:22px;padding:22px;box-shadow:0 14px 34px #33251510}
#arcadePlay .mode-card h2{margin:4px 0 7px}
#arcadePlay .mode-card>p{font-size:12px;color:#81796d;line-height:1.6}
#arcadePlay .mode-name{margin:15px 0 12px}
#arcadePlay .mode-actions{display:grid;gap:9px}
#arcadePlay .mode-actions .btn{width:100%;margin:0;min-height:48px}
#arcadePlay .join-row{display:grid;grid-template-columns:1fr auto;gap:8px}
#arcadePlay .join-row .btn{width:auto}
#arcadePlay .mode-divider{display:flex;align-items:center;gap:10px;color:#aaa;font-size:9px;letter-spacing:.14em;font-weight:800;margin:4px 0}
#arcadePlay .mode-divider:before,#arcadePlay .mode-divider:after{content:"";height:1px;background:#eee6dc;flex:1}
#arcadePlay .mode-offline{background:#f5f0e7;color:#29242d}
.fire-pop{animation:arcFire .8s ease 2}
 #arcadePlay .coin-stage{text-align:center;padding:14px 0 8px}
 #arcadePlay .coin{width:112px;height:112px;margin:8px auto 14px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 32% 28%,#fff2b4 0 8%,#e9b84d 35%,#a86d1c 100%);border:7px double #8b5b18;color:#58370e;font:800 17px Fredoka,sans-serif;box-shadow:0 9px 0 #8b5b1844,0 15px 24px #33251525;backface-visibility:hidden}
 #arcadePlay .coin.is-flipping{animation:coinSpin 1.2s cubic-bezier(.2,.75,.25,1) both}
 #arcadePlay .coin.coin-landed{transform:rotateY(0);font-size:14px;letter-spacing:.04em}
 @keyframes coinSpin{0%{transform:rotateY(0) translateY(0) scale(1)}25%{transform:rotateY(360deg) translateY(-24px) scale(1.08)}55%{transform:rotateY(900deg) translateY(-8px) scale(1.04)}100%{transform:rotateY(1440deg) translateY(0) scale(1)}}
@keyframes arcFire{0%,100%{transform:scale(1)}50%{transform:scale(1.06);background:#ffe0c2;box-shadow:0 0 0 8px #ffb26a44}}
.arcade-chat{max-height:180px;overflow:auto;background:#faf7f0;padding:10px;border-radius:10px;font-size:12px}
@media(max-width:600px){#arcadeHub .deck-hero{padding:27px 18px;border-radius:20px;margin-top:18px}#arcadeHub .deck-preview{min-height:180px;gap:5px}#arcadeHub .flash-card{width:32%;min-height:142px;padding:12px 10px}#arcadeHub .flash-card b{font-size:13px}#arcadeHub .deck-chit{font-size:9px;padding:7px 10px}#arcadeHub .cards{grid-template-columns:1fr 1fr;gap:10px}#arcadeHub .card{padding:14px;min-height:225px}#arcadeHub .card h2{font-size:18px}#arcadeHub .card p{font-size:11px}#arcadePlay .mode-card{padding:17px}#arcadePlay .join-row{grid-template-columns:1fr}#arcadePlay .join-row .btn{width:100%}}
@media(max-width:380px){#arcadeHub .cards{grid-template-columns:1fr}#arcadeHub .flash-card{min-height:128px}#arcadeHub .flash-card b{font-size:12px}}
`;css.textContent+=`\n#arcadePlay .draw-canvas{display:block;width:100%;height:auto;aspect-ratio:4/3;background:#fff;border:2px solid #e6d9eb;border-radius:16px;touch-action:none;cursor:crosshair;box-shadow:0 5px 0 #eee5f1}\n#arcadePlay .draw-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:12px 0}\n#arcadePlay .draw-tools button{border:1px solid #e7ddea;background:#fff;border-radius:10px;padding:9px 12px}\n#arcadePlay .draw-tools button.active{outline:2px solid #9363b5;background:#f4eaff}\n#arcadePlay .draw-word-choice{width:100%;padding:14px!important;border:1px solid #e8d9f1!important;border-radius:13px!important;background:#fff!important;font-weight:800}\n#arcadePlay .draw-guess-row{display:grid;grid-template-columns:1fr auto;gap:8px}\n#arcadePlay .draw-guess-row button{margin:0}\n#arcadePlay .draw-score{display:flex;justify-content:space-between;gap:8px;padding:9px 12px;border-radius:10px;background:#fff8ed;margin:6px 0;font-size:12px}\n`;document.head.append(css);
const teasers=[['FUN FACT #01','I can name 20 footballers just by their clubs.','— ???'],['HOT TAKE #02','Pineapple belongs on pizza.','— ???'],['SECRET TALENT #03','I can recognise songs in two seconds.','— ???'],['PLOT TWIST #04','I have never watched a full horror movie.','— ???'],['RANDOM #05','I would choose a night drive over a party.','— ???'],['DID YOU KNOW #06','I once stayed awake for an entire movie marathon.','— ???']];
const flashPicks=[...teasers].sort(()=>Math.random()-.5).slice(0,3);
const chits=['WHO KNOWS WHO?','ONE SECRET','FIVE CLUES','MAKE YOUR GUESS','FRIEND GROUP CHAOS'].sort(()=>Math.random()-.5).slice(0,4);
const hub=document.createElement('section');hub.id='arcadeHub';hub.className='screen active';
hub.innerHTML='<div class="deck-hero"><div class="deck-kicker">✦ YOUR FRIEND GROUP, SHUFFLED ✦</div><h1>Welcome to <em>Friend Deck.</em></h1><p>Every friend has a plot twist. Pick a game, pass the secrets around, and find out who really knows the group.</p><div class="deck-preview">'+flashPicks.map((x)=>'<article class="flash-card"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></article>').join('')+'</div><div class="deck-chits">'+chits.map((x,i)=>'<span class="deck-chit" style="--tilt:'+((i%2?3:-3))+'deg">'+x+'</span>').join('')+'</div></div><div class="deck-section-head"><div class="eyebrow">PICK YOUR NEXT CHAOS</div><h2>Choose a game 🎴</h2><p>Open any game to choose how everyone plays.</p></div><div class="cards">'+games.map(g=>'<article class="card"><div class="game-icon">'+g[1]+'</div><h2>'+(g[0]==='guess_the_facts'?'Guess the Facts':g[2])+'</h2><p>'+ (g[0]==='guess_the_facts'?'Five anonymous facts. One mystery at a time. Can you guess who said that?':g[0]==='burning_bridges'?'Ask, choose, and let the coin decide what gets revealed.':g[0]==='collect_fruits'?'Collect matching fruit chits and complete your secret set.':g[0]==='imposter'?'Describe the secret without giving it away. Find the imposter.':g[0]==='mafia'?'Secret roles, night turns, discussion, and a group vote.':g[0]==='draw_guess'?'Draw a secret word on a shared canvas while friends race to guess.':'')+'</p><button type="button" class="how-to-btn" data-help="'+g[0]+'">How to play</button><small>'+g[3]+'–'+g[4]+' players · '+(g[0]==='draw_guess'?'Online only':'Online & offline')+'</small><button type="button" class="btn open-game" data-game="'+g[0]+'">Open game <span>↗</span></button></article>').join('')+'</div><footer class="footer">SHUFFLE THE CARDS. REVEAL THE CHAOS. <span>✦</span></footer>';
const play=document.createElement('section');play.id='arcadePlay';play.className='screen';app.insertBefore(hub,app.firstChild);app.insertBefore(play,hub.nextSibling);document.getElementById('homeScreen').classList.remove('active');
let state=null;
 let burnCoinKey='',burnCoinStartedAt=0;
 function coinMarkup(heads,flipping){return '<div class="coin-stage"><div class="coin '+(flipping?'is-flipping':'coin-landed')+'">'+(flipping?'🪙':(heads?'HEADS':'TAILS'))+'</div><p class="muted">'+(flipping?'Flipping the coin…':'Coin landed!')+'</p></div>'}
function show(id){app.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo(0,0)}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const gameGuides={
 burning_bridges:{title:"Burning Bridges",intro:"A private question, a secret choice and a coin toss. Play in turns and see who gets picked.",steps:["The current questioner writes a question for the next player in the turn order, such as “Who is most likely to…?”","Pass the phone to the named player. Only that player should read the question and choose the person it is about.","A coin is flipped. Heads reveals the selected person; tails keeps the answer secret.","Pass the phone back and tap Next turn. The next pair gets a new question. The game tracks how many times each person is picked."],win:"There are no points in this game. It is about the questions, surprises and the pick-count recap."},
 guess_the_facts:{title:"Guess the Facts",intro:"Find out which friend wrote each anonymous fact and score points for correct guesses.",steps:["Add 3–10 players to the room.","Each player writes exactly five facts about themselves. Keep them fun and avoid private information.","All facts are shuffled and shown one at a time in random order.","On each turn, choose the player you think wrote the fact. The answer is revealed after the guess.","The scoreboard updates immediately. Every correct guess earns 1 point."],win:"When all facts have been guessed, the player with the highest score wins."},
 collect_fruits:{title:"Collect Fruits",intro:"Pass fruit chits around the group and try to collect a complete set of the same fruit.",steps:["Each player starts with a hidden hand of fruit chits. The number of matching fruits needed for a set equals the number of players.","On your turn, tap a chit once to reveal it, then tap it again to select it.","Tap Pass chit to send that fruit face-down to the next active player.","You can keep passing chits on your turns, or choose Stop my attempt to reveal your collection.","If your hand contains a full set of the same fruit, you win. Otherwise your turn is over and play moves on."],win:"The first player to collect a matching set of fruits equal to the number of players wins."},
 imposter:{title:"Who Is the Imposter?",intro:"Most players receive the same secret word. The Imposter gets a similar but different word and must blend in.",steps:["Add 4–14 players. Each player privately taps their card to reveal their word, then hides it and passes the phone.","Remember your word. Do not show your card or say the word out loud.","Take turns describing your word without saying it directly. The Imposter must sound convincing without knowing the group’s exact word.","After everyone describes, discuss who seems suspicious. The group can vote now or play another description round.","Everyone privately votes for the person they think is the Imposter. If the vote ties, vote again."],win:"If the Imposter is voted out, everyone else wins. If the group votes out someone innocent, the Imposter wins."},
 draw_guess:{title:"Draw & Guess",intro:"One player draws a secret word while everyone else races to guess it.",steps:["Create or join an online room with 2–15 players.","The drawer privately chooses one of three random words.","The drawer sketches on the shared canvas while everyone else guesses.","Correct guesses earn 5 points and the drawer earns 2 points.","Each player gets one drawing turn, then the game ends."],win:"The group wins when everyone has had a drawing turn."},
 mafia:{title:"Mafia",intro:"A hidden-role game: Killers secretly work together while the Doctor, Detective and Civilians try to identify them.",steps:["Add 5–20 players and choose the number of Killers. Roles are dealt privately: Killers, one Doctor, one Detective and Civilians.","Pass the phone around so each player can privately reveal their role, hide it and pass the phone on.","Killers secretly choose one target. The Doctor chooses one person to save, and the Detective privately guesses who is a Killer.","The result is revealed, then everyone discusses for up to three minutes without revealing their role.","Every active player privately votes for someone to eliminate. Tied votes eliminate nobody. Repeat rounds until one side wins."],win:"Civilians win when all Killers are eliminated. Killers win when the number of remaining Killers equals or exceeds the remaining non-Killers."}
};
function showGameGuide(id){
 const g=gameGuides[id];if(!g)return;
 document.getElementById("fdGameGuide")?.remove();
 const overlay=document.createElement("div");overlay.id="fdGameGuide";overlay.className="fd-guide-overlay";
 overlay.innerHTML='<section class="fd-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="fdGuideTitle"><button type="button" class="guide-close-x" aria-label="Close guide">×</button><div class="guide-kicker">FRIEND DECK · HOW TO PLAY</div><h2 id="fdGuideTitle">'+esc(g.title)+'</h2><p class="guide-intro">'+esc(g.intro)+'</p><ol>'+g.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol><p class="guide-win"><b>How to win:</b> '+esc(g.win)+'</p><button type="button" class="guide-done">Got it</button></section>';
 document.body.append(overlay);
 const close=()=>overlay.remove();overlay.querySelector(".guide-close-x").onclick=close;overlay.querySelector(".guide-done").onclick=close;overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
}
function offlineTurnPlayer(){if(online||!state)return null;const s=state;switch(s.phase){case 'burn_question':return s.asker?.name||null;case 'burn_pick':return s.target?.name||null;case 'fruit':return s.players[s.turn]?.name||null;case 'imposter_cards':case 'imposter_vote':return s.players[s.turn]?.name||null;case 'imposter_describe':return s.players.find(p=>p.id===s.describeOrder?.[s.turn])?.name||null;case 'mafia_cards':return s.players[s.turn]?.name||null;case 'mafia_kill':return s.players.filter(p=>p.active&&p.role==='Killer')[s.turn]?.name||null;case 'mafia_doctor':return s.players.find(p=>p.active&&p.role==='Doctor')?.name||null;case 'mafia_detective':return s.players.find(p=>p.active&&p.role==='Detective')?.name||null;case 'mafia_vote':return s.players.filter(p=>p.active)[s.turn]?.name||null;default:return null;}}

function recordOfflineEnd(gameKey,winnerIds=[]){
 if(!window.FriendDeckStats||!state)return;
 const profile=window.FriendDeckStats.getProfile(),player=state.players?.find(p=>String(p.name).toLowerCase()===String(profile.username||"").toLowerCase());
 if(!player)return;
 window.FriendDeckStats.recordGame({gameKey:"offline-"+(state.startedAt||Date.now())+"-"+gameKey,won:winnerIds.includes(player.id),points:winnerIds.includes(player.id)?1:0});
}
function recordOnlineEnd(s,pub,priv,me){
 if(!window.FriendDeckStats||!["imposter_done","mafia_done","fruit_done","burn_done"].includes(s.phase))return;
 const key="online-"+s.roomId+"-"+(pub.gameSessionId||"session")+"-"+s.phase;
 let won=false;
 if(s.phase==="fruit_done")won=pub.winnerId===me;
 if(s.phase==="imposter_done"){const imp=priv.role==="IMPOSTER";const impWins=String(pub.winner||"").toLowerCase().includes("imposter");won=imp?impWins:!impWins;}
 if(s.phase==="mafia_done"){const killer=priv.role==="Killer";won=killer?pub.winner==="Killers":pub.winner==="Civilians";}
 window.FriendDeckStats.recordGame({gameKey:key,won,points:won?1:0});
}

function shell(title,html){play.classList.remove('game-burning_bridges','game-collect_fruits','game-imposter','game-mafia','game-guess_the_facts');if(state?.id)play.classList.add('game-'+state.id);const manage=(online||state?.phase==='setup')?'':'<button class="btn btn-light" id="manageOffline">Players · kick / vote out</button>';const turnName=offlineTurnPlayer();const turnBanner=turnName?'<div class="offline-turn-banner"><span>NOW IT&#39;S</span><strong>'+esc(turnName)+'&#39;S TURN</strong></div>':'';play.innerHTML='<button class="back-link" id="arcBack">← All games</button><div class="arcHead game-'+(state?.id||'default')+' '+(turnName?'turn-active':'')+'"><div class="eyebrow">'+(online?'ONLINE · LIVE ROOM':'OFFLINE · PASS THE PHONE')+'</div><h1>'+title+'</h1></div>'+turnBanner+manage+html;document.getElementById('arcBack').onclick=async()=>{if(online){try{await api('leave_room')}catch{}if(pollHandle)clearInterval(pollHandle);pollHandle=null;online=null;clearOnlineSession();}show('arcadeHub')};document.getElementById('manageOffline')?.addEventListener('click',openOfflineManage)}
function startSetup(id){const g=games.find(x=>x[0]===id);state={id:id,title:g[2],min:g[3],max:g[4],players:[],history:{},turn:0,round:1};show('arcadePlay');setup()}
function setup(){let s=state;s.phase='setup';const playerRows=s.players.map((p,i)=>s.id==='guess_the_facts'?'<div>'+ (i+1)+'. '+esc(p.name)+' <button data-remove="'+p.id+'">Remove</button></div>':'<div class="setup-player-row"><span class="setup-player-number">'+String(i+1).padStart(2,'0')+'</span><span class="setup-player-name">'+esc(p.name)+'</span><button type="button" class="player-remove-btn" data-remove="'+p.id+'" aria-label="Remove '+esc(p.name)+'">× Remove</button></div>').join('');shell(s.title,'<div class="box"><h2>Players ('+s.players.length+'/'+s.max+')</h2><p class="muted">Add '+s.min+'–'+s.max+' players. Everyone shares this phone.</p><input id="playerName" maxlength="22" placeholder="Player name"><button class="btn btn-dark" id="addPlayer">Add +</button><div class="players '+(s.id==='guess_the_facts'?'':'setup-player-list')+'">'+playerRows+'</div>'+(s.id==='mafia'?'<p class="muted">Number of Killers</p><select id="killerCount">'+Array.from({length:maxKillers(s.players.length)},(_,i)=>'<option value="'+(i+1)+'" '+((i+1)===(s.players.length>=7?3:s.players.length===5?1:2)?'selected':'')+'>'+(i+1)+'</option>').join('')+'</select>':'')+'<button class="btn btn-dark" id="startGame" '+(s.players.length<s.min?'disabled':'')+'>Start game →</button></div>');document.getElementById('addPlayer').onclick=()=>{let n=document.getElementById('playerName').value.trim();if(!n)return;if(s.players.length>=s.max)return alert('Maximum players reached.');if(s.players.some(p=>p.name.toLowerCase()===n.toLowerCase()))return alert('Name already added.');s.players.push({id:crypto.randomUUID(),name:n,active:true});setup()};document.getElementById('playerName').onkeydown=e=>{if(e.key==='Enter')document.getElementById('addPlayer').click()};play.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{s.players=s.players.filter(p=>p.id!==b.dataset.remove);setup()});document.getElementById('startGame').onclick=begin}
function options(exclude){return '<div class="choice">'+state.players.filter(p=>p.active&&p.id!==exclude).map(p=>'<button data-choice="'+p.id+'">'+esc(p.name)+'</button>').join('')+'</div>'}
function choose(fn){play.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>fn(b.dataset.choice))}
function begin(){let s=state;s.hostId=s.players[0].id;if(s.id==='burning_bridges'){s.order=s.players.map(p=>p.id).sort(()=>Math.random()-.5);s.turn=0;s.round=1;burnAsk()}if(s.id==='collect_fruits'){let n=s.players.length;s.fruitSetSize=n;let fruit=['🍎','🍌','🍇','🍊','🍓','🍉','🥝','🍍','🥭','🍒','🍐','🫐','🍋','🥥','🍑','🍈','🌽','🥕','🥑','🍅'].slice(0,n),deck=fruit.flatMap(f=>Array(n).fill(f)).sort(()=>Math.random()-.5);s.players.forEach((p,i)=>p.hand=[]);deck.forEach((fruit,i)=>s.players[i%n].hand.push(fruit));s.done=[];fruitTurn()}if(s.id==='imposter'){const pairs=[['Dolphin','Whale'],['Neymar Jr.','Mbappé'],['Pizza','Burger'],['Kuromi','Hello Kitty'],['Tiger','Lion'],['Minecraft','Roblox'],['Ferrari','Lamborghini'],['Penguin','Panda'],['Sushi','Ramen'],['Guitar','Piano'],['Football','Basketball'],['Moon','Sun'],['Mango','Peach'],['Spider-Man','Batman'],['Eiffel Tower','Big Ben'],['Taylor Swift','Billie Eilish'],['Coconut','Pineapple']];const pair=pairs[Math.floor(Math.random()*pairs.length)];s.word=pair[0];s.imposterWord=pair[1];s.imposter=s.players[Math.floor(Math.random()*s.players.length)].id;s.turn=0;s.votes={};impCard()}if(s.id==='mafia'){let k=Number(document.getElementById('killerCount').value),roles=['Killer','Doctor','Detective',...Array(k-1).fill('Killer'),...Array(s.players.length-k-2).fill('Civilian')].sort(()=>Math.random()-.5);s.players.forEach((p,i)=>p.role=roles[i]);s.round=1;s.killed=[];s.turn=0;mafiaCard()}}
function burnAsk(){let s=state;s.phase='burn_question';if(s.turn>=s.order.length){s.order=s.players.map(p=>p.id).sort(()=>Math.random()-.5);s.turn=0;s.round=(s.round||1)+1;}let a=s.players.find(p=>p.id===s.order[s.turn]),t=s.players.find(p=>p.id===s.order[(s.turn+1)%s.order.length]);s.asker=a;s.target=t;shell('🔥 Burning Bridges','<div class="box"><div class="burn-player-grid"><div class="burn-player-card"><small>QUESTION FROM</small><strong>'+esc(a.name)+'</strong></div><div class="burn-player-card target"><small>PASS PHONE TO</small><strong>'+esc(t.name)+'</strong></div></div><p class="muted">First, '+esc(a.name)+' writes a private question for '+esc(t.name)+'.</p><textarea id="question" rows="3" placeholder="Who in this group always…?"></textarea><button class="btn btn-dark" id="sendQuestion">Send question privately →</button></div>');document.getElementById('sendQuestion').onclick=()=>{let q=document.getElementById('question').value.trim();if(!q)return alert('Write a question first.');s.question=q;burnTarget(a,t)}}
function burnTarget(a,t){state.phase='burn_pick';shell('🔥 Your turn to choose','<div class="box"><div class="burn-player-grid"><div class="burn-player-card"><small>QUESTION FROM</small><strong>'+esc(a.name)+'</strong></div><div class="burn-player-card target"><small>YOUR TURN · PHONE WITH</small><strong>'+esc(t.name)+'</strong></div></div><div class="secret" style="font-size:19px">'+esc(state.question)+'</div><p class="muted">Only '+esc(t.name)+' should choose who this question is about.</p>'+options()+'<p class="muted">Heads and Tails both have an equal 50% chance.</p></div>');choose(id=>{state.chosen=id;state.history[id]=(state.history[id]||0)+1;state.heads=Math.random()<.5;burnReveal()})}
function burnReveal(){let s=state;s.phase='burn_reveal';let p=s.players.find(x=>x.id===s.chosen),n=s.history[s.chosen],names='<div class="burn-player-grid"><div class="burn-player-card"><small>QUESTION FROM</small><strong>'+esc(s.asker?.name||'Player')+'</strong></div><div class="burn-player-card target"><small>PHONE WITH</small><strong>'+esc(s.target?.name||'Player')+'</strong></div></div>';shell('🪙 Coin toss', '<div class="box">'+names+coinMarkup(s.heads,true)+'<p class="muted">Only the questioner and target should see this. Pass the phone back.</p></div>');setTimeout(()=>{if(state!==s||s.phase!=='burn_reveal')return;shell(s.heads?'🪙 HEADS!':'🪙 TAILS!', '<div class="box">'+names+coinMarkup(s.heads,false)+'<div class="result">'+(s.heads?esc(p.name)+' was selected.':'The answer stays secret 🤫')+'</div>'+(n>=2?'<div class="result fire-pop">🔥 '+esc(p.name)+' has been picked '+n+' times!</div>':'')+'<p class="muted">Only the questioner and target should see this. Pass the phone back.</p><button class="btn btn-dark" id="next">Next turn →</button></div>');document.getElementById('next').onclick=()=>{s.turn++;burnAsk()}},1250)}
function burnEnd(){let s=state;s.phase='burn_done';recordOfflineEnd('burn_done');shell('Burning Bridges complete','<div class="box">'+Object.entries(s.history).sort((a,b)=>b[1]-a[1]).map(([id,n])=>'<div class="result">'+esc(s.players.find(p=>p.id===id).name)+' · '+n+' picks</div>').join('')+'<button class="btn btn-dark" id="again">Play again</button></div>');document.getElementById('again').onclick=setup}
function fruitTurn(){let s=state;s.phase='fruit';if(s.done.length===s.players.length){recordOfflineEnd('fruit_done');shell('Collect Fruits finished','<div class="box"><button class="btn btn-dark" id="again">Play again</button></div>');document.getElementById('again').onclick=setup;return}let p=s.players[s.turn];if(s.done.includes(p.id)){s.turn=(s.turn+1)%s.players.length;return fruitTurn()}const fruitNames={'🍎':'Apple','🍌':'Banana','🍇':'Grapes','🍊':'Orange','🍓':'Strawberry','🍉':'Watermelon','🥝':'Kiwi','🍍':'Pineapple','🥭':'Mango','🍒':'Cherries','🍐':'Pear','🫐':'Blueberries','🍋':'Lemon','🥥':'Coconut','🍑':'Peach','🍈':'Melon','🌽':'Corn','🥕':'Carrot','🥑':'Avocado','🍅':'Tomato'};shell('🍉 '+esc(p.name)+'’s turn','<div class="box"><p class="muted">Pass phone to '+esc(p.name)+'. Tap a chit to reveal its fruit. Tap the revealed chit again to select it for passing.</p><div class="choice fruit-chit-grid">'+p.hand.map((f,i)=>'<button type="button" class="fruit-chit" data-chit="'+i+'"><span class="fruit-chit-cover">🎴<small>Tap to reveal</small></span><span class="fruit-chit-face" hidden><strong>'+f+'</strong><small>'+fruitNames[f]+'</small></span></button>').join('')+'</div><p id="picked" class="muted">Tap any chit to reveal the fruit inside.</p><button class="btn btn-light" id="stop">Stop my attempt</button><button class="btn btn-dark" id="pass" disabled>Pass chit →</button></div>');let ix=null;play.querySelectorAll('[data-chit]').forEach(b=>b.onclick=()=>{let i=Number(b.dataset.chit);if(!b.dataset.revealed){b.dataset.revealed='1';b.querySelector('.fruit-chit-cover').hidden=true;b.querySelector('.fruit-chit-face').hidden=false;document.getElementById('picked').textContent='Revealed: '+p.hand[i]+' '+fruitNames[p.hand[i]]+'. Tap it again to select this chit.';return}play.querySelectorAll('[data-chit]').forEach(x=>x.classList.remove('selected'));ix=i;b.classList.add('selected');document.getElementById('picked').textContent='Selected: '+p.hand[ix]+' '+fruitNames[p.hand[ix]];document.getElementById('pass').disabled=false});document.getElementById('pass').onclick=()=>{if(ix===null)return;let ni=(s.players.indexOf(p)+1)%s.players.length;while(s.done.includes(s.players[ni].id))ni=(ni+1)%s.players.length;let next=s.players[ni];next.hand.push(p.hand.splice(ix,1)[0]);s.turn=ni;fruitTurn()};document.getElementById('stop').onclick=()=>{s.done.push(p.id);let counts={};p.hand.forEach(f=>counts[f]=(counts[f]||0)+1);fruitReveal(p,Object.values(counts).some(n=>n>=(s.fruitSetSize||s.players.length)))}}
function fruitReveal(p,win){state.phase='fruit_reveal';if(win)recordOfflineEnd('fruit_done',[p.id]);shell(win?'🏆 Full set!':'Attempt stopped','<div class="box"><div class="result">'+(win?esc(p.name)+' wins!':'No full set for '+esc(p.name)+'.')+'</div><p class="muted">Their complete collection is now public.</p><div class="secret">'+p.hand.join(' ')+'</div><button class="btn btn-dark" id="next">'+(win?'Finish game':'Next player →')+'</button></div>');document.getElementById('next').onclick=()=>{if(win){shell('Collect Fruits winner','<div class="box"><div class="result">'+esc(p.name)+' wins 🍉</div><button class="btn btn-dark" id="again">Play again</button></div>');document.getElementById('again').onclick=setup}else{state.turn=(state.players.indexOf(p)+1)%state.players.length;fruitTurn()}}}
function impCard(){let s=state;s.phase='imposter_cards';if(s.turn>=s.players.length){s.turn=0;s.describeOrder=s.players.map(p=>p.id).sort(()=>Math.random()-.5);return impDescribe()}let p=s.players[s.turn];const secret=esc(p.id===s.imposter?s.imposterWord:s.word);shell('🔒 Private card '+(s.turn+1)+'/'+s.players.length,'<div class="box"><p class="muted">Pass phone to '+esc(p.name)+'. Tap the card to reveal your secret privately.</p><button type="button" class="private-flip-card" id="flipPrivate"><span class="private-card-back">🎴<small>TAP TO REVEAL</small></span><span class="private-card-secret" hidden>'+secret+'</span></button><button class="btn btn-dark" id="ready" disabled>Hide card & pass phone</button></div>');const card=document.getElementById('flipPrivate'),ready=document.getElementById('ready');card.onclick=()=>{card.classList.add('is-revealed');card.querySelector('.private-card-back').hidden=true;card.querySelector('.private-card-secret').hidden=false;ready.disabled=false};ready.onclick=()=>{s.turn++;impCard()}}
function impDescribe(){let s=state;s.phase='imposter_describe';if(s.turn>=s.describeOrder.length){shell('Description round complete','<div class="box"><p>Vote now or have one more round?</p><button class="btn btn-dark" id="vote">Vote now</button><button class="btn btn-light" id="more">One more round</button></div>');document.getElementById('vote').onclick=()=>{s.turn=0;s.votes={};impVote()};document.getElementById('more').onclick=()=>{s.round++;s.turn=0;s.describeOrder=s.players.map(p=>p.id).sort(()=>Math.random()-.5);impDescribe()};return}let p=s.players.find(x=>x.id===s.describeOrder[s.turn]);shell('Round '+s.round+' · '+esc(p.name),'<div class="box"><div class="burn-player-card target"><small>DEFINE THE WORD NOW</small><strong>'+esc(p.name)+'</strong></div><p class="muted">Pass phone to '+esc(p.name)+'. Describe your secret aloud without saying the word.</p><button class="btn btn-dark" id="done">Description done →</button></div>');document.getElementById('done').onclick=()=>{s.turn++;impDescribe()}}
function impVote(){let s=state;s.phase='imposter_vote';if(s.turn>=s.players.length){let max=Math.max(...Object.values(s.votes)),ids=Object.keys(s.votes).filter(id=>s.votes[id]===max);if(ids.length>1){shell('Vote tied','<div class="box"><p>No one is eliminated. Vote again.</p><button class="btn btn-dark" id="revote">Revote</button></div>');document.getElementById('revote').onclick=()=>{s.votes={};s.turn=0;impVote()};return}let out=ids[0],caught=out===s.imposter;s.phase='imposter_done';recordOfflineEnd('imposter_done',caught?s.players.filter(p=>p.id!==s.imposter).map(p=>p.id):[s.imposter]);shell('Imposter revealed','<div class="box"><div class="result">'+esc(s.players.find(p=>p.id===out).name)+' was eliminated.</div><div class="secret">'+(caught?'🎉 Other players win!':'🕵️ Imposter wins!')+'</div><p>Group word: '+esc(s.word)+'</p><p>Imposter word: '+esc(s.imposterWord)+'</p><button class="btn btn-dark" id="again">Play again</button></div>');document.getElementById('again').onclick=setup;return}let p=s.players[s.turn];shell('Vote '+(s.turn+1)+'/'+s.players.length,'<div class="box"><p class="muted">Pass phone to '+esc(p.name)+'. Vote for who you think is the Imposter.</p>'+options(p.id)+'</div>');choose(id=>{s.votes[id]=(s.votes[id]||0)+1;s.turn++;impVote()})}
function mafiaCard(){let s=state;s.phase='mafia_cards';if(s.turn>=s.players.length){s.turn=0;return killerTurn()}let p=s.players[s.turn];const role=p.role==='Killer'?'🔴 KILLER':p.role==='Doctor'?'🩺 DOCTOR':p.role==='Detective'?'🕵️ DETECTIVE':'👤 CIVILIAN';shell('🔒 Role card '+(s.turn+1)+'/'+s.players.length,'<div class="box"><p class="muted">Pass phone to '+esc(p.name)+'. Tap the card to reveal your role privately.</p><button type="button" class="private-flip-card" id="flipPrivate"><span class="private-card-back">🎴<small>TAP TO REVEAL</small></span><span class="private-card-secret" hidden>'+role+'</span></button><button class="btn btn-dark" id="ready" disabled>Hide role & pass phone</button></div>');const card=document.getElementById('flipPrivate'),ready=document.getElementById('ready');card.onclick=()=>{card.classList.add('is-revealed');card.querySelector('.private-card-back').hidden=true;card.querySelector('.private-card-secret').hidden=false;ready.disabled=false};ready.onclick=()=>{s.turn++;mafiaCard()}}
function killerTurn(){let s=state;s.phase='mafia_kill';let ks=s.players.filter(p=>p.active&&p.role==='Killer');if(!ks.length)return mafiaEnd('Civilians');s.kVotes={};s.turn=0;killerPick()}
function killerPick(){let s=state,ks=s.players.filter(p=>p.active&&p.role==='Killer');if(s.turn>=ks.length){const votes=Object.entries(s.kVotes),high=Math.max(0,...votes.map(x=>x[1])),top=votes.filter(x=>x[1]===high);s.target=top[Math.floor(Math.random()*top.length)]?.[0]||null;return doctorTurn()}let p=ks[s.turn];shell('🌙 Killer action '+(s.turn+1)+'/'+ks.length,'<div class="box"><p class="muted">Pass phone to '+esc(p.name)+'. Killers select one target together.</p>'+options(p.id)+'</div>');choose(id=>{s.kVotes[id]=(s.kVotes[id]||0)+1;s.turn++;killerPick()})}
function doctorTurn(){let s=state;s.phase='mafia_doctor';let d=s.players.find(p=>p.active&&p.role==='Doctor');if(!d){s.saved=null;return detectiveTurn()}shell('🩺 Doctor’s turn','<div class="box"><p class="muted">Pass phone to '+esc(d.name)+'. Choose anyone to save, including yourself.</p>'+options()+'</div>');choose(id=>{s.saved=id;detectiveTurn()})}
function detectiveTurn(){let s=state;s.phase='mafia_detective';let d=s.players.find(p=>p.active&&p.role==='Detective');if(!d){s.guess=null;return mafiaReveal()}shell('🕵️ Detective’s turn','<div class="box"><p class="muted">Pass phone to '+esc(d.name)+'. Guess one person you suspect is a Killer.</p>'+options(d.id)+'</div>');choose(id=>{s.guess=id;mafiaReveal()})}
function mafiaReveal(){let s=state;s.phase='mafia_discussion';let v=s.players.find(p=>p.id===s.target),saved=s.target&&s.saved===s.target;if(v&&!saved){v.active=false;s.killed.push(v.id)}let correct=!!(s.guess&&s.players.find(p=>p.id===s.guess)?.role==='Killer');let lines=[v?(saved?'The targeted player was saved.':v.name+' was eliminated.'):'No target selected.','Doctor '+(saved?'saved the correct person':'saved the wrong person')+'.','Detective '+(correct?'guessed correctly':'guessed incorrectly')+'.'];let alive=s.players.filter(p=>p.active),killerCount=alive.filter(p=>p.role==='Killer').length,civilianCount=alive.length-killerCount;if(killerCount===0||killerCount>=civilianCount){mafiaEnd(killerCount===0?'Civilians':'Killers',lines);return}shell('Round '+s.round+' results','<div class="box">'+lines.map(x=>'<div class="result">'+esc(x)+'</div>').join('')+'<p class="muted">Roles remain secret. Discuss face-to-face for 180 seconds.</p><div class="secret" id="timer">03:00</div><button class="btn btn-dark" id="talk">End discussion & vote</button></div>');let t=180;clearInterval(s.timer);s.timer=setInterval(()=>{t--;if(document.getElementById('timer'))document.getElementById('timer').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');if(t<=0){clearInterval(s.timer);mafiaVote()}},1000);document.getElementById('talk').onclick=()=>{clearInterval(s.timer);mafiaVote()}}
function mafiaVote(){state.votes={};state.turn=0;mafiaVoter()}
function mafiaVoter(){let s=state;s.phase='mafia_vote';let alive=s.players.filter(p=>p.active);if(s.turn>=alive.length){let max=Math.max(0,...Object.values(s.votes)),ids=Object.keys(s.votes).filter(id=>s.votes[id]===max);if(ids.length>1){shell('Voting tie · tied players safe','<div class="box"><p>No one is eliminated.</p><button class="btn btn-dark" id="next">Next round</button></div>');document.getElementById('next').onclick=mafiaCheck;return}let p=s.players.find(x=>x.id===ids[0]);if(p)p.active=false;s.phase='mafia_vote_result';shell('Voting result','<div class="box"><div class="result">'+esc(p?.name||'Player')+' was voted out. Role stays secret.</div><button class="btn btn-dark" id="next">Continue →</button></div>');document.getElementById('next').onclick=mafiaCheck;return}let p=alive[s.turn];shell('Vote '+(s.turn+1)+'/'+alive.length,'<div class="box"><p class="muted">Pass phone to '+esc(p.name)+'. Vote for one player. You cannot vote yourself.</p>'+options(p.id)+'</div>');choose(id=>{s.votes[id]=(s.votes[id]||0)+1;s.turn++;mafiaVoter()})}
function mafiaCheck(){let s=state,k=s.players.filter(p=>p.active&&p.role==='Killer').length,o=s.players.filter(p=>p.active).length-k;if(k===0)return mafiaEnd('Civilians');if(k>=o)return mafiaEnd('Killers');s.round++;killerTurn()}
function mafiaEnd(w,roundResults=[]){let s=state;s.phase='mafia_done';recordOfflineEnd('mafia_done',s.players.filter(p=>w==='Killers'?p.role==='Killer':p.role!=='Killer').map(p=>p.id));clearInterval(s.timer);shell('🏆 '+w+' win!','<div class="box">'+roundResults.map(x=>'<div class="result">'+esc(x)+'</div>').join('')+'<div class="secret">'+w+' have won the game.</div><h2>All roles revealed</h2>'+s.players.map(p=>'<div class="result">'+esc(p.name)+' · '+p.role+(p.active?'':' · eliminated')+'</div>').join('')+'<button class="btn btn-dark" id="again">Play again</button></div>');document.getElementById('again').onclick=setup}


function openOfflineManage(){
 if(online||!state)return;
 const s=state,active=s.players;
 const overlay=document.createElement('div');overlay.id='offlineManageOverlay';overlay.style.cssText='position:fixed;inset:0;background:#17130fcc;z-index:9999;display:grid;place-items:center;padding:16px';
 const panel=document.createElement('div');panel.style.cssText='background:#fffaf1;border-radius:18px;padding:20px;width:min(100%,520px);max-height:85vh;overflow:auto;color:#28231d';
 overlay.append(panel);document.body.append(overlay);
 function close(){overlay.remove()}
 function render(){
  panel.innerHTML='<h2>Player controls</h2><p class="muted">Host: '+esc(s.players.find(p=>p.id===s.hostId)?.name||"No host")+'. Pass the phone to the host for an immediate kick. Anyone can start a majority vote.</p>'+s.players.map(p=>'<div class="arcade-player"><b>'+esc(p.name)+'</b> '+(p.id===s.hostId?'👑':'')+(p.id!==s.hostId?' <button data-kick-off="'+p.id+'">Kick</button>':'')+' <button data-vote-off="'+p.id+'">Vote out</button></div>').join('')+'<button class="btn btn-light" id="closeManage">Close</button>';
  panel.querySelector('#closeManage').onclick=close;
  panel.querySelectorAll('[data-kick-off]').forEach(b=>b.onclick=()=>{if(!confirm('Host: kick '+(s.players.find(p=>p.id===b.dataset.kickOff)?.name||'this player')+'?'))return;removeOfflinePlayer(b.dataset.kickOff);close();});
  panel.querySelectorAll('[data-vote-off]').forEach(b=>b.onclick=()=>offlineVote(b.dataset.voteOff));
 }
 function offlineVote(targetId){
  const target=s.players.find(p=>p.id===targetId);if(!target)return;
  const voters=s.players.filter(p=>p.id!==targetId);let yes=0,index=0;
  function ask(){
   if(index>=voters.length){const threshold=Math.floor(s.players.length/2)+1;if(yes>=threshold){removeOfflinePlayer(targetId);close();alert(target.name+' was removed by majority vote.')}else{close();alert('Majority not reached. '+target.name+' stays in the game.')}return}
   const voter=voters[index];panel.innerHTML='<h2>Vote to remove '+esc(target.name)+'?</h2><p class="muted">Pass the phone to '+esc(voter.name)+'. Their vote is private.</p><div class="arcade-actions"><button class="btn btn-dark" id="yesVote">Vote out</button><button class="btn btn-light" id="noVote">Keep player</button></div><button class="btn btn-light" id="cancelVote">Cancel vote</button>';
   panel.querySelector('#yesVote').onclick=()=>{yes++;index++;ask()};
   panel.querySelector('#noVote').onclick=()=>{index++;ask()};
   panel.querySelector('#cancelVote').onclick=render;
  }
  ask();
 }
 render();
}
function removeOfflinePlayer(id){
 const s=state,idx=s.players.findIndex(p=>p.id===id);if(idx<0)return;
 const removed=s.players[idx];
 if(s.id==='collect_fruits'&&removed.hand?.length&&s.players.length>1){const receiver=s.players[(idx+1)%s.players.length];if(receiver.id!==removed.id)receiver.hand=[...(receiver.hand||[]),...removed.hand];}
 s.players=s.players.filter(p=>p.id!==id);
 if(s.order){const oldOrder=[...s.order],oldTurn=s.turn;s.order=s.order.filter(x=>x!==id);if(oldOrder.indexOf(id)<oldTurn)s.turn=Math.max(0,s.turn-1);s.turn=Math.min(s.turn,Math.max(0,s.order.length-1));}else if(idx<s.turn){s.turn=Math.max(0,s.turn-1);}s.turn=Math.min(s.turn,Math.max(0,s.players.length-1));
 if(s.hostId===id&&s.players.length)s.hostId=s.players[Math.floor(Math.random()*s.players.length)].id;
 if(s.done)s.done=s.done.filter(x=>x!==id);
 if(s.voteBallots)delete s.voteBallots[id];if(s.votes){delete s.votes[id];for(const voter of Object.keys(s.votes))if(s.votes[voter]===id)delete s.votes[voter];}
 if(s.id==='imposter'&&s.imposter===id){s.imposterRemoved=true;}
 if(s.id==='mafia'&&s.phase!=='mafia_done'){const k=s.players.filter(p=>p.role==='Killer').length,others=s.players.length-k;if(k===0)return mafiaEnd('Civilians');if(k>=others)return mafiaEnd('Killers');}
 if(s.players.length===0){show('arcadeHub');return;}
 if(s.phase==='burn_question')burnAsk();
 else if(s.phase==='burn_pick'){if(s.asker?.id===id||s.target?.id===id){s.turn++;burnAsk()}else burnTarget(s.asker,s.target);}
 else if(s.phase==='fruit')fruitTurn();
 else if(s.phase==='imposter_cards')impCard();
 else if(s.phase==='imposter_describe')impDescribe();
 else if(s.phase==='imposter_vote')impVote();
 else if(s.phase==='mafia_cards')mafiaCard();
 else if(s.phase==='mafia_kill')killerTurn();
 else if(s.phase==='mafia_doctor')doctorTurn();
 else if(s.phase==='mafia_detective')detectiveTurn();
 else if(s.phase==='mafia_vote')mafiaVoter();
 else if(s.phase==='imposter_done'||s.phase==='mafia_done'){}
 if(s.imposterRemoved&&s.id==='imposter'){shell('Imposter removed','<div class="box"><div class="result">The Imposter left the game. The other players win.</div><button class="btn btn-dark" id="again">Play again</button></div>');document.getElementById('again').onclick=setup;}
}

/* Online multiplayer for the four new games. Secrets are issued by the Edge Function and only returned to each player's session. */
const API_URL="https://antqqabimhgepykkkmwl.supabase.co/functions/v1/multiplayer-game-api";
const API_KEY="sb_publishable_w6n4kCXq8cJoyd-8PE0HoQ_YBPYoI_7";
let online=null,pollHandle=null,renderingOnline=false,autoEndedRound=null,refreshInFlight=false,lastRenderedSnapshot="";
function saveOnlineSession(){try{if(online)sessionStorage.setItem('friendArcadeSession',JSON.stringify({roomId:online.roomId,token:online.token,playerId:online.playerId,isHost:online.isHost,code:online.code,gameType:online.gameType}));}catch{}}
function clearOnlineSession(){try{sessionStorage.removeItem('friendArcadeSession')}catch{}}
async function api(action,extra={}) {
 const body={action,...extra};
 if(online&&action!=="create_room"&&action!=="join_room"){body.roomId=online.roomId;body.token=online.token;}
 const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":API_KEY},body:JSON.stringify(body)});
 const data=await res.json();if(!res.ok||data.error)throw new Error(data.error||"Online request failed.");return data;
}
['onlineCreate','offlineCreate'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{hub.classList.remove('active');play.classList.remove('active')}));
async function onlineEntry(id,kind,name,code=""){
 if(!name||!name.trim())return alert("Enter your player name first.");
 try{
  let data;
  if(kind==="create")data=await api("create_room",{name:name.trim(),gameType:id});
  else if(kind==="join"){if(!code.trim())return alert("Enter the 6-character room code.");data=await api("join_room",{name:name.trim(),code:code.trim().toUpperCase()});}
  else return;
  online={roomId:data.roomId,token:data.token,playerId:data.playerId,isHost:data.isHost,code:data.code,gameType:id,privateState:data.privateState||{},snapshot:null};lastRenderedSnapshot="";
  state={id,title:games.find(x=>x[0]===id)[2],min:games.find(x=>x[0]===id)[3],max:games.find(x=>x[0]===id)[4]};
  show('arcadePlay');saveOnlineSession();
  if(pollHandle)clearInterval(pollHandle);await refreshOnline();if(online)pollHandle=setInterval(refreshOnline,1300);
 }catch(e){alert(e.message);}
}
function launchLegacyGuess(mode,name,code){
 window.__friendDeckEntry={name:name||"",code:code||""};
 show("homeScreen");
 const id=mode==="create"?"onlineCreate":mode==="join"?"onlineJoin":"offlineCreate";
 const button=document.getElementById(id);
 if(!button){alert("That game option is not ready yet. Refresh the page and try again.");return;}
 button.click();
}
function openGameMode(id){
 const g=games.find(x=>x[0]===id);if(!g)return;
 state={id,title:g[2],min:g[3],max:g[4],players:[],history:{},turn:0,round:1};
 show("arcadePlay");
 play.innerHTML='<button type="button" class="back-link" id="modeBack">← All games</button><div class="arcHead"><div class="eyebrow">CHOOSE YOUR MODE</div><h1>'+(id==="guess_the_facts"?"Guess the Facts":esc(g[2]))+'</h1><p>Enter your name, then choose how to play.</p></div><div class="mode-wrap"><div class="mode-card"><h2>🎮 Let’s get the group together</h2><div class="mode-actions"><label for="modePlayerName">Your name</label><input id="modePlayerName" maxlength="22" placeholder="Enter your name…" autocomplete="name">/<button type="button" class="btn btn-dark" id="modeCreate">＋ Create Room</button><div class="mode-divider">OR JOIN FRIENDS</div><div class="join-row"><input id="modeCode" maxlength="6" placeholder="6-character room code" autocapitalize="characters"><button type="button" class="btn btn-light" id="modeJoin">Join Room ↗</button></div><div class="mode-divider">OR</div><button type="button" class="btn mode-offline" id="modeOffline">📱 Play Offline</button></div></div></div>';
 document.getElementById("modeBack").onclick=()=>show("arcadeHub");
 const identity=()=>{const username=document.getElementById("modePlayerName")?.value.trim()||"";if(username.length<2||username.length>22){alert("Enter a name between 2 and 22 characters.");return null;}return {username};};
 if(id==='draw_guess'){
  document.getElementById("modeCreate").onclick=()=>{const p=identity();if(p)onlineEntry(id,"create",p.username);};
  document.getElementById("modeJoin").onclick=()=>{const p=identity();if(!p)return;const code=document.getElementById("modeCode").value.trim();if(!code)return alert("Enter the room code.");onlineEntry(id,"join",p.username,code);};
  document.querySelector("#arcadePlay .mode-offline")?.remove();
  document.querySelector("#arcadePlay .mode-divider:last-of-type")?.remove();
  return;
 }
 document.getElementById("modeCreate").onclick=()=>{const p=identity();if(!p)return;if(id==="guess_the_facts")launchLegacyGuess("create",p.username,"");else onlineEntry(id,"create",p.username);};
 document.getElementById("modeJoin").onclick=()=>{const p=identity();if(!p)return;const code=document.getElementById("modeCode").value.trim();if(!code)return alert("Enter the room code.");if(id==="guess_the_facts")launchLegacyGuess("join",p.username,code);else onlineEntry(id,"join",p.username,code);};
 document.getElementById("modeOffline").onclick=()=>{if(id==="guess_the_facts")launchLegacyGuess("offline",name(),"");else startSetup(id);};
}

function updateOnlineClock(snap){
 const pub=snap?.publicState||{};
 if(snap?.phase==="draw_playing"){
  const left=Math.max(0,90-Math.floor((Date.now()-(pub.startedAt||Date.now()))/1000));
  const el=document.getElementById("drawTimer");if(el)el.textContent=left+"s";
 }else if(snap?.phase==="mafia_discussion"){
  const left=Math.max(0,Math.ceil(((pub.discussionEndsAt||Date.now())-Date.now())/1000));
  const el=document.querySelector("#arcadePlay h2");if(el&&el.textContent.startsWith("💬 Discussion"))el.textContent="💬 Discussion · "+String(Math.floor(left/60)).padStart(2,"0")+":"+String(left%60).padStart(2,"0");
 }
}
async function refreshOnline(){
 if(!online||renderingOnline||refreshInFlight)return;
 refreshInFlight=true;
 try{
  const snap=await api("snapshot");
  const signature=JSON.stringify({phase:snap.phase,publicState:snap.publicState,privateState:snap.privateState,players:snap.players,chat:snap.chat,isHost:snap.isHost,hostPlayerId:snap.hostPlayerId,playerId:snap.playerId,code:snap.code});
  online.snapshot=snap;online.privateState=snap.privateState||{};online.isHost=snap.isHost;
  if(!window.__fdDrawing){
   if(signature!==lastRenderedSnapshot){lastRenderedSnapshot=signature;renderOnline();}
   else updateOnlineClock(snap);
  }
 }catch(e){
  if(String(e.message).includes("session")||String(e.message).includes("active")){
   clearInterval(pollHandle);pollHandle=null;online=null;lastRenderedSnapshot="";clearOnlineSession();alert("You are no longer in this room.");show("arcadeHub");
  }else console.warn("Friend Deck room refresh failed:",e);
 }finally{refreshInFlight=false;}
}
function onlineModeration(snap){
 const me=snap.playerId,host=snap.isHost;
 return '<div class="box"><h3>Room controls</h3><p class="muted">Room code: <b>'+esc(snap.code)+'</b> · Host: '+esc(snap.players.find(p=>p.id===snap.hostPlayerId)?.display_name||snap.players.find(p=>p.id===snap.hostPlayerId)?.name||"Player")+'</p><div class="players">'+snap.players.map(p=>'<div>'+esc(p.display_name||p.name)+' '+(p.id===snap.hostPlayerId?'👑':'')+(host&&p.id!==me?' <button data-kick="'+p.id+'">Kick</button>':'')+(p.id!==me?' <button data-voteout="'+p.id+'">Vote out</button>':'')+'</div>').join('')+'</div><button class="btn btn-light" id="leaveOnline">Leave room</button></div>';
}
function bindModeration(){
 play.querySelectorAll('[data-kick]').forEach(b=>b.onclick=async()=>{if(!confirm("Kick this player?"))return;try{await api("kick",{targetPlayerId:b.dataset.kick});await refreshOnline()}catch(e){alert(e.message)}});
 play.querySelectorAll('[data-voteout]').forEach(b=>b.onclick=async()=>{try{const r=await api("vote_out",{targetPlayerId:b.dataset.voteout});alert(r.removed?"Player removed by majority vote.":"Vote recorded. Majority is required.");await refreshOnline()}catch(e){alert(e.message)}});
 const leave=document.getElementById("leaveOnline");if(leave)leave.onclick=async()=>{try{await api("leave_room");}catch{}clearInterval(pollHandle);pollHandle=null;online=null;lastRenderedSnapshot="";clearOnlineSession();show("arcadeHub");};
}
async function sendOnline(type,payload={}){try{await api("submit_action",{type,payload});await refreshOnline()}catch(e){alert(e.message)}}
function onlineChoice(players,cb,exclude){return '<div class="choice">'+players.filter(p=>p.active!==false&&p.id!==exclude).map(p=>'<button data-online-choice="'+p.id+'">'+esc(p.name||p.display_name)+'</button>').join('')+'</div>'}
function bindOnlineChoices(cb){play.querySelectorAll('[data-online-choice]').forEach(b=>b.onclick=()=>cb(b.dataset.onlineChoice))}
function renderOnline(){
 if(!online||!online.snapshot)return;
 if(online.snapshot.phase==='lobby')autoEndedRound=null;
 renderingOnline=true;
 const s=online.snapshot,pub=s.publicState||{},priv=s.privateState||{},me=s.playerId,players=pub.players||s.players.map(p=>({id:p.id,name:p.display_name,active:true})),mine=players.find(p=>p.id===me);
 recordOnlineEnd(s,pub,priv,me);
 let body="",title=state.title;
 if(s.phase==="lobby"){
  body='<div class="box"><h2>Room '+esc(s.code)+'</h2><p class="muted">'+players.length+' / '+state.max+' players · '+state.min+' minimum. Share the code with friends.</p><div class="players">'+players.map(p=>'<div>'+esc(p.name||p.display_name)+(p.id===s.hostPlayerId?' 👑 Host':'')+'</div>').join('')+'</div>'+(s.isHost?(state.id==="mafia"?'<label class="muted">Number of Killers</label><select id="onlineKillers">'+Array.from({length:maxKillers(players.length)},(_,i)=>'<option value="'+(i+1)+'">'+(i+1)+'</option>').join('')+'</select>':'')+'<button class="btn btn-dark" id="onlineStart" '+(players.length<state.min?'disabled':'')+'>Start game →</button>':'<p class="muted">Waiting for the host to start…</p>')+'</div>'+onlineModeration(s);
  shell(title,body);const st=document.getElementById("onlineStart");if(st)st.onclick=async()=>{try{await api("start_game",{killerCount:Number(document.getElementById("onlineKillers")?.value||0)});await refreshOnline()}catch(e){alert(e.message)}};
 
}else if(s.phase==="draw_choose"){
  body='<div class="box"><h2>🎨 Your drawing turn</h2><p class="muted">Only you can see these three words. Choose one, then draw it without writing letters or numbers.</p>'+(s.drawerId===me?(priv.wordChoices||[]).map(w=>'<button class="draw-word-choice" data-word="'+esc(w)+'">'+esc(w)+'</button>').join(''):'<p class="muted">Waiting for '+esc(players.find(p=>p.id===s.drawerId)?.name||"the drawer")+' to choose a word…</p>')+'</div>'+onlineModeration(s);shell(title,body);play.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>sendOnline("draw_choose_word",{word:b.dataset.word}));
 }else if(s.phase==="draw_playing"){
  const left=Math.max(0,90-Math.floor((Date.now()-(pub.startedAt||Date.now()))/1000));
  body='<div class="box"><h2>'+esc(players.find(p=>p.id===s.drawerId)?.name||"Drawer")+' is drawing</h2><p class="muted">Time left: <b id="drawTimer">'+left+'s</b> · Guess the word!</p><div class="draw-tools"><button type="button" data-color="#24222a" class="active">Black</button><button type="button" data-color="#e34c72">Pink</button><button type="button" data-color="#3976c8">Blue</button><button type="button" data-color="#31956a">Green</button><button type="button" data-color="#f0a42a">Orange</button><button type="button" id="drawClear">Clear</button></div><canvas id="drawCanvas" class="draw-canvas" width="800" height="600" aria-label="Shared drawing canvas"></canvas>'+(s.drawerId===me?'<p class="muted">Draw here. Your secret word: <b>'+esc(priv.chosenWord||"")+'</b></p>':'<form id="drawGuessForm" class="draw-guess-row"><input id="drawGuessInput" maxlength="50" placeholder="Type your guess…" autocomplete="off"><button class="btn btn-dark" type="submit">Guess</button></form>')+'</div>'+onlineModeration(s);
  shell(title,body);
  const canvas=document.getElementById('drawCanvas'),ctx=canvas.getContext('2d');ctx.lineCap='round';ctx.lineJoin='round';ctx.fillStyle='#fff';ctx.fillRect(0,0,800,600);
  const paint=st=>{if(!Array.isArray(st.points)||!st.points.length)return;ctx.strokeStyle=st.color||'#24222a';ctx.lineWidth=st.width||7;ctx.beginPath();st.points.forEach((p,i)=>{const x=p.x*800,y=p.y*600;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});if(st.points.length===1)ctx.lineTo(st.points[0].x*800+.1,st.points[0].y*600+.1);ctx.stroke()};
  (pub.strokes||[]).forEach(paint);
  let color='#24222a',points=[],drawing=false;
  play.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{color=b.dataset.color;play.querySelectorAll('[data-color]').forEach(x=>x.classList.toggle('active',x===b));});
  if(s.drawerId===me){
   const pos=e=>{const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))}};
   canvas.onpointerdown=e=>{drawing=true;window.__fdDrawing=true;points=[pos(e)];canvas.setPointerCapture(e.pointerId);ctx.strokeStyle=color;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(points[0].x*800,points[0].y*600)};
   canvas.onpointermove=e=>{if(!drawing)return;const p=pos(e);points.push(p);ctx.lineTo(p.x*800,p.y*600);ctx.stroke()};
   canvas.onpointerup=async()=>{if(!drawing)return;drawing=false;window.__fdDrawing=false;if(points.length>1)await sendOnline('draw_stroke',{points,color,width:7});else await refreshOnline();};
   canvas.onpointercancel=()=>{drawing=false;window.__fdDrawing=false;};
   document.getElementById('drawClear').onclick=()=>sendOnline('draw_clear');
  }
  const gf=document.getElementById('drawGuessForm');if(gf)gf.onsubmit=e=>{e.preventDefault();const v=document.getElementById('drawGuessInput').value.trim();if(v)sendOnline('draw_guess',{guess:v});};
  const timer=document.getElementById('drawTimer');if(left<=0&&s.isHost)sendOnline('draw_timeout');else if(timer)timer.textContent=left+'s';
 }else if(s.phase==="draw_reveal"){
  body='<div class="box"><h2>Round result</h2><div class="secret">'+esc(pub.answer||"Word revealed")+'</div><p class="result">'+(pub.winnerId?esc(players.find(p=>p.id===pub.winnerId)?.name||"Player")+' guessed correctly!':'Time is up — nobody guessed it.')+'</p><h3>Scores</h3>'+players.map(p=>'<div class="draw-score"><b>'+esc(p.name)+'</b><strong>'+(p.score||0)+' pts</strong></div>').join('')+(s.isHost?'<button class="btn btn-dark" id="drawNext">Next drawer →</button>':'<p class="muted">Waiting for the host to continue…</p>')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById('drawNext')?.addEventListener('click',()=>sendOnline('draw_next'));
 }else if(s.phase==="draw_done"){
  body='<div class="box"><h2>Draw & Guess finished!</h2><p>Everyone has had a drawing turn. Nice game!</p>'+(s.isHost?'<button class="btn btn-dark" id="restartOnline">Play again ↻</button>':'<p class="muted">Waiting for host to rematch…</p>')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById('restartOnline')?.addEventListener('click',async()=>{await api('restart_room');await refreshOnline()});
 
  const card=s.phase==="cards"?(priv.word||"Loading private card…"):({Killer:"🔴 KILLER",Doctor:"🩺 DOCTOR",Detective:"🕵️ DETECTIVE",Civilian:"👤 CIVILIAN"}[priv.role]||"Loading role…");
  const readyType=s.phase==="cards"?"imposter_ready":"mafia_ready";
  body='<div class="box"><p class="muted">Only you can see this private card. Do not show your screen to anyone.</p><div class="secret">'+esc(card)+'</div><button class="btn btn-dark" id="onlineReady">I’m ready — hide card</button></div>'+onlineModeration(s);
  shell(title,body);document.getElementById("onlineReady").onclick=()=>sendOnline(readyType);
 }else if(s.phase==="imposter_describe"){
  const current=pub.order?.[pub.turnIndex],who=players.find(p=>p.id===current);
  body='<div class="box"><h2>'+esc(who?.name||"Player")+'’s description turn</h2><p class="muted">Describe the secret out loud without saying the word. The Imposter must also describe and try to infer it.</p>'+(current===me?'<button class="btn btn-dark" id="onlineDone">Description done →</button>':'<p>Waiting for the current player…</p>')+'</div>'+onlineModeration(s);
  shell(title,body);document.getElementById("onlineDone")?.addEventListener("click",()=>sendOnline("imposter_description_done"));
 }else if(s.phase==="imposter_decision"){
  body='<div class="box"><h2>Discussion complete</h2><p>Host chooses whether to vote now or have one more description round.</p>'+(s.isHost?'<button class="btn btn-dark" id="voteNow">Vote now</button><button class="btn btn-light" id="moreRound">One more round</button>':'<p class="muted">Waiting for host…</p>')+'</div>'+onlineModeration(s);shell(title,body);
  document.getElementById("voteNow")?.addEventListener("click",()=>sendOnline("imposter_open_vote"));document.getElementById("moreRound")?.addEventListener("click",()=>sendOnline("imposter_more_round"));
 }else if(s.phase==="imposter_voting"||s.phase==="imposter_revote"){
  body='<div class="box"><h2>'+(s.phase==="imposter_revote"?"Revote":"Vote for the Imposter")+'</h2><p class="muted">Choose one active player. Your vote is private.</p>'+onlineChoice(players,()=>{},me)+'</div>'+onlineModeration(s);shell(title,body);bindOnlineChoices(id=>sendOnline("imposter_vote",{targetId:id}));
 }else if(s.phase==="imposter_done"){
  body='<div class="box"><div class="secret">Group word: '+esc(pub.secretWord||"—")+'</div><p>Imposter word: '+esc(pub.secretImposterWord||"—")+'</p><div class="result">'+esc(players.find(p=>p.id===pub.imposterId)?.name||"Imposter")+' was the Imposter.</div><div class="result">'+esc(pub.winner||"")+' win!</div>'+(s.isHost?'<button class="btn btn-dark" id="restartOnline">Play again</button>':'<p class="muted">Waiting for host to restart…</p>')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById("restartOnline")?.addEventListener("click",async()=>{await api("restart_room");await refreshOnline()});
 }else if(s.phase==="fruit"){
  const current=pub.order?.[pub.turnIndex],who=players.find(p=>p.id===current),hand=priv.hand||[];
  body='<div class="box"><h2>'+esc(who?.name||"Player")+'’s turn</h2>'+(current===me?'<p class="muted">Choose one chit to pass face-down to the next player.</p><div class="choice">'+hand.map((f,i)=>'<button data-fruit-index="'+i+'">'+esc(f)+'</button>').join('')+'</div><button class="btn btn-light" id="fruitStopOnline">Stop my attempt & reveal my chits</button>':'<p class="muted">Waiting for '+esc(who?.name||"player")+' to pass one chit or stop.</p>')+'</div>'+onlineModeration(s);
  shell(title,body);play.querySelectorAll('[data-fruit-index]').forEach(b=>b.onclick=()=>sendOnline("fruit_pass",{index:Number(b.dataset.fruitIndex)}));document.getElementById("fruitStopOnline")?.addEventListener("click",()=>sendOnline("fruit_stop"));
 }else if(s.phase==="fruit_done"){
  body='<div class="box"><h2>Collect Fruits finished</h2>'+(pub.winnerId?'<div class="result">'+esc(players.find(p=>p.id===pub.winnerId)?.name||"Player")+' collected a full set and wins!</div>':'<div class="result">No full set was collected.</div>')+(pub.revealedCollections||[]).map(x=>'<p>'+esc(players.find(p=>p.id===x.playerId)?.name||"Player")+': '+esc((x.chits||[]).join(" "))+'</p>').join('')+(s.isHost?'<button class="btn btn-dark" id="restartOnline">Play again</button>':'<p class="muted">Waiting for host…</p>')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById("restartOnline")?.addEventListener("click",async()=>{await api("restart_room");await refreshOnline()});
 }else if(s.phase==="burn_question"){
  const current=pub.order?.[pub.turnIndex],who=players.find(p=>p.id===current);
  const nextId=pub.order?.[(Number(pub.turnIndex||0)+1)%(pub.order?.length||1)],nextPlayer=players.find(p=>p.id===nextId);
  body='<div class="box"><div class="burn-player-grid"><div class="burn-player-card"><small>QUESTION FROM</small><strong>'+esc(who?.name||"Player")+'</strong></div><div class="burn-player-card target"><small>PASS PHONE TO</small><strong>'+esc(nextPlayer?.name||"Player")+'</strong></div></div>'+(current===me?'<p class="muted">Write a question for '+esc(nextPlayer?.name||"the adjacent player")+'. Only that player receives it privately.</p><textarea id="burnQOnline" rows="3" placeholder="Who in this group always…?"></textarea><button class="btn btn-dark" id="burnAskOnline">Send private question →</button>':'<p class="muted">Waiting for '+esc(who?.name||"the questioner")+' to send a question for '+esc(nextPlayer?.name||"the next player")+'…</p>')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById("burnAskOnline")?.addEventListener("click",()=>sendOnline("burn_question",{question:document.getElementById("burnQOnline").value}));
 }else if(s.phase==="burn_pick"){
  const asker=players.find(p=>p.id===pub.askerId),target=players.find(p=>p.id===pub.targetId);
  if(me===pub.targetId)body='<div class="box"><div class="burn-player-grid"><div class="burn-player-card"><small>QUESTION FROM</small><strong>'+esc(asker?.name||"Player")+'</strong></div><div class="burn-player-card target"><small>YOUR TURN · PHONE WITH</small><strong>'+esc(target?.name||"You")+'</strong></div></div><p><b>Private question:</b></p><div class="secret" style="font-size:19px">'+esc(priv.incomingQuestion||"")+'</div><p class="muted">Choose who the question is about. Heads and Tails each have a 50% chance.</p>'+onlineChoice(players,()=>{})+'</div>';
  else body='<div class="box"><div class="burn-player-grid"><div class="burn-player-card"><small>QUESTION FROM</small><strong>'+esc(asker?.name||"Player")+'</strong></div><div class="burn-player-card target"><small>PHONE WITH</small><strong>'+esc(target?.name||"Player")+'</strong></div></div><p class="muted">Waiting for '+esc(target?.name||"the adjacent player")+' to make their private choice…</p></div>';
  body+=onlineModeration(s);shell(title,body);if(me===pub.targetId)bindOnlineChoices(id=>sendOnline("burn_pick",{chosenId:id}));
 }else if(s.phase==="burn_reveal"){
  const reveal=priv.burnReveal;
  let coinFlipping=false;if(reveal){const coinKey=String(s.roomId||s.code)+":"+pub.turnIndex+":"+pub.askerId;if(coinKey!==burnCoinKey){burnCoinKey=coinKey;burnCoinStartedAt=Date.now()}coinFlipping=Date.now()-burnCoinStartedAt<2500;}const asker=players.find(p=>p.id===pub.askerId),target=players.find(p=>p.id===pub.targetId);body='<div class="box"><div class="burn-player-grid"><div class="burn-player-card"><small>QUESTION FROM</small><strong>'+esc(asker?.name||"Player")+'</strong></div><div class="burn-player-card target"><small>PHONE WITH</small><strong>'+esc(target?.name||"Player")+'</strong></div></div>'+(reveal?(coinMarkup(reveal.heads,coinFlipping)+(coinFlipping?'<p class="muted">The coin is flipping…</p>':'<div class="result">'+(reveal.heads?esc(players.find(p=>p.id===reveal.chosenId)?.name||"Selected player")+" was selected.":"The answer stays secret 🤫")+'</div>')+(reveal.repeated&&!coinFlipping?'<div class="result fire-pop">🔥 The bridge is burning!</div>':'')):'<p class="muted">Private result is visible only to the questioner and adjacent player.</p>')+(me===pub.askerId&&!coinFlipping?'<button class="btn btn-dark" id="burnNextOnline">Next turn →</button>':'')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById("burnNextOnline")?.addEventListener("click",()=>sendOnline("burn_next"));
 }else if(s.phase==="burn_done"){
  body='<div class="box"><h2>🔥 Burning Bridges ended</h2><p>The room has fewer than 5 active players, so the game has ended.</p>'+(s.isHost?'<button class="btn btn-dark" id="restartOnline">Play again</button>':'<p class="muted">Waiting for host…</p>')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById("restartOnline")?.addEventListener("click",async()=>{await api("restart_room");await refreshOnline()});
 }else if(s.phase==="mafia_kill"||s.phase==="mafia_doctor"||s.phase==="mafia_detective"){
  const role=priv.role,required=s.phase==="mafia_kill"?"Killer":s.phase==="mafia_doctor"?"Doctor":"Detective",action=s.phase==="mafia_kill"?"killer_target":s.phase==="mafia_doctor"?"doctor_save":"detective_guess";
  const roleMatches=role===required;
  body='<div class="box"><h2>'+(s.phase==="mafia_kill"?"🌙 Killer turn":s.phase==="mafia_doctor"?"🩺 Doctor turn":"🕵️ Detective turn")+'</h2>'+(roleMatches?'<p class="muted">'+(required==="Killer"?"Choose the person to target.":required==="Doctor"?"Choose one person to save, including yourself.":"Guess who you think is a Killer.")+'</p>'+onlineChoice(players,()=>{}):'<p class="muted">Your role does not act in this phase. Keep your role secret.</p>')+'</div>'+onlineModeration(s);shell(title,body);if(roleMatches)bindOnlineChoices(id=>sendOnline(action,{targetId:id}));
 }else if(s.phase==="mafia_discussion"){
  const left=Math.max(0,Math.ceil(((pub.discussionEndsAt||Date.now())-Date.now())/1000));if(left<=0&&s.isHost&&autoEndedRound!==pub.round){autoEndedRound=pub.round;setTimeout(()=>sendOnline('mafia_discussion_done'),0)}
  const chat=s.chat||[];
  body='<div class="box">'+(pub.result||[]).map(x=>'<div class="result">'+esc(x)+'</div>').join('')+'<h2>💬 Discussion · '+String(Math.floor(left/60)).padStart(2,"0")+':'+String(left%60).padStart(2,"0")+'</h2><p class="muted">Discuss who seems suspicious. Do not reveal your role.</p><div class="arcade-chat">'+chat.map(m=>'<p><b>'+esc(players.find(p=>p.id===m.playerId)?.name||"Player")+'</b>: '+esc(m.text)+'</p>').join('')+'</div><div class="arcade-row"><input id="mafChatInput" maxlength="300" placeholder="Write a message…"><button class="btn btn-light" id="mafChatSend">Send</button></div>'+(s.isHost?'<button class="btn btn-dark" id="endTalk">End discussion & vote</button>':'')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById("mafChatSend")?.addEventListener("click",()=>{const text=document.getElementById("mafChatInput").value.trim();if(text)sendOnline("chat_message",{text})});document.getElementById("endTalk")?.addEventListener("click",()=>sendOnline("mafia_discussion_done"));
 }else if(s.phase==="mafia_vote"){
  body='<div class="box"><h2>🗳️ Vote out a player</h2><p class="muted">Choose one active player. Your vote is private.</p>'+onlineChoice(players,()=>{},me)+'</div>'+onlineModeration(s);shell(title,body);bindOnlineChoices(id=>sendOnline("mafia_vote",{targetId:id}));
 }else if(s.phase==="mafia_done"){
  body='<div class="box">'+(pub.result||[]).map(x=>'<div class="result">'+esc(x)+'</div>').join('')+'<div class="secret">🏆 '+esc(pub.winner||"")+' win!</div><h2>All roles revealed</h2>'+players.map(p=>'<div class="result">'+esc(p.name)+' · '+esc(p.role||"Unknown")+(p.active===false?' · eliminated':'')+'</div>').join('')+(s.isHost?'<button class="btn btn-dark" id="restartOnline">Play again</button>':'<p class="muted">Waiting for host to restart…</p>')+'</div>'+onlineModeration(s);shell(title,body);document.getElementById("restartOnline")?.addEventListener("click",async()=>{await api("restart_room");await refreshOnline()});
 }else{
  body='<div class="box"><p class="muted">Waiting for the next game phase…</p></div>'+onlineModeration(s);shell(title,body);
 }
 bindModeration();renderingOnline=false;
}

play.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!window.FriendDeckPlayArcadeSound)return;window.FriendDeckPlayArcadeSound(state?.id,state?.phase);});
hub.addEventListener('click',e=>{const help=e.target.closest('[data-help]');if(help){e.preventDefault();showGameGuide(help.dataset.help);return;}const b=e.target.closest('[data-game]');if(!b)return;e.preventDefault();openGameMode(b.dataset.game);});
try{
 const saved=JSON.parse(sessionStorage.getItem("friendArcadeSession")||"null");
 const game=saved&&games.find(g=>g[0]===saved.gameType);
 if(saved&&saved.roomId&&saved.token&&game){
  online={...saved,snapshot:null,privateState:{}};lastRenderedSnapshot="";
  state={id:game[0],title:game[2],min:game[3],max:game[4]};
  show("arcadePlay");
  refreshOnline().then(()=>{if(online&&!pollHandle)pollHandle=setInterval(refreshOnline,1300);});
 }
}catch{clearOnlineSession();}
})();