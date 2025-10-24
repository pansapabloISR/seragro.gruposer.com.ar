# SER AGRO - Drones Agrícolas

## Overview

SER AGRO is a corporate website for an agricultural drone distributor specializing in DJI equipment. The site showcases agricultural drones (DJI AGRAS T50, T100, and Mavic 3 Multispectral) with product pages, technical documentation downloads, firmware updates, and an AI-powered chat assistant named "Mavilda" for customer support. The site is built as a static multi-page website with vanilla JavaScript for interactivity.

## User Preferences

Preferred communication style: Simple, everyday language.

### Critical Configuration Rules
- **⚠️ NEVER recreate workflows using `workflows_set_run_config_tool`** - this overwrites port mappings
- **Port Configuration**: Internal port 5000 MUST map to external port 5000 (not :80)
  - User manually configured this in Networking tool
  - Always use `restart_workflow` to restart the server, never create new workflows
  - Port mapping is saved in `.replit` file (lines 46-47: `localPort = 5000, externalPort = 5000`)
- **Workflow Management**: Only use `restart_workflow("Server")` to restart - NEVER use `workflows_set_run_config_tool`

## System Architecture

### Frontend Architecture
- **Static Multi-Page Site**: Pure HTML5, CSS3, and vanilla JavaScript without any framework
- **Responsive Design**: Mobile-first approach with CSS media queries and responsive navigation
- **Video Integration**: Hero sections with autoplay background videos for product showcasing
- **Navigation Pattern**: Consistent header across all pages with dropdown menus for equipment and downloads

### Page Structure
- **Homepage** (`index.html`): Landing page with company introduction
- **Product Pages**: Dedicated pages for each drone model (T50, T100, Mavic 3)
- **Firmware Page** (`firmware-generador.html`): Generator firmware update instructions
- **Consistent Layout**: All pages share the same header/navigation structure

### Interactive Features
- **Mobile Navigation**: Hamburger menu with toggle functionality (`main-app.js`)
- **Dropdown Menus**: Equipment and downloads sections with hover/click interactions
- **Unified Contact System** (`js/unified-contact.js`): Single-button multi-channel communication hub
  - **Main Button**: "Hablá con nosotros" - Green oval button with pulse animation
    - Position: 100px from bottom, 20px from right
    - Gradient: #2E7D32 → #1B5E20
    - Opens menu with 3 communication options
  - **Contact Options Menu**: Appears above main button with slide-in animation
    - **WhatsApp**: Direct messaging to +54 (93465) 432688
    - **Chat**: Opens Mavilda AI assistant widget
    - **Llamar**: Voice calls via Vapi AI (Public Key: 5a29292f-d9cc-4a21-bb7e-ff8df74763cd)
  - **Call Indicator**: Red pulsing indicator shown during active voice calls
- **Mavilda Chat Widget** (`js/mavilda-chat.js`): AI-powered customer support
  - Session-based conversations with unique session IDs
  - Webhook integration for backend processing
  - Auto-greeting functionality when opened
  - Agent image: "mavilda ingeniera agronoma.png"
  - Invoked programmatically via window.MavildaChat.open() API

