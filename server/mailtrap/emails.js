import { resend, sender } from "./email.config.js";
import { verificationEmail, resetPassword } from "./email.templates.js";

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const htmlContent = verificationEmail.replace("{verificationToken}", verificationToken);

    const data = await resend.emails.send({
      from: sender,
      to: email,
      subject: "Verify your email",
      html: htmlContent,
    }); 

    console.log("Verification email sent:", data);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const sendForgotPasswordEmail = async (email, resetUrl) => {
  try {
    const htmlContent = resetPassword.replace("{resetUrl}", resetUrl);

    const data = await resend.emails.send({
      from: sender,
      to: email,
      subject: "Reset your password",
      html: htmlContent,
    });

    console.log("Reset password email sent:", data?.id);
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

export { sendVerificationEmail, sendForgotPasswordEmail };
