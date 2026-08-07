// ===============================
// PRIMEVEST TRANSACTION HISTORY
// ===============================

let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


// ===============================
// LOGIN CHECK
// ===============================

if (!currentUser) {

    window.location.href = "index.html";

}


// ===============================
// ELEMENTS
// ===============================

const investmentHistory =
    document.getElementById("investmentHistory");

const rechargeHistory =
    document.getElementById("rechargeHistory");

const earningsHistory =
    document.getElementById("earningsHistory");

const withdrawHistory =
    document.getElementById("withdrawHistory");


// ===============================
// INVESTMENT HISTORY
// ===============================

function loadInvestmentHistory() {

    investmentHistory.innerHTML = "";

    const investments =
        currentUser.investments ||
        currentUser.products ||
        [];

    if (investments.length === 0) {

        investmentHistory.innerHTML = `
            <p class="empty">
                No investments yet.
            </p>
        `;

        return;
    }


    investments.forEach(item => {

        investmentHistory.innerHTML += `

            <div class="history-item">

                <h4>
                    ${item.name || item.plan || "Investment Plan"}
                </h4>

                <p>
                    <strong>Investment:</strong>
                    KSh ${Number(
                        item.invest ||
                        item.amount ||
                        item.investment ||
                        0
                    ).toLocaleString()}
                </p>

                <p>
                    <strong>Daily Income:</strong>
                    KSh ${Number(
                        item.daily ||
                        item.dailyIncome ||
                        0
                    ).toLocaleString()}
                </p>

                <p>
                    <strong>Duration:</strong>
                    ${item.duration || 30} Days
                </p>

                <p class="success">
                    <strong>Status:</strong>
                    ${item.status || "Active"}
                </p>

                ${
                    item.date
                    ? `<p><strong>Date:</strong> ${item.date}</p>`
                    : ""
                }

            </div>

        `;

    });

}


// ===============================
// RECHARGE HISTORY
// ===============================

function loadRechargeHistory() {

    rechargeHistory.innerHTML = "";

    const history =
        currentUser.rechargeHistory || [];

    if (history.length === 0) {

        rechargeHistory.innerHTML = `
            <p class="empty">
                No recharge transactions yet.
            </p>
        `;

        return;
    }


    history.forEach(item => {

        rechargeHistory.innerHTML += `

            <div class="history-item">

                <h4>
                    + KSh ${Number(
                        item.amount || 0
                    ).toLocaleString()}
                </h4>

                <p>
                    <strong>Receipt:</strong>
                    ${item.receipt || "Confirmed"}
                </p>

                <p class="success">
                    <strong>Status:</strong>
                    Successful
                </p>

                <p>
                    <strong>Date:</strong>
                    ${item.date || ""}
                </p>

            </div>

        `;

    });

}


// ===============================
// EARNINGS HISTORY
// ===============================

function loadEarningsHistory() {

    earningsHistory.innerHTML = "";

    const history =
        currentUser.earningsHistory || [];

    if (history.length === 0) {

        earningsHistory.innerHTML = `
            <p class="empty">
                No earnings claimed yet.
            </p>
        `;

        return;
    }


    history.forEach(item => {

        earningsHistory.innerHTML += `

            <div class="history-item">

                <h4>
                    + KSh ${Number(
                        item.amount || 0
                    ).toLocaleString()}
                </h4>

                <p class="success">
                    <strong>Status:</strong>
                    Claimed
                </p>

                <p>
                    <strong>Date:</strong>
                    ${item.date || ""}
                </p>

            </div>

        `;

    });

}


// ===============================
// WITHDRAW HISTORY
// ===============================

function loadWithdrawHistory() {

    withdrawHistory.innerHTML = "";

    const history =
        currentUser.withdrawHistory || [];

    if (history.length === 0) {

        withdrawHistory.innerHTML = `
            <p class="empty">
                No withdrawals yet.
            </p>
        `;

        return;
    }


    history.forEach(item => {

        const status =
            item.status || "Processing";

        let statusClass = "processing";

        if (status.toLowerCase() === "successful") {
            statusClass = "success";
        }

        if (status.toLowerCase() === "failed") {
            statusClass = "failed";
        }


        withdrawHistory.innerHTML += `

            <div class="history-item">

                <h4>
                    - KSh ${Number(
                        item.amount || 0
                    ).toLocaleString()}
                </h4>

                <p>
                    <strong>Method:</strong>
                    ${item.method || "M-Pesa"}
                </p>

                <p>
                    <strong>Account:</strong>
                    ${item.account || ""}
                </p>

                <p class="${statusClass}">
                    <strong>Status:</strong>
                    ${status}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${item.date || ""}
                </p>

            </div>

        `;

    });

}


// ===============================
// LOAD EVERYTHING
// ===============================

loadInvestmentHistory();

loadRechargeHistory();

loadEarningsHistory();

loadWithdrawHistory();
