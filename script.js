let scores = JSON.parse(localStorage.getItem("texelScores")) || {};

function showPage(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if(id==="scorePage") updateScoreBoard();
}

function checkTime(){
    const hour = new Date().getHours();
    let result = (hour >=10 || hour <1)
        ? "🍺 HET IS TIJD VOOR BIER!!!"
        : "😴 Tijd voor bed, kampioen.";
    document.getElementById("timeResult").innerText = result;
}

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

function spinWheel(){
    const name = document.getElementById("nameInput").value.trim();
    if(!name) return alert("Vul eerst je naam in!");

    let options = [...baseOptions];

    if(name.toLowerCase() === "thimo"){
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

    const randomIndex = Math.floor(Math.random()*options.length);
    const degrees = 360*5 + (randomIndex*(360/options.length));
    document.getElementById("wheel").style.transform = `rotate(${degrees}deg)`;

    setTimeout(()=>{
        const result = options[randomIndex];
        document.getElementById("wheelResult").innerText = result;
        updateScores(name,result);
        if(result.includes("ATJE")) triggerCelebration();
    },4000);
}

function updateScores(name,result){
    if(!scores[name]) scores[name]=0;
    if(result.includes("Drink") || result==="ATJE!!! 🍻"){
        scores[name]++;
    }
    localStorage.setItem("texelScores",JSON.stringify(scores));
}

function updateScoreBoard(){
    const board = document.getElementById("scoreBoard");
    board.innerHTML="";
    for(let name in scores){
        board.innerHTML += `<p>${name}: ${scores[name]} drankjes</p>`;
    }
}

function resetScores(){
    localStorage.removeItem("texelScores");
    scores={};
    updateScoreBoard();
}

function triggerCelebration(){
    document.getElementById("atjeSound").play().catch(()=>{});
    confettiBurst();
}

function confettiBurst(){
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for(let i=0;i<150;i++){
        ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(Math.random()*canvas.width,Math.random()*canvas.height,5,5);
    }

    setTimeout(()=>ctx.clearRect(0,0,canvas.width,canvas.height),1500);
}

/* 🐍 Secret Thimo Easter Egg */
document.addEventListener("keydown",e=>{
    if(e.key==="t"){
        alert("🐍 Thimo modus geactiveerd. Kans op ellende stijgt.");
    }
});
