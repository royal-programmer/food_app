const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
module.exports = class Email {
  constructor(_0x56f13c, _0x36147c) {
    this.to = _0x56f13c.email;
    this.firstName = _0x56f13c.name.split(" ")[0x0];
    this.url = _0x36147c;
    this.from = "Foodie <" + process.env.EMAIL_FROM + ">";
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
  async ["send"](_0x408aef, _0x425876) {
    const _0xfa45d8 = pug.renderFile(__dirname + "/../view/" + _0x408aef + ".pug", {
      firstName: this.firstName,
      lastName: this.lastName,
      url: this.url,
      subject: _0x425876
    });
    const _0x1551ff = {
      from: this.from,
      to: this.to,
      subject: _0x425876,
      html: _0xfa45d8,
      text: htmlToText.convert(_0xfa45d8)
    };
    await this.newTransport().sendMail(_0x1551ff);
  }
  async ["sendWelcome"]() {
    await this.send("welcome", "welcome to the Foodie!");
  }
  async ["sendPasswordReset"]() {
    await this.send("passwordReset", "Password reset token (valid for only 5 minutes)");
  }
};