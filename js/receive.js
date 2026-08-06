// ===============================
// PRIMEVEST RECEIVE EARNINGS
// ===============================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

const earningAmount = document.getElementById("earningAmount");
const countdown = document.getElementById("countdown");
const claimBtn = document.getElementById("claimBtn");
const historyList = document.getElementById("historyList");

// ===============================
// INITIALIZE USER DATA
// ===============================

currentUser.balance = currentUser.balance || 0;
currentUser.totalEarnings = currentUser.totalEarnings || 0;
currentUser.lastClaimTime = currentUser.lastClaimTime || 0;
currentUser.earningsHistory = currentUser.earningsHistory || [];

// ===============================
// DAILY EARNING
// ===============================

let todayEarning = 0;

if (currentUser.activePlan) {

    todayEarning = Number(currentUser.activePlan.daily);

}

earningAmount.innerHTML =
    "KSh " + todayEarning.toLocaleString();

// ===============================
// CLAIM TIMER
// ===============================

function updateTimer() {

    if (!currentUser.activePlan) {

        countdown.innerHTML = "No Active Investment";

        claimBtn.disabled = true;

        return;

    }

    const now = Date.now();

    const nextClaim =
        currentUser.lastClaimTime + 86400000;

    if (now >= nextClaim) {

        countdown.innerHTML = "Ready to Claim";

        claimBtn.disabled = false;

    } else {

        const remaining = nextClaim - now;

        const hours = Math.floor(remaining / 3600000);

        const minutes = Math.floor(
            (remaining % 3600000) / 60000
        );

        countdown.innerHTML =
            `Next claim in ${hours}h ${minutes}m`;

        claimBtn.disabled = true;

    }

}

updateTimer();

setInterval(updateTimer, 60000);

// ===============================
// CLAIM EARNINGS
// ===============================

claimBtn.onclick = function () {

    if (!currentUser.activePlan) {

        alert("You don't have an active investment.");

        return;

    }

    const now = Date.now();

    if (now < currentUser.lastClaimTime + 86400000) {

        alert("You have already claimed today's earnings.");

        return;

    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        user => user.phone === currentUser.phone
    );

    if (index === -1) return;

    users[index].balance =
        Number(users[index].balance || 0) + todayEarning;

    users[index].totalEarnings =
        Number(users[index].totalEarnings || 0) + todayEarning;

    users[index].lastClaimTime = now;

    if (!users[index].earningsHistory) {

        users[index].earningsHistory = [];

    }

    users[index].earningsHistory.unshift({

        amount: todayEarning,

        date: new Date().toLocaleString()

    });

    currentUser = users[index];

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("Daily earnings received successfully.");

    location.reload();

};

// ===============================
// HISTORY
// ===============================

historyList.innerHTML = "";

if (currentUser.earningsHistory.length > 0) {

    currentUser.earningsHistory.forEach(item => {

        historyList.innerHTML += `

        <div class="history-item">

            <h3>+ KSh ${Number(item.amount).toLocaleString()}</h3>

            <p>${item.date}</p>

        </div>

        `;

    });

} else {

    historyList.innerHTML =
        "<p>No earnings claimed yet.</p>";

}
