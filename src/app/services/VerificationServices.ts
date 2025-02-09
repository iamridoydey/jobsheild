import nodemailer from "nodemailer";
import { UserServices } from "./userServices";

const verificationCodes = new Map();


export class VerificationService {
  static async sendVerificationEmail(email: string): Promise<boolean> {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      verificationCodes.set(email, code);

      await this.sendEmail(email, code);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  static async verifyCode(email: string, code: string) {
    const storedCode = verificationCodes.get(email);

    if (storedCode === code) {
      verificationCodes.delete(email);

      try {
        // Find the user by email
        const user = await UserServices.getUser({ email });

        if (!user) return {}; // User not found

        // Update the user to mark them as verified
        const updatedUser = await UserServices.updateUser({
          id: user.id,
          isVerified: true,
        });

        return updatedUser; // Return the updated user
      } catch (error) {
        console.error("Error verifying user:", error);
        return {}; // Return empty object on error
      }
    }

    return {};
  }

  private static async sendEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
  }
}
