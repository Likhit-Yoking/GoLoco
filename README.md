<<<<<<< HEAD
# P48 - Online Event Ticketing and Management System

## 📖 Project Overview
P48 is a comprehensive, full-stack Online Event Ticketing and Management System designed to streamline the process of organizing events and booking tickets. It offers a seamless experience for both event organizers and attendees, featuring advanced capabilities such as interactive BookMyShow-style seat selection, automated QR code generation for tickets, and robust role-based access control.

## ✨ Features
- **User Authentication & Authorization**: Secure login and registration using JWT (JSON Web Tokens). Role-based authorization for varying access levels.
- **Organizer Dashboard**: Dedicated portal for event organizers to create, manage, and monitor their events.
- **Attendee Dashboard**: Personalized space for users to browse events, book tickets, and view their booking history.
- **Event CRUD Operations**: Full control over event creation, reading, updating, and deletion.
- **Multiple Ticket Types**: Support for diverse ticket categories (e.g., VIP, General Admission, Early Bird) with dynamic pricing.
- **Ticket Booking & Seat Availability**: Real-time tracking of seat availability to prevent double-booking.
- **BookMyShow-Style Seat Selection**: Interactive and intuitive graphical interface for users to select their preferred seats.
- **QR Code Generation**: Unique QR codes generated for each ticket to facilitate quick and secure check-ins at the venue.
- **My Bookings**: Easy access for attendees to view and manage their past and upcoming event tickets.
- **Cloud Integration**: 
  - **Azure SQL Database** for reliable, scalable, and secure data storage.
  - **Azure Blob Storage** for efficient handling of media files like event banners and user avatars.

## 💻 Tech Stack

### Frontend
- **React**: Modern UI library for building responsive user interfaces.
- **Vite**: Next-generation frontend tooling for fast development.
- **Axios**: Promise-based HTTP client for seamless API communication.

### Backend
- **ASP.NET Core Web API**: High-performance backend framework.
- **Entity Framework Core**: Robust ORM for database interactions.
- **JWT (JSON Web Tokens)**: Standardized method for securing endpoints.
- **SQL Server**: Relational database management.

### Azure (Cloud Infrastructure)
- **Azure SQL Database**: Managed relational database service.
- **Azure Blob Storage**: Object storage for unstructured data.
- **Azure App Service**: Fully managed platform for web app hosting.

## 📂 Folder Structure

```text
P48-Online-Event-Ticketing-System
│
├── frontend
│
├── backend
│
└── README.md
```

## 🚀 Installation & Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup
Navigate to the backend directory and run the ASP.NET Core API.

```bash
cd backend
dotnet restore
dotnet run
```

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

To properly run this application, set up the following environment variables.

### Frontend
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=your_backend_api_url
```
cp .env.example .env

### Backend
Add the following to your `appsettings.json` or configure them via environment variables:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your_azure_sql_connection_string"
  },
  "AzureBlobStorage": {
    "ConnectionString": "your_azure_blob_connection_string",
    "ContainerName": "your_container_name"
  }
}
```
Copy appsettings.example.json to appsettings.Development.json

## 📸 Screenshots

*(Placeholders for future screenshots)*

- **Home Page**: `[Add screenshot here]`
- **Organizer Dashboard**: `[Add screenshot here]`
- **Seat Selection Interface**: `[Add screenshot here]`
- **QR Code Ticket**: `[Add screenshot here]`

## 🔮 Future Enhancements
- Integration with third-party payment gateways (e.g., Stripe, PayPal).
- Real-time notifications and email confirmations for bookings.
- Advanced analytics and reporting for event organizers.
- Mobile application for attendees using React Native.

