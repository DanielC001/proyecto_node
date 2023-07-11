import express, {Request, Response } from 'express'
import logger from './utils/logger' 
import routes from './api/routes'
import { errorHandlerMiddleware } from './middleware/errorHandler'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
});

const app = express()
//const port = 8087


// Crea un middleware para convertir 
// todos los bodies de los request en JSON
app.use(express.json())
app.use( errorHandlerMiddleware )
app.use('/api/v1', routes)


app.listen(process.env.PORT, () =>{
    logger.info(`Server is listening on port ${process.env.PORT}`)
}
)
