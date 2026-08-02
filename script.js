const KEY = "18/12";
const els = {
    pass: document.getElementById('pass'), 
    loginBox: document.getElementById('login-box'), 
    hint: document.getElementById('hint'),
    bgMusic: document.getElementById('bg-music'), 
    mainContent: document.getElementById('main-content'),
    tituloFinal: document.getElementById('titulo-final'), 
    progressCounter: document.getElementById('progress-counter'), 
    galeriaCartas: document.getElementById('galeria-cartas'), 
    count: document.getElementById('count'), 
    finalMsg: document.getElementById('final-msg'), 
    heartView: document.getElementById('heart-view'), 
    pixelHeartCanvas: document.getElementById('pixel-heart-canvas'), 
    pixelMsg: document.getElementById('pixel-msg'), 
    btnToFlowers: document.getElementById('btn-to-flowers'),
    flowerView: document.getElementById('flower-view')
};

let cardsOpened = 0; 
let openedSet = new Set();

// Tecla "Enter" para el login
els.pass.addEventListener("keypress", function(event) { 
    if (event.key === "Enter") checkPass(); 
});

function checkPass() {
    if(els.pass.value.trim() === KEY) {
        els.loginBox.style.opacity = '0'; 
        els.bgMusic.volume = 0.05;
        
        // Iniciar la música automáticamente al dar clic/enter
        els.bgMusic.play().catch(() => console.log("Autoplay bloqueado."));
        
        setTimeout(start, 800);
    } else { 
        els.hint.innerText = "Fecha incorrecta."; 
    }
}

function start() {
    els.loginBox.style.display = 'none'; 
    els.mainContent.style.display = 'block';
    
    // Forzar reflow para asegurar las transiciones CSS
    void els.mainContent.offsetWidth; 
    
    setTimeout(() => {
        els.tituloFinal.style.opacity = '1'; 
        els.progressCounter.style.opacity = '1';
        els.galeriaCartas.style.opacity = '1';
        els.galeriaCartas.style.transform = 'translate3d(0,0,0)';
    }, 100);
}

function openCard(el) {
    if(!el.classList.contains('abierta')) {
        el.classList.add('abierta');
        if (!openedSet.has(el)) {
            openedSet.add(el); 
            cardsOpened++; 
            els.count.innerText = cardsOpened;
        }
        if(cardsOpened === 6) { 
            els.finalMsg.style.opacity = '1'; 
        }
    }
}

// --- CORAZÓN PIXEL (VISTA 2) ---
function transitionToHeart() {
    els.mainContent.style.opacity = '0'; 
    setTimeout(() => {
        els.mainContent.style.display = 'none'; 
        els.heartView.style.display = 'flex';
        setTimeout(() => { 
            els.heartView.style.opacity = '1'; 
            drawPixelHeart(); 
        }, 100);
    }, 1000);
}

function drawPixelHeart() {
    const ctx = els.pixelHeartCanvas.getContext('2d');
    const heartMap = [
        "  OOOOO   OOOOO  ", " OOOOOOO OOOOOOO ", "OOOOOOOOOOOOOOOOO",
        "OOOOOOOOOOOOOOOOO", "OOOOOOOOOOOOOOOOO", " OOOOOOOOOOOOOOO ",
        "  OOOOOOOOOOOOO  ", "   OOOOOOOOOOO   ", "    OOOOOOOOO    ",
        "     OOOOOOO     ", "      OOOOO      ", "       OOO       ", "        O        "
    ];
    const pixelSize = window.innerWidth < 768 ? 14 : 20; 
    els.pixelHeartCanvas.width = heartMap[0].length * pixelSize; 
    els.pixelHeartCanvas.height = heartMap.length * pixelSize;

    const pixels = [];
    for (let y = 0; y < heartMap.length; y++) {
        for (let x = 0; x < heartMap[y].length; x++) {
            if (heartMap[y][x] === 'O') pixels.push({ x: x * pixelSize, y: y * pixelSize });
        }
    }
    
    // Desordenar los pixeles
    for (let i = pixels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
    }

    let idx = 0; 
    ctx.fillStyle = '#fff'; 
    ctx.shadowColor = '#00f2fe'; 
    ctx.shadowBlur = 15;
    
    function drawNextPixel() {
        for(let k = 0; k < 2; k++) {
            if (idx < pixels.length) {
                const p = pixels[idx]; 
                ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1); 
                idx++;
            }
        }
        if (idx < pixels.length) {
            requestAnimationFrame(drawNextPixel);
        } else {
            setTimeout(() => { 
                els.pixelMsg.style.opacity = '1'; 
                setTimeout(() => { 
                    els.btnToFlowers.style.opacity = '1'; 
                }, 2500); 
            }, 500);
        }
    }
    drawNextPixel();
}

// --- FLORES ROJAS CSS (VISTA FINAL 3) ---
function transitionToFlowers() {
    els.heartView.style.opacity = '0';
    setTimeout(() => {
        els.heartView.style.display = 'none';
        els.flowerView.style.display = 'flex';
        
        setTimeout(() => {
            els.flowerView.style.opacity = '1';
            // Al quitar esta clase, las animaciones de CSS de la flor inician desde cero
            els.flowerView.classList.remove('paused');
        }, 100);
    }, 1500);
}
// --- FUNCIÓN PARA ENVIAR WHATSAPP ---
function sendWhatsApp() {
    const msgInput = document.getElementById('wp-msg');
    const msg = msgInput.value.trim();
    
    if(msg === "") {
        alert("Escribe un mensajito primero 😊");
        msgInput.focus();
        return;
    }
    
    // Aquí pon tu número de teléfono real (dejando el 593 al inicio)
    const phone = "593967970393"; 
    
    // Codifica el texto para que los espacios y emojis se envíen bien en la URL
    const encodedMsg = encodeURIComponent(msg);
    const url = `https://wa.me/${phone}?text=${encodedMsg}`;
    
    // Abre WhatsApp en una pestaña nueva
    window.open(url, '_blank');
}