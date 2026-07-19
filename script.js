// ===== CONFIGURACION DEL POEMA Y TIEMPOS =====
// Tiempos estimados (en segundos). Deberás ajustarlos según lo que dure tu voz.
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
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const audioPoema = document.getElementById('audio-poema');
const magicText = document.getElementById('magic-text');
const lanternsContainer = document.getElementById('lanterns-container');

let isPlaying = false;
let currentLineIndex = -1;

// ===== MOTOR DE FAROLES HIPERREALISTAS =====
function spawnRealisticLantern() {
    if (!isPlaying) return;

    const lantern = document.createElement('div');
    lantern.classList.add('realistic-lantern');
    
    // Configuracion aleatoria
    const size = Math.random() * 60 + 40; // Tamaño en pixeles (entre 40 y 100)
    const leftPos = Math.random() * 90; // Posición horizontal (0% a 90%)
    const duration = Math.random() * 15 + 20; // Tiempo en subir (20s a 35s)
    const delay = Math.random() * 2;
    
    lantern.style.width = size + 'px';
    lantern.style.height = (size * 1.5) + 'px'; // Mantiene proporcion
    lantern.style.left = leftPos + '%';
    lantern.style.bottom = '-150px'; // Empieza debajo de la pantalla
    
    lantern.style.animationDuration = duration + 's';
    lantern.style.animationDelay = delay + 's';
    
    lanternsContainer.appendChild(lantern);
    
    // Eliminar del DOM cuando termine la animacion para no saturar la memoria
    setTimeout(() => {
        if(lantern.parentNode) {
            lantern.parentNode.removeChild(lantern);
        }
    }, (duration + delay) * 1000);

    // Llamar al siguiente farol
    setTimeout(spawnRealisticLantern, Math.random() * 1500 + 500);
}

// Sincronizador de Audio
function checkLyrics() {
    if (!isPlaying || !audioPoema) return;
    
    let currentTime = audioPoema.currentTime;
    let activeLine = -1;
    
    for (let i = 0; i < poemaSync.length; i++) {
        if (currentTime >= poemaSync[i].time) {
            activeLine = i;
        }
    }
    
    if (activeLine !== currentLineIndex && activeLine !== -1) {
        currentLineIndex = activeLine;
        
        // Efecto cinematográfico de desvanecimiento
        magicText.classList.remove('show');
        setTimeout(() => {
            magicText.textContent = poemaSync[currentLineIndex].text;
            magicText.classList.add('show');
        }, 800); 
    }
    
    // Ocultar al final de todo
    if (activeLine === poemaSync.length - 1 && currentTime > poemaSync[activeLine].time + 6) {
        magicText.classList.remove('show');
    }
    
    requestAnimationFrame(checkLyrics);
}

// ===== INICIO =====
startBtn.addEventListener('click', () => {
    startScreen.classList.remove('active');
    
    if(audioPoema.src) {
        audioPoema.play().catch(e => console.log("Falta el audio o no puede iniciar", e));
    }
    
    isPlaying = true;
    checkLyrics();
    
    // Lanzar primeros faroles en masa
    for(let i=0; i<8; i++) {
        setTimeout(spawnRealisticLantern, i * 400);
    }
});
