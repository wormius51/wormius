const client = require('../db-client');

async function setup () {
    return client.query(`
    CREATE TABLE IF NOT EXIST blogpost(
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL DEFAULT 'New Post',
        coverimage VARCHAR(40) NOT NULL DEFAULT '/images/worm.png',
        content VARCHAR(80000) NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'draft'
    )`);
}

/**
 * Creates a new blog post.
 * Initially in draft status.
 * @param {{title, coverimage, content}} params An object containing the params
 * @returns 
 */
async function create (params) {
    return client.insertQuery("blogpost", params);
}

module.exports.setup = setup;
module.exports.create = create;