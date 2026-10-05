const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>'PKR '+Math.round(n).toLocaleString('en-US');
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const todayS=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
function toast(m){let c=$('#toasts');if(!c){c=document.createElement('div');c.id='toasts';c.setAttribute('aria-live','polite');document.body.append(c)}const t=document.createElement('div');t.className='toast';t.textContent='✓ '+m;c.append(t);setTimeout(()=>t.remove(),3200)}
if(!document.body.dataset.admin){
 const L=[['index.html','Home'],['rooms.html','Rooms'],['about.html','About'],['amenities.html','Amenities'],['gallery.html','Gallery'],['dining.html','Dining'],['attractions.html','Things To Do'],['offers.html','Offers'],['contact.html','Contact']];
 const cur=document.body.dataset.page+'.html';
 document.body.insertAdjacentHTML('afterbegin',`<header class="nav"><div class="wrap bar"><a class="logo" href="index.html">The <b>Haven</b></a><button class="burger" id="burger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button><nav id="menu" aria-label="Main">${L.map(l=>`<a href="${l[0]}" ${l[0]===cur?'aria-current="page" style="color:var(--gold)"':''}>${l[1]}</a>`).join('')}<a class="btn sm" href="index.html#rooms">Book Now</a></nav></div></header>`);
 document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><b>THE HAVEN GUESTHOUSE</b><p>Karachi, Pakistan · +92 300 1234567 · stay@havenguesthouse.com</p><p><a href="faq.html" style="color:#e4cc9c">FAQ</a> · <a href="reviews.html" style="color:#e4cc9c">Reviews</a> · <a href="index.html#mybooking" style="color:#e4cc9c">My Booking</a> · <a href="admin/login.html" style="color:#e4cc9c">Admin demo</a></p><p>© 2026 The Haven Guesthouse. All rights reserved.</p></div></footer><a class="wa" href="https://wa.me/920000000000?text=${encodeURIComponent('Hello, I would like to know more about staying at The Haven Guesthouse.')}" target="_blank" rel="noopener">WhatsApp</a>`);
 $('#burger').onclick=()=>{const o=$('#menu').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
}
