// ===== CONFIGURACION DEL POEMA Y TIEMPOS =====
const poemaSync = [
    { time: 2.0,  text: "Hay personas que llegan como llega la marea," },
    { time: 5.5,  text: "sin avisar, sin ruido, sin pedir permiso," },
    { time: 9.0,  text: "y cuando quieres darte cuenta ya te rodean," },
    { time: 13.0, text: "y el mundo sin ellas ya no tiene el mismo piso." },
    
    { time: 18.0, text: "Tú llegaste así, Meyli, sin hacer escándalo," },
    { time: 22.0, text: "con esa mirada que no sabe disimular," },
    { time: 26.0, text: "con esa voz que el silencio vuelve un regalo," },
    { time: 30.0, text: "y esa forma de ser que no puedo evitar." },
    
    // Aquí el fondo cambia al Bosque Encantado
    { time: 36.0, text: "No sé cómo explicar lo que genera tu presencia," },
    { time: 40.5, text: "esa calma extraña de sentir que ya te conocía," },
    { time: 45.0, text: "como si el tiempo antes de ti fuera una ausencia," },
    { time: 49.5, text: "y tú fueras la razón por la que el alma sonreía." },
    
    { time: 55.0, text: "Dicen que hay personas que no se encuentran, se eligen," },
    { time: 59.5, text: "yo creo que a veces el destino simplemente sabe," },
    { time: 64.0, text: "y nos pone frente a frente a los que se dirigen," },
    { time: 68.5, text: "hacia algo que todavía no tiene nombre pero ya se sabe." },
    
    // Aquí el fondo cambia al Amanecer Romántico
    { time: 75.0, text: "Y mientras llega el día en que volvamos a vernos," },
    { time: 79.5, text: "cuento las horas con una impaciencia que no miento," },
    { time: 84.0, text: "porque anhelar tus ojos es de los sentimientos" },
    { time: 88.5, text: "más honestos que he tenido en mucho tiempo." },
    
    { time: 94.0, text: "No tengo más palabras, solo tengo esta certeza:" },
    { time: 98.5, text: "que hay algo en ti que no quiero dejar de descubrir," },
    { time: 103.0, text: "y si el universo me da el tiempo y la destreza," },
    { time: 107.5, text: "me gustaría ser esa persona que te hace sonreír." }
];

// ===== ELEMENTOS DOM =====
const envelopeBtn = document.getElementById('envelope-btn');
const startScreen = document.getElementById('start-screen');
const audioPoema = document.getElementById('audio-poema');
const magicText = document.getElementById('magic-text');
const lanternsContainer = document.getElementById('lanterns-container');

const bg1 = document.getElementById('bg-1'); // Río
const bg2 = document.getElementById('bg-2'); // Bosque Encantado
const bg3 = document.getElementById('bg-3'); // Amanecer

let isPlaying = false;
let currentLineIndex = -1;
let virtualTime = 0;
let lastTime = 0;

// ===== MOTOR DE FAROLES HIPERREALISTAS =====
function spawnRealisticLantern() {
    if (!isPlaying) return;

    const lantern = document.createElement('div');
    lantern.classList.add('realistic-lantern');
    
    const size = Math.random() * 60 + 40;
    const leftPos = Math.random() * 90; 
    const duration = Math.random() * 15 + 20; 
    const delay = Math.random() * 2;
    
    lantern.style.width = size + 'px';
    lantern.style.height = (size * 1.5) + 'px'; 
    lantern.style.left = leftPos + '%';
    lantern.style.bottom = '-150px'; 
    
    lantern.style.animationDuration = duration + 's';
    lantern.style.animationDelay = delay + 's';
    
    lanternsContainer.appendChild(lantern);
    
    setTimeout(() => {
        if(lantern.parentNode) {
            lantern.parentNode.removeChild(lantern);
        }
    }, (duration + delay) * 1000);

    setTimeout(spawnRealisticLantern, Math.random() * 1500 + 500);
}

// ===== MANEJADOR DE FONDOS MAGICO =====
function updateBackgrounds(index) {
    if (index === 8) { // Transición al Bosque Encantado
        bg1.classList.remove('active');
        bg2.classList.add('active');
    } else if (index === 16) { // Transición al Amanecer Épico
        bg2.classList.remove('active');
        bg3.classList.add('active');
    }
}

// ===== SINCRONIZADOR Y EFECTOS MAGICOS DE LETRAS =====
function checkLyrics() {
    if (!isPlaying) return;
    
    let currentTime = 0;
    
    if (audioPoema && audioPoema.duration > 0 && !audioPoema.paused) {
        currentTime = audioPoema.currentTime;
    } else {
        let now = Date.now();
        virtualTime += (now - lastTime) / 1000;
        lastTime = now;
        currentTime = virtualTime;
    }
    
    let activeLine = -1;
    for (let i = 0; i < poemaSync.length; i++) {
        if (currentTime >= poemaSync[i].time) {
            activeLine = i;
        }
    }
    
    if (activeLine !== currentLineIndex && activeLine !== -1) {
        currentLineIndex = activeLine;
        
        // 1. Desvanecer mágicamente la frase anterior
        if (magicText.classList.contains('show')) {
            magicText.classList.remove('show');
            magicText.classList.add('fade-out');
        }
        
        // 2. Revisar si toca cambio de fondo
        updateBackgrounds(currentLineIndex);
        
        // 3. Mostrar la nueva frase tras el desvanecimiento
        setTimeout(() => {
            magicText.textContent = poemaSync[currentLineIndex].text;
            magicText.classList.remove('fade-out');
            magicText.classList.add('show');
        }, 1200); 
    }
    
    // Ocultar al final de todo
    if (activeLine === poemaSync.length - 1 && currentTime > poemaSync[activeLine].time + 6) {
        magicText.classList.remove('show');
        magicText.classList.add('fade-out');
    }
    
    requestAnimationFrame(checkLyrics);
}

// ===== INTERACCION: DESATAR EL LAZO =====
envelopeBtn.addEventListener('click', () => {
    // 1. Animación Mágica de disolución
    envelopeBtn.classList.add('open');
    
    // 2. Empieza la experiencia inmersiva
    setTimeout(() => {
        startScreen.classList.remove('active');
        
        if(audioPoema && audioPoema.src) {
            audioPoema.play().catch(e => console.log("Modo virtual sin audio"));
        }
        
        isPlaying = true;
        lastTime = Date.now();
        virtualTime = 0;
        checkLyrics();
        
        // Lanzar faroles
        for(let i=0; i<8; i++) {
            setTimeout(spawnRealisticLantern, i * 400);
        }
    }, 1500);
});
