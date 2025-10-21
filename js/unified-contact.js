(function() {
    'use strict';

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
    let vapiInstance = null;
    let inCall = false;

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
    // LIMPIEZA DE CACHÉ (se ejecuta primero)
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>WhatsApp</span>
        `;
        whatsappOption.addEventListener('click', handleWhatsAppClick);
        
        // Opción Chat
        const chatOption = document.createElement('button');
        chatOption.className = 'contact-option chat-option';
        chatOption.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.60 15.72 3.64 17.19L2.5 21.5L7.08 20.38C8.46 21.24 10.17 21.75 12 21.75C17.52 21.75 22 17.27 22 11.75C22 6.23 17.52 2 12 2Z"/>
            </svg>
            <span>Chat</span>
        `;
        chatOption.addEventListener('click', handleChatClick);
        
        // Opción Llamar
        const callOption = document.createElement('button');
        callOption.className = 'contact-option call-option';
        callOption.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
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
            <div class="call-indicator-pulse"></div>
            <span>En llamada...</span>
            <button class="hangup-button">Colgar</button>
        `;
        
        const hangupButton = indicator.querySelector('.hangup-button');
        hangupButton.addEventListener('click', endCall);
        
        document.body.appendChild(indicator);
    }

    // ==========================================
    // ESTILOS
    // ==========================================
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Ocultar completamente el widget por defecto de Vapi */
            .vapi-btn,
            [class*="vapi"],
            [id*="vapi"],
            button[class*="Vapi"],
            div[class*="Vapi"] {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }

            /* Botón principal */
            .unified-contact-main-button {
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 15px 25px;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(46, 125, 50, 0.4);
                z-index: 9999;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
                animation: pulse-button 2s infinite;
            }

            .unified-contact-main-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 25px rgba(46, 125, 50, 0.5);
            }

            .unified-contact-main-button.menu-open {
                animation: none;
            }

            @keyframes pulse-button {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            /* Menú de opciones */
            .unified-contact-menu {
                position: fixed;
                bottom: 180px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 9998;
            }

            .unified-contact-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .contact-option {
                background: white;
                color: #333;
                border: 2px solid #E0E0E0;
                border-radius: 50px;
                padding: 12px 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                min-width: 180px;
                font-size: 15px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .contact-option:hover {
                transform: translateX(-5px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            }

            .whatsapp-option:hover {
                background: #25D366;
                color: white;
                border-color: #25D366;
            }

            .chat-option:hover {
                background: #2E7D32;
                color: white;
                border-color: #2E7D32;
            }

            .call-option:hover {
                background: #1976D2;
                color: white;
                border-color: #1976D2;
            }

            .unified-contact-menu.show .contact-option {
                animation: slideIn 0.3s ease forwards;
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
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            /* Indicador de llamada */
            .call-indicator {
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: linear-gradient(135deg, #DC143C 0%, #8B0000 100%);
                color: white;
                border-radius: 50px;
                padding: 15px 25px;
                display: none;
                align-items: center;
                gap: 12px;
                box-shadow: 0 4px 20px rgba(220, 20, 60, 0.5);
                z-index: 9999;
                font-weight: 600;
            }

            .call-indicator.active {
                display: flex;
            }

            .call-indicator-pulse {
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                animation: pulse-indicator 1.5s infinite;
            }

            @keyframes pulse-indicator {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(1.3);
                }
            }

            .hangup-button {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid white;
                border-radius: 25px;
                padding: 8px 20px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                margin-left: 10px;
            }

            .hangup-button:hover {
                background: white;
                color: #DC143C;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .unified-contact-main-button {
                    bottom: 80px;
                    right: 15px;
                    padding: 12px 20px;
                    font-size: 14px;
                }

                .unified-contact-menu {
                    bottom: 160px;
                    right: 15px;
                }

                .contact-option {
                    min-width: 160px;
                    padding: 10px 18px;
                    font-size: 14px;
                }

                .call-indicator {
                    bottom: 80px;
                    right: 15px;
                    padding: 12px 20px;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
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
        // Ocultar botón principal
        hideMainButton();
        // Invocar el chat de Mavilda
        if (window.MavildaChat && typeof window.MavildaChat.open === 'function') {
            window.MavildaChat.open();
        }
    }

    async function handleCallClick() {
        toggleMenu();

        try {
            // Inicializar Vapi si aún no está hecho
            if (!vapiInstance) {
                await initializeVapi();
            }

            if (!vapiInstance) {
                throw new Error('No se pudo inicializar Vapi');
            }

            // Iniciar la llamada
            console.log('🎯 Iniciando llamada de voz...');
            vapiInstance.start();
            inCall = true;
            showCallIndicator();
            console.log('✅ Llamada iniciada correctamente');

        } catch (error) {
            console.error('❌ Error al iniciar llamada:', error);
            alert('No se pudo iniciar la llamada. Por favor, intentá de nuevo.');
            inCall = false;
            hideCallIndicator();
        }
    }

    function endCall() {
        if (vapiInstance && inCall) {
            try {
                console.log('🛑 Deteniendo llamada...');
                vapiInstance.stop();
                inCall = false;
                hideCallIndicator();
                console.log('✅ Llamada finalizada');
            } catch (error) {
                console.error('❌ Error al detener llamada:', error);
                inCall = false;
                hideCallIndicator();
            }
        }
    }

    // ==========================================
    // INICIALIZAR VAPI (WIDGET INVISIBLE)
    // ==========================================
    async function initializeVapi() {
        if (vapiInstance) return vapiInstance;

        // Esperar a que window.vapiSDK esté disponible
        await waitForVapi();

        try {
            // Inicializar Vapi CON widget pero invisible (width/height = 0)
            // El widget existe (por eso funciona audio/micrófono) pero no se ve
            vapiInstance = window.vapiSDK.run({
                apiKey: CONFIG.vapiPublicKey,
                assistant: CONFIG.vapiAssistantId,
                config: {
                    width: "0px",
                    height: "0px",
                    position: "bottom-right",
                    offset: "0px"
                }
            });

            console.log('✅ Vapi inicializado con widget invisible');
            return vapiInstance;
        } catch (error) {
            console.error('❌ Error al inicializar Vapi:', error);
            return null;
        }
    }

    // ==========================================
    // ESPERAR A QUE VAPI SE CARGUE
    // ==========================================
    function waitForVapi(maxAttempts = 30, interval = 200) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            
            const checkVapi = setInterval(() => {
                attempts++;
                
                if (attempts === 1) {
                    console.log('🔍 Esperando que Vapi SDK se cargue...');
                }
                
                // Chequear window.vapiSDK (HTML Script Tag)
                if (window.vapiSDK && typeof window.vapiSDK.run === 'function') {
                    clearInterval(checkVapi);
                    console.log('✅ Vapi SDK (HTML Script Tag) cargado correctamente');
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkVapi);
                    console.error('❌ Timeout esperando Vapi SDK. window.vapiSDK:', window.vapiSDK);
                    reject(new Error('Vapi SDK no disponible'));
                }
            }, interval);
        });
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    function init() {
        // Limpiar caché primero
        clearCacheAndServiceWorkers();
        
        // Crear elementos
        createMainButton();
        createOptionsMenu();
        createCallIndicator();
        addStyles();
        
        console.log('✅ Sistema de comunicación unificado cargado correctamente');
        // Vapi se inicializará solo cuando el usuario haga clic en "Llamar"
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
