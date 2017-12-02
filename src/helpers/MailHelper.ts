import * as nodeMailer from 'nodemailer';
import * as emailExistence from 'email-existence';
import Project from '../config/Project';

class MailHelper {
    private static transporter: nodeMailer.Transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: Project.SMTP.AUTHENTICATOR.USERNAME,
            pass: Project.SMTP.AUTHENTICATOR.PASSWORD
        }
    });

    static async sendMail(email: string, subject: string, text?: string, html?: string): Promise<nodeMailer.SentMessageInfo> {
        return await this.transporter.sendMail({
            from: `${Project.SMTP.SENDER.NAME} <${Project.SMTP.SENDER.EMAIL}>`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html // html body
        });
    }

    static checkRealEmail(email: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            emailExistence.check(email, (error, response) => {
                if (error) {
                    console.error(error);
                    resolve(false);
                }
                resolve(response);
            });
        });
    }
}

Object.seal(MailHelper);
export default MailHelper;
