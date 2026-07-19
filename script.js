// ===== POEMA =====
const poemaSync = [
    { time: 2.0,  text: "Hay personas que llegan como llega la marea," },
    { time: 5.5,  text: "sin avisar, sin ruido, sin pedir permiso," },
    { time: 9.0,  text: "y cuando quieres darte cuenta ya te rodean," },
    { time: 13.0, text: "y el mundo sin ellas ya no tiene el mismo piso." },
    { time: 18.0, text: "Tú llegaste así, Meyli, sin hacer escándalo," },
    { time: 22.0, text: "con esa mirada que no sabe disimular," },
    { time: 26.0, text: "con esa voz que el silencio vuelve un regalo," },
    { time: 30.0, text: "y esa forma de ser que no puedo evitar." },
    { time: 36.0, text: "No sé cómo explicar lo que genera tu presencia," },
    { time: 40.5, text: "esa calma extraña de sentir que ya te conocía," },
    { time: 45.0, text: "como si el tiempo antes de ti fuera una ausencia," },
    { time: 49.5, text: "y tú fueras la razón por la que el alma sonreía." },
    { time: 55.0, text: "Dicen que hay personas que no se encuentran, se eligen," },
    { time: 59.5, text: "yo creo que a veces el destino simplemente sabe," },
    { time: 64.0, text: "y nos pone frente a frente a los que se dirigen," },
    { time: 68.5, text: "hacia algo que todavía no tiene nombre pero ya se sabe." },
    { time: 75.0, text: "Y mientras llega el día en que volvamos a vernos," },
    { time: 79.5, text: "cuento las horas con una impaciencia que no miento," },
    { time: 84.0, text: "porque anhelar tus ojos es de los sentimientos" },
    { time: 88.5, text: "más honestos que he tenido en mucho tiempo." },
    { time: 94.0, text: "No tengo más palabras, solo tengo esta certeza:" },
    { time: 98.5, text: "que hay algo en ti que no quiero dejar de descubrir," },
    { time: 103.0, text: "y si el universo me da el tiempo y la destreza," },
    { time: 107.5, text: "me gustaría ser esa persona que te hace sonreír." }
];

// ===== ELEMENTOS =====
const envelopeClick = document.getElementById('envelope-click');
const envelopeFlap = document.getElementById('envelope-flap');
const waxSeal = document.getElementById('wax-seal');
const card = document.getElementById('card');
const cardNameArea = document.getElementById('card-name');
const fairyDustContainer = document.getElementById('fairy-dust-container');
const ribbonText = document.getElementById('ribbon-txt');
const startScreen = document.getElementById('start-screen');
const audioPoema = document.getElementById('audio-poema');
const magicText = document.getElementById('magic-text');
const lanternsContainer = document.getElementById('lanterns-container');
const bg1 = document.getElementById('bg-1');
const bg2 = document.getElementById('bg-2');
const bg3 = document.getElementById('bg-3');
const bg4 = document.getElementById('bg-4');
const handwrittenFinale = document.getElementById('handwritten-finale');

let isPlaying = false;
let currentLineIndex = -1;
let virtualTime = 0;
let lastTime = 0;
let finaleTriggered = false;
let opened = false;

// ===== ESCRIBIR NOMBRE LETRA POR LETRA =====
function writeNameLetterByLetter(callback) {
    const name = "Meyli";
    cardNameArea.innerHTML = '';

    name.split('').forEach((char, i) => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('letter');
            cardNameArea.appendChild(span);

            // Pequeño delay antes de la animación para que el DOM se actualice
            requestAnimationFrame(() => {
                span.classList.add('appear');
            });

            // Callback después de la última letra
            if (i === name.length - 1 && callback) {
                setTimeout(callback, 1500); // Pausa para admirar el nombre completo
            }
        }, i * 700); // 700ms entre cada letra (lento y romántico)
    });
}