### Styling Approach
- **CSS Variables**: Centralized color scheme and theme configuration
- **Custom Properties**: Agricultural green color palette (primary: #2E7D32, secondary: #1B5E20)
- **Responsive Components**: Flexible layouts that adapt to different screen sizes
- **Video Backgrounds**: Full-screen video heroes with overlay content

### Asset Management
- **Static Assets**: Images stored in `/imagenes/` directory
- **PDF Downloads**: Technical datasheets in `/attached_assets/` directory
- **Video Content**: Product videos for hero sections

## External Dependencies

### Analytics & Tracking
- **Google Analytics (gtag.js)**: Conversion tracking with ID `AW-17289441166`
  - Implemented across all pages for consistent analytics
  - Tracks user interactions and conversions

### Third-Party Integrations
- **Chat Backend**: Railway-hosted webhook service
  - URL: `https://primary-production-396f31.up.railway.app/webhook/mavilda-chat`
  - Purpose: AI chat assistant backend for customer support
  - Session-based conversation management
- **Vapi Voice AI**: Voice call integration for customer support  
  - NPM Package: `@vapi-ai/web` v2.5.0 (installed locally via npm)
  - Public Key: `5a29292f-d9cc-4a21-bb7e-ff8df74763cd`
  - Assistant ID: `776543a0-f4a2-4ed7-ad7a-f1fe0f6fd4d4`
  - Enables real-time voice conversations with AI assistant
  - Loaded as ES module import in unified-contact.js

### External Resources
- **Google Fonts**: Open Sans font family for typography
- **Font Awesome**: Icon library (Kit: 14b830158f.js) used in some components

### Build & Development
- **Vite**: Frontend build tool and dev server (v7.1.11)
  - Processes ES modules and npm packages
  - Dev server runs on port 5000 with HMR (Hot Module Replacement)
  - Configured in `vite.config.js` with host: 0.0.0.0, allowedHosts: true
- **Server Setup**: `server.py` acts as wrapper to exec `npm run dev`
  - Ensures compatibility with existing Replit workflow configuration
  - Vite handles all static file serving and module bundling

### Deployment Platform
- **Replit Hosting**: Site is configured for deployment on Replit's hosting service
- **Build Process**: Vite bundles JavaScript modules including @vapi-ai/web dependency

### Contact Information
- Phone: +54 (93465) 432688
- WhatsApp: +54 (93465) 432688
- Email: ser.agro@gruposer.com.ar
- Physical Location: Omar Carrasco 2776, Rosario, Argentina

## Recent Changes (October 2025)

### Migration to Vite & ES Modules (Oct 21, 2025)
- **Migrated from CDN to npm-based Vapi SDK**: Resolved module loading issues
  - Installed `@vapi-ai/web` v2.5.0 via npm for reliable dependency management
  - Configured Vite as build tool and dev server (replaces simple Python HTTP server)
  - All JavaScript files now use ES module syntax (`import`/`export`)
  - HTML pages load scripts with `<script type="module">` tags
- **Vapi Integration Improvements**:
  - `unified-contact.js` now imports Vapi class directly: `import Vapi from "@vapi-ai/web"`
  - Vapi client instantiated on page load with event listeners (call-start, call-end, error)
  - Custom UI only - no default Vapi widget shown (hidden via CSS)
  - Voice calls initiated with `vapiClient.start(assistantId)` and stopped with `vapiClient.stop()`
- **Server Configuration**:
  - `server.py` now wrapper script that executes `npm run dev` (runs Vite)
  - Vite dev server handles module bundling, HMR, and static file serving on port 5000
  - Workflow still named "Server" and uses `restart_workflow` for restarts
- **Removed cache-busting query parameters** - Vite handles module versioning automatically

### Unified Communication System (Oct 20, 2025)
- **Created unified-contact.js**: Single-button multi-channel communication hub
  - Replaced separate WhatsApp and Mavilda floating buttons with one unified button
  - Implemented 3-option menu: WhatsApp, Chat, and Voice Calls
  - Menu appears with slide-in animation and staggered delays (0.05s between options)
  - Call indicator with red pulsing animation for active voice calls
  - **Smart button visibility**: Button only hides when chat or call are active, stays visible during menu open
- **Refactored mavilda-chat.js**: Converted to invocable module
  - Removed standalone floating button
  - Exposed public API: window.MavildaChat.open() and .close()
  - Maintains all chat functionality (sessions, auto-greeting, webhook integration)
  - Calls UnifiedContact.show() when chat closes to restore main button
- **Updated main-app.js**: Removed standalone WhatsApp button code

### JavaScript Architecture (Earlier Oct 2025)
- Renamed `script.js` → `main-app.js` for better cache management
- Renamed `js/chat-widget.js` → `js/mavilda-chat.js` for better cache management

### UI/UX Improvements
- Unified contact button: "Hablá con nosotros" at 100px from bottom, 20px from right
- Pulse animation on main button (grows/shrinks subtly every 2 seconds)
- Responsive design: Adjusts button size and position for mobile (80px from bottom, 15px from right)
- Updated all WhatsApp contact numbers from 5493401514509 to 5493465432688
- Changed Mavilda agent image to "mavilda ingeniera agronoma.png"
- Fixed mobile/desktop cache issues with file renaming and meta tags
- Fixed CSS !important override issue in style.css for mobile button positioning

### Android Production Rendering Fix (Oct 24, 2025)
- **Call Indicator Overflow Fix**: Resolved Android-specific clipping issue in production
  - Added `max-width: calc(100vw - 40px)` to desktop call indicator with `box-sizing: border-box`
  - Enforced `max-width: calc(100vw - 30px)` across mobile breakpoint (prevents overflow)
  - Changed button design: white solid background with red text for better visibility
  - Protected button with `flex-shrink: 0` and `white-space: nowrap` to prevent compression
  - Made text flexible with `flex-shrink: 1` and ellipsis truncation
  - Reduced spacing on mobile: padding (10px 14px), gap (8px), smaller pulse dot (10px)
  - Optimized button on mobile: padding (6px 12px), font-size (11px)
  - Root cause: Roboto font on Android is wider than SF Pro on iOS, production build lacked max-width constraints