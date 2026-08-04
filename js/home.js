// ======================================
// PrimeVest - Home Page
// js/home.js
// ======================================

// Your Render Backend
const API_BASE = "https://smartpaypesa-backend.onrender.com";

// Investment Products
const products = [
    { amount: 500, daily: 35, duration: 30 },
    { amount: 1000, daily: 75, duration: 30 },
    { amount: 2000, daily: 160, duration: 30 },
    { amount: 5000, daily: 420, duration: 30 },
    { amount: 10000, daily: 900, duration: 30 }
];

// ===============================
// Load User
// ===============================
let user = JSON.parse(localStorage.getItem("user")) || {

    username: "Guest",
    phone: "",
    balance: 0,
    investment: 0,
    dailyIncome: 0,
    firstPurchase: false

};

// ===============================
// Display User
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const welcome = document.getElementById("welcomeUser");
    const balance = document.getElementById("balance");

    if (welcome) {
        welcome.innerText = `Welcome ${user.username}`;
    }

    if (balance) {
        balance.innerText =
            "KSh " + Number(user.balance).toLocaleString();
    }

    startLiveActivity();

});

// ===============================
// Purchase Product
// ===============================
function purchaseProduct(amount) {

    // Save amount
    localStorage.setItem("purchaseAmount", amount);

    // Redirect to payment page
    window.location.href =
        `payment.html?amount=${amount}`;

}

// ===============================
// Logout
// ===============================
function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "index.html";

}

// ===============================
// Fake Live Activity
// ===============================
const names = [

    "Brian",
    "James",
    "Mercy",
    "Peter",
    "John",
    "Kevin",
    "Faith",
    "Alice",
    "Mary",
    "Dennis",
    "Joy",
    "Brenda",
    "Linet",
    "Collins"

];

const amounts = [

    500,
    1000,
    2000,
    5000,
    10000

];

function randomPhone() {

    const phone =
        Math.floor(Math.random() * 90000000) + 10000000;

    return "07" + phone.toString().substring(0, 2) +
        "****" +
        phone.toString().substring(6);

}

function startLiveActivity() {

    const popup = document.getElementById("liveActivity");
    const text = document.getElementById("activityText");

    if (!popup || !text) return;

    setInterval(() => {

        const name =
            names[Math.floor(Math.random() * names.length)];

        const amount =
            amounts[Math.floor(Math.random() * amounts.length)];

        text.innerHTML = `
            <strong>${name}</strong>
            (${randomPhone()})<br>
            Just invested
            <strong>KSh ${amount.toLocaleString()}</strong>
        `;

        popup.classList.add("show");

        setTimeout(() => {

            popup.classList.remove("show");

        }, 5000);

    }, 9000);

}
