
import app from './app.js';
import nodemailer from "nodemailer";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`RentChain backend running on port ${PORT}`);
});
