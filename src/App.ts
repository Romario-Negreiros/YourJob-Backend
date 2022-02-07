import express from 'express'
import cors from 'cors'
import db from './database'

import routes from './app/routes'

class App {
  public express: express.Application

  constructor () {
    this.express = express()

    this.middlewares()
    this.routes()
    this.database()
  }

  private async database (): Promise<void> {
    try {
      await db.sync()
    } catch (err) {
      console.log(`Connection to postgreSQL failed: ${err.message}`)
    }
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private routes (): void {
    this.express.use('/api', routes)
  }
}

export default new App().express
