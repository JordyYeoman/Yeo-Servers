import { config } from "dotenv";
config();
import express from "express";
import authRoutes from "./routes/auth";
import passport from "passport";
 
require('./strategies/google');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT;

  app.use(passport.initialize());
  // TODO: Understand sessions with passport
//   app.use(passport.session());

  app.use("/api/auth", authRoutes);

  try {
    app.listen(PORT, () => {
      console.log("Server running on port: ", PORT);
    });
  } catch (err) {
    console.log("err", err);
  }
}

startServer();
