const html_banner = document.querySelector('#banner');

// Guarantee a consistent banner on all pages
html_banner.innerHTML =`   <p id="banner-welcome">COCJPへようこそ</p>
   <span>
      <a class="banner-element" href="https://duhuhk.github.io/cocjp/">Home</a>
      <a class="banner-element" href="https://duhuhk.github.io/cocjp/vocab/">Vocabulary</a>
      <a class="banner-element" href="https://duhuhk.github.io/cocjp/grammar/">Grammar</a>
      <a class="banner-element" href="https://duhuhk.github.io/cocjp/chapters/">Lessons</a>
      <a class="banner-element" href="https://duhuhk.github.io/cocjp/banner_other/">Other</a>
      
      <span id="banner-search" class="banner-element"><label for="page-search">Search: </label><input id="page-search" type='text'></span>
   </span>`;

// Add minimize functionality to info nests (based on .ih elements)
// If there isn't already, add the minimizing data- attribute to every .ih element
// Also add the event listener for clicking to toggle minimized state
document.querySelectorAll('.info-group > .ih').forEach(l => {
   // The '.info-group > .ih' here will only grab .ih elements that are immediate children of .info-group elements
   let p = l.parentNode;
   if(l.getAttribute('data-is-minimized') === null){
      l.setAttribute('data-is-minimized', 'false');
   }
   let subsize0 = +getComputedStyle(l).getPropertyValue('border-bottom-width').split('px')[0];
   let subsize1 = +getComputedStyle(l).getPropertyValue('border-top-width').split('px')[0];
   let subsize2 = +getComputedStyle(l).getPropertyValue('padding-bottom').split('px')[0];
   let subsize3 = +getComputedStyle(l).getPropertyValue('padding-top').split('px')[0];
   let subsize4 = +getComputedStyle(l).getPropertyValue('margin-bottom').split('px')[0];
   let subsize5 = +getComputedStyle(l).getPropertyValue('margin-top').split('px')[0];
   let subsize = [subsize0,subsize1,subsize2,subsize3,subsize4,subsize5].reduce((a,b) => a + b) / 2;
   // v The -1 comes from covering the bottom border of the .ih element with the bottom border of the .info-group element
   l.setAttribute('data-minimizing-weight', subsize);
   l.setAttribute('data-minimized-size', l.offsetHeight - subsize - 1);
   if(p.getAttribute('data-is-minimized') === null){
      p.setAttribute('data-is-minimized', 'false');
   }
   if(p.getAttribute('data-is-minimized') == 'false'){
      p.setAttribute('data-full-size', p.scrollHeight);
   }
   
   l.addEventListener('click', e =>{
      let P = l.parentNode;
      let minState = l.getAttribute('data-is-minimized');
      let tog = minState == 'true' ? 'false' : 'true';
      l.setAttribute('data-is-minimized', tog);
      P.setAttribute('data-is-minimized', tog);
      if(Number(P.getAttribute('data-full-size')) < P.scrollHeight){
         P.setAttribute('data-full-size', P.scrollHeight);
      }
      if(tog == 'true'){
         // P.setAttribute('data-full-size', P.offsetHeight);
         P.style.height = l.getAttribute('data-minimized-size') + 'px';
         P.style.overflow = 'hidden';
      }
      else{
         P.style.height = (P.getAttribute('data-full-size') - subsize) + 'px';
         P.style.overflow = 'auto';
      }
      console.log(P.style.height.split('px')[0] - P.getAttribute('data-full-size'));
   });
   
   /*
   About the -6 (the 'data-minimizing-weight'):
   .info-group
      padding 3px
      outline 1px
      
      net 4px
      net (scroll) 3px
      
   .ih
      margin -3px
      margin-bottom 4px
      padding 5px
      border-bottom 1px solid black
      
      net 12
      net (offset) 11px
      net (client) 11px
   
   offsetHeight INC border, padding
   scrollHeight INC padding EXC border, margin
   clientHeight INC padding EXC border, margin
   
   -0.5 * (.ih -> net (offset))?
   */
});

/*
Old script: would check each element clicked for minimizability
Unused, but may be useful for allowing any element to minimize a parent - e.g. by applying a data-can-minimize attribute
Alt., use above querySlectorAll

window.addEventListener('click', e => {
   let t = e.target;
   // console.log(t.classList);
   if(e.target.classList.includes('ih')){
      
   }
});
*/





// Homepage - Rainbow Kintama
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