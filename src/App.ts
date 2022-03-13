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
      console.error(`Connection to postgreSQL failed: ${err}`)
    }
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use((req, res, next) => {
      res.header({ 'Access-Control-Allow-Origin': 'http://localhost:3000' })
      next()
    })
  }

  private routes (): void {
    this.express.use(routes)
  }
}

export default new App().express
