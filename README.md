<p align="center">
  <a href="" rel="noopener">
    <img src="public/muf.png" alt="Project logo"></a>
</p>

<div align="center">
<h3 align="center">Usofe Front</h3>

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/nikFinogenov/usofe-front.svg)](https://github.com/nikFinogenov/usofe-front/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/nikFinogenov/usofe-front.svg)](https://github.com/nikFinogenov/usofe-front/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center" style="font-size: 25px;">
    <b>A front-end platform for the Muffin forum, where users can ask, discuss, and answer questions on various topics.</b>
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)
- [Backend](#backend)

## 🧐 About <a name = "about"></a>

Usofe Front is the front-end of the Muffin forum platform, a Q&A forum designed to facilitate discussions and knowledge sharing on various topics. Users can ask questions, provide answers, and engage with each other in a supportive community. The project aims to create an easy-to-use platform that encourages learning and collaboration.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will help you set up a local development environment for Usofe Front.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v20 or higher)
- npm (Node Package Manager)
- A backend server running (check out [Usofe Backend](https://github.com/nikFinogenov/usofe-back))

You can verify the installation and versions by running:

```bash
node -v
npm -v
```

### Installing

1. Clone the repository:

   ```bash
   git clone https://github.com/nikFinogenov/usofe-front
   ```

2. Navigate to the project directory:

   ```bash
   cd usofe-front
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env-example` and fill in the required environment variables:

   ```ini
   REACT_APP_URL="http://localhost:3000"
   REACT_APP_API="http://localhost:3306/api"
   REACT_APP_BASE="http://localhost:3306"
   ```

5. Start the application:

   ```bash
   npm start
   ```

Now, your front-end application should be running at `http://localhost:3000`.

## ⛏️ Built Using <a name = "built_using"></a>

- [React](https://reactjs.org/) - Front-end Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling Framework
- [Axios](https://axios-http.com/) - HTTP Client
- [React Router](https://reactrouter.com/) - Routing

## ✍️ Authors <a name = "authors"></a>

- [@nikFinogenov](https://github.com/nikFinogenov) - Idea & Initial work

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Thanks to the Muffin community for support and feedback.

## Backend <a name = "backend"></a>

For the backend of the project, please visit the [Usofe Backend repository](https://github.com/nikFinogenov/usofe-back).
```

This README includes sections about the project, installation instructions, environment variables, and a link to the backend repository.