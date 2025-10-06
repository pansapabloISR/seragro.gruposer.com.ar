// Chat Widget Mavilda - Versión Final Optimizada
(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        webhookUrl: 'https://primary-production-396f31.up.railway.app/webhook/mavilda-chat',
        position: 'bottom-right',
        primaryColor: '#2E7D32',
        secondaryColor: '#1B5E20',
        logoUrl: 'imagenes/logo color pleno.png' // Logo de SER AGRO
    };

    // Generar ID de sesión único
    function generateSessionId() {
        const stored = localStorage.getItem('mavilda_session_id');
        if (stored) return stored;

        const newId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('mavilda_session_id', newId);
        return newId;
    }

    const sessionId = generateSessionId();

    // Estilos CSS del widget
    const styles = `
        .mavilda-chat-widget {
            position: fixed;
            ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            bottom: 90px;
            z-index: 9998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .mavilda-chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.secondaryColor});
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: relative;
        }

        .mavilda-chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        .mavilda-chat-button svg {
            width: 32px;
            height: 32px;
            fill: white;
        }

        .mavilda-chat-button.active svg.chat-icon {
            display: none;
        }

        .mavilda-chat-button svg.close-icon {
            display: none;
        }

        .mavilda-chat-button.active svg.close-icon {
            display: block;
        }

        .mavilda-chat-window {
            position: absolute;
            bottom: 80px;
            ${CONFIG.position.includes('right') ? 'right: 0;' : 'left: 0;'}
            width: 380px;
            height: 550px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.3s ease-out;
        }

        .mavilda-chat-window.active {
            display: flex;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .mavilda-chat-header {
            background: linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.secondaryColor});
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .mavilda-chat-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 3px;
        }

        .mavilda-chat-avatar img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .mavilda-chat-info h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }

        .mavilda-chat-info p {
            margin: 3px 0 0;
            font-size: 13px;
            opacity: 0.9;
        }

        .mavilda-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f5f5f5;
        }

        .mavilda-message {
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
        }

        .mavilda-message.user {
            align-items: flex-end;
        }

        .mavilda-message-content {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            animation: messageIn 0.3s ease-out;
            line-height: 1.5;
            white-space: pre-wrap;
        }

        /* Formato mejorado para mensajes de Mavilda */
        .mavilda-message.bot .mavilda-message-content {
            background: white;
            color: #333;
            border-bottom-left-radius: 4px;
        }

        .mavilda-message.bot .mavilda-message-content strong {
            color: ${CONFIG.primaryColor};
            display: block;
            margin: 8px 0 4px 0;
        }

        .mavilda-message.bot .mavilda-message-content ul {
            margin: 8px 0;
            padding-left: 20px;
        }

        .mavilda-message.bot .mavilda-message-content li {
            margin: 4px 0;
        }

        /* Formato de precios */
        .mavilda-message.bot .mavilda-message-content[data-has-price="true"] {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        @keyframes messageIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .mavilda-message.user .mavilda-message-content {
            background: ${CONFIG.primaryColor};
            color: white;
            border-bottom-right-radius: 4px;
        }

        .mavilda-typing {
            display: none;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: white;
            border-radius: 18px;
            max-width: 75px;
            margin-bottom: 15px;
        }

        .mavilda-typing.active {
            display: flex;
        }

        .mavilda-typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${CONFIG.primaryColor};
            animation: typingDot 1.4s infinite;
        }

        .mavilda-typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .mavilda-typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingDot {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }

        .mavilda-chat-input-container {
            padding: 15px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
        }

        .mavilda-chat-input {
            flex: 1;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            padding: 12px 18px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s;
        }

        .mavilda-chat-input:focus {
            border-color: ${CONFIG.primaryColor};
        }

        .mavilda-chat-send {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: ${CONFIG.primaryColor};
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }

        .mavilda-chat-send:hover {
            background: ${CONFIG.secondaryColor};
            transform: scale(1.05);
        }

        .mavilda-chat-send:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .mavilda-chat-send svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        @media (max-width: 480px) {
            .mavilda-chat-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 100px);
                max-height: 600px;
            }
        }
    `;

    // Crear elemento de estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Función para formatear mensaje de Mavilda
    function formatMessage(text) {
        // Detectar si tiene precios (USD)
        const hasPrice = text.includes('USD') || text.includes('$');

        // Mejorar formato de listas y bullets
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negritas
            .replace(/\n- /g, '\n• ') // Bullets
            .replace(/\n\*/g, '\n•'); // Bullets alternativo

        return { formatted, hasPrice };
    }

    // HTML del widget
    const widgetHTML = `
        <div class="mavilda-chat-widget">
            <button class="mavilda-chat-button" aria-label="Abrir chat">
                <svg class="chat-icon" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
                <svg class="close-icon" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
            <div class="mavilda-chat-window">
                <div class="mavilda-chat-header">
                    <div class="mavilda-chat-avatar">
                        <img src="${CONFIG.logoUrl}" alt="SER AGRO" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E🚁%3C/text%3E%3C/svg%3E'">
                    </div>
                    <div class="mavilda-chat-info">
                        <h3>Mavilda</h3>
                        <p>Asesora de drones agrícolas</p>
                    </div>
                </div>
                <div class="mavilda-chat-messages" id="mavilda-messages">
                    <!-- Mavilda responderá automáticamente -->
                </div>
                <div class="mavilda-typing" id="mavilda-typing">
                    <div class="mavilda-typing-dot"></div>
                    <div class="mavilda-typing-dot"></div>
                    <div class="mavilda-typing-dot"></div>
                </div>
                <div class="mavilda-chat-input-container">
                    <input 
                        type="text" 
                        class="mavilda-chat-input" 
                        id="mavilda-input"
                        placeholder="Escribe tu mensaje..."
                        autocomplete="off"
                    />
                    <button class="mavilda-chat-send" id="mavilda-send" aria-label="Enviar mensaje">
                        <svg viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Insertar widget en el DOM
    document.addEventListener('DOMContentLoaded', function() {
        const widgetContainer = document.createElement('div');
        widgetContainer.innerHTML = widgetHTML;
        document.body.appendChild(widgetContainer);

        // Referencias a elementos
        const chatButton = document.querySelector('.mavilda-chat-button');
        const chatWindow = document.querySelector('.mavilda-chat-window');
        const messagesContainer = document.getElementById('mavilda-messages');
        const typingIndicator = document.getElementById('mavilda-typing');
        const inputField = document.getElementById('mavilda-input');
        const sendButton = document.getElementById('mavilda-send');

        // Toggle chat
        chatButton.addEventListener('click', function() {
            chatButton.classList.toggle('active');
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                inputField.focus();

                // Enviar saludo inicial solo la primera vez
                const hasGreeted = localStorage.getItem('mavilda_greeted_' + sessionId);
                if (!hasGreeted && messagesContainer.children.length === 0) {
                    localStorage.setItem('mavilda_greeted_' + sessionId, 'true');
                    sendInitialGreeting();
                }
            }
        });

        // Función para agregar mensaje
        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `mavilda-message ${isUser ? 'user' : 'bot'}`;

            if (!isUser) {
                const { formatted, hasPrice } = formatMessage(text);
                messageDiv.innerHTML = `
                    <div class="mavilda-message-content" ${hasPrice ? 'data-has-price="true"' : ''}>${formatted}</div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="mavilda-message-content">${text}</div>
                `;
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Función para enviar mensaje inicial
        async function sendInitialGreeting() {
            typingIndicator.classList.add('active');

            try {
                const response = await fetch(CONFIG.webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: 'Hola',
                        sessionId: sessionId
                    })
                });

                const data = await response.json();
                typingIndicator.classList.remove('active');

                if (data.response) {
                    addMessage(data.response);
                } else if (data.output) {
                    addMessage(data.output);
                }
            } catch (error) {
                console.error('Error en saludo inicial:', error);
                typingIndicator.classList.remove('active');
                addMessage('¡Hola! 👋 Soy Mavilda de Seragro. ¿En qué puedo ayudarte?');
            }
        }

        // Función para enviar mensaje
        async function sendMessage() {
            const message = inputField.value.trim();
            if (!message) return;

            // Agregar mensaje del usuario
            addMessage(message, true);
            inputField.value = '';
            sendButton.disabled = true;

            // Mostrar indicador de escritura
            typingIndicator.classList.add('active');

            try {
                const response = await fetch(CONFIG.webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        sessionId: sessionId
                    })
                });

                const data = await response.json();

                // Ocultar indicador de escritura
                typingIndicator.classList.remove('active');

                // Agregar respuesta del bot
                if (data.response) {
                    addMessage(data.response);
                } else if (data.output) {
                    addMessage(data.output);
                } else {
                    addMessage('Disculpá, tuve un problema al procesar tu mensaje. ¿Podés intentar de nuevo?');
                }

            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                typingIndicator.classList.remove('active');
                addMessage('Lo siento, hubo un error de conexión. Por favor, intentá nuevamente.');
            }

            sendButton.disabled = false;
            inputField.focus();
        }

        // Event listeners
        sendButton.addEventListener('click', sendMessage);

        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Auto-resize para móviles
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 480 && chatWindow.classList.contains('active')) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });
    });
})();