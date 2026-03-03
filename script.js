let scores = JSON.parse(localStorage.getItem("texelScores")) || {};
let spinning = false;
let currentRotation = 0;

const SPIN_DURATION = 8000;

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

const colors = [
    "#ffcc00","#ff4444","#33cc33","#3399ff",
    "#cc33ff","#ff9933","#00cccc","#ff6699"
];

const wheel = document.getElementById("wheel");
const liveResult = document.getElementById("liveResult");
const spinBtn = document.getElementById("spinBtn");

function showPage(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if(id==="scorePage") updateScoreBoard();
}

function checkTime(){
    const hour = new Date().getHours();
    document.getElementById("timeResult").innerText =
        (hour >=10 || hour <1)
        ? "🍺 HET IS TIJD VOOR BIER!"
        : "😴 Tijd voor bed.";
}

/* =========================
   WHEEL CREATION
========================= */
function createWheel(options){
    const angle = 360 / options.length;

    // Taart achtergrond
    let gradient = "conic-gradient(";
    options.forEach((_,i)=>{
        const start = i*angle;
        const end = (i+1)*angle;
        gradient += `${colors[i % colors.length]} ${start}deg ${end}deg`;
        if(i < options.length-1) gradient += ",";
    });
    gradient += ")";
    wheel.style.background = gradient;

    // Oude labels verwijderen
    wheel.querySelectorAll(".label").forEach(l=>l.remove());

    // Radiale tekst (wijzend naar centrum)
    options.forEach((option,i)=>{
        const label = document.createElement("div");
        label.className="label";

        const midAngle = i*angle + angle/2;

        label.style.transform =
            `rotate(${midAngle}deg) translate(0,-130px)`;

        label.innerText = option;
        wheel.appendChild(label);
    });
}

/* =========================
   SPIN LOGIC
========================= */
function spinWheel(){
    if(spinning) return;

    const name=document.getElementById("nameInput").value.trim();
    if(!name) return alert("Vul eerst je naam in!");

    let options=[...baseOptions];

    // 🐍 Thimo sabotage
    if(name.toLowerCase()==="thimo"){
        options=[
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

    const angle=360/options.length;
    const randomIndex=Math.floor(Math.random()*options.length);

    // Normalize huidige rotatie
    currentRotation = currentRotation % 360;

    // Pointer staat op 0° (12 uur)
    const targetAngle = 360 - (randomIndex * angle + angle/2);

    const extraSpins = 8 * 360;

    const totalRotation = currentRotation + extraSpins + targetAngle;

    spinning=true;
    spinBtn.disabled=true;

    wheel.style.transition =
        `transform ${SPIN_DURATION}ms cubic-bezier(0.1,0.9,0.2,1)`;

    wheel.style.transform=`rotate(${totalRotation}deg)`;

    const interval=setInterval(()=>{
        const computed = getComputedStyle(wheel).transform;
        if(computed==="none") return;

        const matrix=new DOMMatrix(computed);
        let deg=Math.atan2(matrix.b,matrix.a)*(180/Math.PI);
        if(deg<0) deg+=360;

        const active =
            Math.floor(((360 - deg) % 360) / angle);

        liveResult.innerText=
            options[active % options.length];

    },100);

    setTimeout(()=>{
        clearInterval(interval);

        const result=options[randomIndex];
        liveResult.innerText="🎉 "+result;

        updateScores(name,result);
        if(result.includes("ATJE")) confettiBurst();

        currentRotation = totalRotation % 360;
        spinning=false;
        spinBtn.disabled=false;

    },SPIN_DURATION);
}

/* =========================
   SCORES
========================= */
function updateScores(name,result){
    if(!scores[name]) scores[name]=0;
    if(result.includes("Drink")||result==="ATJE!!! 🍻"){
        scores[name]++;
    }
    localStorage.setItem("texelScores",JSON.stringify(scores));
}

function updateScoreBoard(){
    const board=document.getElementById("scoreBoard");
    board.innerHTML="";
    for(let name in scores){
        board.innerHTML+=`<p>${name}: ${scores[name]} drankjes</p>`;
    }
}

function resetScores(){
    localStorage.removeItem("texelScores");
    scores={};
    updateScoreBoard();
}

/* =========================
   CONFETTI
========================= */
function confettiBurst(){
    const canvas=document.getElementById("confetti");
    const ctx=canvas.getContext("2d");

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    for(let i=0;i<300;i++){
        ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(
            Math.random()*canvas.width,
            Math.random()*canvas.height,
            6,6
        );
    }

    setTimeout(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    },2000);
}
