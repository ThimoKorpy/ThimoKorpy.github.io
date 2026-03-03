// =============================
// TEXEL DRINK TRIP 2026 🍺
// =============================

// ---------- SCORE STORAGE ----------
let scores = JSON.parse(localStorage.getItem("texelScores")) || {};

// ---------- PAGE NAVIGATION ----------
function showPage(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if(id==="scorePage") updateScoreBoard();
}

// ---------- TIME CHECK ----------
function checkTime(){
    const hour = new Date().getHours();
    let result = (hour >=10 || hour <1)
        ? "🍺 HET IS TIJD VOOR BIER!!!"
        : "😴 Tijd voor bed, kampioen.";
    document.getElementById("timeResult").innerText = result;
}

// ---------- BASE OPTIONS ----------
const baseOptions = [
    "Drink 1 slok 🍺",
    "Drink 2 slokken 🍺",
    "Drink 3 slokken 🍺",
    "ATJE!!! 🍻",
    "Geef 1 slok 😈",
    "Geef 2 slokken 😈",
    "Geef 3 slokken 😈",
    "Geef een ATJE weg 😈🍻"
];

// ---------- WHEEL LOGIC ----------
const wheel = document.getElementById("wheel");
const liveResult = document.getElementById("liveResult");

let currentRotation = 0;
let spinning = false;

function createWheel(options) {
    wheel.innerHTML = "";
    const segmentAngle = 360 / options.length;

    options.forEach((option, index) => {
        const segment = document.createElement("div");
        segment.className = "segment";
        segment.style.transform = 
            `rotate(${segmentAngle * index}deg) skewY(${90 - segmentAngle}deg)`;
        segment.style.background = 
            `hsl(${index * 40}, 80%, 60%)`;

        const text = document.createElement("div");
        text.style.transform = 
            `skewY(-${90 - segmentAngle}deg) rotate(${segmentAngle/2}deg)`;
        text.style.padding = "5px";
        text.innerText = option;

        segment.appendChild(text);
        wheel.appendChild(segment);
    });
}

function spinWheel() {
    if (spinning) return;

    const name = document.getElementById("nameInput").value.trim();
    if (!name) return alert("Vul eerst je naam in!");

    let options = [...baseOptions];

    // 🐍 THIMO SABOTAGE MODE
    if (name.toLowerCase() === "thimo") {
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

    createWheel(options);

    const segmentAngle = 360 / options.length;
    const randomIndex = Math.floor(Math.random() * options.length);

    const extraSpins = 6 * 360; // veel rondjes
    const finalAngle = 
        360 - (randomIndex * segmentAngle) - (segmentAngle / 2);

    const totalRotation = currentRotation + extraSpins + finalAngle;

    spinning = true;

    wheel.style.transition =
        "transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)";
    wheel.style.transform = `rotate(${totalRotation}deg)`;

    // 🔄 Live update tijdens spin
    let interval = setInterval(() => {
        const computedStyle = window.getComputedStyle(wheel);
        const matrix = new DOMMatrix(computedStyle.transform);
        let angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const activeIndex =
            Math.floor((360 - angle) / segmentAngle) % options.length;

        liveResult.innerText = options[activeIndex];
    }, 100);

    // 🏁 Na spin
    setTimeout(() => {
        clearInterval(interval);

        const result = options[randomIndex];
        liveResult.innerText = "🎉 " + result;

        updateScores(name, result);

        if (result.includes("ATJE")) {
            triggerCelebration();
        }

        currentRotation = totalRotation % 360;
        spinning = false;

    }, 5000);
}

// ---------- SCOREBOARD ----------
function updateScores(name,result){
    if(!scores[name]) scores[name]=0;

    if(result.includes("Drink") || result === "ATJE!!! 🍻"){
        scores[name]++;
    }

    localStorage.setItem("texelScores",
        JSON.stringify(scores));
}

function updateScoreBoard(){
    const board = document.getElementById("scoreBoard");
    board.innerHTML="";

    for(let name in scores){
        board.innerHTML += 
            `<p>${name}: ${scores[name]} drankjes</p>`;
    }
}

function resetScores(){
    localStorage.removeItem("texelScores");
    scores={};
    updateScoreBoard();
}

// ---------- CELEBRATION ----------
function confettiBurst(){
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for(let i=0;i<200;i++){
        ctx.fillStyle =
            `hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(
            Math.random()*canvas.width,
            Math.random()*canvas.height,
            6,6
        );
    }

    setTimeout(()=>{
        ctx.clearRect(0,0,
            canvas.width,canvas.height);
    },1500);
}

// ---------- SECRET KEY ----------
document.addEventListener("keydown",e=>{
    if(e.key==="t"){
        alert("🐍 THIMO CHAOS MODE GEACTIVEERD");
    }
});
