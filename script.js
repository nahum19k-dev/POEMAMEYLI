// ===== ACRÓSTICO =====
const acrosticSync = [
    { time: 2.0, text: "Más de una vez me pregunté qué era esa calma,<br>esa sensación extraña de sentir que ya te conocía,<br>como si algo en el universo le dijera a mi alma<br>que ibas a llegar, y que la espera valdría." },
    { time: 24.0, text: "Eres de esas personas difíciles de ignorar,<br>de las que sin querer se meten en el pecho,<br>y cuando intentas dejar de pensar<br>ya tienen en tu mente un sitio hecho." },
    { time: 48.0, text: "Yo podría pasarme la noche entera escuchándote,<br>tu voz es la melodía más hermosa,<br>tu hermana diría que es odiosa,<br>pero yo me quedo con que eres una diosa." },
    { time: 72.0, text: "Llevo contando los días desde que no te veo,<br>y volverte a verte es mi mayor anhelo,<br>espero que tú sientas lo mismo que yo creo,<br>porque sin ti el tiempo vuela sin consuelo." },
    { time: 96.0, text: "Imagino el día en que volvamos a vernos,<br>y no tengo palabras, solo tengo certeza,<br>hay algo en ti que no termino de descubrir,<br>y si el universo concede esa belleza,<br>quiero ser esa persona que te hace sonreír." }
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
const magicText = document.getElementById('magic-text');
const bg1 = document.getElementById('bg-1');
const bg2 = document.getElementById('bg-2');
const bg3 = document.getElementById('bg-3');
const bg4 = document.getElementById('bg-4');
const handwrittenFinale = document.getElementById('handwritten-finale');

let finaleTriggered = false;
let opened = false;
let audioStarted = false;

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

// ===== FAROLES DEL BOSQUE =====
function spawnLantern() {
    if (finaleTriggered) return;
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

// ===== EVENTO PRINCIPAL (CLICK) =====
envelopeClick.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    // Desbloquear audio silenciosamente
    audioPoema.volume = 0;
    audioPoema.play().then(() => {
        audioPoema.pause();
        audioPoema.volume = 1;
        audioPoema.currentTime = 0;
    }).catch(e => console.log('Autoplay requiere interacción:', e));

    // 1. Quema el sello y abre solapa
    waxSeal.classList.add('burn');
    ribbonText.classList.add('hide');
    setTimeout(() => { envelopeFlap.classList.add('open'); }, 800);

    // 2. Polvo de hadas y sube la carta (Bolsillo)
    setTimeout(burstFairyDust, 1500);
    setTimeout(() => { card.style.opacity = '1'; }, 2000);
    setTimeout(() => { card.classList.add('slide-out'); }, 2500);

    // 3. El sobre cae
    setTimeout(() => { envelopeClick.classList.add('drop'); }, 3500);

    // 4. Escribe MEYLI
    setTimeout(() => { cardName.classList.add('write'); }, 4500);

    // 5. Destello rápido del poema en la carta
    setTimeout(flashAcrosticOnCard, 6000);
});

// ===== DESTELLO DEL ACRÓSTICO EN LA CARTA =====
function flashAcrosticOnCard() {
    // Ponemos todo el poema de golpe, muy rápido
    acrosticSync.forEach((para, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = 'poem-line';
            p.innerHTML = para.text;
            poemContainer.appendChild(p);
            requestAnimationFrame(() => {
                p.classList.add('show');
                poemContainer.scrollTo({ top: poemContainer.scrollHeight, behavior: 'smooth' });
            });
        }, index * 400); // 400ms por párrafo, súper rápido
    });

    // 6. Tan pronto termina de imprimirse rápido, ¡EXPLOTA!
    setTimeout(explodeCard, 2800); 
}

// ===== LA EXPLOSIÓN Y EL PORTAL =====
function explodeCard() {
    // 1. Quemar carta brevemente
    card.classList.add('burning');
    cardName.classList.add('smoke');
    document.querySelectorAll('.poem-line').forEach(p => p.classList.add('smoke'));

    // 2. Explosión inmersiva (nos sumergimos)
    setTimeout(() => {
        createExplosionParticles(false); // Expansión masiva
        
        card.classList.add('submerge'); // La carta viene hacia la cámara y se desvanece
        
        setTimeout(() => {
            envelopeScene.style.display = 'none'; // Desaparece la escena inicial
        }, 1000);
        
        lanternsContainer.classList.remove('hidden'); // Revela el bosque
        
        // Empiezan los faroles
        for (let i = 0; i < 8; i++) {
            setTimeout(spawnLantern, i * 400);
        }
        
        // 3. Empieza el viaje y el audio en el bosque
        setTimeout(startForestPoem, 2000); 
    }, 1500);
}

