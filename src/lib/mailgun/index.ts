import mailgun from 'mailgun-js'
import fs from 'fs'
import ejs from 'ejs'
import { htmlToText } from 'html-to-text'
import juice from 'juice'
import dotenv from 'dotenv'
dotenv.config()

interface TemplateVars {
  name: string
  email: string
  link: string
}

class Mail {
  public to!: string
  public subject!: string
  public text!: string
  public html!: string
  public templateName!: string
  public templateVars!: TemplateVars
  private mg!: mailgun.Mailgun
  public error!: string

  constructor () {
    this.mg = mailgun({ apiKey: process.env.API_KEY, domain: process.env.DOMAIN })
  }

  public send = async () => {
    const templatePath = `src/lib/email/templates/${this.templateName}.html`
    if (this.templateName && fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, 'utf-8')
      this.html = juice(ejs.render(template, this.templateVars))
      this.text = htmlToText(this.html)
      const data = {
        from: process.env.EMAIL,
        to: this.to,
        subject: this.subject,
        html: this.html
      }
      try {
        await this.mg.messages().send(data)
      } catch (err) {
        this.error = err.message
      }
    }
  }
}

export default Mail
