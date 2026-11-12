(()=>{'use strict';
const $=id=>document.getElementById(id);
const PAGE={home:$('home'),lobby:$('lobby'),game:$('game'),finished:$('finished')};
const COLORS=['#f5b8cc','#a9d8ff','#ffe09a','#b5e6bc'];
let socket=null,latest=null,currentRoom=null,rejoinCode=new URLSearchParams(location.search).get('room')?.toUpperCase()||null;
let myClientId=localStorage.getItem('bilgi-arenasi-client-id');
if(!myClientId){myClientId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;localStorage.setItem('bilgi-arenasi-client-id',myClientId);}
let clockOffset=0,lastRound=0,selected=null,toastTimer=0,connecting=false,shouldRejoin=true;
const send=(msg)=>{if(socket?.readyState===WebSocket.OPEN){socket.send(JSON.stringify(msg));return true;}toast('Bağlantı kesildi. Yeniden bağlanılıyor…');return false;};
const show=page=>{for(const [id,node] of Object.entries(PAGE))node.classList.toggle('hidden',id!==page);};
function toast(s){const n=$('toast');n.textContent=s;n.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.classList.add('hidden'),4500);}
const join=(code)=>{if(!code)return;const trimmed=code.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);if(trimmed.length!==6){toast('Oda kodu 6 karakter olmalı.');return;}rejoinCode=trimmed;shouldRejoin=true;if(!send({type:'join',code:trimmed,clientId:myClientId}))return;};
function connect(){
 if(connecting||socket?.readyState===WebSocket.OPEN)return;
 connecting=true;
 const proto=location.protocol==='https:'?'wss:':'ws:';
 socket=new WebSocket(`${proto}//${location.host}/ws`);
 window.gameSocket = socket;
 socket.onopen=()=>{connecting=false;$('connection').className='connection online';$('connection').innerHTML='<i></i> Bağlandı';if(shouldRejoin&&rejoinCode)send({type:'join',code:rejoinCode,clientId:myClientId});};
 socket.onmessage=e=>{
  let data;try{data=JSON.parse(e.data);}catch{return;}
  if(data.type==='state'){latest=data;currentRoom=data.code;rejoinCode=data.code;clockOffset=data.serverNow-Date.now();
    const u=new URL(location.href);u.searchParams.set('room',data.code);history.replaceState(null,'',u);render(data);}
  if(data.type==='error')toast(data.message);
  if(data.type==='left'){latest=null;currentRoom=null;rejoinCode=null;shouldRejoin=false;history.replaceState(null,'',location.pathname);show('home');}
 };
 socket.onclose=()=>{connecting=false;$('connection').className='connection offline';$('connection').innerHTML='<i></i> Bağlantı kesildi';if(currentRoom)toast('Bağlantı kesildi, yeniden bağlanılıyor…');setTimeout(connect,1600);};
 socket.onerror=()=>{};
}
function createSeatCard(p){
 const b=document.createElement('button');b.type='button';b.className='seat-card'+(p.seat===latest.seat?' mine':'')+(p.taken?' taken':'');
 const avatar=document.createElement('span');avatar.className='seat-avatar';avatar.textContent=p.seat;
 const title=document.createElement('strong');title.textContent='Oyuncu '+p.seat;
 const detail=document.createElement('small');detail.textContent=p.seat===latest.seat?'★ Senin koltuğun':p.taken?(p.connected?'● Bağlandı':'○ Yeniden bağlanıyor'):'+ Bu koltuğu seç';
 b.append(avatar,title,detail);
 b.disabled=!!p.taken&&p.seat!==latest.seat;
 b.addEventListener('click',()=>send({type:'seat',seat:p.seat}));
 return b;
}
function renderLobby(s){
 show('lobby');$('roomCode').textContent=s.code;
 $('seatGrid').replaceChildren(...s.players.map(createSeatCard));
 const ready=s.players.filter(p=>p.taken&&p.connected).length;
 $('lobbyStatus').textContent=`${ready} / 4 oyuncu hazır`;
 $('start').disabled=ready!==4||!s.seat;
 $('start').textContent=ready===4?'🎉 Herkes hazır! Oyunu başlat →':`Dört oyuncu bekleniyor (${ready}/4)`;
}
function scoreElement(p){
 const row=document.createElement('div');row.className='score-row'+(p.seat===latest.seat?' mine':'');
 const icon=document.createElement('span');icon.className='score-icon';icon.textContent=p.seat;
 const meta=document.createElement('span');meta.className='score-meta';
 const name=document.createElement('small');name.textContent=`Oyuncu ${p.seat}${p.seat===latest.seat?' · SEN':''}`;
 const pts=document.createElement('strong');pts.textContent=`${p.score} puan`;meta.append(name,pts);
 const indicator=document.createElement('span');indicator.className='answered-dot';indicator.textContent=p.answered?'✓':'';
 row.append(icon,meta,indicator);return row;
}
function makeOption(option,i,s){
 const b=document.createElement('button');b.type='button';b.className='answer-option';
 const letter=document.createElement('span');letter.className='option-letter';letter.textContent='ABCD'[i];
 const word=document.createElement('span');word.textContent=option;b.append(letter,word);
 const mine=s.players.find(p=>p.seat===s.seat);
 if(selected===i)b.classList.add('selected');
 if(s.reveal){
  if(s.reveal.answer===i)b.classList.add('correct');
  if(s.seat&&s.reveal.answers['ABCD'.indexOf(s.seat)]===i&&i!==s.reveal.answer)b.classList.add('wrong');
 }
 b.disabled=!!s.reveal||!s.seat||!!mine?.answered;
 b.addEventListener('click',()=>{if(send({type:'answer',option:i})){selected=i;renderGame(latest);}});
 return b;
}
function renderGame(s){
 show('game');const q=s.question;if(!q)return;
 if(lastRound!==s.questionNumber){lastRound=s.questionNumber;selected=null;}
 $('roundLabel').textContent=`SORU ${s.questionNumber} / ${s.total}`;
 $('category').textContent=q.category==='Düzen'?'Evrendeki Mükemmel Düzen':q.category==='Tevhit'?'Allah’ın Varlığı ve Birliği':q.category==='İsimler'?'Allah’ın Güzel İsimleri':'İhlas Suresi';
 $('progressBar').style.width=`${100*s.questionNumber/s.total}%`;
 $('qEyebrow').textContent=`✦ ${q.category.toUpperCase()} · BİLGİNİ GÖSTER`;
 $('question').textContent=q.text;
 $('answers').replaceChildren(...q.options.map((o,i)=>makeOption(o,i,s)));
 const answered=s.players.filter(p=>p.answered).length;
 $('answeredCount').textContent=`${answered} / 4 cevapladı`;
 $('gameScores').replaceChildren(...s.players.map(scoreElement));
 $('spectatorHint').classList.toggle('hidden',!!s.seat);
 const me=s.players.find(p=>p.seat===s.seat);
 $('answerStatus').textContent=s.reveal?'Soru tamamlandı. Doğru cevabı incele!':me?.answered?'✓ Cevabın kaydedildi. Arkadaşların bekleniyor…':s.seat?'Süren var! Bir cevap seç.':'Oyuncular cevaplıyor…';
 $('revealBox').classList.toggle('hidden',!s.reveal);
 if(s.reveal){
  const index='ABCD'.indexOf(s.seat),mineAnswer=s.reveal.answers[index];
  $('revealHeading').textContent=index<0?'✅ Doğru cevap: '+ 'ABCD'[s.reveal.answer] :mineAnswer===s.reveal.answer?'🎉 Doğru bildin! +10 puan':mineAnswer==null?'⌛ Süre doldu. Doğru cevap: '+ 'ABCD'[s.reveal.answer]:'💡 Doğru cevap: '+ 'ABCD'[s.reveal.answer];
  $('explanation').textContent=s.reveal.explanation;
 }
 updateClock();
}
function finalRow(p,i,best){const item=document.createElement('div');item.className='final-item'+(p.score===best?' first':'');const rank=document.createElement('div');rank.className='final-rank';rank.textContent=i===0?'🥇':i===1?'🥈':i===2?'🥉':'🎖️';const name=document.createElement('div');name.className='final-name';name.textContent=`Oyuncu ${p.seat}${p.seat===latest.seat?' (Sen)':''}`;const points=document.createElement('div');points.className='final-points';points.textContent=`${p.score} `;const small=document.createElement('small');small.textContent=`puan · ${p.correct}/50`;points.append(small);item.append(rank,name,points);return item;}
function renderFinished(s){show('finished');const winners=s.winners||[];$('winnerTitle').textContent=winners.length===1?`Oyuncu ${winners[0]} şampiyon! 🎉`:`Beraberlik! ${winners.join(' ve ')} 🏆`;const sorted=[...s.players].sort((a,b)=>b.score-a.score||a.seat.localeCompare(b.seat));$('finalScores').replaceChildren(...sorted.map((p,i)=>finalRow(p,i,sorted[0].score)));$('again').disabled=!s.seat||!s.players.every(p=>p.connected);}
function render(s){if(s.phase==='lobby')renderLobby(s);if(s.phase==='question'||s.phase==='reveal')renderGame(s);if(s.phase==='finished')renderFinished(s);}
function updateClock(){if(!latest||!(latest.phase==='question'||latest.phase==='reveal'))return;
 const s=latest;const ms=s.phase==='question'?Math.max(0,s.deadline-(Date.now()+clockOffset)):Math.max(0,s.revealUntil-(Date.now()+clockOffset));const sec=Math.ceil(ms/1000);
 $('timerText').textContent=sec;const frac=s.phase==='question'?Math.min(1,ms/60000):0;
 $('timerArc').style.strokeDashoffset=String(263.89*(1-frac));$('timer').classList.toggle('urgent',s.phase==='question'&&sec<=10);
}
$('create').addEventListener('click',()=>{shouldRejoin=true;send({type:'create',clientId:myClientId});});
$('joinForm').addEventListener('submit',e=>{e.preventDefault();join($('roomInput').value);});
$('copyInvite').addEventListener('click',async()=>{if(!currentRoom)return;const url=new URL(location.href);url.searchParams.set('room',currentRoom);try{await navigator.clipboard.writeText(url.toString());toast('Davet bağlantısı kopyalandı! Arkadaşlarına gönder.');}catch{toast('Bu bağlantıyı paylaş: '+url.toString());}});
$('start').addEventListener('click',()=>send({type:'start'}));$('again').addEventListener('click',()=>send({type:'start'}));
$('leave').addEventListener('click',()=>{shouldRejoin=false;send({type:'leave'});});
setInterval(updateClock,150);
setInterval(()=>{if(socket?.readyState===WebSocket.OPEN)send({type:'ping'});},15000);
connect();
})();