// ===== EL VIAJE EN EL BOSQUE (LECTURA DEL POEMA) =====
function startForestPoem() {
    // Cambiar fondos lentamente
    bg1.style.opacity = '1';
    setTimeout(() => { bg1.style.opacity = '0'; bg2.style.opacity = '1'; }, 30000);
    setTimeout(() => { bg2.style.opacity = '0'; bg3.style.opacity = '1'; }, 60000);
    setTimeout(() => { bg3.style.opacity = '0'; bg4.style.opacity = '1'; }, 90000);

    // Reproducir audio
    audioPoema.play().then(() => {
        audioStarted = true;
    }).catch((e) => {
        console.log('Audio bloqueado, usando temporizador', e);
    });

    let currentPara = 0;
    let fallbackTime = 0;
    let lastTick = Date.now();
    
    const interval = setInterval(() => {
        let currentTime = 0;
        
        if (audioStarted) {
            currentTime = audioPoema.currentTime;
        } else {
            const now = Date.now();
            fallbackTime += (now - lastTick) / 1000;
            lastTick = now;
            currentTime = fallbackTime;
        }

        // Mostrar párrafos en el centro de la pantalla (magicText)
        if (currentPara < acrosticSync.length && currentTime >= acrosticSync[currentPara].time) {
            showText(acrosticSync[currentPara].text);
            currentPara++;
        }

        // Final del poema (115s aprox)
        if (currentTime >= 115 && !finaleTriggered) { 
            finaleTriggered = true;
            clearInterval(interval);
            magicText.style.opacity = '0';
            triggerReconstructionPhase();
        }
    }, 100);
}

function showText(htmlText) {
    magicText.style.opacity = '0';
    magicText.style.transform = 'translate(-50%, 20px)';
    
    setTimeout(() => {
        magicText.innerHTML = htmlText; // Usamos innerHTML por los <br>
        magicText.style.opacity = '1';
        magicText.style.transform = 'translate(-50%, -50%)';
    }, 1200);
}

// ===== FASE DE RECONSTRUCCIÓN =====
function triggerReconstructionPhase() {
    // 1. Pergamino final flotando en el bosque
    setTimeout(() => {
        handwrittenFinale.classList.remove('hidden');
        handwrittenFinale.style.animation = 'fadeIn 3s forwards';
    }, 1000);

    // 2. Reconstrucción inversa
    setTimeout(() => {
        handwrittenFinale.style.animation = 'fadeOut 2s forwards';
        lanternsContainer.style.transition = 'opacity 2s';
        lanternsContainer.style.opacity = '0'; // Adiós bosque

        createExplosionParticles(true); // Partículas succión

        setTimeout(() => {
            envelopeScene.style.display = 'flex';
            envelopeScene.style.opacity = '0';
            
            // Limpiar daños de la explosión
            card.classList.remove('burning', 'submerge', 'slide-out');
            cardName.classList.remove('smoke');
            poemContainer.innerHTML = ''; 
            
            // Reconstruir
            card.classList.add('reconstruct');
            document.querySelector('.envelope').classList.add('reconstruct');
            
            // Aparece de nuevo
            setTimeout(() => {
                envelopeScene.style.opacity = '1';
                
                // Guardar
                setTimeout(() => {
                    // La carta cae devuelta al bolsillo
                    card.style.transform = 'translate(-50%, 110%)'; 
                    card.style.opacity = '0'; // Se esconde en el bolsillo
                    
                    setTimeout(() => {
                        envelopeFlap.classList.remove('open');
                    }, 2000);
                }, 4000);
            }, 100);
            
        }, 1500);
    }, 6000); // 6 segundos leyendo "Para siempre, tuyo"
}

// ===== SISTEMA DE PARTÍCULAS (Explosión) =====
function createExplosionParticles(reverse) {
    explosionContainer.innerHTML = '';
    const numParticles = 200;
    const colors = ['#ffcc00', '#ff6600', '#ff3300', '#ffffff', '#ffd700'];

    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.className = 'explosion-particle';
        
        const size = Math.random() * 8 + 3;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * window.innerWidth * 1.5;
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
            // Expansión masiva hacia la cámara
            p.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(10)`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 2000,
                easing: 'cubic-bezier(0.2, 1, 0.3, 1)',
                fill: 'forwards'
            });
        }
    }
}
