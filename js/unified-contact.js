import Vapi from "@vapi-ai/web";

// ==========================================
// CONFIGURACIÓN
// ==========================================
const CONFIG = {
    whatsappPhone: '5493465432688',
    whatsappMessage: 'Hola, vengo desde el sitio de SER AGRO',
    vapiPublicKey: '5a29292f-d9cc-4a21-bb7e-ff8df74763cd',
    vapiAssistantId: '776543a0-f4a2-4ed7-ad7a-f1fe0f6fd4d4',
    primaryColor: '#2E7D32',
    secondaryColor: '#1B5E20',
    whatsappColor: '#25D366'
};

let menuOpen = false;
let vapiClient = null;
let inCall = false;

// ==========================================
// INICIALIZAR CLIENTE VAPI
// ==========================================
function initVapiClient() {
    if (!vapiClient) {
        vapiClient = new Vapi(CONFIG.vapiPublicKey);
        
        // Eventos del cliente Vapi
        vapiClient.on('call-start', () => {
            console.log('✅ Llamada iniciada');
            inCall = true;
            showCallIndicator();
        });
        
        vapiClient.on('call-end', () => {
            console.log('✅ Llamada finalizada');
            inCall = false;
            hideCallIndicator();
        });
        
        vapiClient.on('error', (error) => {
            console.error('❌ Error en Vapi:', error);
            alert('Ocurrió un error durante la llamada. Por favor, intentá de nuevo.');
            inCall = false;
            hideCallIndicator();
        });
        
        console.log('✅ Cliente Vapi inicializado');
    }
    return vapiClient;
}

// ==========================================
// MOSTRAR/OCULTAR INDICADOR DE LLAMADA
// ==========================================
function showCallIndicator() {
    const indicator = document.getElementById('call-indicator');
    const mainButton = document.getElementById('unified-contact-button');
    if (indicator) indicator.classList.add('active');
    if (mainButton) mainButton.style.display = 'none';
}

function hideCallIndicator() {
    const indicator = document.getElementById('call-indicator');
    const mainButton = document.getElementById('unified-contact-button');
    if (indicator) indicator.classList.remove('active');
    if (mainButton) mainButton.style.display = 'flex';
}

// ==========================================
// MOSTRAR/OCULTAR BOTÓN PRINCIPAL
// ==========================================
function hideMainButton() {
    const button = document.getElementById('unified-contact-button');
    if (button) {
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
    }
}

function showMainButton() {
    const button = document.getElementById('unified-contact-button');
    if (button) {
        button.style.opacity = '1';
        button.style.pointerEvents = 'all';
    }
}

// Exponer API para que otros módulos puedan ocultar/mostrar el botón
window.UnifiedContact = {
    hide: hideMainButton,
    show: showMainButton
};

// ==========================================
// LIMPIEZA DE CACHÉ
// ==========================================
function clearCacheAndServiceWorkers() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        });
    }
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }
}

// ==========================================
// CREAR BOTÓN PRINCIPAL
// ==========================================
function createMainButton() {
    const button = document.createElement('button');
    button.id = 'unified-contact-button';
    button.className = 'unified-contact-main-button';
    button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style="flex-shrink: 0;">
            <circle cx="8" cy="12" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="16" cy="12" r="1.5"/>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.60 15.72 3.64 17.19L2.5 21.5L7.08 20.38C8.46 21.24 10.17 21.75 12 21.75C17.52 21.75 22 17.27 22 11.75C22 6.23 17.52 2 12 2Z" opacity="0.3"/>
        </svg>
        <span>Hablá con nosotros</span>
    `;
    button.addEventListener('click', toggleMenu);
    document.body.appendChild(button);
}

// ==========================================
// CREAR MENÚ DE OPCIONES
// ==========================================
function createOptionsMenu() {
    const menu = document.createElement('div');
    menu.id = 'unified-contact-menu';
    menu.className = 'unified-contact-menu';
    
    // Opción WhatsApp
    const whatsappOption = document.createElement('button');
    whatsappOption.className = 'contact-option whatsapp-option';
    whatsappOption.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span>WhatsApp</span>
    `;
    whatsappOption.addEventListener('click', handleWhatsAppClick);
    
    // Opción Chat
    const chatOption = document.createElement('button');
    chatOption.className = 'contact-option chat-option';
    chatOption.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="9" cy="10" r="1.5"/>
            <circle cx="12" cy="10" r="1.5"/>
            <circle cx="15" cy="10" r="1.5"/>
        </svg>
        <span>Chat</span>
    `;
    chatOption.addEventListener('click', handleChatClick);
    
    // Opción Llamar
    const callOption = document.createElement('button');
    callOption.className = 'contact-option call-option';
    callOption.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
        <span>Llamar</span>
    `;
    callOption.addEventListener('click', handleCallClick);
    
    menu.appendChild(whatsappOption);
    menu.appendChild(chatOption);
    menu.appendChild(callOption);
    
    document.body.appendChild(menu);
}

// ==========================================
// CREAR INDICADOR DE LLAMADA
// ==========================================
function createCallIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'call-indicator';
    indicator.className = 'call-indicator';
    indicator.innerHTML = `
        <div class="pulse-dot"></div>
        <span>En llamada...</span>
        <button class="end-call-btn" id="end-call-btn">Colgar</button>
    `;
    
    document.body.appendChild(indicator);
    
    // Agregar evento al botón de colgar
    document.getElementById('end-call-btn').addEventListener('click', endCall);
}

