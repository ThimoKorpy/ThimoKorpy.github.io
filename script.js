// == TEXEL DRINK RAD ==

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

const wheelSvg = document.getElementById("wheelSvg");
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

// 🎡 build SVG wheel
function createSvgWheel(options){
    wheelSvg.innerHTML=""; // clear

    const center = 170; 
    const radius = 150;
    const angle = 360 / options.length;

    options.forEach((opt,i) => {
        const startAngle = i*angle;
        const endAngle = startAngle + angle;

        // path for pie
        const x1 = center + radius*Math.cos(Math.PI*(startAngle)/180);
        const y1 = center + radius*Math.sin(Math.PI*(startAngle)/180);
        const x2 = center + radius*Math.cos(Math.PI*(endAngle)/180);
        const y2 = center + radius*Math.sin(Math.PI*(endAngle)/180);

        const path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute("d",
            `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`);
        path.setAttribute("fill", colors[i%colors.length]);
        wheelSvg.appendChild(path);

        // add label
        const textAngle = startAngle + angle/2;
        const text = document.createElementNS("http://www.w3.org/2000/svg","text");
        text.setAttribute("x",center);
        text.setAttribute("y",center);
        text.setAttribute("dominant-baseline","middle");
        text.setAttribute("text-anchor","middle");
        // position along radius
        const tx = center + (radius/2)*Math.cos(Math.PI*textAngle/180);
        const ty = center + (radius/2)*Math.sin(Math.PI*textAngle/180);
        text.setAttribute("transform",
            `translate(${tx},${ty}) rotate(${textAngle+90})`);
        text.textContent = opt;
        text.style.fontSize = "13px";
        text.style.userSelect = "none";
        wheelSvg.appendChild(text);
    });
}

// 🎯 Spin logic
function spinWheel(){
    if(spinning) return;

    const name=document.getElementById("nameInput").value.trim();
    if(!name) return alert("Vul eerst je naam in!");

    let options=[...baseOptions];
    if(name.toLowerCase()==="thimo"){
        options=[
            "Geef 1 slok 😈","Geef 2 slokken 😈","Geef 3 slokken 😈",
            "Geef een ATJE weg 😈🍻","Geef een ATJE weg 😈🍻",
            "Geef een ATJE weg 😈🍻","Geef een ATJE weg 😈🍻"
        ];
    }

    createSvgWheel(options);

    const angle = 360/options.length;
    const randomIndex = Math.floor(Math.random()*options.length);

    currentRotation = currentRotation % 360;
    const targetAngle = 360 - (randomIndex*angle + angle/2);
    const extraSpins = 8*360;

    const total = currentRotation + extraSpins + targetAngle;

    spinning=true;
    spinBtn.disabled=true;

    wheelSvg.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.1,0.9,0.2,1)`;
    wheelSvg.style.transform = `rotate(${total}deg)`;

    const interval = setInterval(()=>{
        const computed = getComputedStyle(wheelSvg).transform;
        if(computed==="none") return;

        const matrix = new DOMMatrix(computed);
        let deg = Math.atan2(matrix.b,matrix.a)*(180/Math.PI);
        if(deg<0) deg+=360;

        const idx = Math.floor(((360 - deg)%360)/angle);
        liveResult.innerText = options[idx%options.length];
    },100);

    setTimeout(()=>{
        clearInterval(interval);
        const result = options[randomIndex];
        liveResult.innerText = "🎉 " + result;
        updateScores(name,result);
        if(result.includes("ATJE")) confettiBurst();
        currentRotation = total % 360;
        spinning=false;
        spinBtn.disabled=false;
    },SPIN_DURATION);
}

// scores & confetti (same as before)
function updateScores(name,result){if(!scores[name]) scores[name]=0; if(result.includes("Drink")||result==="ATJE!!! 🍻"){scores[name]++;} localStorage.setItem("texelScores",JSON.stringify(scores));}
function updateScoreBoard(){document.getElementById("scoreBoard").innerHTML = Object.entries(scores).map(([n,s])=> `<p>${n}: ${s} drankjes</p>`).join("");}
function resetScores(){localStorage.removeItem("texelScores"); scores={}; updateScoreBoard();}
function confettiBurst(){ const canvas=document.getElementById("confetti"); const ctx=canvas.getContext("2d"); canvas.width=window.innerWidth; canvas.height=window.innerHeight; for(let i=0;i<300;i++){ ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`; ctx.fillRect(Math.random()*canvas.width,Math.random()*canvas.height,6,6);} setTimeout(()=>ctx.clearRect(0,0,canvas.width,canvas.height),2000);}
