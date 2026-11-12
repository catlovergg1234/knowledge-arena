'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {WebSocketServer, WebSocket} = require('ws');
const QUESTIONS = require('./questions');

const PORT = Number(process.env.PORT) || 3000;
const QUESTION_MS = Number(process.env.QUESTION_MS) || 60000; // Varsayılan: 60 saniye
const REVEAL_MS = Number(process.env.REVEAL_MS) || 4000;
const ROOT = path.join(__dirname, 'public');
const FILES = {'/':'index.html','/index.html':'index.html','/style.css':'style.css','/client.js':'client.js','/favicon.svg':'favicon.svg'};
const TYPES = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
const rooms = new Map();

const server = http.createServer((req,res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/health') {res.writeHead(200, {'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,rooms:rooms.size}));return;}
  const filename = FILES[pathname];
  if (!filename) {res.writeHead(404); res.end('Not found'); return;}
  fs.readFile(path.join(ROOT, filename),(err,data)=>{
    if(err){res.writeHead(500);res.end('File error');return;}
    res.writeHead(200,{'Content-Type':TYPES[path.extname(filename)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data);
  });
});
const wss = new WebSocketServer({server,path:'/ws',maxPayload:8192});
const shuffle = arr => {const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=crypto.randomInt(i+1);[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
const send = (ws, obj) => {if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj));};
function createCode(){let code;do{code=crypto.randomBytes(4).toString('hex').slice(0,6).toUpperCase();}while(rooms.has(code));return code;}
function makeRoom(){const code=createCode();const room={code,phase:'lobby',members:new Set(),seats:Array(4).fill(null),scores:[0,0,0,0],corrects:[0,0,0,0],roundNo:-1,deck:[],answers:{},deadline:0,revealUntil:0,questionTimer:null,revealTimer:null,lastActivity:Date.now()};rooms.set(code,room);return room;}
function memberSeat(room,ws){return room.seats.findIndex(p=>p&&p.clientId===ws.clientId&&p.socket===ws);}
function stateFor(room,ws){
  const index=memberSeat(room,ws);
  const item=room.deck[room.roundNo];
  const state={type:'state',serverNow:Date.now(),code:room.code,phase:room.phase,seat:index<0?null:'ABCD'[index],total:QUESTIONS.length,questionNumber:room.roundNo+1,deadline:room.deadline,revealUntil:room.revealUntil,
    players:room.seats.map((p,i)=>({seat:'ABCD'[i],taken:!!p,connected:!!(p&&p.socket&&p.socket.readyState===WebSocket.OPEN),score:room.scores[i],correct:room.corrects[i],answered:room.answers[i]!==undefined}))};
  if(item&&(room.phase==='question'||room.phase==='reveal')){
    state.question={category:item.category,text:item.text,options:item.options};
    if(room.phase==='reveal'){
      state.reveal={answer:item.answer,explanation:item.explanation,answers:room.seats.map((p,i)=>room.answers[i]===undefined?null:room.answers[i])};
    }
  }
  if(room.phase==='finished'){
    const best=Math.max(...room.scores);state.winners=room.seats.map((p,i)=>room.scores[i]===best?'ABCD'[i]:null).filter(Boolean);
  }
  return state;
}
function broadcast(room){room.lastActivity=Date.now();for(const ws of room.members)send(ws,stateFor(room,ws));}
function warn(ws,message){send(ws,{type:'error',message});}
function detach(ws){
  if(!ws.room)return;
  const room=ws.room;room.members.delete(ws);
  for(let i=0;i<4;i++){
    const p=room.seats[i];
    if(p&&p.socket===ws){p.socket=null;if(room.phase==='lobby'&&ws.explicitLeave)room.seats[i]=null;}
  }
  ws.room=null;broadcast(room);
}
function enter(ws,room,clientId){
  ws.explicitLeave=false;detach(ws);ws.room=room;ws.clientId=clientId;room.members.add(ws);
  // Aynı tarayıcının yeniden bağlanması; aynı koltuğu geri alır.
  const old=room.seats.find(p=>p&&p.clientId===clientId);
  if(old){old.socket=ws;}
  broadcast(room);
}
function makeDeck(){return shuffle(QUESTIONS).map(q=>{
  const order=shuffle([0,1,2,3]);
  return {id:q.id,category:q.category,text:q.text,options:order.map(i=>q.options[i]),answer:order.indexOf(q.answer),explanation:q.explanation};
});}
function startRound(room){
  room.answers={};room.roundNo++;
  if(room.roundNo>=room.deck.length){room.phase='finished';room.deadline=0;broadcast(room);return;}
  room.phase='question';room.deadline=Date.now()+QUESTION_MS;room.revealUntil=0;
  broadcast(room);
  clearTimeout(room.questionTimer);
  room.questionTimer=setTimeout(()=>revealRound(room), QUESTION_MS+12);
}
function revealRound(room){
  if(room.phase!=='question')return;
  clearTimeout(room.questionTimer);
  const item=room.deck[room.roundNo];
  for(let i=0;i<4;i++)if(room.answers[i]===item.answer){room.scores[i]+=10;room.corrects[i]++;}
  room.phase='reveal';room.revealUntil=Date.now()+REVEAL_MS;room.deadline=0;broadcast(room);
  room.revealTimer=setTimeout(()=>startRound(room),REVEAL_MS);
}
function handle(ws,msg){
  if(!msg||typeof msg!=='object')return;
  if(msg.type==='ping'){send(ws,{type:'pong'});return;}
  if(msg.type==='create'){
    if(!/^[-_a-zA-Z0-9]{12,100}$/.test(msg.clientId||''))return warn(ws,'Oyuncu kimliği geçersiz.');
    const room=makeRoom();enter(ws,room,msg.clientId);return;
  }
  if(msg.type==='join'){
    const code=String(msg.code||'').trim().toUpperCase();
    if(!/^[-_a-zA-Z0-9]{12,100}$/.test(msg.clientId||''))return warn(ws,'Oyuncu kimliği geçersiz.');
    const room=rooms.get(code);if(!room)return warn(ws,'Bu oda bulunamadı. Oda kodunu kontrol et.');
    enter(ws,room,msg.clientId);return;
  }
  const room=ws.room;if(!room)return warn(ws,'Önce bir odaya katıl.');
  if(msg.type==='leave') {ws.explicitLeave=true;detach(ws);send(ws,{type:'left'});return;}
  if(msg.type==='seat'){
    if(room.phase!=='lobby')return warn(ws,'Oyun başladıktan sonra oyuncu koltuğu değiştirilemez.');
    const i='ABCD'.indexOf(msg.seat);if(i<0)return;
    const target=room.seats[i];
    if(target&&target.clientId!==ws.clientId)return warn(ws,'Bu koltuk dolu. Başka birini seç.');
    for(let j=0;j<4;j++)if(room.seats[j]&&room.seats[j].clientId===ws.clientId)room.seats[j]=null;
    room.seats[i]={clientId:ws.clientId,socket:ws};broadcast(room);return;
  }
  if(msg.type==='start'){
    if(room.phase!=='lobby'&&room.phase!=='finished')return;
    if(memberSeat(room,ws)<0)return warn(ws,'Önce bir oyuncu koltuğu seç.');
    if(room.seats.some(p=>!p||!p.socket||p.socket.readyState!==WebSocket.OPEN))return warn(ws,'Başlamak için dört oyuncunun da bağlanması gerekiyor.');
    clearTimeout(room.questionTimer);clearTimeout(room.revealTimer);
    room.deck=makeDeck();room.roundNo=-1;room.scores=[0,0,0,0];room.corrects=[0,0,0,0];startRound(room);return;
  }
  if(msg.type==='answer'){
    if(room.phase!=='question')return;
    if(Date.now()>=room.deadline){revealRound(room);return;}
    const i=memberSeat(room,ws);
    if(i<0||room.answers[i]!==undefined||!Number.isInteger(msg.option)||msg.option<0||msg.option>3)return;
    room.answers[i]=msg.option;
    if(room.seats.every((p,j)=>p&&room.answers[j]!==undefined))revealRound(room);else broadcast(room);
  }
}
wss.on('connection', ws=>{
  ws.room=null;ws.isAlive=true;
  ws.on('pong',()=>ws.isAlive=true);
  ws.on('message',data=>{try{handle(ws,JSON.parse(data.toString()));}catch{warn(ws,'Mesaj okunamadı.');}});
  ws.on('close',()=>detach(ws));
  send(ws,{type:'welcome'});
});
const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue;}ws.isAlive=false;ws.ping();}},30000);
const cleanup=setInterval(()=>{for(const [code,room] of rooms){if(room.members.size===0&&Date.now()-room.lastActivity>2*60*60*1000){clearTimeout(room.questionTimer);clearTimeout(room.revealTimer);rooms.delete(code);}}},60000);
server.listen(PORT,'0.0.0.0',()=>console.log(`Bilgi Arenası: http://localhost:${PORT}`));
function stop(){clearInterval(heartbeat);clearInterval(cleanup);for(const room of rooms.values()){clearTimeout(room.questionTimer);clearTimeout(room.revealTimer);}wss.close();server.close();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
module.exports={server,rooms,wss};
