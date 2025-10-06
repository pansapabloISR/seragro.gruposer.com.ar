# SER AGRO - Drones Agrícolas

## Overview

SER AGRO is a corporate website for an agricultural drone distributor specializing in DJI equipment. The site showcases agricultural drones (DJI AGRAS T50, T100, and Mavic 3 Multispectral) with product pages, technical documentation downloads, firmware updates, and an AI-powered chat assistant named "Mavilda" for customer support. The site is built as a static multi-page website with vanilla JavaScript for interactivity.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **Mobile Navigation**: Hamburger menu with toggle functionality (`script.js`)
- **Dropdown Menus**: Equipment and downloads sections with hover/click interactions
- **AI Chat Widget** (`js/chat-widget.js`): Customer support chatbot integration
  - Session-based conversations with unique session IDs
  - Webhook integration for backend processing
  - Auto-greeting functionality
  - Floating button interface

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

### External Resources
- **Google Fonts**: Open Sans font family for typography
- **Font Awesome**: Icon library (Kit: 14b830158f.js) used in some components

### Deployment Platform
- **Replit Hosting**: Site is configured for deployment on Replit's hosting service
- **No Build Process**: Static files served directly without compilation or bundling

### Contact Information
- Phone: +54 (9 3401) 514509
- Email: ser.agro@gruposer.com.ar
- Physical Location: Omar Carrascos 2773, Rosario, Argentina