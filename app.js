import express from "express"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
import { pugEngine } from "nodemailer-pug-engine"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const sendEmail = async(email, ctx, txt) => {
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: process.env.SENDER,
            pass: process.env.PASSWORD,
        },
    });

    transporter.use('compile', pugEngine({
        templateDir: "./template",
        pretty: true
    }))

    const mailOptions = {
        from: process.env.SENDER,
        to: `${email}`,
        subject: txt,
        template: "template",
        ctx: ctx
    };

    try {
        transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Send mail success. Check your email"
        }
    } catch (error) {
        return {
            success: true,
            message: error.message
        }
    }
}

app.post("/send", async function (req, res) {
    const { ctx, receiver, subject } = req.body
    return res.json(await sendEmail(receiver, ctx, subject))
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
  