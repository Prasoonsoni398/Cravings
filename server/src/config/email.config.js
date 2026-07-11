import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    console.log("Started Sending Email");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME || "soniprasoon392@gmail.com",
        pass: process.env.GMAIL_PASSCODE || "vzpibtsqlchzwwds",
      },
    });

    console.log("3....2....1")

    const mailOption = {
        from : process.env.GMAIL_USERNAME,
        to,
        subject,
        html:message,
    }

    console.log("sending Email");
    
    const res = await transporter.sendMail(mailOption)

    console.log(res);
    

  } catch (error) {
    console.log("Error sending email",error);
    throw error;
  }
};

export default sendEmail;

sendEmail(
    "soniprasoon396@gmail.com",
    "Prasoon Soni",
    "<h1 style='color:blue;'>Hi there prasoon soni is here </h1>"
)
