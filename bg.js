// Simple animated particle background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas && canvas.getContext && canvas.getContext('2d');
let particles = [];

function resize(){
  if(!canvas) return;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function rand(min,max){return Math.random()*(max-min)+min}

function initParticles(n=80){
  particles = [];
  for(let i=0;i<n;i++) particles.push({x:rand(0,innerWidth),y:rand(0,innerHeight),r:rand(0.8,2.2),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3)});
}

function draw(){
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if(p.x < -10) p.x = canvas.width + 10;
    if(p.x > canvas.width + 10) p.x = -10;
    if(p.y < -10) p.y = canvas.height + 10;
    if(p.y > canvas.height + 10) p.y = -10;
  })
}

function loop(){
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener('resize', ()=>{resize(); initParticles();});
if(canvas && ctx){
  resize();
  initParticles(Math.max(40, Math.floor((innerWidth*innerHeight)/80000)));
  loop();
}
