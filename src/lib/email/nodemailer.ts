import nodemailer from 'nodemailer'
import config from '../../config/transporter'
import smtpTransport from 'nodemailer-smtp-transport'
import fs from 'fs'
import ejs from 'ejs'
import { htmlToText } from 'html-to-text'
import juice from 'juice'

interface TemplateVars {
  name: string;
  email: string;
  resetLink: string;
}

class Mail {
  public to!: string
  public subject!: string
  public html!: string
  public text!: string
  public templateName!: string
  public templateVars!: TemplateVars
  public error!: string | null
  private transporter!: nodemailer.Transporter

  constructor () {
    this.transporter = this.configureTransporter()
    this.error = null
  }

  public sendMail () {
    const templatePath = `src/lib/email/templates/${this.templateName}.html`
    if (this.templateName && fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, 'utf-8')
      this.html = juice(ejs.render(template, this.templateVars))
      this.text = htmlToText(this.html)
      const mailOptions = {
        from: config.user,
        to: this.to,
        subject: this.subject,
        html: this.html
      }
      this.transporter.sendMail(mailOptions, err => {
        if (err) {
          this.error = 'Error on sending email to user!'
        }
      })
    }
  }

  private configureTransporter () {
    return nodemailer.createTransport(smtpTransport({
      service: config.service,
      host: config.host,
      port: config.port,
      secure: false,
      auth: {
        user: config.user,
        pass: config.password
      },
      tls: { rejectUnauthorized: false }
    }))
  }
}

export default Mail
