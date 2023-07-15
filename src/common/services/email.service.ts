import { Injectable } from "@nestjs/common";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface IMailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}


@Injectable()
class EmailService {
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    private from: string;
    constructor(
    ) {

    }

    async sendMail({ to, html, subject, text }: IMailOptions) {
        this.from = "Music Recommendation System"
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT!,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        let mailOptions = {
            from: this.from,
            text,
            to,
            html,
            subject,
        };
        return await this.transporter.sendMail(mailOptions);
    }


    async getOTPTemplate(otp: number) {
        return `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>OTP Email Template</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.5;
                        color: #333;
                        background-color: #f9f9f9;
                        padding: 0;
                        margin: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        border-radius: 4px;
                    }
                    h1 {
                        font-size: 24px;
                        margin: 0 0 20px;
                        color: #333;
                        text-align: center;
                    }
                
                    .otp {
                        font-size: 28px;
                        font-weight: bold;
                        color: #333;
                        text-align: center;
                        padding: 20px;
                        background-color: #f9f9f9;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .instructions {
                        margin: 20px 0;
                        padding: 0;
                        list-style: none;
                        font-size: 14px;
                        line-height: 1.5;
                    }
                    
                    .small-image{
                        width:30px;
            
                    }
                    .font-bold{
                        font-weight:600;
                    }
                    
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Dear user,</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <div class="otp">${otp}</div>
                    <p>Please enter this code on the verification page to confirm your account.</p>
                    <ul class="instructions">
                        <li class="font-bold">Do not share this OTP with anyone.</li>
                        <li>If you did not request this OTP, please ignore this email.</li>
                    </ul>
                </div>
            </body>
            </html>
            `

    }
}

export default EmailService;