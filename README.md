# Priority Lab Microservices Monorepo

A hands-on event-driven, distributed system built with **NestJS**, **Prisma**, and **Nx**, simulating a scalable, production-grade architecture for invoice synchronization with authentication and document handling.

---

## Architecture Overview
              ┌─────────────────────────────┐
              │         Client / UI         │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │        API Gateway          │
              │  (JWT, Filtering, Proxy)    │
              │          :3006              │
              └─────┬─────────────┬─────────┘
                    │             │
    ┌───────────────▼──┐      ┌───▼───────────────────┐
    │  Prisma Service  │      │   Fake-Priority       │
    │   (Invoices DB)  │      │   (Invoices & PDFs)   │
    │       :3005      │      │        :3001          │
    └────────┬─────────┘      └───┬───────────────────┘
             │                    │
    ┌────────▼────────────┐   ┌───▼──────────────┐
    │  Worker-Prisma      │   │ Worker-Priority  │
    │   (3004)           │   │   (3003)         │
    └────────┬────────────┘   └────┬────────────┘
             │                     │
         ┌───▼───────────────────────────────┐
         │            Local-Queue            │
         │    (Simple Event Queue :3002)     │
         └───────────────────────────────────┘
## Service Responsibilities

### fake-auth
**Authentication microservice.**  
Provides login functionality with mock credentials, issues JWT tokens, and exposes a `/validate` endpoint for verifying those tokens. Used for securing access to other services via `Authorization` headers.

### fake-priority
**Mock external ERP API (e.g., Priority ERP).**  
Simulates an external system by exposing endpoints to:
- Fetch all or filtered invoices (`/invoices?updatedSince=...`)
- Retrieve individual invoice data (`/invoices/:id`)
- Download invoice PDF files (`/invoices/:id/pdf`)

### local-queue
**Minimal in-memory event queue.**  
Acts as a placeholder for systems like RabbitMQ or Redis Streams. Allows event-based architecture: services push and consume invoice update events without direct coupling.

### worker-priority
**Poller worker for syncing invoices from fake-priority.**  
Periodically checks `fake-priority` for new or updated invoices and sends those events to `local-queue` for downstream processing.

### worker-prisma
**Queue consumer and database updater.**  
Listens for invoice events from `local-queue` and updates the internal database by calling `prisma-service`.

### prisma-service
**Database microservice with Prisma.**  
Responsible for data persistence and queries. Exposes endpoints to:
- Filter and paginate invoices
- Upsert (insert/update) invoices into the database
- For local demo at angular app, will connect to this service instead of api gateway which requires more complex setup. Therefore there is authguard on the query api calls

### api-gateway
**Client-facing unified API.**  
Acts as a secure API Gateway:
- Verifies JWTs via `fake-auth`
- Routes invoice read/write requests to `prisma-service`
- Proxies PDF requests to `fake-priority`

Clients interact only with this service.

- **Fake-Auth**: (3000) Auth microservice, issues and validates JWTs.
- **API Gateway**: (3006) Handles all client requests, validates JWT via Fake-Auth, proxies to internal services.
- **Prisma Service**: (3005) Simple DB API (Invoices), uses Prisma/SQLite.
- **Fake-Priority**: (3001) Simulates an external ERP (Priority) API, provides fake invoices & PDFs.
- **Local-Queue**: (3002) In-memory event queue, used for event-driven sync.
- **Worker-Priority**: (3003) Polls Fake-Priority, pushes invoice updates to Local-Queue.
- **Worker-Prisma**: (3004) Pulls events from Local-Queue, upserts invoices in Prisma Service.

---

## Why is This Architecture Scalable?

- **Microservices:** Each concern (auth, API, ERP, queue, DB, background work) is a separately deployed app. You can scale them independently.
- **Event-driven:** Sync is decoupled via the local-queue—swap it with Redis/RabbitMQ for real production workloads.
- **API Gateway:** Single point for client validation, routing, and security. Makes adding more APIs/clients easy.
- **Replaceable Services:** Simulate real third-party APIs, swap DBs, or swap queue types without rewriting the system.
- **Clear Separation:** Each service is small, testable, and replaceable—critical for large teams or enterprise requirements.

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- [NestJS CLI](https://docs.nestjs.com/cli/overview) and [Nx CLI](https://nx.dev/) (optional, but helpful)
- Git (for code checkout)

---

## Setup & Running Locally

**1. Clone and install dependencies:**

git clone <your-repo-url>
cd priority-lab
npm install

**2. Generate Prisma Client and Migrate DB:**

npx prisma generate
npx prisma migrate dev --name init

**3. Start each service in a separate terminal:**
npx nx build fake-priority
npx nx serve fake-priority

*Do this for each service, replacing the name (fake-priority) with:*

## Service Ports

| Service          | Port |
|------------------|------|
| Fake-Auth        | 3000 |
| Fake-Priority    | 3001 |
| Local-Queue      | 3002 |
| Worker-Priority  | 3003 |
| Worker-Prisma    | 3004 |
| Prisma-Service   | 3005 |
| API-Gateway      | 3006 |
### 🚀 Demo Startup Script

The following Bash script launches each service in a **new terminal window** (Windows), waits briefly between each, then triggers the data sync from `fake-priority` into the database.

```bash
#!/bin/bash

# Start fake-auth
echo "Starting fake-auth..."
start "fake-auth" bash -c "npm run start:fake-auth; exec bash"
sleep 2

# Start fake-priority
echo "Starting fake-priority..."
start "fake-priority" bash -c "npm run start:fake-priority; exec bash"
sleep 2

# Start local-queue
echo "Starting local-queue..."
start "local-queue" bash -c "npm run start:local-queue; exec bash"
sleep 2

# Start worker-priority
echo "Starting worker-priority..."
start "worker-priority" bash -c "npm run start:worker-priority; exec bash"
sleep 2

# Start worker-prisma
echo "Starting worker-prisma..."
start "worker-prisma" bash -c "npm run start:worker-prisma; exec bash"
sleep 2

# Start prisma-service
echo "Starting prisma-service..."
start "prisma-service" bash -c "npm run start:prisma-service; exec bash"
sleep 5

# Sync invoices from fake-priority
echo "Triggering sync from fake-priority - one document each time..."
curl -X POST http://localhost:3004/api/worker/sync
sleep 2

# Process and save to DB via worker-prisma
echo "Triggering process to save invoices to DB... - one document each time "
curl -X POST http://localhost:3005/api/worker/process

echo "✅ Demo environment initialized."
```

> 💡 **Note:**
>
> * This script is for **Windows (Git Bash or WSL)**.
> * On macOS/Linux, replace `start "window-name" bash -c` with `gnome-terminal -- bash -c` or similar alternatives.
> * Ensure `concurrently`, `nx`, and project dependencies are installed before running.
