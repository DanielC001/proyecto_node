import { knex } from 'knex'
import dotenv  from 'dotenv'

dotenv.config({
    path:'./.env'
});

export const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        database: 'gestion_citas',
        user: 'postgres',
        password: process.env.PSW,
    },
})

export default db