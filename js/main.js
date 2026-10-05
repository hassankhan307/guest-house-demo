const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>'PKR '+Math.round(n).toLocaleString('en-US');
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let bookings=load('guesthouseBookings',[]),search=load('guesthouseSearch',null),B=null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const grad=r=>`linear-gradient(135deg,${r.c.split(',')[0]},${r.c.split(',')[1]})`;
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent='✓ '+m;$('#toasts').append(t);setTimeout(()=>t.remove(),3200)}
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const nights=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const nice=d=>new Date(d+'T00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
function validate(s){
 if(!s.ci||!s.co)return'Please choose check-in and check-out dates.';
 if(s.ci<today())return'Check-in cannot be in the past.';
 if(s.co<=s.ci)return'Check-out must be after check-in (minimum 1 night).';
 if(!(s.ad>=1&&s.ad<=8))return'Adults must be between 1 and 8.';
 if(!(s.ch>=0)||!(s.rm>=1))return'Please enter valid guest and room numbers.';return''}
function free(r,s){if(!s)return r.units;const used=bookings.filter(b=>b.roomId==r.id&&b.status!=='Cancelled'&&s.ci<b.co&&s.co>b.ci).reduce((n,b)=>n+b.rooms,0);return r.units-used}
function renderRooms(){
 const t=$('#fType').value,p=+$('#fPrice').value,g=+$('#fGuests').value,so=$('#fSort').value;
 let l=ROOMS.filter(r=>(!t||r.type===t)&&(!p||r.price<=p)&&r.cap>=g);
 if(so==='lo')l.sort((a,b)=>a.price-b.price);if(so==='hi')l.sort((a,b)=>b.price-a.price);if(so==='rate')l.sort((a,b)=>b.rating-a.rating);
 $('#roomGrid').innerHTML=l.length?l.map(r=>{const ok=free(r,search)>=(search?search.rm:1)&&(!search||(search.ad+search.ch)<=r.cap*search.rm);
 return `<article class="card room fade"><div class="img" role="img" aria-label="${r.name} illustration"><i style="background:${grad(r)}"></i>${ph('room-'+r.id+'.jpg',r.name)}</div><div class="in"><h3>${r.name}</h3><div class="meta">${r.bed} · ${r.cap} guests · ${r.size} m² · ★ ${r.rating}</div>
 <div class="tags">${r.am.map(a=>`<span>${a}</span>`).join('')}</div><div class="price">${fmt(r.price)} <small>/ night</small></div>
 ${search?`<div class="badge ${ok?'':'no'}">${ok?'Available for your dates':'Not available for your dates'}</div>`:''}
 <div class="row" style="margin-top:12px"><button class="btn out sm" data-d="${r.id}">View Details</button><button class="btn sm" data-b="${r.id}" ${ok?'':'disabled style="opacity:.5"'}>Book Now</button></div></div></article>`}).join(''):'<p>No rooms match these filters.</p>';
 reveal()}
function reveal(){const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.1});$$('.fade:not(.in)').forEach(el=>io.observe(el))}
function openModal(h){$('#mbody').innerHTML=h;$('#modal').hidden=false;document.body.style.overflow='hidden'}
function closeModal(){$('#modal').hidden=true;document.body.style.overflow=''}
function details(id){const r=ROOMS.find(x=>x.id==id);
 openModal(`<div class="img" style="border-radius:10px" role="img" aria-label="${r.name}"><i style="background:${grad(r)}"></i>${ph('room-'+r.id+'.jpg',r.name)}</div><h3 style="margin-top:14px;font-size:26px">${r.name}</h3><p class="meta">★ ${r.rating} · ${r.size} m² · ${r.bed} · Max ${r.cap} guests</p><p style="margin:10px 0">${r.d}</p>
 <div class="tags">${r.am.map(a=>`<span>${a}</span>`).join('')}</div><p class="meta">Policies: check-in 2 PM, check-out 12 PM. Free cancellation up to 48 hours before arrival.</p><div class="price">${fmt(r.price)} <small>/ night</small></div><button class="btn" data-b="${r.id}">Book This Room</button>`)}
function calc(b){const n=nights(b.ci,b.co),sub=n*b.room.price*b.rm;let disc=0,o=OFFERS.find(x=>x.id===b.offer);
 if(o&&o.pct)disc=sub*o.pct/100;else if(o&&o.free)disc=n>=6?b.room.price*b.rm:0;else if(n>=3)disc=sub*.05;
 const tax=sub*.1;return{n,sub,tax,disc,total:sub+tax-disc}}
