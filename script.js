// =====================
// TEXEL DRINK MACHINE 🍺
// =====================

let scores = JSON.parse(localStorage.getItem("texelScores")) || {};
let spinning = false;
let currentRotation = 0;

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

// -------- NAVIGATION --------
function showPage(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if(id==="scorePage") updateScoreBoard();
}

// -------- TIME --------
function checkTime(){
    const hour = new Date().getHours();
    document.getElementById("timeResult").innerText =
        (hour >=10 || hour <1)
        ? "🍺 HET IS TIJD VOOR BIER!"
        : "😴 Tijd voor bed.";
}

// -------- CREATE WHEEL --------
function createWheel(options){
    wheel.innerHTML="";
    const angle = 360 / options.length;

    options.forEach((option,i)=>{
        const segment=document.createElement("div");
        segment.className="segment";
        segment.style.background=colors[i % colors.length];
        segment.style.transform=
            `rotate(${angle*i}deg) skewY(${90-angle}deg)`;

        const text=document.createElement("span");
        text.innerText=option;
        text.style.transform=
            `skewY(-${90-angle}deg) rotate(${angle/2}deg)`;

        segment.appendChild(text);
        wheel.appendChild(segment);
    });
}

// -------- SPIN --------
function spinWheel(){
    if(spinning) return;

    const name=document.getElementById("nameInput").value.trim();
    if(!name) return alert("Vul eerst je naam in!");

    let options=[...baseOptions];

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

    const extraSpins=5*360;
    const stopAngle=360-(randomIndex*angle)-(angle/2);
    const total=currentRotation+extraSpins+stopAngle;

    spinning=true;
    spinBtn.disabled=true;

    wheel.style.transform=`rotate(${total}deg)`;

    const interval=setInterval(()=>{
        const style=window.getComputedStyle(wheel);
        const matrix=new DOMMatrix(style.transform);
        let deg=Math.atan2(matrix.b,matrix.a)*(180/Math.PI);
        if(deg<0) deg+=360;

        const active=Math.floor((360-deg)/angle)%options.length;
        liveResult.innerText=options[active];
    },100);

    setTimeout(()=>{
        clearInterval(interval);

        const result=options[randomIndex];
        liveResult.innerText="🎉 "+result;

        updateScores(name,result);

        if(result.includes("ATJE")) confettiBurst();

        currentRotation=total%360;
        spinning=false;
        spinBtn.disabled=false;

    },5000);
}

// -------- SCORES --------
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

// -------- CONFETTI --------
function confettiBurst(){
    const canvas=document.getElementById("confetti");
    const ctx=canvas.getContext("2d");

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    for(let i=0;i<200;i++){
        ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(
            Math.random()*canvas.width,
            Math.random()*canvas.height,
            6,6
        );
    }

    setTimeout(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    },1500);
}
