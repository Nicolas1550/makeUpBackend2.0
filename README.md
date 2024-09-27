# Makeup - E-commerce Platform Backend 💄

This is the backend repository for the **Makeup** project, which powers the e-commerce platform for beauty products, services, and course management.

## 🚀 Tech Stack

The backend is built with the following technologies:

- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white)
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
- ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
- ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white)

## 🌟 Features

- **Real-time updates**: WebSocket support for real-time updates on orders and services.
- **User & Role Management**: Assign roles and services to users with real-time communication via WhatsApp.
- **E-commerce**: Integration with MercadoPago for secure online payments.
- **Order Management**: Full support for managing and tracking orders for both users and admins.
- **Admin Dashboard**: Role-based access to add products, edit services, and track sales.

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nicolas1550/backendMakeup.git
   cd backendMakeup
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file with your environment variables. Here's an example:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=makeup_db
   JWT_SECRET=yourjwtsecret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`.

## 🛠️ Key Dependencies

- **Node.js**: Backend runtime.
- **Express.js**: Web framework for handling HTTP requests.
- **MySQL**: Database for storing user, product, and order data.
- **Sequelize**: ORM for managing MySQL interactions.
- **Socket.IO**: For real-time communication between the server and the frontend.
- **Passport.js**: For user authentication and role-based access.

## 🔗 Frontend Repository

Make sure to clone and set up the frontend repository to fully use the application:
- [Frontend Repository](https://github.com/Nicolas1550/makeup-frontend)

## 💼 About the Developer

I'm Nicolas Luciuk, a Full Stack Developer with a passion for building scalable, secure, and high-performing applications. Connect with me on LinkedIn!

- [LinkedIn Profile](https://www.linkedin.com/in/nicolas-luciuk/)

## 📄 License

This project is licensed under the MIT License.
