require("dotenv").config();
import express from "express";
import router from "./api/routes";
import deserializeUser from "./middlware/deserializeUser";
import { notFound } from "./middlware/notFound";
import { errorHandler } from "./middlware/errorHandler";

const app = express();

app.use(express.json());

app.use(deserializeUser);

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

export default app;
