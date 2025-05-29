# Chatich

**Chatich** is an open-source web application for displaying live chat messages from Twitch, Kick, and YouTube channels. It is designed for stream overlays, OBS browser sources, and custom widgets, with real-time updates and flexible styling.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/matias-obezzi/chatich.git
cd chatich
npm install
# or
yarn install
```

### Running the Application

Start the development server:

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```sh
npm run build
npm run preview
# or
yarn build
yarn preview
```

---

## 🛠️ How to Contribute & Add Features

We welcome contributions! Here’s how you can help improve Chatich:

### 1. Fork & Clone

- Fork this repository.
- Clone your fork to your local machine.

### 2. Create a Feature Branch

```sh
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Add new features, fix bugs, or improve documentation.
- Follow the existing code style and structure.
- If you add a new chat provider or feature, document it in the code and README.

### 4. Test Your Changes

- Run the application locally and verify your changes work as expected.
- Add or update unit tests if applicable.

### 5. Commit & Push

```sh
git add .
git commit -m "Describe your changes"
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

- Go to the GitHub page for your fork.
- Click "Compare & pull request".
- Describe your changes and submit the PR.

---

## 💡 Adding New Features

- **New Chat Providers:**  
  Add a new context/provider in `src/contexts/` and a new handler in the main page. Update the documentation and translations.
- **Custom Styles:**  
  Add new style keys to the `CustomStyles` type and update the documentation.
- **Translations:**  
  Add new languages to the `translations` object in documentation and UI components.
- **UI Improvements:**  
  Use [Tailwind CSS](https://tailwindcss.com/) for styling. Keep the UI responsive and accessible.

---

## 📚 Documentation

- See the [Home page](src/pages/home.tsx) for usage and customization.
- For questions or issues, please open an issue or discussion on GitHub.

---

## 📝 License

MIT

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) for the React framework
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [tmi.js](https://tmijs.com/) for Twitch chat integration