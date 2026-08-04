// ======================================
// PrimeVest - payment.js
// ======================================

// Your Render Backend URL
const API_URL = "https://smartpaypesa-backend.onrender.com";

// Get amount from URL
const params = new URLSearchParams(window.location.search);
const amount = Number(params.get("amount")) || 0;

// Elements
const amountInput = document.getElementById("displayAmount");
const phoneInput = document.getElementById("phone");
const payBtn = document.getElementById("payBtn");
const status = document.getElementById("status");

// Display Amount
if (amountInput) {
    amountInput.value = "KSh " + amount.toLocaleString();
}

// ===========================
// Convert Phone Number
// ===========================
function formatPhone(phone) {

    phone = phone.replace(/\D/g, "");

    if (phone.startsWith("07")) {
        return "254" + phone.substring(1);
    }

    if (phone.startsWith("01")) {
        return "254" + phone.substring(1);
    }

    if (phone.startsWith("7")) {
        return "254" + phone;
    }

    if (phone.startsWith("1")) {
        return "254" + phone;
    }

    if (phone.startsWith("254")) {
        return phone;
    }

    return null;
}

// ===========================
// Pay Button
// ===========================
payBtn.addEventListener("click", async () => {

    let phone = formatPhone(phoneInput.value);

    if (!phone) {
        alert("Enter a valid Safaricom phone number.");
        return;
    }

    if (amount < 1) {
        alert("Invalid amount.");
        return;
    }

    payBtn.disabled = true;
    status.innerHTML = "Sending STK Push...";

    try {

        const response = await fetch(`${API_URL}/api/payment`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                phone: phone,

                amount: amount

            })

        });

        const data = await response.json();

        if (data.success) {

            status.innerHTML =
                "STK Push sent successfully.<br>Check your phone.";

            localStorage.setItem(
                "checkoutRequestId",
                data.checkout_request_id
            );

            checkPayment(data.checkout_request_id);

        } else {

            payBtn.disabled = false;

            status.innerHTML = "";

            alert(data.message || "Unable to initiate payment.");

        }

    } catch (error) {

        console.log(error);

        payBtn.disabled = false;

        status.innerHTML = "";

        alert("Unable to connect to server.");

    }

});

// ===========================
// Check Payment Status
// ===========================
function checkPayment(id) {

    const timer = setInterval(async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/local/${id}`
            );

            const result = await response.json();

            if (result.status === "COMPLETED") {

                clearInterval(timer);

                paymentSuccess();

            }

            if (result.status === "FAILED") {

                clearInterval(timer);

                payBtn.disabled = false;

                status.innerHTML = "";

                alert("Payment Failed.");

            }

        } catch (err) {

            console.log(err);

        }

    }, 3000);

}

// ===========================
// Payment Success
// ===========================
function paymentSuccess() {

    let user = JSON.parse(localStorage.getItem("user")) || {

        balance: 0,

        investment: 0,

        firstPurchase: false

    };

    user.investment += amount;

    if (!user.firstPurchase) {

        user.balance += 150;

        user.firstPurchase = true;

        alert("🎉 Registration Bonus\n\nKSh 150 has been credited.");

    }

    localStorage.setItem("user", JSON.stringify(user));

    alert("Payment Successful!");

    window.location.href = "profile.html";

}
