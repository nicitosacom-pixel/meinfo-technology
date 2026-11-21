(function(){
  var d=document,root=d.documentElement,mqr=matchMedia('(prefers-reduced-motion:reduce)');
  function all(s){return Array.prototype.slice.call(d.querySelectorAll(s))}
  function $(id){return d.getElementById(id)}
  /* calm mode */
  var calm=$('calm');
  function setCalm(v,save){root.classList.toggle('calm',v);calm.setAttribute('aria-pressed',v);if(save){try{localStorage.setItem('calm',v?'1':'0')}catch(e){}}}
  var st=null;try{st=localStorage.getItem('calm')}catch(e){}
  setCalm(st===null?mqr.matches:st==='1',false);
  calm.addEventListener('click',function(){setCalm(!root.classList.contains('calm'),true)});
  /* reveal on scroll (staggered, delay cleared afterwards so hover stays snappy) */
  all('.rv').forEach(function(e){e.style.transitionDelay=(Array.prototype.indexOf.call(e.parentNode.children,e)%4)*90+'ms'});
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var t=x.target;t.classList.add('in','on');io.unobserve(t);setTimeout(function(){t.style.transitionDelay=''},1000)}})},{threshold:.15});
  all('.rv,.chat').forEach(function(el){io.observe(el)});
  /* card spotlight */
  all('.card').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')})});
  /* hero tilt */
  var h=d.querySelector('.hc');
  if(h&&matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches){
    h.addEventListener('pointermove',function(e){var r=h.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;h.style.transform='perspective(900px) rotateY('+x*8+'deg) rotateX('+(-y*8)+'deg)'});
    h.addEventListener('pointerleave',function(){h.style.transform=''});
  }
  /* progress bar + cursor glow */
  var pg=$('pgb'),cur=$('cur'),mx=-999,my=-999;
  addEventListener('scroll',function(){var m=root.scrollHeight-innerHeight;pg.style.transform='scaleX('+(m>0?scrollY/m:0)+')'},{passive:true});
  addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;cur.style.opacity=1;cur.style.transform='translate('+mx+'px,'+my+'px)'},{passive:true});
  /* typewriter (home only) */
  var rw=$('rw');
  if(rw){
    var Wd=['сайты','веб-приложения','автоматизацию заявок','уведомления в Telegram'],wi=0,ci=0,dl=false;
    (function ty(){
      if(root.classList.contains('calm')){rw.textContent=Wd[0];setTimeout(ty,1000);return}
      var w=Wd[wi],t;ci+=dl?-1:1;rw.textContent=w.slice(0,ci);t=dl?35:70;
      if(!dl&&ci===w.length){dl=true;t=1500}else if(dl&&ci===0){dl=false;wi=(wi+1)%Wd.length;t=300}
      setTimeout(ty,t)
    })();
  }
  /* contact form -> Telegram */
  var f=$('brief');
  if(f){
    var kind='Сайт',chips=all('.chip'),note=$('note');
    chips.forEach(function(c){c.addEventListener('click',function(){chips.forEach(function(x){x.setAttribute('aria-pressed','false')});c.setAttribute('aria-pressed','true');kind=c.textContent})});
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var n=$('nm').value.trim(),t=$('tx').value.trim();
      var msg='Здравствуйте! '+(n?'Меня зовут '+n+'. ':'')+'Нужно: '+kind.toLowerCase()+'.'+(t?' '+t:'');
      window.open('https://t.me/NKTIIA_1','_blank','noopener');
      var fail='Откройте Telegram и опишите задачу.';
      try{navigator.clipboard.writeText(msg).then(function(){note.textContent='Текст скопирован. Вставьте его в чат Telegram.'},function(){note.textContent=fail})}catch(_){note.textContent=fail}
    });
  }
  /* particles */
  var c=$('fx'),x=c.getContext('2d'),P=[],W=0,H=0;
  function rs(){W=c.width=innerWidth;H=c.height=innerHeight;var n=Math.min(70,Math.floor(W*H/20000));P=[];for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4})}
  rs();addEventListener('resize',rs);
  (function tick(){
    if(!root.classList.contains('calm')&&!d.hidden){
      x.clearRect(0,0,W,H);
      for(var i=0;i<P.length;i++){
        var a=P[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
        x.fillStyle='rgba(255,59,87,.85)';x.beginPath();x.arc(a.x,a.y,1.7,0,6.283);x.fill();
        for(var j=i+1;j<P.length;j++){var b=P[j],dx=a.x-b.x,dy=a.y-b.y,q=dx*dx+dy*dy;if(q<14000){x.strokeStyle='rgba(255,59,87,'+.28*(1-q/14000)+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
        var mdx=a.x-mx,mdy=a.y-my,mq=mdx*mdx+mdy*mdy;if(mq<24000){x.strokeStyle='rgba(255,142,156,'+.5*(1-mq/24000)+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(mx,my);x.stroke()}
      }
    }
    requestAnimationFrame(tick)
  })();
})();