## 👥 Contributors
- **[Your Name/Team Name]** - *Initial work* - [Your GitHub Profile](https://github.com/your-username)

## 📄 License
This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

=======
# 🎟 GoLoco — Online Event Ticketing & Management Platform

A modern, fully responsive landing page for an Online Event Ticketing & Management System built with **React + Vite**. Featuring a premium dark glassmorphism UI, smooth Framer Motion animations, and a fully functional frontend filtering & booking flow.

---

## 🚀 Live Demo

> Run locally via `npm run dev` → Open http://localhost:5173

---

## ✨ Features

### 🎯 Core Sections
- **Sticky Glassmorphic Navbar** — Transparent initially, blurs & adds shadow on scroll with a mobile hamburger menu
- **Hero Section** — Animated heading, subheading, dual CTAs, and a custom SVG event illustration
- **Event Discovery Bar** — Compact Airbnb-style filter row with expandable search, category/location/date/price/sort pill dropdowns with popovers, availability toggle chips, and a reset button
- **Featured Statistics** — Scroll-animated cards showing Live Events, Tickets Sold, Cities, and Average Rating
- **Quick Filter Chips** — Horizontal scrollable category shortcuts (Music, Tech, Food, Sports, etc.)
- **Upcoming Events Grid** — 10 sample events with responsive 4/3/2/1 column layouts
- **Event Cards** — Glass cards featuring image zoom on hover, countdown ("Starts in X Days"), trending ribbon, organizer info, type badge (In-Person/Online), seats progress bar, bookmark & share actions
- **Grid / List View Toggle** — Switch between card grid and horizontal list layout
- **Real-time Filtering & Sorting** — All filter changes update event cards instantly with no page reload
- **Booking Modal** — Ticket quantity selector, billing breakdown with fees, and a confirmation receipt with QR code
- **Footer** — Branding, quick links, social icons, copyright

### 🎨 Design System
- **Theme**: Dark mode with glassmorphism (`backdrop-filter: blur`)
- **Colors**: Purple (`#7C3AED`) and Blue (`#3B82F6`) accent gradient
- **Font**: Inter (Google Fonts)
- **Border Radius**: 18px rounded corners
- **Animations**: Framer Motion entrance animations, staggered card reveals, hover lift, scale, and glow effects
- **Background**: Animated floating gradient glow spheres

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19.x | UI Framework |
| Vite | 8.x | Build Tool & Dev Server |
| Framer Motion | 12.x | Animations |
| Lucide React | 1.x | Icons |
| CSS Modules | Native | Scoped Component Styles |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Sticky header with scroll detection
│   ├── Navbar.module.css
│   ├── Hero.jsx             # Landing hero with SVG illustration
│   ├── Hero.module.css
│   ├── EventDiscovery.jsx   # Compact filter bar with popovers
│   ├── EventDiscovery.module.css
│   ├── EventList.jsx        # Stats, chips, grid controls, event grid
│   ├── EventList.module.css
│   ├── EventCard.jsx        # Individual event card component
│   ├── EventCard.module.css
│   ├── Footer.jsx           # Site footer
│   └── Footer.module.css
│
├── data/
│   └── events.js            # 10 sample event objects
│
├── App.jsx                  # Root layout + filter state + booking modal
├── App.css                  # Global layout + modal styles
├── main.jsx                 # React entry point
└── index.css                # CSS variables + resets
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/sai-sandeep-seelam/GoLoco.git
cd GoLoco

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `/dist` folder.

---

## 🔮 Future Roadmap

The codebase is structured to easily extend into a full-stack platform:

- [ ] React Router — Login, Sign Up, Event Details, Seat Selection
- [ ] QR Ticket Page
- [ ] Organizer Dashboard
- [ ] User Dashboard (Bookings, Wishlist)
- [ ] Backend API integration (Node.js / Firebase)
- [ ] Payment gateway (Razorpay / Stripe)
- [ ] Real-time seat availability (WebSockets)

---

## 📸 Screenshots

> Coming soon — run locally to see the live experience.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">Made with ❤️ by <a href="https://github.com/sai-sandeep-seelam">Sai Sandeep Seelam</a></p>
>>>>>>> 99d461b779b18391db45123b13e1ac9472642e41
