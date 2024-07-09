const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0x0];
    this.url = url;
    this.from = `Foodie <${process.env.EMAIL_FROM}>`;
  }

  ["newTransport"]() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async ["send"](template, subject) {
    const html = pug.renderFile(`${__dirname}/../view/${template}.pug`, {
      firstName: this.firstName,
      lastName: this.lastName,
      url: this.url,
      subject
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async ["sendWelcome"]() {
    await this.send("welcome", "welcome to the Foodie!");
  }
  
  async ["sendPasswordReset"]() {
    await this.send("passwordReset", "Password reset token (valid for only 5 minutes)");
  }
};