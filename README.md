# Notah

<img src="frontend/public/notah-logo.gif" alt="Notah Logo" width=200></img>

## Table of Contents

- [What is Notah?](#what-is-notah)
- [How to Use](#how-to-use)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)

<a name="what-is-notah"></a>

## What is Notah?

Notah is a ChatGPT integrated note-taking app. It is minimalistic and simple to use, creating a fast and efficient experience for notetakers.

<a name="how-to-use"></a>

## How to Use

Notah is a web-based app. It is available [_here_](https://notah.heppoko.space/).

### Instructions:

1. If you want to take a quick, temporary note, click on **"Memo"** ([memo](https://notah.heppoko.space/memo)). You will be able to jot down notes with limited feature.
2. If you want to create different notebooks and pages with access to full feature, you will need to **"Signup"** ([signup](https://notah.heppoko.space/signup)) or **"Login"** ([login](https://notah.heppoko.space/login)).

For additional instructions, please watch the following 1-min introduction video:

<a href="https://youtu.be/I9foJZl5JS0?si=WG3fG9enp3JwEmUX">
<img src="https://img.youtube.com/vi/I9foJZl5JS0/hqdefault.jpg" alt="Notah Introduction Link" width=200></img>
</a>

<a name="technology-stack"></a>

## Technology Stack

Notah is a full-stack web application using React on the frontend, ASP.NET on the backend, and PostgreSQL as the database.

### Frontend:

- Language: Typescript
- Framework: React (Vite)
- Styling: Tailwind CSS
- State Management: React-Redux, Redux-Persist
- Routing: React-Router
- Hosting: Netlify.com (https://notah.heppoko.space/)

### Backend:

- Language: C#
- Framework: ASP.NET, Entity Framework
- Security: JWT Authentication, Password Hashing
- API: OpenAI API (ChatGPT)
- Hosting: Docker + Render.com

### Database:

- Database: PostgreSQL
- Hosting: Amazon Relational Database Server (RDS) - AWS

<a name="key-features"></a>

## Key Features

- Send prompts to ChatGPT and generate answers directly in your notes
- Customizable experience by creating different notebooks and pages
- Take notes using Textboxs, Shapes, and Tables
- Notes can be saved as PDF