// ===== POLVO DE HADAS =====
function burstFairyDust() {
    for (let i = 0; i < 45; i++) {
        setTimeout(() => {
            const dust = document.createElement('div');
            dust.classList.add('fairy-dust');

            const tx = (Math.random() - 0.5) * 600 + 'px';
            const ty = (Math.random() - 0.5) * 600 + 'px';
            dust.style.setProperty('--tx', tx);
            dust.style.setProperty('--ty', ty);

            const size = Math.random() * 7 + 3;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';

            const duration = Math.random() * 2 + 1;
            dust.style.animation = `fairyExplode ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;

            fairyDustContainer.appendChild(dust);
            setTimeout(() => { if (dust.parentNode) dust.remove(); }, duration * 1000);
        }, i * 40); // Salen escalonadamente (no todas juntas)
    }
}

// ===== FAROLES =====
function spawnLantern() {
    if (!isPlaying || finaleTriggered) return;

    const lantern = document.createElement('div');
    lantern.classList.add('realistic-lantern');
    const size = Math.random() * 60 + 40;
    lantern.style.width = size + 'px';
    lantern.style.height = (size * 1.5) + 'px';
    lantern.style.left = Math.random() * 90 + '%';
    lantern.style.bottom = '-150px';
    const duration = Math.random() * 15 + 20;
    const delay = Math.random() * 2;
    lantern.style.animationDuration = duration + 's';
    lantern.style.animationDelay = delay + 's';
    lanternsContainer.appendChild(lantern);
    setTimeout(() => { if (lantern.parentNode) lantern.remove(); }, (duration + delay) * 1000);
    setTimeout(spawnLantern, Math.random() * 1500 + 500);
}

// ===== FONDOS =====
function updateBackgrounds(index) {
    if (index === 8) { bg1.classList.remove('active'); bg2.classList.add('active'); }
    else if (index === 16) { bg2.classList.remove('active'); bg3.classList.add('active'); }
}

// ===== SINCRONIZADOR =====
function checkLyrics() {
    if (!isPlaying) return;
    let currentTime = 0;
    if (audioPoema && audioPoema.duration > 0 && !audioPoema.paused) {
        currentTime = audioPoema.currentTime;
    } else {
        const now = Date.now();
        virtualTime += (now - lastTime) / 1000;
        lastTime = now;
        currentTime = virtualTime;
    }

    let activeLine = -1;
    for (let i = 0; i < poemaSync.length; i++) {
        if (currentTime >= poemaSync[i].time) activeLine = i;
    }

    if (activeLine !== currentLineIndex && activeLine !== -1) {
        currentLineIndex = activeLine;
        if (magicText.classList.contains('show')) {
            magicText.classList.remove('show');
            magicText.classList.add('fade-out');
        }
        updateBackgrounds(currentLineIndex);
        setTimeout(() => {
            magicText.textContent = poemaSync[currentLineIndex].text;
            magicText.classList.remove('fade-out');
            magicText.classList.add('show');
        }, 1200);
    }

    if (activeLine === poemaSync.length - 1 && currentTime > poemaSync[activeLine].time + 5) {
        if (magicText.classList.contains('show')) {
            magicText.classList.remove('show');
            magicText.classList.add('fade-out');
        }
        setTimeout(triggerFinale, 1500);
    }
    requestAnimationFrame(checkLyrics);
}

// ===== FINAL =====
function triggerFinale() {
    if (finaleTriggered) return;
    finaleTriggered = true;
    bg3.classList.remove('active');
    bg4.classList.add('active');
    document.querySelectorAll('.realistic-lantern').forEach(l => l.style.opacity = '0');
    setTimeout(() => { handwrittenFinale.classList.add('show'); }, 3000);
}

// ===== LA SECUENCIA MAESTRA DE APERTURA =====
function startExperience() {
    startScreen.classList.remove('active');
    if (audioPoema && audioPoema.src) {
        audioPoema.play().catch(() => {});
    }
    isPlaying = true;
    lastTime = Date.now();
    virtualTime = 0;
    checkLyrics();
    for (let i = 0; i < 8; i++) {
        setTimeout(spawnLantern, i * 400);
    }
}

envelopeClick.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    // ── PASO 1: El sello se quema lentamente (1.2s) ──
    waxSeal.classList.add('burn');
    ribbonText.classList.add('hide');

    // ── PASO 1b: La solapa se abre después del sello (1.5s de transición) ──
    setTimeout(() => {
        envelopeFlap.classList.add('open');
    }, 800);

    // ── PASO 2: Polvo de hadas sale escalonadamente ──
    setTimeout(burstFairyDust, 1500);

    // ── PASO 3: Tarjeta se hace visible y sube lentamente (3s de transición) ──
    setTimeout(() => {
        card.classList.add('visible');
    }, 2000);

    setTimeout(() => {
        card.classList.add('slide-out');
    }, 2500);

    // ── PASO 3b: El sobre cae suavemente (2s de transición) ──
    setTimeout(() => {
        envelopeClick.classList.add('drop');
    }, 3500);

    // ── PASO 4: Escritura mágica letra por letra (M...e...y...l...i) ──
    setTimeout(() => {
        writeNameLetterByLetter(() => {
            // ── PASO 5: Después de admirar el nombre, la tarjeta se sumerge ──
            card.classList.add('submerge');

            // ── Entramos al Río Oscuro ──
            setTimeout(startExperience, 2500);
        });
    }, 5500);
});
