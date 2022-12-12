const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: process.env.db_user,
        password: process.env.db_password,
        database: 'blog'
    }
});

module.exports = knex