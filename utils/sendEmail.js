import nodemailer from "nodemailer";
import "dotenv/config";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_SECRET,
    refreshToken: process.env.OAUTH_REFRESH,
  },
});

async function sendEmail(reciever, subject, message) {
  console.log(process.env.EMAIL);
  const mailOptions = {
    from: process.env.EMAIL,
    to: reciever,
    subject: subject,
    html: message,
  };
  return await transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log(info);
    })
    .catch((err) => {
      console.error(err);
    });
}

export default sendEmail;
