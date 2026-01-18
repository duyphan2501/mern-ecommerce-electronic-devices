import  { verificationEmail, resetPassword, orderConfirmationEmail } from "./email.templates.js";
import dotenv from "dotenv";
import transporter from "./email.config.js";

dotenv.config({ quiet: true });

const sendEmail = async (email, subject, html) => {
  const options = {
    from: `"Electronic Company" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject,  
    html,
  };
  const info = await transporter.sendMail(options);
  console.log("Message sent:", info.messageId);
};

const sendVerificationEmail = async (email, verificationToken) => {
  const htmlContent = verificationEmail.replace(
    "{verificationToken}",
    verificationToken
  );
  await sendEmail(email, "Verify your email", htmlContent);
};

const sendForgotPasswordEmail = async (email, resetUrl) => {
  const htmlContent = resetPassword.replace("{resetUrl}", resetUrl);
  await sendEmail(email, "Reset your password", htmlContent);
};

const sendOrderConfirmEmail = async (order) => {
  const { subject, html } = orderConfirmationEmail(
    order.orderId,
    order.items,
    order.totalPrice,
    order.shippingInfo,
    order.payment.provider
  );
  await sendEmail(order.email, subject, html)
};
  
export { sendVerificationEmail, sendForgotPasswordEmail, sendOrderConfirmEmail };