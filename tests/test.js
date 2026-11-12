'use strict';
// Çekirdek oyun akışını gerçek npm bağımlılıkları olmadan test eder.
const assert=require('assert/strict');
const {EventEmitter}=require('events');
const Module=require('module');
const oldLoader=Module._load;
class FakeWSS extends EventEmitter{constructor(){super();this.clients=new Set();}close(){}}
class FakeWS extends EventEmitter{
 constructor(){super();this.readyState=1;this.sent=[];this.isAlive=true;}
 send(data){this.sent.push(JSON.parse(data));}
 ping(){this.emit('pong');}
 terminate(){this.readyState=3;this.emit('close');}
 push(x){this.emit('message',Buffer.from(JSON.stringify(x)));}
 get state(){return this.sent.filter(x=>x.type==='state').at(-1);}
}
Module._load=function(request,parent,isMain){if(request==='ws')return {WebSocketServer:FakeWSS,WebSocket:{OPEN:1}};return oldLoader.call(this,request,parent,isMain);};
process.env.PORT='31997';process.env.REVEAL_MS='8';process.env.QUESTION_MS='80';
const {server,wss,rooms}=require('../server');
Module._load=oldLoader;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const ids=['abc123abc123','def123def123','ghi123ghi123','jkl123jkl123'];
function connect(){const ws=new FakeWS();wss.clients.add(ws);wss.emit('connection',ws);return ws;}
async function test(){
 const sockets=ids.map(()=>connect());sockets[0].push({type:'create',clientId:ids[0]});const code=sockets[0].state.code;
 assert.equal(code.length,6);assert.equal(rooms.size,1);
 for(let i=1;i<4;i++)sockets[i].push({type:'join',code,clientId:ids[i]});
 for(let i=0;i<4;i++)sockets[i].push({type:'seat',seat:'ABCD'[i]});
 assert.equal(sockets[0].state.players.filter(p=>p.taken).length,4);
 sockets[0].push({type:'start'});assert.equal(sockets[0].state.phase,'question');
 const room=rooms.get(code);
 // 4 oyuncunun cevap vermesini bekle, doğru yanıta istemciden erişilemiyor.
 assert.equal(sockets[0].state.question.answer,undefined);
 sockets[0].push({type:'answer',option:room.deck[0].answer});
 sockets[0].push({type:'answer',option:1}); // Tek oyuncu için ikinci cevap reddedilmeli.
 assert.equal(Object.keys(room.answers).length,1);
 assert.equal(sockets[0].state.phase,'question');
 for(let i=1;i<4;i++)sockets[i].push({type:'answer',option:room.deck[0].answer});
 assert.equal(sockets[0].state.phase,'reveal');
 assert.deepEqual(room.scores,[10,10,10,10]);
 await wait(12);
 assert.equal(sockets[0].state.phase,'question');
 // B bağlantısı kesilsin ve aynı kimlikle geri dönsün.
 sockets[1].terminate();const restored=connect();restored.push({type:'join',code,clientId:ids[1]});
 assert.equal(restored.state.seat,'B');sockets[1]=restored;
 // Kalan 49 sorunun tamamını doğru cevapla.
 for(let n=1;n<50;n++){
  assert.equal(room.roundNo,n);
  const correct=room.deck[n].answer;
  for(const socket of sockets)socket.push({type:'answer',option:correct});
  assert.equal(room.phase,'reveal');
  if(n<49){await wait(12);assert.equal(room.phase,'question');}
 }
 await wait(15);
 assert.equal(sockets[0].state.phase,'finished');
 assert.deepEqual(room.scores,[500,500,500,500]);
 assert.deepEqual(sockets[0].state.winners,['A','B','C','D']);
 // Yeni tur otomatik güncellenmeli.
 sockets[2].push({type:'start'});assert.equal(sockets[0].state.phase,'question');assert.equal(room.roundNo,0);
 // 60 saniyelik sınırın test yapılandırmasında 80ms'ye indirilmiş karşılığı.
 const answer=room.deck[0].answer;
 for(let i=0;i<3;i++)sockets[i].push({type:'answer',option:answer});
 await wait(100);assert.equal(room.phase,'reveal');
 assert.deepEqual(room.scores,[10,10,10,0]);
 console.log('BAŞARILI: 50 soru, erken ilerleme, 4. cevap yokken süre dolması, yinelenen cevap engeli, yeniden bağlantı, puanlar, beraberlik, yeniden başlatma.');
 process.emit('SIGTERM');setTimeout(()=>process.exit(0),20);
}
test().catch(e=>{console.error(e);process.exit(1)});
