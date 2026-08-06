// ===============================
// PRIMEVEST PROFILE
// ===============================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ===============================
// INITIALIZE USER DATA
// ===============================

currentUser.balance = currentUser.balance || 0;
currentUser.totalInvestment = currentUser.totalInvestment || 0;
currentUser.totalEarnings = currentUser.totalEarnings || 0;
currentUser.totalWithdrawn = currentUser.totalWithdrawn || 0;
currentUser.rechargeHistory = currentUser.rechargeHistory || [];
currentUser.earningsHistory = currentUser.earningsHistory || [];
currentUser.activePlan = currentUser.activePlan || null;

// ===============================
// DISPLAY USER DETAILS
// ===============================

document.getElementById("username").innerHTML =
    currentUser.username;

document.getElementById("phone").innerHTML =
    currentUser.phone;

document.getElementById("balance").innerHTML =
    "KSh " + currentUser.balance.toLocaleString();

document.getElementById("investment").innerHTML =
    "KSh " + currentUser.totalInvestment.toLocaleString();

document.getElementById("earnings").innerHTML =
    "KSh " + currentUser.totalEarnings.toLocaleString();

document.getElementById("withdrawn").innerHTML =
    "KSh " + currentUser.totalWithdrawn.toLocaleString();

// ===============================
// ACTIVE PLAN
// ===============================

const activePlan = document.getElementById("activePlan");

if (activePlan) {

    if (currentUser.activePlan) {

        activePlan.innerHTML = `
            <strong>${currentUser.activePlan.name}</strong><br>
            Investment: KSh ${currentUser.activePlan.invest.toLocaleString()}<br>
            Daily Income: KSh ${currentUser.activePlan.daily.toLocaleString()}<br>
            Duration: ${currentUser.activePlan.duration} Days
        `;

    } else {

        activePlan.innerHTML = "No Active Investment";

    }

}

// ===============================
// REFERRAL
// ===============================

document.getElementById("referralCode").value =
    currentUser.referralCode;

const WEBSITE_URL =
    "https://investment-five-pi.vercel.app";

document.getElementById("referralLink").value =
    WEBSITE_URL +
    "/register.html?ref=" +
    currentUser.referralCode;

// ===============================
// COPY INVITATION CODE
// ===============================

document.getElementById("copyCode").onclick = function () {

    navigator.clipboard.writeText(
        document.getElementById("referralCode").value
    );

    alert("Invitation code copied.");

};

// ===============================
// COPY REFERRAL LINK
// ===============================

document.getElementById("copyLink").onclick = function () {

    navigator.clipboard.writeText(
        document.getElementById("referralLink").value
    );

    alert("Referral link copied.");

};

// ===============================
// LOGOUT
// ===============================

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

    }

}

// ===============================
// REFRESH USER
// ===============================

function refreshUser() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUser = users.find(
        user => user.phone === currentUser.phone
    );

    if (!updatedUser) return;

    currentUser = updatedUser;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
    );

}

refreshUser();
