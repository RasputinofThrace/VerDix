
# 🌱 Verdix — AI-Powered Sustainability Intelligence Platform

Verdix is a full-stack web application that helps users make informed, sustainable purchasing decisions by analyzing the environmental impact of everyday products.

The platform uses AI-based image understanding, real-time processing, and a modern web interface to convert complex sustainability data into clear, actionable insights.

Verdix is currently built as a **stateless, API-driven full-stack application**, with a clean architecture designed for future scalability.

---

## 🚩 Problem Statement

Consumers want to choose sustainable products, but:
- Sustainability labels are inconsistent and hard to interpret
- Greenwashing makes brand claims unreliable
- Product lifecycle impact is rarely transparent
- Disposal and recycling information is unclear

As a result, users lack trustworthy, actionable information at the point of purchase.

---

## 💡 Solution

Verdix acts as a **decision-support system** for sustainable consumption.

Users can upload or scan product images, and Verdix:
- Analyzes packaging and materials using AI
- Generates a structured sustainability score
- Explains environmental trade-offs clearly
- Recommends better alternatives
- Provides disposal and recycling guidance

The system is designed to work in real time without requiring user accounts.

---

## ✨ Core Features

### 🔍 AI-Powered Product Analysis
- Image-based product input
- AI-driven material and packaging assessment
- Sustainability scoring across:
  - Packaging impact
  - Production considerations
  - Lifecycle footprint
- Human-readable explanations (pros & cons)

---

### 🔄 Alternative Discovery
- Suggests more sustainable product options
- Comparative sustainability insights
- Focus on practical, accessible alternatives

---

### 📊 Impact Awareness
- Visual explanation of environmental impact
- Simple equivalence-based comparisons
- Helps users understand how individual choices scale

---

### 🗺️ Recycling & Disposal Guidance
- Location-based recycling center discovery
- Category-specific disposal instructions
- Map-based navigation support

---

### 🎨 User Experience
- Modern, dark-mode-first interface
- Smooth animations and micro-interactions
- Responsive design for mobile and desktop
- Product-grade UI focus

---

## 🧱 Tech Stack

### Frontend
- **React.js**
- **TypeScript**
- **Tailwind CSS**
- Lucide Icons

### Backend
- **Node.js**
- **Express.js**
- RESTful API architecture
- Secure request handling

### AI Integration
- **Google Gemini API**
- Image understanding & sustainability reasoning
- Custom scoring logic

> Note: Verdix currently does not persist user or product data in a database.  
> The architecture is intentionally designed to support future database integration.

---

## 🏗️ Project Structure

```

verdix/
│
├── frontend/        # React + Tailwind UI
├── backend/         # Node.js + Express APIs
├── shared/          # Shared utilities & types
└── README.md

````

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/immansha/verdix.git
cd verdix
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run start
```

---

## 🔮 Planned Enhancements

* Database integration for user history and analytics
* Barcode-based product scanning
* User profiles & sustainability tracking
* Community challenges and impact visualization
* Multi-language support
* Retail and brand integrations

---

## 🎯 Why Verdix?

Verdix demonstrates:

* Full-stack application design
* AI integration in real-world workflows
* Clean separation of frontend and backend
* Product-first engineering mindset
* Honest, scalable system architecture

---

## 👩‍💻 Author

**Mansha Kshatriya**
Computer Science | Full-Stack & AI Enthusiast

GitHub: [https://github.com/immansha](https://github.com/immansha)

---

## 📄 License

MIT License


