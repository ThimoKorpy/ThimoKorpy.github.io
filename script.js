let scores = JSON.parse(localStorage.getItem("texelScores")) || {};
let spinning = false;
let currentRotation = 0;

const SPIN_DURATION = 8000;

const baseOptions = [
    "Drink 1 slok",
    "Drink 2 slokken",
    "Drink 3 slokken",
    "ATJE!!!",
    "Geef 1 slok",
    "Geef 2 slokken",
    "Geef 3 slokken",
    "Geef een ATJE weg"
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

// create wheel slices
function createWheel(options){
    const angle = 360/options.length;

    // conic gradient
    let grad = "conic-gradient(";
    options.forEach((opt,i)=>{
        const start = i*angle;
        const end = (i+1)*angle;
        grad += `${colors[i%colors.length]} ${start}deg ${end}deg`;
        if(i<options.length-1) grad+=",";
    });
    grad+=")";
    wheel.style.background=grad;

    // labels
    wheel.querySelectorAll(".label").forEach(l=>l.remove());
    options.forEach((opt,i)=>{
        const label=document.createElement("div");
        label.className="label";
        label.innerText=opt;
        wheel.appendChild(label);
    });
}

// spin
function spinWheel(){
    if(spinning) return;

    const name = document.getElementById("nameInput").value.trim();
    if(!name) return alert("Vul eerst je naam in!");

    let options = [...baseOptions];
    if(name.toLowerCase()==="thimo"){
        options=[
            "Geef 1 slok","Geef 2 slokken","Geef 3 slokken",
            "Geef een ATJE weg","Geef een ATJE weg",
            "Geef een ATJE weg","Geef een ATJE weg"
        ];
    }

    createWheel(options);

    const angle = 360/options.length;
    const randomIndex = Math.floor(Math.random()*options.length);
    currentRotation = currentRotation % 360;
    const targetAngle = 360 - (randomIndex*angle + angle/2);
    const total = currentRotation + 8*360 + targetAngle;

    spinning=true;
    spinBtn.disabled=true;

    wheel.style.transform=`rotate(${total}deg)`;

    const interval = setInterval(()=>{
        const matrix = new DOMMatrix(getComputedStyle(wheel).transform);
        let deg = Math.atan2(matrix.b,matrix.a)*(180/Math.PI);
        if(deg<0) deg+=360;
        const idx = Math.floor(((360-deg)%360)/angle);
        liveResult.innerText=options[idx%options.length];
    },100);

    setTimeout(()=>{
        clearInterval(interval);
        liveResult.innerText="🎉 "+options[randomIndex];
        updateScores(name,options[randomIndex]);
        currentRotation = total%360;
        spinning=false;
        spinBtn.disabled=false;
    },SPIN_DURATION);
}

// scores
function updateScores(name,result){
    if(!scores[name]) scores[name]=0;
    if(result.includes("Drink")||result==="ATJE!!!"){scores[name]++;}
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
