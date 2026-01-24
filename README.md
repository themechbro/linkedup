## LinkedUp

LinkedUp is a LinkedIn-style social networking application built to explore real-world backend and full-stack concepts such as users, connections, posts, messaging, and conversations.

This repository includes the database schema backup required to run the project locally.

## 📦 Tech Stack

**Backend**: Node.js / Express

**Database**: PostgreSQL

**Frontend**: React / Next.js (if applicable)

**Auth**: Sessions / JWT (as implemented)

**Microservice**: Java Spring Boot

## Backend And Spring Boot Repo

- Backend (https://github.com/themechbro/linkedup-backend)
- Microservice (https://github.com/themechbro/linkedup_microservice)

## 🗄️ Database Setup

The project ships with a PostgreSQL SQL file that defines the **entire database structure** required for the application to run.

### What the SQL file contains

- Tables

- Columns and data types

- Primary keys & foreign keys

- Indexes

- Sequences

- Triggers and functions

> ⚠️ The file may also contain demo/sample data.
> This is intentional for development convenience.

## 🚀 Getting Started (Local Setup)

### 1️⃣ Create a PostgreSQL database

CREATE DATABASE linkedup;

### 2️⃣ Restore the database schema

- Using psql:

psql -U postgres -d linkedup -f linkedup_schema.sql

- Or using pgAdmin:

Create an empty database named linkedup

Right-click the database → Restore

Select linkedup_schema.sql

- Restore

### 3️⃣ Configure environment variables

Create a .env file in the backend root:

- DB_HOST=localhost
- DB_PORT=5432
- DB_NAME=linkedup
- DB_USER=postgres
- DB_PASSWORD=your_password

### 4️⃣ Run the backend

npm install
npm run dev

## 📊 Database Structure Overview

Key tables include:

- users – user profiles and authentication data

- posts – user posts

- comments – post comments

- connections – accepted user connections

- connection_requests – pending connection requests

- messages – chat messages

- conversations – user conversations

- education – education details

- jobs – job / experience details

- session – session tracking

## 🧠 Notes for Contributors

The database schema is version-controlled via SQL, not migrations.

If you modify the schema, regenerate the SQL backup before committing.

For production setups, consider splitting:

- schema.sql

- seed.sql

## 📜 License

This project is for educational and learning purposes.

## 🙌 Acknowledgements

Inspired by real-world social networking platforms to practice scalable backend and database design.
