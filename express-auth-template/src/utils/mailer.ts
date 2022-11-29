import config from "config";
import nodemailer from "nodemailer";

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

async function sendEmail() {}

export default sendEmail;
