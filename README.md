# SnapLink — URL Shortener & QR Code Generator

SnapLink is a full-stack web application that allows users to shorten long URLs, generate QR codes, and track link analytics in real time.

## Features

- User Authentication (JWT)
- URL Shortening with custom short codes
- QR Code generation for each link
- Click Analytics (device, browser, country)
- User Dashboard to manage links

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs

## Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

## Project Structure

```
snaplink/
├── backend/         # Express API
├── frontend/        # React App
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
└── ErDiagram.md
```
