// ===== ACRÓSTICO =====
const poemParagraphs = [
    "Más de una vez me pregunté qué era esa calma,<br>esa sensación extraña de sentir que ya te conocía,<br>como si algo en el universo le dijera a mi alma<br>que ibas a llegar, y que la espera valdría.",
    "Eres de esas personas difíciles de ignorar,<br>de las que sin querer se meten en el pecho,<br>y cuando intentas dejar de pensar<br>ya tienen en tu mente un sitio hecho.",
    "Yo podría pasarme la noche entera escuchándote,<br>tu voz es la melodía más hermosa,<br>tu hermana diría que es odiosa,<br>pero yo me quedo con que eres una diosa.",
    "Llevo contando los días desde que no te veo,<br>y volverte a verte es mi mayor anhelo,<br>espero que tú sientas lo mismo que yo creo,<br>porque sin ti el tiempo vuela sin consuelo.",
    "Imagino el día en que volvamos a vernos,<br>y no tengo palabras, solo tengo certeza,<br>hay algo en ti que no termino de descubrir,<br>y si el universo concede esa belleza,<br>quiero ser esa persona que te hace sonreír."
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
const audioFondo = document.getElementById('audio-fondo');
const audioPoema = document.getElementById('audio-poema');
const lanternsContainer = document.getElementById('lanterns-container');
const bg1 = document.getElementById('bg-1');
const bg2 = document.getElementById('bg-2');
const bg3 = document.getElementById('bg-3');
const bg4 = document.getElementById('bg-4');
const btnCloseCard = document.getElementById('btn-close-card');

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

    // Reproducir música de fondo suave
    audioFondo.volume = 1;
    audioFondo.play().catch(e => console.log('Autoplay bloqueado (Fondo):', e));

    // Desbloquear audio principal en el navegador (Lo pausamos inmediatamente para usarlo después)
    audioPoema.volume = 0;
    audioPoema.play().then(() => {
        audioPoema.pause();
        audioPoema.currentTime = 0;
        audioPoema.volume = 1;
    }).catch(e => console.log('Autoplay bloqueado (Voz):', e));

    // 1. Quema el sello y abre solapa
    waxSeal.classList.add('burn');
    ribbonText.classList.add('hide');
    setTimeout(() => { envelopeFlap.classList.add('open'); }, 800);

    // 2. Polvo de hadas y sube la carta (Bolsillo)
    setTimeout(burstFairyDust, 1500);
    setTimeout(() => { card.style.opacity = '1'; }, 2000);
    setTimeout(() => { 
        card.classList.add('slide-out'); 
        document.querySelector('.envelope-wrapper').classList.add('shift-down');
    }, 2500);

    // 3. El sobre cae
    setTimeout(() => { envelopeClick.classList.add('drop'); }, 3500);

    // 4. Escribe MEYLI
    setTimeout(() => { cardName.classList.add('write'); }, 4500);

    // 5. Empieza el poema lento sobre la carta
    setTimeout(startSlowPoemOnCard, 7000);
});

// ===== POEMA LENTO EN LA CARTA =====
function startSlowPoemOnCard() {
    poemContainer.innerHTML = '<div class="full-poem-text" id="full-poem-text-container"></div>';
    const textContainer = document.getElementById('full-poem-text-container');

    const topOrnament = document.createElement('div');
    topOrnament.className = 'ornament';
    topOrnament.innerHTML = '⊱ ♥ ⊰';
    textContainer.appendChild(topOrnament);
    
    setTimeout(() => topOrnament.classList.add('show'), 1000);

    let currentPara = 0;
    let lastTick = Date.now();
    
    // Tiempos ultra rápidos para que la carta no demore (6 segundos total)
    const dynamicTimes = [0.5, 1.5, 2.5, 3.5, 4.5];
    
    const interval = setInterval(() => {
        const currentTime = (Date.now() - lastTick) / 1000;

        // Mostrar párrafos 1 a 1 de forma lenta según el tiempo dinámico
        if (currentPara < poemParagraphs.length && currentTime >= dynamicTimes[currentPara]) {
            
            // Añadir el divisor antes de cada párrafo (excepto el primero)
            if (currentPara > 0) {
                const divider = document.createElement('div');
                divider.className = 'divider-heart';
                divider.innerHTML = '<span>♥</span>';
                textContainer.appendChild(divider);
                requestAnimationFrame(() => {
                    divider.classList.add('show');
                    divider.style.opacity = '1';
                    divider.style.transform = 'translateY(0)';
                });
            }

            const p = document.createElement('p');
            p.className = 'poem-line';
            
            // Resaltar acróstico
            const firstLetter = poemParagraphs[currentPara].charAt(0);
            const restOfText = poemParagraphs[currentPara].slice(1);
            p.innerHTML = `<span class="acrostic-letter">${firstLetter}</span>${restOfText}`;
            
            textContainer.appendChild(p);
            requestAnimationFrame(() => {
                p.classList.add('show');
            });
            currentPara++;

            // Si es el último párrafo, añadir adorno final poco después
            if (currentPara === poemParagraphs.length) {
                setTimeout(() => {
                    const bottomOrnament = document.createElement('div');
                    bottomOrnament.className = 'ornament';
                    bottomOrnament.innerHTML = '⊱ ♥ ⊰';
                    textContainer.appendChild(bottomOrnament);
                    requestAnimationFrame(() => bottomOrnament.classList.add('show'));
                }, 3000);
            }
        }

        // Final del poema detona explosión automáticamente a los 6 segundos
        if (currentTime >= 6.0 && !finaleTriggered) { 
            finaleTriggered = true;
            clearInterval(interval);
            explodeCardIntoSquares();
        }
    }, 100);
}

