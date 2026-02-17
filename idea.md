# SnapLink — Project Idea

## Overview

**SnapLink** is a full-stack URL Shortener and QR Code Generator web application. It allows users to convert long, complex URLs into short, shareable links and generate custom QR codes for those links. The platform also provides a detailed analytics dashboard to track link performance.

## Problem Statement

Long URLs are difficult to share, remember, and track. There is no easy way for individuals or small businesses to manage their links, understand who is clicking them, and from where. SnapLink solves this by providing a clean, fast, and feature-rich link management platform.

## Scope

- User registration and login with JWT-based authentication
- URL shortening with auto-generated short codes (using nanoid)
- Custom QR code generation for each shortened link
- Click analytics: track total clicks, device type, browser, and country
- User dashboard to view, manage, and delete their links
- Public redirect endpoint for short links

## Key Features

| Feature | Description |
|---|---|
| **User Auth** | Signup/Login with JWT tokens, password hashing with bcrypt |
| **URL Shortening** | Convert long URLs to short aliases (e.g., `snplink.io/abc123`) |
| **QR Code Generator** | Auto-generate downloadable QR codes for each link |
| **Analytics Dashboard** | Track clicks, device info, browser, and geolocation per link |
| **Link Management** | View history, copy links, delete links from user dashboard |
| **Redirect Service** | Fast redirect from short URL to original URL |

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Router, Axios, Recharts, qrcode.react |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **URL Shortening** | nanoid |
| **QR Code** | qrcode (npm) |

## OOP & Software Engineering Principles Applied

- **Encapsulation**: Business logic separated into Services/Controllers
- **Abstraction**: Repository/Model layer abstracts DB operations
- **Separation of Concerns**: Routes → Controllers → Services → Models
- **Design Patterns**: Singleton (DB connection), MVC architecture
- **Clean Code**: Modular file structure, meaningful naming conventions
