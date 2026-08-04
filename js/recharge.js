// =====================================
// PRIMEVEST RECHARGE
// =====================================

const API_BASE_URL = "https://smartpaypesa-backend.onrender.com";

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

const balance = document.getElementById("balance");
const phone = document.getElementById("phone");
const amount = document.getElementById("amount");
const payBtn = document.getElementById("payBtn");
const status = document.getElementById("status");
const historyList = document.getElementById("historyList");

// =====================================
// SHOW BALANCE
// =====================================

balance.innerHTML = "KSh " + Number(currentUser.balance || 0).toLocaleString();

if (currentUser.phone) {
    phone.value = currentUser.phone;
}

// =====================================
// LOAD HISTORY
// =====================================

loadHistory();

function loadHistory() {

    historyList.innerHTML = "";

    if (!currentUser.rechargeHistory || currentUser.rechargeHistory.length === 0) {

        historyList.innerHTML = "<p>No recharge history.</p>";
        return;

    }

    currentUser.rechargeHistory.forEach(item => {

        historyList.innerHTML += `
        <div class="history-item">
            <h3>KSh ${Number(item.amount).toLocaleString()}</h3>
            <p><strong>Receipt:</strong> ${item.receipt}</p>
            <p><strong>Date:</strong> ${item.date}</p>
        </div>
        `;

    });

}

// =====================================
// PHONE FORMAT
// =====================================

function formatPhone(phoneNumber) {

    phoneNumber = phoneNumber.replace(/\D/g, "");

    if (phoneNumber.startsWith("07")) {
        return "254" + phoneNumber.substring(1);
    }

    if (phoneNumber.startsWith("01")) {
        return "254" + phoneNumber.substring(1);
    }

    if (phoneNumber.startsWith("7")) {
        return "254" + phoneNumber;
    }

    if (phoneNumber.startsWith("1")) {
        return "254" + phoneNumber;
    }

    if (phoneNumber.startsWith("254")) {
        return phoneNumber;
    }

    return null;

}

// =====================================
// PAY
// =====================================

payBtn.onclick = async function () {

    const phoneNumber = formatPhone(phone.value.trim());
    const rechargeAmount = Number(amount.value);

    if (!phoneNumber) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid Safaricom number.";
        return;

    }

    if (rechargeAmount < 1) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid amount.";
        return;

    }

    payBtn.disabled = true;

    status.style.color = "#0d6efd";
    status.innerHTML = "Sending STK Push...";

    try {

        const response = await fetch(`${API_BASE_URL}/api/payment`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                phone: phoneNumber,

                amount: rechargeAmount

            })

        });

        const data = await response.json();

        if (!data.success) {

            payBtn.disabled = false;

            status.style.color = "red";
            status.innerHTML = data.message || "Unable to initiate payment.";

            return;

        }

        status.innerHTML = "STK Push sent. Complete payment on your phone.";

        pollPayment(data.checkout_request_id, rechargeAmount);

    }

    catch (error) {

        payBtn.disabled = false;

        status.style.color = "red";
        status.innerHTML = "Cannot connect to payment server.";

    }

};

// =====================================
// CHECK PAYMENT
// =====================================

function pollPayment(checkoutId, rechargeAmount) {

    let attempts = 0;

    const timer = setInterval(async () => {

        attempts++;

        if (attempts >= 40) {

            clearInterval(timer);

            payBtn.disabled = false;

            status.style.color = "red";
            status.innerHTML = "Payment verification timed out.";

            return;

        }

        try {

            const response = await fetch(`${API_BASE_URL}/api/local/${checkoutId}`);

            const data = await response.json();

            if (data.status === "PENDING") {

                return;

            }

            clearInterval(timer);

            payBtn.disabled = false;

            if (data.status === "COMPLETED") {

                completeRecharge(
                    rechargeAmount,
                    data.receipt || "Confirmed"
                );

            } else {

                status.style.color = "red";
                status.innerHTML = data.resultDesc || "Payment Failed.";

            }

        }

        catch (err) {

            clearInterval(timer);

            payBtn.disabled = false;

            status.style.color = "red";
            status
