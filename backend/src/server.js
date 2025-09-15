
import app from './app.js';
import { connectDB } from './utils/db.js';

const PORT = process.env.PORT || 5001;

const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
    } else {
      console.warn('MONGO_URI not set. Auth features requiring DB will not work.');
    }
    app.listen(PORT, () => {
      console.log(`RentChain backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
