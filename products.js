// ===============================
// PRIMEVEST PRODUCTS
// ===============================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "index.html";

}

currentUser.balance = Number(currentUser.balance || 0);
currentUser.totalInvestment = Number(currentUser.totalInvestment || 0);

const products = [

{
name:"Starter Plan",
invest:500,
daily:50,
duration:30
},

{
name:"Silver Plan",
invest:1000,
daily:100,
duration:30
},

{
name:"Gold Plan",
invest:2000,
daily:220,
duration:30
},

{
name:"Diamond Plan",
invest:5000,
daily:600,
duration:30
},

{
name:"VIP Plan",
invest:10000,
daily:1300,
duration:30
}

];

const container = document.getElementById("productsContainer");

products.forEach(product=>{

const card=document.createElement("div");

card.className="card";

const active=currentUser.activePlan &&
currentUser.activePlan.name===product.name;

card.innerHTML=`

<h3>KSh ${product.invest.toLocaleString()}</h3>

<p>Daily Earnings</p>

<h2>KSh ${product.daily.toLocaleString()}</h2>

<span>Duration: ${product.duration} Days</span>

<button ${active?"disabled":""}>
${active?"ACTIVE":"Invest Now"}
</button>

`;

const btn=card.querySelector("button");

if(!active){

btn.onclick=function(){

if(currentUser.activePlan){

alert("You already have an active investment.");

return;

}

if(currentUser.balance<product.invest){

alert("Insufficient wallet balance.");

return;

}

if(!confirm(`Invest KSh ${product.invest.toLocaleString()}?`)){

return;

}

currentUser.balance-=product.invest;

currentUser.totalInvestment+=product.invest;

currentUser.activePlan={

name:product.name,

invest:product.invest,

daily:product.daily,

duration:product.duration,

purchaseDate:Date.now(),

expiryDate:Date.now()+(product.duration*86400000)

};

let users=JSON.parse(localStorage.getItem("users"))||[];

const index=users.findIndex(
u=>u.phone===currentUser.phone
);

if(index!==-1){

users[index]=currentUser;

}

localStorage.setItem(
"users",
JSON.stringify(users)
);

localStorage.setItem(
"currentUser",
JSON.stringify(currentUser)
);

alert("Investment activated successfully.");

location.reload();

};

}

container.appendChild(card);

});