// ==========================================
// ESTILOS CSS
// ==========================================
function addStyles() {
    const styles = `
        .unified-contact-main-button {
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 16px 28px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(46, 125, 50, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9998;
            font-family: 'Open Sans', sans-serif;
            animation: subtlePulse 2s ease-in-out infinite;
        }

        @keyframes subtlePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .unified-contact-main-button:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 30px rgba(46, 125, 50, 0.5);
            animation: none;
        }

        .unified-contact-main-button.menu-open {
            background: linear-gradient(135deg, ${CONFIG.secondaryColor} 0%, #0d3f10 100%);
        }

        .unified-contact-menu {
            position: fixed;
            bottom: 180px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9997;
        }

        .unified-contact-menu.show {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
        }

        .contact-option {
            background: white;
            border: none;
            border-radius: 50px;
            padding: 14px 24px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Open Sans', sans-serif;
            opacity: 0;
            transform: translateX(20px);
        }

        .unified-contact-menu.show .contact-option {
            animation: slideIn 0.4s ease-out forwards;
        }

        .unified-contact-menu.show .contact-option:nth-child(1) {
            animation-delay: 0.05s;
        }

        .unified-contact-menu.show .contact-option:nth-child(2) {
            animation-delay: 0.1s;
        }

        .unified-contact-menu.show .contact-option:nth-child(3) {
            animation-delay: 0.15s;
        }

        @keyframes slideIn {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .contact-option:hover {
            transform: translateX(-5px) scale(1.05);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        }

        .whatsapp-option {
            color: ${CONFIG.whatsappColor};
        }

        .whatsapp-option svg {
            fill: ${CONFIG.whatsappColor};
        }

        .chat-option {
            color: ${CONFIG.primaryColor};
        }

        .chat-option svg {
            fill: ${CONFIG.primaryColor};
        }

        .call-option {
            color: #1976D2;
        }

        .call-option svg {
            fill: #1976D2;
        }

        .call-indicator {
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
            color: white;
            border-radius: 50px;
            padding: 12px 20px;
            box-shadow: 0 4px 20px rgba(211, 47, 47, 0.4);
            display: none;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            font-family: 'Open Sans', sans-serif;
            font-weight: 600;
            max-width: calc(100vw - 40px);
            box-sizing: border-box;
        }

        .call-indicator.active {
            display: flex;
        }

        .pulse-dot {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.3);
                opacity: 0.7;
            }
        }

        .end-call-btn {
            background: white;
            border: none;
            color: #d32f2f;
            border-radius: 25px;
            padding: 8px 18px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.3s ease;
            font-family: 'Open Sans', sans-serif;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .end-call-btn:hover {
            background: #f5f5f5;
            transform: scale(1.05);
        }
        
        .call-indicator > span {
            flex-shrink: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .vapi-btn {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        @media (max-width: 768px) {
            .unified-contact-main-button {
                bottom: 80px;
                right: 15px;
                padding: 14px 24px;
                font-size: 15px;
            }

            .unified-contact-menu {
                bottom: 160px;
                right: 15px;
            }

            .contact-option {
                padding: 12px 20px;
                font-size: 14px;
            }

            .call-indicator {
                bottom: 80px;
                right: 15px;
                padding: 10px 14px;
                font-size: 13px;
                max-width: calc(100vw - 30px);
                gap: 8px;
            }
            
            .end-call-btn {
                padding: 6px 12px;
                font-size: 11px;
            }
            
            .pulse-dot {
                width: 10px;
                height: 10px;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// ==========================================
// TOGGLE MENÚ
// ==========================================
function toggleMenu() {
    const button = document.getElementById('unified-contact-button');
    const menu = document.getElementById('unified-contact-menu');
    
    menuOpen = !menuOpen;
    
    if (menuOpen) {
        menu.classList.add('show');
        button.classList.add('menu-open');
    } else {
        menu.classList.remove('show');
        button.classList.remove('menu-open');
    }
}

// ==========================================
// HANDLERS DE OPCIONES
// ==========================================
function handleWhatsAppClick() {
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappPhone}&text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    window.open(url, '_blank');
    toggleMenu();
}

function handleChatClick() {
    toggleMenu();
    hideMainButton();
    if (window.MavildaChat && typeof window.MavildaChat.open === 'function') {
        window.MavildaChat.open();
    }
}

async function handleCallClick() {
    toggleMenu();
    
    try {
        // Inicializar cliente si es necesario
        const client = initVapiClient();
        
        // Iniciar la llamada
        console.log('🎯 Iniciando llamada con Vapi...');
        await client.start(CONFIG.vapiAssistantId);
        
    } catch (error) {
        console.error('❌ Error al iniciar llamada:', error);
        alert('No se pudo iniciar la llamada. Por favor, intentá de nuevo.');
        hideCallIndicator();
    }
}

function endCall() {
    if (vapiClient && inCall) {
        try {
            vapiClient.stop();
            console.log('✅ Llamada detenida por el usuario');
        } catch (error) {
            console.error('❌ Error al detener llamada:', error);
        }
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
function init() {
    clearCacheAndServiceWorkers();
    createMainButton();
    createOptionsMenu();
    createCallIndicator();
    addStyles();
    initVapiClient();
    
    console.log('✅ Sistema de comunicación unificado cargado correctamente');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
