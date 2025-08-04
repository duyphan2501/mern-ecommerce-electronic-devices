import { resend, sender } from "./email.config.js";
import { verificationEmail, resetPassword } from "./email.templates.js";

const sendVerificationEmail = async (email, verificationToken) => {
  const htmlContent = verificationEmail.replace(
    "{verificationToken}",
    verificationToken
  );

  const result = await resend.emails.send({
    from: sender,
    to: email,
    subject: "Verify your email",
    html: htmlContent,
  });

  if (result.error) {
    throw new Error(result.error.error);
  }
};

const sendForgotPasswordEmail = async (email, resetUrl) => {
  const htmlContent = resetPassword.replace("{resetUrl}", resetUrl);

  const result = await resend.emails.send({
    from: sender,
    to: email,
    subject: "Reset your password",
    html: htmlContent,
  });

  if (result.error) {
    throw new Error(result.error.error);
  }
};

export { sendVerificationEmail, sendForgotPasswordEmail };
