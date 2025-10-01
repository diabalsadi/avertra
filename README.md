# Avertra Blog Application

A modern, full-stack blog application built with Next.js, TypeScript, and PostgreSQL. Avertra provides a clean and intuitive platform for creating and managing blog posts with user authentication.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Blog Management**: Create, read, update, and delete blog posts
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript support throughout the application
- **Database Management**: PostgreSQL with Prisma ORM for robust data handling
- **Testing Suite**: Comprehensive testing with Jest and React Testing Library
- **Modern React**: Built with React 19 and Next.js 15

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Next.js 15**: React framework with server-side rendering and API routes
- **React 19**: Latest React with modern features
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible, unstyled UI components
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation

#### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma**: Modern database toolkit and ORM
- **PostgreSQL**: Robust relational database
- **NextAuth.js**: Authentication library for Next.js
- **Argon2**: Secure password hashing
- **JWT**: JSON Web Tokens for session management

#### Development & Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **ESLint**: Code linting for consistent code quality
- **Docker Compose**: Containerized development environment

### Project Structure

```
avertra/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Article/         # Blog article components
│   │   ├── DynamicForm/     # Form components
│   │   ├── Navigation/      # Navigation components
│   │   └── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── context/             # React context providers
│   ├── controllers/         # Business logic controllers
│   ├── generated/           # Generated Prisma client
│   ├── lib/                 # Utility functions
│   ├── pages/               # Next.js pages and API routes
│   │   ├── api/             # API endpoints
│   │   └── blogs/           # Blog-related pages
│   ├── services/            # External service integrations
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── tests/                   # Test files
└── coverage/                # Test coverage reports
```

### Key Components

1. **Authentication System**: JWT-based authentication with secure password hashing
2. **Blog Management**: CRUD operations for blog posts with user association
3. **Database Layer**: Prisma ORM with PostgreSQL for data persistence
4. **UI Components**: Modular, reusable components built with Radix UI
5. **API Layer**: RESTful API endpoints built with Next.js API routes

## 🛠️ Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for database)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/diabalsadi/avertra.git
cd avertra
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add the following environment variables to your `.env` file:

```env
# Database
DATABASE_URL="postgresql://dev:dev@localhost:5432/avertra"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### 4. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5432 with the following credentials:
- **Host**: localhost
- **Port**: 5432
- **Database**: avertra
- **Username**: dev
- **Password**: dev

### 5. Database Setup

Generate the Prisma client and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

Optionally, open Prisma Studio to view your database:

```bash
npx prisma studio
```

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run dev:turbo` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with coverage
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# View test coverage
npm run test -- --coverage
```

## 🐳 Docker Development

The project includes Docker Compose for the database. To manage the database container:

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f

# Restart database
docker-compose restart
```

## 🔧 Database Management

### Running Migrations

```bash
# Create and run a new migration
npx prisma migrate dev --name your-migration-name

# Reset database (development only)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

### Prisma Studio

Access the database GUI:

```bash
npx prisma studio
```

## 📁 Key Directories Explained

- **`src/components/`**: Reusable React components organized by feature
- **`src/controllers/`**: Business logic separated from API routes
- **`src/services/`**: External service integrations (JWT, Prisma)
- **`src/pages/api/`**: Next.js API routes for backend functionality
- **`src/types/`**: TypeScript type definitions
- **`prisma/`**: Database schema, migrations, and Prisma configuration

## 🔐 Authentication Flow

1. User registers with email/password
2. Password is hashed using Argon2
3. JWT token is generated upon successful login
4. Token is used to authenticate API requests
5. Protected routes verify JWT validity