function startBook(id,offer){const r=ROOMS.find(x=>x.id==id);offer=offer||localStorage.getItem("guesthouseOffer");localStorage.removeItem("guesthouseOffer");B={room:r,ci:'',co:'',ad:2,ch:0,rm:1,...(search||{}),offer:offer||null};step(1)}
function step(n,err){B._s=n;let h=`<div class="steps">${[1,2,3,4].map(i=>`<b class="${i<=n?'on':''}"></b>`).join('')}</div>`;
 if(n===1){const c=!validate(B)?calc(B):null;
  h+=`<h3>Your stay: ${B.room.name}</h3><div class="two" style="margin:12px 0"><label>Check-in<input type="date" id="bci" min="${today()}" value="${B.ci}"></label><label>Check-out<input type="date" id="bco" min="${today()}" value="${B.co}"></label><label>Adults<input type="number" id="bad" min="1" max="8" value="${B.ad}"></label><label>Children<input type="number" id="bch" min="0" max="6" value="${B.ch}"></label><label>Rooms<input type="number" id="brm" min="1" max="4" value="${B.rm}"></label>
  <label>Offer<select id="boff"><option value="">None</option>${OFFERS.map(o=>`<option value="${o.id}" ${B.offer===o.id?'selected':''}>${o.title}</option>`).join('')}</select></label></div><p class="err" role="alert">${err||''}</p>
  ${c?`<table class="sum"><tr><td>${B.room.name} × ${c.n} night${c.n>1?'s':''} × ${B.rm} room</td><td>${fmt(c.sub)}</td></tr><tr><td>Tax (10%)</td><td>${fmt(c.tax)}</td></tr><tr><td>Discount</td><td>− ${fmt(c.disc)}</td></tr><tr class="t"><td>Total</td><td>${fmt(c.total)}</td></tr></table>`:''}
  <button class="btn" id="n1">Continue</button>`}
 if(n===2)h+=`<h3>Guest details</h3><div class="two" style="margin-top:12px"><label>Full name<input id="gn" value="${esc(B.name||'')}"></label><label>Email<input id="ge" type="email" value="${esc(B.email||'')}"></label><label>Phone<input id="gp" value="${esc(B.phone||'')}"></label><label>Country<input id="gc" value="${esc(B.country||'Pakistan')}"></label></div><label style="margin:12px 0">Special requests<textarea id="gs" rows="2">${esc(B.req||'')}</textarea></label><p class="err" role="alert">${err||''}</p><button class="btn out" id="back">Back</button> <button class="btn" id="n2">Continue</button>`;
 if(n===3)h+=`<h3>Payment <small class="meta">(demo, no real payment)</small></h3><div style="display:grid;gap:8px;margin:12px 0">${['Credit / Debit Card','Cash on Arrival','Bank Transfer'].map((p,i)=>`<label class="pay"><input type="radio" name="pm" value="${p}" ${i?'':'checked'}>${p}</label>`).join('')}</div><div class="two"><label>Card number<input placeholder="4242 4242 4242 4242" maxlength="19"></label><label>Name on card<input></label><label>Expiry<input placeholder="MM/YY"></label><label>CVV<input placeholder="123" maxlength="3"></label></div><p class="meta" style="margin:10px 0">Simulated checkout. No card data is stored or sent.</p><button class="btn out" id="back">Back</button> <button class="btn" id="n3">Confirm Booking</button>`;
 if(n===4)h=`<div class="ok">✓</div><h3 style="text-align:center">Booking Confirmed</h3><p style="text-align:center">Thank you, ${esc(B.name.split(' ')[0])}!</p><table class="sum"><tr><td>Reference</td><td><b>${B.ref}</b></td></tr><tr><td>Room</td><td>${B.room.name}</td></tr><tr><td>Check-in</td><td>${nice(B.ci)}</td></tr><tr><td>Check-out</td><td>${nice(B.co)}</td></tr><tr><td>Guests</td><td>${B.ad} Adult${B.ad>1?'s':''}${B.ch?`, ${B.ch} Child`:''}</td></tr><tr class="t"><td>Total</td><td>${fmt(B.total)}</td></tr></table><div class="row noprint"><button class="btn" onclick="window.print()">Print Confirmation</button><button class="btn out" id="done">Back Home</button></div>`;
 openModal(h)}
function showFound(b){$('#found').innerHTML=b?`<div class="card" style="padding:22px;margin-top:20px"><h3>${b.ref} <span class="badge ${b.status==='Cancelled'?'no':''}">${b.status}</span></h3><table class="sum"><tr><td>Guest</td><td>${esc(b.name)}</td></tr><tr><td>Room</td><td>${b.roomName}</td></tr><tr><td>Dates</td><td>${nice(b.ci)} to ${nice(b.co)}</td></tr><tr><td>Guests</td><td>${b.ad} adults, ${b.ch} children</td></tr><tr><td>Payment</td><td>${b.pm}</td></tr><tr><td>Requests</td><td>${esc(b.req||'None')}</td></tr><tr class="t"><td>Total</td><td>${fmt(b.total)}</td></tr></table>
 <div class="row"><button class="btn out sm" data-mod="${b.ref}" ${b.status==='Cancelled'?'disabled':''}>Modify Booking</button><button class="btn red sm" data-can="${b.ref}" ${b.status==='Cancelled'?'disabled':''}>Cancel Booking</button><button class="btn sm" onclick="window.print()">Print</button></div></div>`:'<p class="err" style="margin-top:14px">No booking found for that reference and email.</p>'}
