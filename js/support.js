// ===============================
// PRIMEVEST SUPPORT
// ===============================

function openWhatsApp() {

    // Replace this number with your official
    // PrimeVest support WhatsApp number.

    const supportNumber = "254700000000";

    const message =
        "Hello PrimeVest Support, I need assistance with my account.";

    const url =
        "https://wa.me/" +
        supportNumber +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");

}


function sendEmail() {

    const email =
        "support.primevest@gmail.com";

    const subject =
        "PrimeVest Support Request";

    const body =
        "Hello PrimeVest Support,%0A%0AI need assistance with:%0A%0A";

    window.location.href =
        "mailto:" +
        email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        body;

}
