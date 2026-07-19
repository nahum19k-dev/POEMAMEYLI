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
const cardName = document.getElementById('card-name');
const poemContainer = document.getElementById('poem-container');
const fairyDustContainer = document.getElementById('fairy-dust-container');
const explosionContainer = document.getElementById('explosion-container');
const ribbonText = document.getElementById('ribbon-txt');
const startScreen = document.getElementById('start-screen');
const envelopeScene = document.querySelector('.envelope-scene');
const audioPoema = document.getElementById('audio-poema');
const lanternsContainer = document.getElementById('lanterns-container');
const bg1 = document.getElementById('bg-1');
const bg2 = document.getElementById('bg-2');
const bg3 = document.getElementById('bg-3');
const bg4 = document.getElementById('bg-4');
const handwrittenFinale = document.getElementById('handwritten-finale');

let finaleTriggered = false;
let opened = false;

// ===== POLVO DE HADAS (Apertura) =====
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
        }, i * 40);
    }
}

// ===== EVENTO PRINCIPAL (CLICK) =====
envelopeClick.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    // 0. Desbloquear audio silenciosamente
    audioPoema.volume = 0;
    audioPoema.play().then(() => {
        audioPoema.pause();
        audioPoema.volume = 1;
        audioPoema.currentTime = 0;
    }).catch(e => console.log('Autoplay requiere interacción más fuerte:', e));

    // 1. Quema el sello
    waxSeal.classList.add('burn');
    ribbonText.classList.add('hide');

    // 2. Solapa se abre
    setTimeout(() => { envelopeFlap.classList.add('open'); }, 800);

    // 3. Polvo de hadas
    setTimeout(burstFairyDust, 1500);

    // 4. Sube la carta
    setTimeout(() => { card.classList.add('visible'); }, 2000);
    setTimeout(() => { card.classList.add('slide-out'); }, 2500);

    // 5. El sobre cae
    setTimeout(() => { envelopeClick.classList.add('drop'); }, 3500);

    // 6. Escribe MEYLI
    setTimeout(() => { cardName.classList.add('write'); }, 4500);

    // 7. Empieza el Poema en la carta
    setTimeout(startPoemOnCard, 8000);
});

// ===== SECUENCIA DEL POEMA EN LA CARTA =====
function startPoemOnCard() {
    let audioStarted = false;
    
    // Intentar reproducir (ya debería estar desbloqueado)
    audioPoema.play().then(() => {
        audioStarted = true;
    }).catch((e) => {
        console.log('Audio bloqueado, usando temporizador de respaldo', e);
    });
    
    let currentLine = 0;
    let fallbackTime = 0;
    let lastTick = Date.now();
    
    const interval = setInterval(() => {
        let currentTime = 0;
        
        // Si el audio suena, sincronizar con él. Si no, usar tiempo simulado.
        if (audioStarted) {
            currentTime = audioPoema.currentTime;
        } else {
            const now = Date.now();
            fallbackTime += (now - lastTick) / 1000;
            lastTick = now;
            currentTime = fallbackTime;
        }
        
        // Escribir líneas en la carta
        if (currentLine < poemaSync.length && currentTime >= poemaSync[currentLine].time) {
            const p = document.createElement('p');
            p.className = 'poem-line';
            p.textContent = poemaSync[currentLine].text;
            poemContainer.appendChild(p);
            
            requestAnimationFrame(() => {
                p.classList.add('show');
                // Auto-scroll
                poemContainer.scrollTo({ top: poemContainer.scrollHeight, behavior: 'smooth' });
            });
            
            currentLine++;
        }

        // Final del poema (detonar explosión después de la última línea)
        if (currentTime >= 110 && !finaleTriggered) { // 110s es cuando termina de hablar
            finaleTriggered = true;
            clearInterval(interval);
            explodeCard();
        }
    }, 100);
}

// ===== LA EXPLOSIÓN =====
function explodeCard() {
    // 1. Quemar carta
    card.classList.add('burning');
    cardName.classList.add('smoke');
    document.querySelectorAll('.poem-line').forEach(p => p.classList.add('smoke'));

    // 2. Partículas y transición al bosque
    setTimeout(() => {
        createExplosionParticles(false); // Expansión
        
        envelopeScene.style.transition = 'opacity 1s';
        envelopeScene.style.opacity = '0'; // Desaparece sobre y carta
        
        lanternsContainer.classList.remove('hidden'); // Muestra bosque/luna
        startBackgroundSequence();

        // 3. Empieza reconstrucción después de 12 segundos de visión
        setTimeout(triggerReconstructionPhase, 12000); 
    }, 2500);
}

// ===== LA VISIÓN (FONDOS) =====
function startBackgroundSequence() {
    bg1.style.opacity = '1';
    // Cicla rápido por los fondos majestuosos
    setTimeout(() => { bg1.style.opacity = '0'; bg2.style.opacity = '1'; }, 4000);
    setTimeout(() => { bg2.style.opacity = '0'; bg3.style.opacity = '1'; }, 8000);
}

// ===== FASE DE RECONSTRUCCIÓN =====
function triggerReconstructionPhase() {
    // 1. Pergamino final flotando en el bosque
    handwrittenFinale.classList.remove('hidden');
    handwrittenFinale.style.animation = 'fadeIn 3s forwards';

    // 2. Reconstrucción inversa
    setTimeout(() => {
        handwrittenFinale.style.animation = 'fadeOut 2s forwards';
        lanternsContainer.style.transition = 'opacity 2s';
        lanternsContainer.style.opacity = '0'; // Adiós bosque

        createExplosionParticles(true); // Partículas succión

        setTimeout(() => {
            envelopeScene.style.opacity = '1';
            
            // Limpiar daños de la explosión
            card.classList.remove('burning');
            cardName.classList.remove('smoke');
            poemContainer.innerHTML = ''; 
            
            // Reconstruir
            card.classList.add('reconstruct');
            document.querySelector('.envelope').classList.add('reconstruct');

            // Guardar
            setTimeout(() => {
                card.classList.remove('slide-out');
                card.classList.add('slide-in');
                
                setTimeout(() => {
                    envelopeFlap.classList.remove('open');
                }, 2000);
            }, 4500);
            
        }, 1500);
    }, 5000); // 5 segundos leyendo el final
}

// ===== SISTEMA DE PARTÍCULAS (Explosión) =====
function createExplosionParticles(reverse) {
    explosionContainer.innerHTML = '';
    const numParticles = 200;
    const colors = ['#ffcc00', '#ff6600', '#ff3300', '#ffffff', '#ffd700'];

    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.className = 'explosion-particle';
        
        const size = Math.random() * 6 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * window.innerWidth;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        explosionContainer.appendChild(p);

        if (reverse) {
            // Succión
            p.animate([
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${Math.random()})`, opacity: 0 },
                { opacity: 1, offset: 0.2 },
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 1500,
                easing: 'cubic-bezier(0.2, 0, 0.8, 1)',
                fill: 'forwards'
            });
        } else {
            // Expansión
            p.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 2000,
                easing: 'cubic-bezier(0.2, 1, 0.3, 1)',
                fill: 'forwards'
            });
        }
    }
}