// ===== LA EXPLOSIÓN EN CUADRITOS Y EL PORTAL =====
function explodeCardIntoSquares() {
    // 1. Quemar carta brevemente
    card.classList.add('burning');
    cardName.classList.add('smoke');
    poemContainer.classList.add('smoke');

    // 2. Explosión inmersiva (nos sumergimos al fondo)
    setTimeout(() => {
        createSquareParticles(false); // Expansión masiva de cuadritos
        
        card.classList.add('submerge'); // La carta viene hacia la cámara y desaparece
        
        setTimeout(() => {
            envelopeScene.style.display = 'none'; // Desaparece la escena
            startScreen.classList.remove('active'); // Elimina el overlay oscuro del principio
            startScreen.style.display = 'none'; // Forza a quitar el blur que se bugea en celulares
            
            // Elimina la capa de sombra del agua para que los fondos se vean súper brillantes y claros
            const waterOverlay = document.getElementById('water-overlay');
            if (waterOverlay) waterOverlay.style.opacity = '0';
        }, 1000);
        
        // Cambiar fondos mágicos en el bosque
        lanternsContainer.classList.remove('hidden');
        bg1.style.opacity = '1';
        
        // Detiene la música instrumental
        audioFondo.pause();
        
        // Empieza a sonar tu voz justo cuando aparece la laguna (bg2 / bosque)
        audioPoema.volume = 1;
        audioPoema.currentTime = 0;
        audioPoema.play().catch(e => console.log('Audio error:', e));

        setTimeout(() => { bg1.style.opacity = '0'; bg2.style.opacity = '1'; }, 4000);
        setTimeout(() => { bg2.style.opacity = '0'; bg3.style.opacity = '1'; }, 8000);
        setTimeout(() => { bg3.style.opacity = '0'; bg4.style.opacity = '1'; }, 12000);
        
        // Empiezan los faroles
        for (let i = 0; i < 8; i++) {
            setTimeout(spawnLantern, i * 400);
        }
        
        // Cuando tu voz termina de hablar, aparece el texto final escrito a mano
        audioPoema.onended = () => {
            const finale = document.getElementById('handwritten-finale');
            finale.classList.add('show');
        };

        // Fallback por si acaso el navegador bloqueó completamente el audio
        setTimeout(() => {
            const finale = document.getElementById('handwritten-finale');
            if (!finale.classList.contains('show')) {
                finale.classList.add('show');
            }
        }, Math.max((audioPoema.duration || 30) * 1000 + 1000, 25000));
        
    }, 1500);
}



// ===== BOTÓN CERRAR =====
btnCloseCard.addEventListener('click', () => {
    btnCloseCard.classList.add('hidden');
    
    // Romper en cuadritos de nuevo (opcional, o simplemente se guarda)
    createSquareParticles(false);
    card.classList.add('burning');
    
    setTimeout(() => {
        card.classList.remove('burning');
        // La carta cae devuelta al bolsillo
        card.style.transform = 'translate(-50%, 110%)'; 
        card.style.opacity = '0'; 
        
        setTimeout(() => {
            envelopeFlap.classList.remove('open');
        }, 2000);
    }, 1500);
});

// ===== SISTEMA DE CUADRITOS (Explosión) =====
function createSquareParticles(reverse) {
    explosionContainer.innerHTML = '';
    const numParticles = 250; // Más partículas
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
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${Math.random()}) rotate(${Math.random()*360}deg)`, opacity: 0 },
                { opacity: 1, offset: 0.2 },
                { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 1500,
                easing: 'cubic-bezier(0.2, 0, 0.8, 1)',
                fill: 'forwards'
            });
        } else {
            // Expansión masiva hacia la cámara
            p.animate([
                { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(10) rotate(${Math.random()*360}deg)`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 2000,
                easing: 'cubic-bezier(0.2, 1, 0.3, 1)',
                fill: 'forwards'
            });
        }
    }
}
