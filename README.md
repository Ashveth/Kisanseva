🌾 KisanSeva – AI Powered Smart Farming Assistant

KisanSeva is an AI-driven smart agriculture platform designed to help farmers make data-driven decisions about crops, disease management, expenses, and market trends.
It combines Artificial Intelligence, weather data, and farm analytics to improve productivity and sustainability.

🚀 Features
🌱 Basic Features
🔐 User Authentication

Secure email signup & login

Password reset support

Built with Supabase Auth

🌍 Multi-language Support

Supports multiple Indian languages:

English

Hindi

Marathi

Telugu

Tamil

Kannada

Bengali

📊 Dashboard

Central dashboard providing:

Weather widget

Farm statistics

Recent diary entries

Quick access to tools

📔 Farm Diary

Farmers can log:

Daily activities

Expenses

Income

Crop tags

Export records to PDF for documentation.

📈 Monthly Expense Charts

Visual analytics using Recharts to help farmers understand spending patterns.

👤 Profile Management

Farm profile includes:

Farm size

Soil type

Crops grown

Irrigation method

🔔 Notifications

System alerts

Read / unread tracking

Stored in database

📱 PWA Support

Installable on mobile homescreen

Offline shell caching

Works even with limited internet

🤖 AI Powered Features
🧑‍🌾 AI Chat Assistant

AI agricultural advisor

Provides farming tips and recommendations

Streaming responses with markdown support

🌾 Crop Advisor

Recommends the top 3 crops based on:

Soil nutrients (N, P, K)

Soil pH

Temperature

Rainfall

🌿 Disease Detection

Farmers can upload plant images and AI will:

Identify plant disease

Detect severity

Suggest treatments

Recommend organic solutions

📊 Crop Yield Predictor

Predicts expected crop production using:

Crop type

Soil nutrients

Farm size

Weather conditions

Irrigation method

Provides:

Estimated yield (tons/acre)

Risk factors

Optimization tips

📉 Market Intelligence

Provides AI generated insights on:

Crop prices

MSP values

Market trends

Best mandi to sell crops

Optimal selling time

🏛 Government Schemes

Searchable database of government schemes with:

AI powered eligibility checker

Quick farmer guidance

📚 Knowledge Base

Offline farming guide covering:

Crop diseases

Pest control

Best farming practices

🌦 Weather Integration

Location based weather forecasts using:

OpenWeatherMap API

🎤 Speech Recognition

Voice input support using Web Speech API.

Farmers can talk to the AI assistant instead of typing.

🛠 Tech Stack
Frontend

React 18

TypeScript

Vite

Tailwind CSS

shadcn/ui

Framer Motion

State Management

TanStack React Query

Routing

React Router v6

Charts

Recharts

PDF Export

jsPDF

jspdf-autotable

Markdown Rendering

react-markdown

remark-gfm

Backend

Supabase (Lovable Cloud)

PostgreSQL Database

Row Level Security (RLS)

Deno Edge Functions

AI Integration

All AI requests are handled using:

Lovable AI Gateway

Models used:

Feature	Model
AI Chat	Gemini 3 Flash Preview
Crop Advisor	Gemini 2.5 Flash
Disease Detection	Gemini 2.5 Flash
Yield Predictor	Gemini 2.5 Flash
Market Intelligence	Gemini 2.5 Flash
Scheme Eligibility	Gemini 2.5 Flash
🔑 API Keys Used
Key	Purpose
LOVABLE_API_KEY	AI Gateway access
Supabase Anon Key	Frontend database access
OpenWeatherMap API	Weather data

All secrets are stored securely in Edge Functions.

⚙️ How the System Works

1️⃣ User opens the website
2️⃣ PWA loads cached application shell instantly

3️⃣ User signs up / logs in via Supabase Auth

4️⃣ Dashboard loads:

Weather data

Farm statistics

Recent activities

5️⃣ AI features work through this flow:

Frontend → Edge Function → Lovable AI Gateway → AI Model → Response

6️⃣ Farm data is stored in PostgreSQL with Row Level Security

7️⃣ Offline support handled using Workbox caching
📱 PWA Installation

Users can install KisanSeva directly from the browser:

Open the website

Click Install App

App appears on mobile homescreen

🌍 Impact

KisanSeva helps farmers by:

Improving crop planning

Detecting diseases early

Predicting crop yield

Tracking farm finances

Understanding market trends

Accessing government schemes

Goal: Empower farmers with AI-driven agriculture tools.

👨‍💻 Team

Team Name: Zero Day

Team Leader
Ashveth Pawar

Team Members
Yash Shinde
Adarsh Mishra

📜 License

This project is built for Hackathon / Educational purposes.
