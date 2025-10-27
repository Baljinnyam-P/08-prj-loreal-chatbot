# L'Oréal Product Advisor Chatbot

A modern, AI-powered chatbot that helps users discover and understand L'Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances. The chatbot provides personalized routines and recommendations, all styled to match L'Oréal's brand identity.

## ✨ Features

- **L'Oréal Branding:** Uses official brand colors (black, white, gold, red) and logo for a professional look.
- **Responsive Design:** Works beautifully on desktop and mobile devices.
- **Modern Chat UI:** Distinct message bubbles for user and assistant, mimicking real chat apps.
- **Conversation History:** Tracks context, including user name and past questions, for natural multi-turn interactions.
- **Polite AI:** Only answers questions about L'Oréal products, routines, and beauty topics. Politely refuses unrelated queries.
- **Secure API Key:** API requests are routed through a Cloudflare Worker, keeping your OpenAI key safe.
- **Personalized Experience:** Displays the user's latest question above the bot response, resetting with each new question.
- **Easy Deployment:** Ready to run in GitHub Codespaces or deploy to your own server.

## 🚀 Getting Started

1. **Open in GitHub Codespaces:**

   - Click the **Code** button in your repo and select **Open with Codespaces → New codespace**.
   - Open `index.html` via the live preview.

2. **Cloudflare Worker Setup:**

   - Store your OpenAI API key securely in Cloudflare Worker secrets.
   - Deploy the Worker and update your chatbot's endpoint URL in `script.js`.

3. **Customize:**
   - Add your own L'Oréal logo to the `img` folder as `loreal-logo.png`.
   - Tweak colors and layout in `style.css` if desired.

## 🖼️ Preview

![L'Oréal Chatbot Screenshot](img/loreal-chatbot-preview.png)

## 📚 Technologies Used

- HTML, CSS, JavaScript (beginner-friendly, no frameworks)
- OpenAI GPT-4o API (via Cloudflare Worker)
- Responsive web design

## 🏆 Project Highlights

- Beautiful, branded UI for L'Oréal
- Secure, privacy-focused API integration
- Real-time, multi-turn chat experience
- Ready to showcase on your GitHub profile!

---

Enjoy building your L'Oréal beauty assistant! 💄
