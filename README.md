# React macOS Clone

A web-based clone of the macOS desktop environment built with React, TypeScript, and Supabase. Features a working window system, app store, and custom app installation capabilities.

## Features

- 🖥️ Desktop environment with working windows
- 🚀 Window management (minimize, maximize, drag)
- 📱 App Store with installable applications
- 👤 User authentication
- 🎨 Customizable desktop background
- 📦 Custom app upload and installation
- 💾 Persistent storage with Supabase

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase
- Vite
- Zustand
- React-Rnd
- Lucide Icons

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Supabase account

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-macos-clone.git
   cd react-macos-clone
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```
