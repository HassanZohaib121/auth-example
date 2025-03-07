# Authentication Example with Prisma and MySQL

This project is a simple authentication example demonstrating login, signup, password reset features, and session management using Prisma with a MySQL database. The application is built using only server actions.

## Features
- User Registration (Signup)
- User Login
- Password Reset
- Session Management with Cookies
- Secure Authentication using Prisma

## Tech Stack
- **Next.js 15.1.7**: React framework with server actions
- **Prisma 6.4.0**: ORM for MySQL
- **MySQL**: Relational database management system
- **bcryptjs**: Password hashing
- **Nodemailer**: For sending password reset emails
- **Tailwind CSS**: Styling
- **ShadCN Middleware**: UI components and middleware
- **Zod**: Schema validation

## Installation

```sh
git clone https://github.com/HassanZohaib121/auth-example.git
cd auth-example
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Install Using Template

```sh
npx create-next-app --example https://github.com/HassanZohaib121/auth-example <YOUR_APP_NAME>
```

## Environment Variables
Create a `.env` file in the root directory and add the following:

```sh
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
# use command openssl rand -base64 32
SESSION_SECRET="your-secret-key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
EMAIL_SERVER_USER="example@email.com"
EMAIL_SERVER_PASS="yourpassword"
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
```

## Prisma Setup
```sh
npx prisma init
npx prisma generate
npx prisma migrate dev
```

## Scripts
- `npm run dev`: Start development server
- `npm run build`: Build the project
- `npm run start`: Start production server
- `npm run lint`: Run linter

## License
This project is licensed under the MIT License.

