import nodemailer from "nodemailer";
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: SMTP_EMAIL,
      to: email,
      subject: "2FA Code",
      html: `<p>Your 2FA code: ${token}</p>`,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const resetLink = `${domain}/auth/new-password?token=${token}`;

  try {
    await transport.sendMail({
      from: SMTP_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  try {
    await transport.sendMail({
      from: SMTP_EMAIL,
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  } catch (error) {
    console.log(error);
  }
};
