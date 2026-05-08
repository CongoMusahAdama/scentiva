# Third-Party Services Integration Guide

This document outlines the third-party services used by Scentiva Aura and the required configuration keys for deployment.

## 1. Database & Infrastructure
### MongoDB Atlas
*   **Purpose**: Primary database for users, products, orders, and logs.
*   **Environment Variable**: `MONGODB_URI`
*   **Website**: [mongodb.com/atlas](https://www.mongodb.com/atlas)

### JWT (JSON Web Tokens)
*   **Purpose**: Secure authentication and session management.
*   **Environment Variables**: 
    *   `JWT_SECRET`: Random string for token signing.
    *   `JWT_EXPIRES_IN`: Token expiration (e.g., `1d`).

## 2. Communication Services
### Resend
*   **Purpose**: Transactional email delivery (Welcome emails, OTPs).
*   **Environment Variable**: `RESEND_API_KEY`
*   **Website**: [resend.com](https://resend.com)

### mNotify
*   **Purpose**: SMS gateway for OTP verification and admin notifications.
*   **Environment Variables**:
    *   `MNOTIFY_API_KEY`: API Key for the SMS service.
    *   `MNOTIFY_SENDER_ID`: Custom sender name (e.g., `Scentiva`).
    *   `ADMIN_PHONE_NOTIFICATION`: Phone number for admin alerts.
*   **Website**: [mnotify.com](https://mnotify.com)

## 3. Media & Assets
### Cloudinary
*   **Purpose**: Image hosting, optimization, and transformations for product photos and user avatars.
*   **Environment Variables**:
    *   `CLOUDINARY_CLOUD_NAME`
    *   `CLOUDINARY_API_KEY`
    *   `CLOUDINARY_API_SECRET`
*   **Website**: [cloudinary.com](https://cloudinary.com)

## 4. Frontend Configuration
### WhatsApp Integration
*   **Purpose**: Direct customer-to-admin communication for orders.
*   **Variable**: `NEXT_PUBLIC_WHATSAPP_NUMBER`

### API Connectivity
*   **Purpose**: Points the frontend to the correct backend endpoint.
*   **Variable**: `NEXT_PUBLIC_API_URL`

---
*Last Updated: May 8, 2026*
