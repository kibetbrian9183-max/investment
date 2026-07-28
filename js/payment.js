// ===============================
// PRIMEVEST PAYMENT
// ===============================

const API_BASE_URL = "https://investment-mpesa-backend.onrender.com";

const product = JSON.parse(localStorage.getItem("selectedProduct"));
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!product || !currentUser) {
    window.location.href = "home.html";
}

const planName = document.getElementById("planName");
const amount = document.getElementById("amount");
const phone = document.getElementById("phone");
const payBtn = document.getElementById("payBtn");
const status = document.getElementById("status");

planName.innerHTML = product.name;
amount.innerHTML = "KSh " + product.invest.toLocaleString();
phone.value = currentUser.phone;

// ===============================
// PAY
// ===============================

payBtn.addEventListener("click", async () => {

    // Get phone number
    let phoneNumber = phone.value.trim().replace(/\s+/g, "");

    // Convert 07XXXXXXXX -> 2547XXXXXXXX
    if (/^07\d{8}$/.test(phoneNumber)) {
        phoneNumber = "254" + phoneNumber.substring(1);
    }

    // Convert 01XXXXXXXX -> 2541XXXXXXXX
    else if (/^01\d{8}$/.test(phoneNumber)) {
        phoneNumber = "254" + phoneNumber.substring(1);
    }

    // Validate final number
    if (!/^254(7|1)\d{8}$/.test(phoneNumber)) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid Safaricom number.";

        return;
    }

    // Show converted number
    phone.value = phoneNumber;

    // Ensure amount is a plain number
    const amountToPay = Number(product.invest);

    status.style.color = "#0d6efd";
    status.innerHTML = "Sending STK Push...";

    payBtn.disabled = true;
    payBtn.innerHTML = "Please Wait...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/mpesa/stkpush`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    phone: phoneNumber,
                    amount: amountToPay,
                    accountReference: "PrimeVest",
                    transactionDesc: product.name

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            payBtn.disabled = false;
            payBtn.innerHTML = "Pay with M-Pesa";

            status.style.color = "red";
            status.innerHTML =
                data.error || data.message || "Unable to send STK Push.";

            return;
        }

        const checkoutId =
            data.checkoutRequestId ||
            data.CheckoutRequestID;

        status.style.color = "green";
        status.innerHTML =
            "STK Push sent successfully. Check your phone and enter your M-Pesa PIN.";

        pollPayment(checkoutId);

    } catch (error) {

        payBtn.disabled = false;
        payBtn.innerHTML = "Pay with M-Pesa";

        console.error(error);

        status.style.color = "red";
        status.innerHTML =
            "Cannot connect to payment server.";

    }

});
// ===============================
// CHECK PAYMENT STATUS
// ===============================

function pollPayment(checkoutId) {

    let attempts = 0;

    const timer = setInterval(async () => {

        attempts++;

        if (attempts > 20) {

            clearInterval(timer);

            status.style.color = "red";

            status.innerHTML =
                "Payment verification timed out.";

            return;

        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/mpesa/status/${checkoutId}`
            );

            const data = await response.json();

            if (data.status === "pending") {

                return;

            }

            clearInterval(timer);

            if (data.status === "success") {

                completeInvestment();

            }

            else {

                status.style.color = "red";

                status.innerHTML =
                    data.resultDesc || "Payment Failed.";

            }

        }

        catch (error) {

            clearInterval(timer);

            status.style.color = "red";

            status.innerHTML =
                "Unable to verify payment.";

        }

    }, 3000);

}

// ===============================
// SAVE INVESTMENT
// ===============================

function completeInvestment() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        u => u.phone === currentUser.phone
    );

    if (index === -1) return;

    // First investment bonus
    if (users[index].products.length === 0) {

        users[index].balance += 150;

    }

    users[index].investmentBalance += product.invest;

    users[index].totalInvestment += product.invest;

    users[index].products.push({

        ...product,

        purchaseDate: Date.now(),

        lastClaim: Date.now()

    });

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem(
        "currentUser",
        JSON.stringify(users[index])
    );

    status.style.color = "green";

    status.innerHTML =
        "✅ Payment Successful! Redirecting...";

    setTimeout(() => {

        window.location.href = "home.html";

    }, 2000);

}
