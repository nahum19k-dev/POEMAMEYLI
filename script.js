// ===== CONFIGURACION DEL POEMA Y TIEMPOS =====
// Aquí pondrás el texto de tu poema y en qué segundo exacto quieres que aparezca.
const poemaSync = [
    { time: 2.0, text: "A veces me pregunto..." },
    { time: 5.5, text: "cómo es que en tan poco tiempo te volviste tan importante." },
    { time: 10.0, text: "Tus ojos tienen una luz especial," },
    { time: 14.5, text: "como si escondieran mil constelaciones." },
    { time: 19.0, text: "Este pequeño detalle es solo para ti," },
    { time: 23.5, text: "para que sepas lo mucho que pienso en ti." },
    { time: 28.0, text: "Meyli, eres mi estrella favorita." }
];

// ===== ELEMENTOS DOM =====
const canvas = document.getElementById('magic-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const audioPoema = document.getElementById('audio-poema');
const magicText = document.getElementById('magic-text');

let width, height;
let time = 0;
let isPlaying = false;
let currentLineIndex = -1;

// Arrays para objetos gráficos
let stars = [];
let lanterns = [];
const NUM_STARS = 150;

// ===== AJUSTE DE PANTALLA (DPR para celulares) =====
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initStars();
}
window.addEventListener('resize', resize);

// ===== CLASES GRÁFICAS =====
class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.7; // Solo en la parte superior (cielo)
        this.size = Math.random() * 1.5;
        this.alpha = Math.random();
        this.speed = (Math.random() * 0.02) + 0.005;
    }
    update() {
        this.alpha += Math.sin(time * this.speed) * 0.02;
        if(this.alpha > 1) this.alpha = 1;
        if(this.alpha < 0.1) this.alpha = 0.1;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Lantern {
    constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || height + 50;
        this.size = Math.random() * 8 + 12; // Tamaño del farol
        this.speedY = -(Math.random() * 0.8 + 0.5); // Sube
        this.speedX = Math.random() * 0.4 - 0.2; // Viento
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        this.flicker = Math.random();
    }
    update() {
        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5 + this.speedX;
        this.flicker = 0.7 + Math.random() * 0.3; // Parpadeo de fuego
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Brillo (Glow)
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 3);
        glow.addColorStop(0, `rgba(255, 218, 117, ${this.flicker * 0.6})`);
        glow.addColorStop(1, 'rgba(255, 218, 117, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Cuerpo del farol (forma de cilindro ovalado)
        ctx.fillStyle = `rgba(255, 200, 80, ${this.flicker})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.7, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Base oscura
        ctx.fillStyle = 'rgba(50, 20, 10, 0.8)';
        ctx.fillRect(-this.size*0.5, this.size*0.8, this.size, this.size*0.2);

        ctx.restore();
    }
}

function initStars() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
        stars.push(new Star());
    }
}

// Generador de faroles automatico
function spawnLantern() {
    if (isPlaying) {
        lanterns.push(new Lantern());
    }
    // Tiempo aleatorio entre 0.5 y 2 segundos para el proximo farol
    setTimeout(spawnLantern, Math.random() * 1500 + 500);
}

// ===== MOTOR DE RENDERIZADO =====
function drawWaterReflection() {
    const horizon = height * 0.65; // El horizonte del rio
    
    // Gradiente del agua (oscuro en el horizonte, mas claro abajo)
    const waterGrad = ctx.createLinearGradient(0, horizon, 0, height);
    waterGrad.addColorStop(0, '#0a0d24');
    waterGrad.addColorStop(1, '#02030a');
    
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, horizon, width, height - horizon);

    // Reflejo de la luna (centro)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for(let i=0; i<20; i++) {
        let waveY = horizon + (i * 15);
        let waveWidth = 200 - (i*5) + Math.sin(time*0.05 + i)*20;
        let waveX = width/2 - waveWidth/2 + Math.sin(time*0.02 + i)*10;
        ctx.fillRect(waveX, waveY, waveWidth, 2);
    }
    
    // Reflejos de los faroles en el agua
    lanterns.forEach(l => {
        // Solo reflejar si estan cerca del horizonte
        if(l.y > horizon - 300) {
            let reflectionY = horizon + (horizon - l.y) * 0.5; // Distorsión de distancia
            if (reflectionY > horizon && reflectionY < height) {
                let alpha = (l.y / horizon) * 0.3; // Mas lejos = menos brillante
                if(alpha < 0) alpha = 0;
                
                ctx.fillStyle = `rgba(255, 218, 117, ${alpha * l.flicker})`;
                let waveWidth = l.size * 2 + Math.sin(time*0.1 + l.x)*5;
                ctx.fillRect(l.x - waveWidth/2, reflectionY, waveWidth, 3);
            }
        }
    });
}

function animate() {
    // Fondo oscuro con trazo semi-transparente para dar suavidad (motion blur)
    ctx.fillStyle = 'rgba(3, 4, 12, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Dibujar luna
    const moonGrad = ctx.createRadialGradient(width/2, height*0.4, 0, width/2, height*0.4, 150);
    moonGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    moonGrad.addColorStop(0.2, 'rgba(255, 245, 220, 0.4)');
    moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(width/2, height*0.4, 150, 0, Math.PI * 2);
    ctx.fill();

    // Dibujar estrellas
    stars.forEach(s => { s.update(); s.draw(); });

    // Dibujar reflejos de agua
    drawWaterReflection();

    // Dibujar faroles
    for (let i = lanterns.length - 1; i >= 0; i--) {
        lanterns[i].update();
        lanterns[i].draw();
        // Eliminar faroles que salen de la pantalla por arriba
        if (lanterns[i].y < -100) {
            lanterns.splice(i, 1);
        }
    }

    // Sincronización de Subtítulos con el Audio
    if (isPlaying && audioPoema) {
        let currentTime = audioPoema.currentTime;
        
        // Buscar qué linea toca mostrar
        let activeLine = -1;
        for (let i = 0; i < poemaSync.length; i++) {
            if (currentTime >= poemaSync[i].time) {
                activeLine = i;
            }
        }
        
        // Si hay una linea nueva que no sea la actual
        if (activeLine !== currentLineIndex && activeLine !== -1) {
            currentLineIndex = activeLine;
            // Efecto de desvanecimiento
            magicText.classList.remove('show');
            setTimeout(() => {
                magicText.textContent = poemaSync[currentLineIndex].text;
                magicText.classList.add('show');
            }, 600); // Esperar que desaparezca el anterior
        }
        
        // Ocultar al final
        if (activeLine === poemaSync.length - 1 && currentTime > poemaSync[activeLine].time + 5) {
            magicText.classList.remove('show');
        }
    }

    time++;
    requestAnimationFrame(animate);
}

// ===== INICIALIZACIÓN =====
resize();
animate();
spawnLantern(); // Comienza a generar faroles lentamente

startBtn.addEventListener('click', () => {
    startScreen.classList.remove('active');
    
    // Iniciar el audio
    if(audioPoema.src) {
        audioPoema.play().catch(e => console.log("Audio no pudo iniciar", e));
    }
    
    isPlaying = true;
    
    // Soltar un grupo de faroles iniciales
    for(let i=0; i<10; i++) {
        setTimeout(() => lanterns.push(new Lantern()), i * 200);
    }
});

// Interacción al tocar la pantalla (agrega un farol extra)
canvas.addEventListener('click', (e) => {
    if(isPlaying) {
        // En lugar de salir desde el click, puede salir desde abajo en la posicion X del click
        lanterns.push(new Lantern(e.clientX, height + 20));
    }
});
