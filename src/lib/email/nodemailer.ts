import createTransporter from '../../config/transporter'
import fs from 'fs'
import ejs from 'ejs'
import { htmlToText } from 'html-to-text'
import juice from 'juice'

interface TemplateVars {
  name: string;
  email: string;
  link: string;
}

class Mail {
  public to!: string
  public subject!: string
  public html!: string
  public text!: string
  public templateName!: string
  public templateVars!: TemplateVars
  public error!: string | null

  constructor () {
    this.error = null
  }

  public sendMail = async () => {
    const templatePath = `src/lib/email/templates/${this.templateName}.html`
    if (this.templateName && fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, 'utf-8')
      this.html = juice(ejs.render(template, this.templateVars))
      this.text = htmlToText(this.html)
      const mailOptions = {
        from: process.env.EMAIL,
        to: this.to,
        subject: this.subject,
        html: this.html
      }
      const transporter = await createTransporter()
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          this.error = err.message
          if (!this.error) {
            this.error = 'Error on sending email... Username and pwd'
          }
        }
      })
    }
  }
}

export default Mail
