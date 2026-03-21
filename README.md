# TaskMaster - Full-Stack Application

A production-ready full-stack web application built with React, Node.js, Express, and PostgreSQL, designed for deployment on AWS.

## Features
- **User Authentication**: Secure JWT-based registration and login.
- **Task Management**: Create, read, update, and delete tasks.
- **Filtering**: View all tasks, pending tasks, or completed tasks.
- **Modern UI**: Clean and responsive user interface.

## Tech Stack
- **Frontend**: React, Vite, React Router, Axios, Lucide Icons.
- **Backend**: Node.js, Express, Prisma ORM, JSON Web Tokens (JWT), Bcrypt.
- **Database**: PostgreSQL.
- **DevOps**: Docker, Docker Compose, GitHub Actions.

## Local Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js (v18+)

### Running with Docker Compose
The easiest way to run the entire stack locally is using Docker Compose:

1. Clone the repository.
2. Run the following command in the root directory:
   ```bash
   docker compose up --build
   ```
3. The frontend will be available at `http://localhost`, the backend at `http://localhost:5000`, and PostgreSQL at `localhost:5432`.

*(Note: On the first run, the backend will attempt to connect to the DB. You need to run `npx prisma db push` inside the backend container or locally if pointing to localhost:5432 to create the tables natively.)*

### Running Manually

**Backend:**
1. `cd backend`
2. `npm install`
3. Configure `.env` with a local PostgreSQL `DATABASE_URL`.
4. `npx prisma db push` to sync your schema.
5. `npm run dev` to start the server.

**Frontend:**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## AWS Deployment Guide

This project is structured to fit perfectly into a standard AWS architecture. 

### 1. Database (Amazon RDS)
- Navigate to AWS RDS and create a new **PostgreSQL** database instance.
- Ensure it's placed in a VPC with appropriate Security Groups (allow incoming connections from your EC2 instance on port 5432).
- Note the Endpoint URL, Username, and Password.
- Update your backend's `.env` or production environment variables with the new `DATABASE_URL`.

### 2. Backend (Amazon EC2 / ECS)
**Using EC2 (Simpler):**
- Launch an EC2 instance (Ubuntu/Amazon Linux).
- SSH into the instance and install Docker & Docker Compose.
- Clone your repository.
- Modify `docker-compose.yml` to only run the `backend` service, and pass the RDS `DATABASE_URL` as an environment variable.
- Run `docker compose up -d backend`.
- Ensure the EC2 Security Group allows inbound traffic on port `5000` or configure a reverse proxy (Nginx) to route traffic from port 80 to 5000.

### 3. Frontend (Amazon S3 + CloudFront)
- Navigate to the `frontend` directory and run `npm run build`. This generates a `dist/` folder.
- Go to AWS S3 and create a new bucket (e.g., `taskmaster-frontend`).
- Enable "Static website hosting" on the S3 bucket.
- Upload the contents of the `dist/` folder to the S3 bucket.
- To ensure React Router works correctly, go to error documents and point 404 errors to `index.html`.
- **For Production**: Set up Amazon CloudFront distribution pointing to your S3 bucket. This acts as a CDN and allows you to easily attach an SSL/TLS certificate via AWS Certificate Manager (ACM).

### 4. CI/CD (GitHub Actions)
A `.github/workflows/main.yml` is included to automatically build the project on pushes. You can extend this to automatically deploy:
- Push the Docker image to Amazon ECR.
- Deploy the frontend build to the S3 bucket via `aws s3 sync`.

## License
MIT License
