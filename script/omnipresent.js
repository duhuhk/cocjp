let kntm = document.querySelector('#金玉');
let kntmTimer;
if(kntm){
   kntm.setAttribute('data-rgb', JSON.stringify({r:0,g:0,b:0,t:0,s:0.015}));
   
   kntmTimer = window.requestAnimationFrame(kntmRinbu);
}
const kntmFade = {
   r: {pi: 0},
   g: {pi: (2/3) * Math.PI},
   b: {pi: (4/3) * Math.PI},
   lw: 100,
   up: 210,
   get mult(){
      return this.up - this.lw;
   },
   twopi: 2 * Math.PI,
};
function kntmRinbu(){
   let phase = JSON.parse(kntm.getAttribute('data-rgb'));
   
   let t = phase.t;
   let s = phase.s;
   
   phase.r = kntmFade.mult * Math.sin(t + kntmFade.r.pi) + kntmFade.lw;
   phase.g = kntmFade.mult * Math.sin(t + kntmFade.g.pi) + kntmFade.lw;
   phase.b = kntmFade.mult * Math.sin(t + kntmFade.b.pi) + kntmFade.lw;
   
   t += s;
   phase.t = t % kntmFade.twopi;
   
   kntm.setAttribute('data-rgb', JSON.stringify(phase));
   kntm.style.color = `rgb(${phase.r},${phase.g},${phase.b})`;
   
   kntmTimer = window.requestAnimationFrame(kntmRinbu);
}