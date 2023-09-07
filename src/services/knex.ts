import { Knex, knex as knexBuilder } from 'knex'
import { env } from '../env'

const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: env.APPDB_PG_HOST,
        port: env.APPDB_PG_PORT,
        user: env.APPDB_PG_USER,
        password: env.APPDB_PG_PASSWORD,
        database: env.APPDB_PG_DATABASE,
        timezone: 'UTC',
    },
    log: {
        warn(message) {
            console.warn(message)
        },
        error(message) {
            console.error(message)
        },
        deprecate(message) {
            console.warn(message)
        },
        debug(message) {
            console.debug(message)
        },
    },
    pool: {
        max: 100,
        min: 20,
    },
    searchPath: ['public'],
}

export const knex: Knex = knexBuilder(config)
