const ROOMS=[
{id:1,name:"Deluxe King Room",type:"Deluxe",price:12000,cap:2,size:32,bed:"1 King Bed",rating:4.8,units:3,am:["Wi-Fi","AC","Breakfast"],c:"#6b7f5e,#2f4a3a",d:"A calm, light-filled room with a plush king bed and garden-facing windows."},
{id:2,name:"Executive Suite",type:"Suite",price:18000,cap:4,size:48,bed:"1 King Bed",rating:4.9,units:2,am:["Wi-Fi","AC","Breakfast","Balcony"],c:"#b08d57,#5a4426",d:"A separate lounge, private balcony and a deep soaking tub for longer stays."},
{id:3,name:"Family Room",type:"Family",price:15000,cap:4,size:42,bed:"2 Queen Beds",rating:4.7,units:3,am:["Wi-Fi","AC","Breakfast"],c:"#8a9a8c,#3b5546",d:"Two queen beds and generous space, ideal for families travelling together."},
{id:4,name:"Garden Twin Room",type:"Standard",price:8500,cap:2,size:26,bed:"2 Single Beds",rating:4.5,units:4,am:["Wi-Fi","AC","Breakfast"],c:"#9aa88a,#44593f",d:"A bright, quiet twin room opening onto the garden courtyard."},
{id:5,name:"Superior Queen Room",type:"Deluxe",price:10500,cap:2,size:30,bed:"1 Queen Bed",rating:4.6,units:3,am:["Wi-Fi","AC","Breakfast"],c:"#c2a878,#6b5535",d:"Warm tones, a writing desk and a comfortable queen bed for business or leisure."}];
const OFFERS=[
{id:"weekend",title:"Weekend Escape",tag:"20% OFF",text:"Save 20% on your room for any stay.",pct:20},
{id:"long",title:"Long Stay",tag:"6th night free",text:"Stay 5 nights and get the 6th night free.",free:true},
{id:"couple",title:"Couple's Package",tag:"10% OFF",text:"Room + breakfast + dinner for two, 10% off.",pct:10}];
let OFFERS_ALL=OFFERS.slice();
try{const r=JSON.parse(localStorage.getItem('guesthouseRooms'));if(r&&r.length)ROOMS.splice(0,ROOMS.length,...r);
const o=JSON.parse(localStorage.getItem('guesthouseOffers'));if(o){OFFERS_ALL=o;OFFERS.splice(0,OFFERS.length,...o.filter(x=>x.enabled!==false))}}catch(e){}
/* Set USE_PHOTOS=true after adding photos to assets/images (see README.md there). Missing files fall back to the gradient. */
const USE_PHOTOS=false;
const ph=(f,a)=>USE_PHOTOS?`<img src="assets/images/${f}" alt="${a}" loading="lazy" onerror="this.remove()">`:'';
