# Nothing Client App

A modern e-commerce web application built with React, TypeScript, and Vite, featuring a sleek user interface and comprehensive product management capabilities.

## 🚀 Features

- **Modern Tech Stack**: Built with React, TypeScript, and Vite for optimal performance
- **Responsive Design**: Fully responsive UI that works seamlessly across all devices
- **UI Components**: Extensive collection of reusable UI components powered by shadcn/ui
- **Product Management**: Complete product browsing and purchasing functionality
- **Payment Integration**: Secure payment processing through Razorpay
- **User Experience**: Interactive features including:
  - Product previews
  - Shopping cart
  - Order confirmation
  - Social sharing
  - Referral system
  - Leaderboard
  - FAQ section

## 🛠️ Technical Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query
- **UI Components**: Custom components + shadcn/ui
- **Payment Gateway**: Razorpay
- **Code Quality**: ESLint, TypeScript strict mode

## 📦 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages/routes
├── hooks/         # Custom React hooks
├── lib/          # Utilities and constants
└── schema/       # Data models and types
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SinhaGautam/nothing-client-app.git
   cd nothing-client-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

The project includes a comprehensive set of UI components located in `src/components/ui/`:

- Buttons, Inputs, and Forms
- Modal Dialogs and Alerts
- Navigation Components
- Data Display Components
- Layout Components
- Interactive Elements

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_RAZORPAY_KEY=your_razorpay_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Gautam Sinha** - *Initial work* - [SinhaGautam](https://github.com/SinhaGautam)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing UI components
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://reactjs.org/) for the awesome frontend library
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
