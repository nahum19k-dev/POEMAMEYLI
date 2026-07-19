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

// ===== ELEMENTOS DOM =====
const envelopeBtn = document.getElementById('envelope-btn');
const foldedParchment = document.getElementById('folded-parchment');
const fairyDustContainer = document.getElementById('fairy-dust-container');
const liveWritingText = document.querySelector('.live-writing-text');
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

// ===== POLVO DE HADAS (Efecto Sorpresa) =====
function burstFairyDust() {
    for (let i = 0; i < 40; i++) {
        const dust = document.createElement('div');
        dust.classList.add('fairy-dust');
        
        // Randomizar dirección de explosión
        const tx = (Math.random() - 0.5) * 800 + 'px';
        const ty = (Math.random() - 0.5) * 800 + 'px';
        dust.style.setProperty('--tx', tx);
        dust.style.setProperty('--ty', ty);
        
        const duration = Math.random() * 1.5 + 0.5;
        dust.style.animation = `fairyExplode ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
        
        fairyDustContainer.appendChild(dust);
        
        setTimeout(() => {
            if(dust.parentNode) dust.parentNode.removeChild(dust);
        }, duration * 1000);
    }
}

// ===== MOTOR DE FAROLES HIPERREALISTAS =====
function spawnRealisticLantern() {
    if (!isPlaying || finaleTriggered) return;

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
    if (index === 8) { 
        bg1.classList.remove('active');
        bg2.classList.add('active');
    } else if (index === 16) { 
        bg2.classList.remove('active');
        bg3.classList.add('active');
    }
}

// ===== SINCRONIZADOR DE LETRAS =====
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
    
    // El Gran Final Poético
    if (activeLine === poemaSync.length - 1 && currentTime > poemaSync[activeLine].time + 5) {
        if (magicText.classList.contains('show')) {
            magicText.classList.remove('show');
            magicText.classList.add('fade-out');
        }
        setTimeout(triggerPoeticFinale, 1500);
    }
    
    requestAnimationFrame(checkLyrics);
}

// ===== GRAN FINAL POETICO (CINE CLASICO) =====
function triggerPoeticFinale() {
    if (finaleTriggered) return;
    finaleTriggered = true;
    
    bg3.classList.remove('active');
    bg4.classList.add('active'); 
    
    const lanterns = document.querySelectorAll('.realistic-lantern');
    lanterns.forEach(l => l.style.opacity = '0');
    
    setTimeout(() => {
        handwrittenFinale.classList.add('show');
    }, 3000); 
}

// ===== LA GRAN SECUENCIA DE APERTURA (5 EFECTOS) =====
envelopeBtn.addEventListener('click', () => {
    // 1. El Clic: El sobre cae, el sello de cera estalla en fuego (Clase .drop en CSS)
    envelopeBtn.classList.add('drop');
    
    // 2. Magia: Estallido de polvo de hadas saliendo del sobre
    setTimeout(burstFairyDust, 200);
    
    // 3. Papel 3D: Sale del sobre y se desdobla
    setTimeout(() => {
        foldedParchment.classList.add('slide-out');
    }, 500);

    setTimeout(() => {
        foldedParchment.classList.add('unfold');
    }, 1500);

    // 4. Escritura en tiempo real (Tinta de oro)
    setTimeout(() => {
        liveWritingText.classList.add('write');
    }, 3000); // Se escribe después de estar desdoblado
    
    // 5. El zoom in final hacia el poema
    setTimeout(() => {
        foldedParchment.classList.add('zoom-in');
    }, 6000); // 3 seg para desdoblar + 2.5s para escribir
    
    // Entrando al Río Oscuro
    setTimeout(() => {
        startScreen.classList.remove('active');
        
        if(audioPoema && audioPoema.src) {
            audioPoema.play().catch(e => console.log("Modo virtual sin audio"));
        }
        
        isPlaying = true;
        lastTime = Date.now();
        virtualTime = 0;
        checkLyrics();
        
        for(let i=0; i<8; i++) {
            setTimeout(spawnRealisticLantern, i * 400);
        }
    }, 7800);
});
