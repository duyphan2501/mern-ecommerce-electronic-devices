import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"

dotenv.config()
const TOKEN = process.env.MAILTRAP_TOKEN;

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Duy Phan",
};

export {client, sender}