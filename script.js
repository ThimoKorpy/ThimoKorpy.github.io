function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById(pageId).classList.add("active");
}

function checkTime() {
    const now = new Date();
    const hour = now.getHours();

    let result = "";

    if (hour >= 10 || hour < 1) {
        result = "🍺 HET IS TIJD VOOR BIER! 🍺";
    } else {
        result = "😴 Ga naar bed joh.";
    }

    document.getElementById("timeResult").innerText = result;
}

function spinWheel() {
    const name = document.getElementById("nameInput").value.trim().toLowerCase();
    let result = "";

    // Normale kansen
    let options = [
        "Drink 1 slok 🍺",
        "Drink 2 slokken 🍺",
        "Drink 3 slokken 🍺",
        "ATJE!!! 🍻",
        "Geef 1 slok 😈",
        "Geef 2 slokken 😈",
        "Geef 3 slokken 😈",
        "Geef een ATJE weg 😈🍻"
    ];

    if (name === "thimo") {
        // Geen drink-opties
        options = [
            "Geef 1 slok 😈",
            "Geef 2 slokken 😈",
            "Geef 3 slokken 😈",
            "Geef een ATJE weg 😈🍻",
            "Geef een ATJE weg 😈🍻",
            "Geef een ATJE weg 😈🍻",
            "Geef een ATJE weg 😈🍻"
        ];
    }

    const randomIndex = Math.floor(Math.random() * options.length);
    result = options[randomIndex];

    document.getElementById("wheelResult").innerText = result;
