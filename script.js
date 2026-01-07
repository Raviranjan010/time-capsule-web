let interval;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const form = document.getElementById("formSection");
const countdown = document.getElementById("countdownSection");
const unlocked = document.getElementById("unlockedSection");

const messageInput = document.getElementById("message");
const unlockTimeInput = document.getElementById("unlockTime");
const displayMessage = document.getElementById("displayMessage");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

themeToggle.onclick = () => {
    const theme = document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",theme);
    localStorage.setItem("theme",theme);
    themeIcon.textContent = theme==="dark"?"☀️":"🌙";
};

document.getElementById("lockBtn").onclick = () => {
    if(!messageInput.value || !unlockTimeInput.value) return alert("Fill all fields");
    localStorage.setItem("capsule",JSON.stringify({
        msg:messageInput.value,
        time:unlockTimeInput.value
    }));
    startCountdown();
};

function startCountdown(){
    form.classList.add("hidden");
    countdown.classList.add("active");

    interval = setInterval(()=>{
        const data = JSON.parse(localStorage.getItem("capsule"));
        const diff = new Date(data.time) - new Date();

        if(diff<=0){
            clearInterval(interval);
            unlock(data.msg);
        }

        daysEl.textContent = Math.floor(diff/86400000);
        hoursEl.textContent = Math.floor(diff/3600000)%24;
        minutesEl.textContent = Math.floor(diff/60000)%60;
        secondsEl.textContent = Math.floor(diff/1000)%60;
    },1000);
}

function unlock(msg){
    countdown.classList.remove("active");
    unlocked.classList.add("active");
    displayMessage.textContent = msg;
}

document.getElementById("resetBtn").onclick = () => {
    localStorage.removeItem("capsule");
    location.reload();
};

window.onload = ()=>{
    const savedTheme = localStorage.getItem("theme")||"light";
    document.documentElement.setAttribute("data-theme",savedTheme);

    if(localStorage.getItem("capsule")){
        startCountdown();
    }
};
