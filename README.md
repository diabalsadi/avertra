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

## 🚀 Quick Start Scripts

For testing and development purposes, here are bash scripts using curl commands to interact with the API:

### User Management Scripts

#### Register a New User
```bash
#!/bin/bash
# register_user.sh - Register a new user

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login User
```bash
#!/bin/bash
# login_user.sh - Login a user and get JWT token

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

#### Get Current User Info
```bash
#!/bin/bash
# get_user.sh - Get current user information
# Replace YOUR_JWT_TOKEN with the token from login response

TOKEN="YOUR_JWT_TOKEN"

curl -X GET http://localhost:3000/api/auth/getuser \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Blog Management Scripts

#### Create a New Blog Post
```bash
#!/bin/bash
# create_blog.sh - Create a new blog post
# Replace YOUR_JWT_TOKEN and USER_ID with actual values

TOKEN="YOUR_JWT_TOKEN"
USER_ID="YOUR_USER_ID"

curl -X POST http://localhost:3000/api/blog/createBlog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "description": "This is the content of my first blog post. It contains interesting information about web development.",
    "imgSrc": "https://example.com/image.jpg",
    "userId": "'$USER_ID'"
  }'
```

#### Get All Blog Posts
```bash
#!/bin/bash
# get_all_blogs.sh - Retrieve all blog posts

curl -X GET "http://localhost:3000/api/blog/getAll?offset=0" \
  -H "Content-Type: application/json"
```

#### Get Specific Blog Post
```bash
#!/bin/bash
# get_blog.sh - Get a specific blog post by ID
# Replace BLOG_ID with actual blog ID

BLOG_ID="YOUR_BLOG_ID"

curl -X GET "http://localhost:3000/api/blog/getArticle?id=$BLOG_ID" \
  -H "Content-Type: application/json"
```

#### Update Blog Post
```bash
#!/bin/bash
# update_blog.sh - Update an existing blog post
# Replace YOUR_JWT_TOKEN and BLOG_ID with actual values

TOKEN="YOUR_JWT_TOKEN"
BLOG_ID="YOUR_BLOG_ID"

curl -X PATCH http://localhost:3000/api/blog/updateBlog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'$BLOG_ID'",
    "title": "Updated Blog Post Title",
    "description": "This is the updated content of the blog post.",
    "imgSrc": "https://example.com/updated-image.jpg"
  }'
```

#### Delete Blog Post
```bash
#!/bin/bash
# delete_blog.sh - Delete a blog post
# Replace YOUR_JWT_TOKEN and BLOG_ID with actual values

TOKEN="YOUR_JWT_TOKEN"
BLOG_ID="YOUR_BLOG_ID"

curl -X DELETE http://localhost:3000/api/blog/deleteBlog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'$BLOG_ID'"
  }'
```

### Complete Workflow Example

Here's a complete example showing how to register a user, login, and create a blog post:

```bash
#!/bin/bash
# complete_workflow.sh - Complete example workflow

echo "1. Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123",
    "firstName": "Test",
    "lastName": "User"
  }')

echo "Register Response: $REGISTER_RESPONSE"

echo -e "\n2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token and user ID from response (requires jq)
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.id')

echo -e "\n3. Creating a blog post..."
BLOG_RESPONSE=$(curl -s -X POST http://localhost:3000/api/blog/createBlog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Test Blog Post",
    "description": "This is a test blog post created via API.",
    "imgSrc": "https://via.placeholder.com/800x600",
    "userId": "'$USER_ID'"
  }')

echo "Blog Creation Response: $BLOG_RESPONSE"

echo -e "\n4. Getting all blogs..."
curl -s -X GET "http://localhost:3000/api/blog/getAll?offset=0" \
  -H "Content-Type: application/json" | jq '.'
```

### Prerequisites for Scripts

To use these scripts effectively:

1. **Make scripts executable**:
   ```bash
   chmod +x *.sh
   ```

2. **Install jq for JSON parsing** (optional but recommended):
   ```bash
   # macOS
   brew install jq

   # Ubuntu/Debian
   sudo apt-get install jq
   ```

3. **Ensure your development server is running**:
   ```bash
   npm run dev
   ```

### Usage Tips

- Replace placeholder values (`YOUR_JWT_TOKEN`, `USER_ID`, etc.) with actual values from API responses
- Store tokens in environment variables for security: `export TOKEN="your_jwt_token"`
- Use the complete workflow script as a starting point for testing
- Monitor the development server console for request logs
- Use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for GUI-based API testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## What to improve 🤔
1. Add a caching system to not hit the db a lot
2. More dynamic routing for create and update the blogs
