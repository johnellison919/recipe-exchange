# Recipe Exchange

A full-stack recipe sharing platform where users can create, discover, and vote on recipes. Built with Angular and ASP.NET Core.

## Tech Stack

**Frontend**
- Angular 21 with standalone components and Signal-based state management
- Reactive Forms for input handling and validation
- Cookie-based authentication with HTTP interceptors

**Backend**
- .NET 9, ASP.NET Core MVC (Controllers)
- Entity Framework Core with MySQL (via Pomelo)
- Cookie authentication (HttpOnly, SameSite)
- Resend for transactional emails (confirmation, password reset)

## Features

- User registration and login with email confirmation
- Password reset via email
- Create, edit, and delete recipes with images
- Ingredient grouping, instructions, tags, and metadata (prep time, cook time, servings)
- Upvote/downvote system
- Save recipes to a personal collection
- User profiles with avatar upload
- Search and browse recipe feed
- Recently viewed recipes

## Project Structure

```
recipe-exchange/
├── backend/
│   └── RecipeExchange.Api/
│       ├── Controllers/      # Auth, Recipes, Upload endpoints
│       ├── Data/             # EF Core DbContext and migrations
│       ├── Dtos/             # Request/response data transfer objects
│       ├── Models/           # Entity models (User, Recipe, Vote, SavedRecipe)
│       ├── Services/         # Business logic (Auth, Recipe, Vote, Email, SavedRecipe)
│       └── Program.cs        # App configuration and middleware
└── frontend/
    └── src/app/
        ├── core/             # Auth service, guards, interceptors
        ├── features/         # Auth, recipes, settings, profile pages
        └── shared/           # Header, sidebar, avatar utilities
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v20+) and npm
- [MySQL](https://dev.mysql.com/downloads/) (v8+)

## Getting Started

### Database

Create a MySQL database:

```sql
CREATE DATABASE recipe_exchange;
```

### Backend

```bash
cd backend/RecipeExchange.Api

# Configure your connection string and settings
# Edit appsettings.Development.json with your MySQL credentials and Resend API key

# Run the API (migrations are applied automatically in development)
dotnet run
```

The API starts at `http://localhost:5163`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (proxies API requests to localhost:5163)
npm start
```

The app opens at `http://localhost:4200`.

## Configuration

Backend settings are in `appsettings.json` / `appsettings.Development.json`:

| Setting | Description |
|---------|-------------|
| `ConnectionStrings:DefaultConnection` | MySQL connection string |
| `Cors:AllowedOrigins` | Allowed frontend origins |
| `Resend:ApiKey` | API key for transactional emails |
| `Resend:FromEmail` | Sender email address |
| `FrontendBaseUrl` | Base URL used in email links |

For production, set these via environment variables rather than config files.

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register a new account |
| POST | `/api/auth/login` | No | Log in |
| POST | `/api/auth/logout` | Yes | Log out |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| GET | `/api/recipes` | No | List/search recipes |
| POST | `/api/recipes` | Yes | Create a recipe |
| GET | `/api/recipes/:id` | No | Get recipe details |
| PUT | `/api/recipes/:id` | Yes | Update a recipe |
| DELETE | `/api/recipes/:id` | Yes | Delete a recipe |
| POST | `/api/recipes/:id/vote` | Yes | Vote on a recipe |
| POST | `/api/upload` | Yes | Upload an image |
