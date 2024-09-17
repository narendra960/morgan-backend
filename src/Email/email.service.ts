import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as mg from 'mailgun-js';
require('dotenv').config();  

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private mailgun: mg.Mailgun;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service:'dreamhost',
      host: 'smtp.dreamhost.com',
      port: 587,
      auth: {
        type:'login',
        user: 'noreply@epiphanygames.net',
        pass: 'xaB*8dRW'
      },
      tls:{
          rejectUnauthorized: false
      },
      secure: false,
      debug:true
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'noreply@epiphanygames.net',
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'noreply@epiphanygames.net',
      to,
      subject: 'Password Reset',
      html: `
        <p>Hello,</p>
        <p>You've requested to reset your password. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request this, please ignore this email.</p>`
    };
    await this.transporter.sendMail(mailOptions);
  }
}