document.addEventListener('click',e=>{const t=e.target;
 if(t.dataset.d)details(t.dataset.d);if(t.dataset.b)startBook(t.dataset.b);
 if(t.dataset.o){startBook(ROOMS[0].id,t.dataset.o);toast('Offer applied')}
 if(t.id==='back')step(B._s-1);
 if(t.id==='n1'){B.ci=$('#bci').value;B.co=$('#bco').value;B.ad=+$('#bad').value;B.ch=+$('#bch').value;B.rm=+$('#brm').value;B.offer=$('#boff').value||null;
  const er=validate({ci:B.ci,co:B.co,ad:B.ad,ch:B.ch,rm:B.rm})||((B.ad+B.ch)>B.room.cap*B.rm?`This room fits ${B.room.cap} guests per room.`:free(B.room,B)<B.rm?'Not enough rooms available for those dates.':'');er?step(1,er):step(2)}
 if(t.id==='n2'){B.name=$('#gn').value.trim();B.email=$('#ge').value.trim();B.phone=$('#gp').value.trim();B.country=$('#gc').value;B.req=$('#gs').value;
  const er=!B.name?'Please enter your full name.':!/^\S+@\S+\.\S+$/.test(B.email)?'Please enter a valid email.':B.phone.length<7?'Please enter a valid phone number.':'';er?step(2,er):step(3)}
 if(t.id==='n3'){B.pm=$('input[name=pm]:checked').value;const c=calc(B);B.total=c.total;B.ref='HVN-2026-'+Math.floor(10000+Math.random()*90000);
  bookings.push({ref:B.ref,roomId:B.room.id,roomName:B.room.name,ci:B.ci,co:B.co,ad:B.ad,ch:B.ch,rooms:B.rm,name:B.name,email:B.email,phone:B.phone,req:B.req,pm:B.pm,total:c.total,status:'Confirmed'});
  save('guesthouseBookings',bookings);step(4);toast('Booking confirmed');renderRooms()}
 if(t.id==='done'){closeModal();location.hash='#top'}
 if(t.dataset.can&&confirm('Cancel this booking? This cannot be undone.')){const b=bookings.find(x=>x.ref===t.dataset.can);b.status='Cancelled';save('guesthouseBookings',bookings);showFound(b);toast('Booking cancelled');renderRooms()}
 if(t.dataset.mod){const b=bookings.find(x=>x.ref===t.dataset.mod),ci=prompt('New check-in (YYYY-MM-DD)',b.ci),co=ci&&prompt('New check-out (YYYY-MM-DD)',b.co);
  if(ci&&co){const er=validate({ci,co,ad:b.ad,ch:b.ch,rm:b.rooms});if(er)return alert(er);const r=ROOMS.find(x=>x.id==b.roomId);b.ci=ci;b.co=co;b.total=calc({room:r,ci,co,rm:b.rooms}).total;save('guesthouseBookings',bookings);showFound(b);toast('Booking updated')}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$('#mx').onclick=closeModal;$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
$('#burger').onclick=()=>{const o=$('#menu').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
$$('#menu a').forEach(a=>a.addEventListener('click',()=>{$('#menu').classList.remove('open');$('#burger').setAttribute('aria-expanded',false)}));
['fType','fPrice','fGuests','fSort'].forEach(i=>$('#'+i).onchange=renderRooms);
$('#ci').min=$('#co').min=today();
if(search){$('#ci').value=search.ci;$('#co').value=search.co;$('#ad').value=search.ad;$('#ch').value=search.ch;$('#rm').value=search.rm}
$('#search').onsubmit=e=>{e.preventDefault();const s={ci:$('#ci').value,co:$('#co').value,ad:+$('#ad').value,ch:+$('#ch').value,rm:+$('#rm').value},er=validate(s);
 $('#serr').textContent=er;if(er)return;search=s;save('guesthouseSearch',s);$('#availnote').textContent=`Availability for ${nice(s.ci)} to ${nice(s.co)} (${nights(s.ci,s.co)} nights).`;renderRooms();location.hash='#rooms'};
$('#offerGrid').innerHTML=OFFERS.map(o=>`<div class="card offer fade"><span class="tag">${o.tag}</span><h3>${o.title}</h3><p>${o.text}</p><button class="btn" data-o="${o.id}">Book This Offer</button></div>`).join('');
$('#findForm').onsubmit=e=>{e.preventDefault();const r=$('#fRef').value.trim().toLowerCase(),m=$('#fEmail').value.trim().toLowerCase();showFound(bookings.find(b=>b.ref.toLowerCase()===r&&b.email.toLowerCase()===m))};
$('#contactForm').onsubmit=e=>{e.preventDefault();const er=!$('#cName').value.trim()?'Please enter your name.':!/^\S+@\S+\.\S+$/.test($('#cEmail').value)?'Please enter a valid email.':$('#cMsg').value.trim().length<10?'Message should be at least 10 characters.':'';
 $('#cerr').textContent=er;if(!er){e.target.reset();toast('Message sent')}};
const wa=$('#wa');wa.href='https://wa.me/920000000000?text='+encodeURIComponent('Hello, I would like to know more about staying at The Haven Guesthouse.');wa.target='_blank';wa.rel='noopener';
if(USE_PHOTOS)$('.hero').classList.add('photo');
renderRooms();reveal();
