// --- Starfield Animation ---
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * width;
                this.size = 0.5;
            }
            update() {
                this.z -= 0.5; // Speed
                if (this.z <= 0) {
                    this.z = width;
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                }
            }
            draw() {
                const x = (this.x - width / 2) * (width / this.z) + width / 2;
                const y = (this.y - height / 2) * (width / this.z) + height / 2;
                const s = this.size * (width / this.z);
                
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.arc(x, y, s, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initStars() {
            stars = [];
            for(let i=0; i<800; i++) stars.push(new Star());
        }

        function animate() {
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, width, height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => { resize(); initStars(); });
        resize();
        initStars();
        animate();

        // --- App Logic ---
        const views = {
            create: document.getElementById('view-create'),
            countdown: document.getElementById('view-countdown'),
            unlocked: document.getElementById('view-unlocked')
        };

        let countdownInterval;

        // Audio Context
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playSound(freq, type='sine', dur=0.1) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + dur);
            osc.stop(audioCtx.currentTime + dur);
        }

        function switchView(viewName) {
            Object.values(views).forEach(el => el.classList.remove('active'));
            views[viewName].classList.add('active');
        }

        function switchStep(stepNum) {
            playSound(600, 'square', 0.05);
            document.querySelectorAll('.step-content').forEach(el => el.style.display = 'none');
            document.getElementById(`step-${stepNum}`).style.display = 'block';
            
            document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.step')[stepNum-1].classList.add('active');
        }

        function lockCapsule() {
            const title = document.getElementById('capsuleTitle').value || 'Unknown Capsule';
            const msg = document.getElementById('message').value;
            const time = document.getElementById('unlockTime').value;
            const img = document.getElementById('imageUrl').value;
            const pin = document.getElementById('pinCode').value;

            if(!msg || !time) {
                alert("Message and Time are required.");
                return;
            }

            const unlockDate = new Date(time).getTime();
            if(unlockDate <= Date.now()) {
                alert("Time must be in the future.");
                return;
            }

            const data = {
                title, msg, unlockDate, img, pin,
                lockedAt: Date.now()
            };

            localStorage.setItem('chronosCapsule', JSON.stringify(data));
            playSound(200, 'sawtooth', 0.5);
            checkCapsule();
        }

        function checkCapsule() {
            const data = JSON.parse(localStorage.getItem('chronosCapsule'));
            if(!data) {
                switchView('create');
                return;
            }

            const now = Date.now();
            if(now >= data.unlockDate) {
                // Unlock Logic
                if(data.pin) {
                    const input = prompt("Enter Security PIN:");
                    if(input !== data.pin) {
                        alert("Access Denied.");
                        return;
                    }
                }
                showUnlocked(data);
            } else {
                // Countdown Logic
                switchView('countdown');
                document.getElementById('target-date-display').innerText = 
                    `TARGET: ${new Date(data.unlockDate).toLocaleString()}`;
                startTimer(data.unlockDate);
            }
        }

        function startTimer(target) {
            clearInterval(countdownInterval);
            countdownInterval = setInterval(() => {
                const now = Date.now();
                const diff = target - now;

                if(diff <= 0) {
                    clearInterval(countdownInterval);
                    checkCapsule();
                    return;
                }

                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                document.getElementById('d').innerText = d.toString().padStart(2, '0');
                document.getElementById('h').innerText = h.toString().padStart(2, '0');
                document.getElementById('m').innerText = m.toString().padStart(2, '0');
                document.getElementById('s').innerText = s.toString().padStart(2, '0');
            }, 1000);
        }

        function showUnlocked(data) {
            switchView('unlocked');
            playSound(800, 'sine', 0.5);
            document.getElementById('unlocked-title').innerText = data.title;
            document.getElementById('unlocked-message').innerText = data.msg;
            
            const imgEl = document.getElementById('unlocked-image');
            if(data.img) {
                imgEl.src = data.img;
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
            }
        }

        function resetCapsule() {
            if(confirm("Purge current capsule data?")) {
                localStorage.removeItem('chronosCapsule');
                clearInterval(countdownInterval);
                location.reload();
            }
        }

        // Init
        checkCapsule();
