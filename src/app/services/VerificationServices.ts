import nodemailer from "nodemailer";

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

  static async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = verificationCodes.get(email);
    if (storedCode === code) {
      verificationCodes.delete(email); 
      return true;
    }
    return false;
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
