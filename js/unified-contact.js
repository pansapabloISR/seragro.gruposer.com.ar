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
        menu.innerHTML = `
            <button class="contact-option" id="option-whatsapp" data-delay="0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.106"/>
                </svg>
                <span>WhatsApp</span>
            </button>
            <button class="contact-option" id="option-chat" data-delay="1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.60 15.72 3.64 17.19L2.5 21.5L7.08 20.38C8.46 21.24 10.17 21.75 12 21.75C17.52 21.75 22 17.27 22 11.75C22 6.23 17.52 2 12 2ZM12 20C10.43 20 8.95 19.55 7.68 18.76L7.41 18.59L4.65 19.31L5.38 16.65L5.19 16.36C4.33 15.03 3.85 13.47 3.85 11.85C3.85 7.36 7.51 3.7 12 3.7C16.49 3.7 20.15 7.36 20.15 11.85C20.15 16.34 16.49 20 12 20Z"/>
                    <path d="M8.5 7.5C8.5 7.22 8.72 7 9 7H15C15.28 7 15.5 7.22 15.5 7.5C15.5 7.78 15.28 8 15 8H9C8.72 8 8.5 7.78 8.5 7.5Z"/>
                    <path d="M8.5 10.5C8.5 10.22 8.72 10 9 10H15C15.28 10 15.5 10.22 15.5 10.5C15.5 10.78 15.28 11 15 11H9C8.72 11 8.5 10.78 8.5 10.5Z"/>
                    <path d="M8.5 13.5C8.5 13.22 8.72 13 9 13H12C12.28 13 12.5 13.22 12.5 13.5C12.5 13.78 12.28 14 12 14H9C8.72 14 8.5 13.78 8.5 13.5Z"/>
                </svg>
                <span>Chat</span>
            </button>
            <button class="contact-option" id="option-call" data-delay="2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>Llamar</span>
            </button>
        `;
        document.body.appendChild(menu);

        // Agregar event listeners
        document.getElementById('option-whatsapp').addEventListener('click', handleWhatsAppClick);
        document.getElementById('option-chat').addEventListener('click', handleChatClick);
        document.getElementById('option-call').addEventListener('click', handleCallClick);
    }

    // ==========================================
    // CREAR INDICADOR DE LLAMADA
    // ==========================================
    function createCallIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'call-indicator';
        indicator.className = 'call-indicator';
        indicator.innerHTML = `
            <div class="call-pulse"></div>
            <span>En llamada...</span>
            <button id="hang-up-button" class="hang-up-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                </svg>
                Colgar
            </button>
        `;
        document.body.appendChild(indicator);
        
        document.getElementById('hang-up-button').addEventListener('click', endCall);
    }

    // ==========================================
    // AGREGAR ESTILOS CSS
    // ==========================================
    function addStyles() {
        const styles = `
            /* Botón principal */
            .unified-contact-main-button {
                position: fixed;
                bottom: 100px;
                right: 20px;
                min-width: 160px;
                height: 60px;
                padding: 12px 20px;
                border-radius: 30px;
                background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                z-index: 100000;
                color: white;
                font-size: 14px;
                font-weight: 600;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: all 0.3s ease;
                animation: pulse-button 2s ease-in-out infinite;
            }

            .unified-contact-main-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }

            .unified-contact-main-button.menu-open {
                background: ${CONFIG.secondaryColor};
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
                bottom: 170px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 99999;
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .unified-contact-menu.show {
                opacity: 1;
                transform: translateY(0);
                pointer-events: all;
            }

            .contact-option {
                width: 140px;
                height: 48px;
                border-radius: 24px;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(10px);
            }

            .unified-contact-menu.show .contact-option {
                animation: slideIn 0.3s ease forwards;
            }

            .unified-contact-menu.show .contact-option[data-delay="0"] {
                animation-delay: 0s;
            }

            .unified-contact-menu.show .contact-option[data-delay="1"] {
                animation-delay: 0.05s;
            }

            .unified-contact-menu.show .contact-option[data-delay="2"] {
                animation-delay: 0.1s;
            }

            @keyframes slideIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            #option-whatsapp {
                background: ${CONFIG.whatsappColor};
                color: white;
            }

            #option-chat {
                background: ${CONFIG.primaryColor};
                color: white;
            }

            #option-call {
                background: white;
                color: #333;
            }

            .contact-option:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }

            /* Indicador de llamada */
            .call-indicator {
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 12px 20px;
                border-radius: 30px;
                box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
                display: none;
                align-items: center;
                gap: 12px;
                z-index: 100001;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .call-indicator.active {
                display: flex;
            }

            .call-pulse {
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                animation: pulse-dot 1.5s ease-in-out infinite;
            }

            @keyframes pulse-dot {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(1.2);
                }
            }

            .call-indicator span {
                font-weight: 600;
                font-size: 14px;
            }

            .hang-up-button {
                background: rgba(255,255,255,0.2);
                border: 1px solid white;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: 600;
                font-family: inherit;
                transition: all 0.2s ease;
            }

            .hang-up-button:hover {
                background: rgba(255,255,255,0.3);
            }

            /* Responsive */
            @media (max-width: 480px) {
                .unified-contact-main-button {
                    bottom: 80px;
                    right: 15px;
                    min-width: 140px;
                    height: 50px;
                    font-size: 12px;
                    padding: 10px 16px;
                }

                .unified-contact-menu {
                    bottom: 140px;
                    right: 15px;
                }

                .contact-option {
                    width: 130px;
                    height: 44px;
                    font-size: 13px;
                }

                .call-indicator {
                    bottom: 80px;
                    right: 15px;
                    font-size: 12px;
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
        // Invocar el chat de Mavilda
        if (window.MavildaChat && typeof window.MavildaChat.open === 'function') {
            window.MavildaChat.open();
        }
    }

    async function handleCallClick() {
        toggleMenu();
        
        // Inicializar Vapi si no está inicializado
        if (!vapiInstance && window.Vapi) {
            try {
                vapiInstance = new window.Vapi(CONFIG.vapiPublicKey);
                console.log('✅ Vapi inicializado correctamente');
            } catch (error) {
                console.error('❌ Error al inicializar Vapi:', error);
                alert('Error al iniciar la llamada. Por favor, intentá de nuevo.');
                return;
            }
        }

        if (!vapiInstance) {
            console.error('❌ Vapi SDK no está disponible');
            alert('El sistema de llamadas no está disponible en este momento.');
            return;
        }

        try {
            // Iniciar la llamada
            await vapiInstance.start(CONFIG.vapiAssistantId);
            inCall = true;
            
            // Mostrar indicador de llamada
            const indicator = document.getElementById('call-indicator');
            const mainButton = document.getElementById('unified-contact-button');
            indicator.classList.add('active');
            mainButton.style.display = 'none';
            
            console.log('✅ Llamada iniciada');
        } catch (error) {
            console.error('❌ Error al iniciar llamada:', error);
            alert('No se pudo iniciar la llamada. Por favor, intentá de nuevo.');
        }
    }

    function endCall() {
        if (vapiInstance && inCall) {
            vapiInstance.stop();
            inCall = false;
            
            // Ocultar indicador de llamada
            const indicator = document.getElementById('call-indicator');
            const mainButton = document.getElementById('unified-contact-button');
            indicator.classList.remove('active');
            mainButton.style.display = 'flex';
            
            console.log('✅ Llamada finalizada');
        }
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
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
