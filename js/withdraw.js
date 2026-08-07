// ===============================
// PRIMEVEST WITHDRAW
// ===============================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ===============================
// ELEMENTS
// ===============================

const balance = document.getElementById("balance");
const method = document.getElementById("method");
const account = document.getElementById("account");
const amount = document.getElementById("amount");
const withdrawBtn = document.getElementById("withdrawBtn");
const status = document.getElementById("status");
const historyList = document.getElementById("historyList");

// ===============================
// SHOW BALANCE
// ===============================

function updateBalance() {

    const userBalance = Number(currentUser.balance || 0);

    balance.innerHTML =
        "KSh " + userBalance.toLocaleString();

}

updateBalance();

// ===============================
// LOAD WITHDRAWAL HISTORY
// ===============================

function loadHistory() {

    historyList.innerHTML = "";

    const history = currentUser.withdrawHistory || [];

    if (history.length === 0) {

        historyList.innerHTML =
            "<p>No withdrawals yet.</p>";

        return;
    }

    history.forEach(item => {

        const statusClass =
            String(item.status || "Processing")
                .toLowerCase();

        historyList.innerHTML += `

            <div class="history-item">

                <h3>
                    KSh ${Number(item.amount || 0).toLocaleString()}
                </h3>

                <p>
                    <strong>Method:</strong>
                    ${item.method || "M-Pesa"}
                </p>

                <p>
                    <strong>Account:</strong>
                    ${item.account || "-"}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${item.date || "-"}
                </p>

                <p class="withdraw-status ${statusClass}">
                    ${item.status || "Processing"}
                </p>

            </div>

        `;

    });

}

loadHistory();

// ===============================
// FORMAT PHONE NUMBER
// ===============================

function formatPhone(phoneNumber) {

    let phone = String(phoneNumber || "")
        .replace(/\D/g, "");

    if (phone.startsWith("07") || phone.startsWith("01")) {

        return "254" + phone.substring(1);

    }

    if (phone.startsWith("7") || phone.startsWith("1")) {

        return "254" + phone;

    }

    if (phone.startsWith("254")) {

        return phone;

    }

    return null;

}

// ===============================
// WITHDRAW
// ===============================

withdrawBtn.onclick = function () {

    const phone = formatPhone(account.value.trim());

    const withdrawAmount =
        Number(amount.value);

    const selectedMethod =
        method.value;

    // -------------------------------
    // VALIDATE PHONE
    // -------------------------------

    if (!phone || !/^254(7|1)\d{8}$/.test(phone)) {

        status.style.color = "red";

        status.innerHTML =
            "Enter a valid M-Pesa phone number.";

        return;
    }

    // -------------------------------
    // VALIDATE AMOUNT
    // -------------------------------

    if (
        !Number.isFinite(withdrawAmount) ||
        withdrawAmount < 150
    ) {

        status.style.color = "red";

        status.innerHTML =
            "Minimum withdrawal is KSh 150.";

        return;
    }

    // -------------------------------
    // CHECK BALANCE
    // -------------------------------

    const availableBalance =
        Number(currentUser.balance || 0);

    if (withdrawAmount > availableBalance) {

        status.style.color = "red";

        status.innerHTML =
            "Insufficient account balance.";

        return;
    }

    // -------------------------------
    // DISABLE BUTTON
    // -------------------------------

    withdrawBtn.disabled = true;

    withdrawBtn.innerHTML =
        "Processing...";

    // ===============================
    // GET USERS
    // ===============================

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        user => user.phone === currentUser.phone
    );

    if (index === -1) {

        withdrawBtn.disabled = false;

        withdrawBtn.innerHTML =
            "Withdraw";

        status.style.color = "red";

        status.innerHTML =
            "User account could not be found.";

        return;
    }

    // ===============================
    // MAKE SURE FIELDS EXIST
    // ===============================

    users[index].balance =
        Number(users[index].balance || 0);

    users[index].totalWithdrawn =
        Number(users[index].totalWithdrawn || 0);

    if (!Array.isArray(users[index].withdrawHistory)) {

        users[index].withdrawHistory = [];

    }

    // ===============================
    // DEDUCT BALANCE
    // ===============================

    users[index].balance -= withdrawAmount;

    // ===============================
    // UPDATE TOTAL WITHDRAWN
    // ===============================

    users[index].totalWithdrawn +=
        withdrawAmount;

    // ===============================
    // CREATE WITHDRAWAL
    // ===============================

    const withdrawal = {

        id:
            "WD-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 1000),

        amount:
            withdrawAmount,

        method:
            selectedMethod || "M-Pesa",

        account:
            phone,

        status:
            "Processing",

        date:
            new Date().toLocaleString(),

        createdAt:
            Date.now(),

        completedAt:
            null

    };

    users[index].withdrawHistory.unshift(
        withdrawal
    );

    // ===============================
    // SAVE PROCESSING WITHDRAWAL
    // ===============================

    localStorage.setItem(
        "users",
        JSON.stringify(users[index] ? users : users)
    );

    localStorage.setItem(
        "currentUser",
        JSON.stringify(users[index])
    );

    currentUser =
        users[index];

    updateBalance();

    loadHistory();

    // ===============================
    // SHOW PROCESSING
    // ===============================

    status.style.color = "#f59e0b";

    status.innerHTML =
        "Withdrawal is being processed...";

    account.value = "";
    amount.value = "";

    // ===============================
    // COMPLETE AFTER 5 SECONDS
    // ===============================

    setTimeout(function () {

        // Get latest users again
        let latestUsers =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];

        const latestIndex =
            latestUsers.findIndex(
                user =>
                    user.phone === currentUser.phone
            );

        if (latestIndex === -1) {

            withdrawBtn.disabled = false;

            withdrawBtn.innerHTML =
                "Withdraw";

            return;
        }

        const latestUser =
            latestUsers[latestIndex];

        if (
            !Array.isArray(
                latestUser.withdrawHistory
            )
        ) {

            return;
        }

        // Find this exact withdrawal
        const withdrawalIndex =
            latestUser.withdrawHistory.findIndex(
                item =>
                    item.id === withdrawal.id
            );

        if (withdrawalIndex === -1) {

            return;
        }

        // ===============================
        // CHANGE TO COMPLETED
        // ===============================

        latestUser.withdrawHistory[
            withdrawalIndex
        ].status = "Completed";

        latestUser.withdrawHistory[
            withdrawalIndex
        ].completedAt = Date.now();

        // ===============================
        // SAVE
        // ===============================

        localStorage.setItem(
            "users",
            JSON.stringify(latestUsers)
        );

        localStorage.setItem(
            "currentUser",
            JSON.stringify(latestUser)
        );

        currentUser =
            latestUser;

        // ===============================
        // UPDATE UI
        // ===============================

        updateBalance();

        loadHistory();

        status.style.color = "green";

        status.innerHTML =
            "✅ Withdrawal completed successfully.";

        withdrawBtn.disabled = false;

        withdrawBtn.innerHTML =
            "Withdraw";

    }, 5000);

};
