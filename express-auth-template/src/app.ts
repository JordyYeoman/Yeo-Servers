require("dotenv").config();
import express from "express";
import config from "config";

const app = express();
const port = config.get("port");

console.log("Systems Online and Ready, sir");
