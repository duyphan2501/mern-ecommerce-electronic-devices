import PayOS from "@payos/node";
import dotenv from "dotenv";
import ngrok from "ngrok";
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 3000;

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY,
);

const startNgrokAndConfirmWebhook = async () => {
  try {
    // Khởi tạo ngrok và lấy URL runtime
    let url;
    if (process.env.NODE_ENV === "development") url = await ngrok.connect(PORT);
    else url = process.env.BACKEND_URL;
    const webhookUrl = `${url}/api/payment/webhook/payos`;

    // Confirm webhook với PayOS
    await payOS.confirmWebhook(webhookUrl);
    console.log("Webhook confirmed with:", webhookUrl);
  } catch (error) {
    console.error("Error confirming webhook:", error);
  }
};

export { payOS, startNgrokAndConfirmWebhook };
