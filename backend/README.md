# RentChain Backend

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- JWT, bcrypt
- Razorpay, Cloudinary/AWS S3

## Structure
- `src/config` — Configuration files
- `src/routes` — Express routes
- `src/controllers` — Route controllers
- `src/models` — Mongoose models
- `src/services` — Business logic
- `src/middleware` — Express middleware
- `src/modules` — Feature modules (auth, user, property, lease, payment, kyc, admin, notification, review, dispute, analytics)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables (see `.env.example`).
3. Start the server:
   ```bash
   npm run dev
   ```

---

Follow modular structure and best practices for all new features.