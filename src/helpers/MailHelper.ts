import * as nodeMailer from 'nodemailer';
import Project from '../config/Project';

export default class MailHelper {
    private static transporter: nodeMailer.Transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: Project.SMTP_SETTINGS.AUTHENTICATOR.USERNAME,
            pass: Project.SMTP_SETTINGS.AUTHENTICATOR.PASSWORD
        }
    });

    static async sendMail(email: string, subject: string, text?: string, html?: string): Promise<nodeMailer.SentMessageInfo> {
        return await this.transporter.sendMail({
            from: `${Project.SMTP_SETTINGS.SENDER.NAME} <${Project.SMTP_SETTINGS.SENDER.EMAIL}>`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html // html body
        });
    }
}
