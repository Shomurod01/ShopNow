# Setup Instructions

## Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- Stripe account (test keys)

## Installation

1. Install root dependencies:

```bash
npm install
```

2. Install server dependencies:

```bash
cd server && npm install && cd ..
```

3. Install client dependencies:

```bash
cd client && npm install && cd ..
```

4. Configure environment:

- Copy `server/.env.example` to `server/.env`
- Update MongoDB URI
- Add your Stripe secret key
- Copy `client/.env.local` (template provided)
- Add your Stripe publishable key

5. Seed database:

```bash
npm run seed
```

6. Start app:

```bash
npm run dev
```

Server: http://localhost:5000
Client: http://localhost:5173

## Demo Accounts

- Admin: admin@example.com / admin123
- User: user@example.com / user123
