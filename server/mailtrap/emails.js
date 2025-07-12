import { client, sender } from "./email.config.js";
import { verificationEmail, resetPassword } from "./email.templates.js";

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const recipient = [{ email }];
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: verificationEmail.replace("{verificationToken}", verificationToken),
      category: "Email Verification"
    });
    console.log(response)
  } catch (error) {
    console.log(error);
  } 
};

const sendForgotPasswordEMail = async(email, resetUrl) => {
  try {
    const recipient = [{email}]
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset password",
      html: resetPassword.replace("{resetUrl}", resetUrl),
      category: "Reset Password"
    })  
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

export { sendVerificationEmail, sendForgotPasswordEMail };
