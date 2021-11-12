const client = require('../db-client');

async function setup () {
    return client.query(`
    CREATE TABLE IF NOT EXISTS blogpost(
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL DEFAULT 'New Post',
        coverimage VARCHAR(40) NOT NULL DEFAULT '/images/worm.png',
        content VARCHAR(80000) NOT NULL DEFAULT '<h1 class = "primaryText">New Post</h1>',
        status VARCHAR(10) NOT NULL DEFAULT 'draft',
        creationdate DATE NOT NULL DEFAULT CURRENT_DATE,
        publishdate DATE
    )`);
}

/**
 * Creates a new blog post.
 * Initially in draft status.
 * @param {{title, coverimage, content}} params An object containing the params
 */
async function create (params) {
    return client.insertQuery("blogpost", params);
}

/**
 * Reads posts that match the params.
 * Initially in draft status.
 * @param {{id, title}} params An object containing the params
 * @param {{colname, acsending}} ordering 
 */
async function read (params, ordering) {
    return client.selectQuery("blogpost", params, ordering);
}

/**
 * Update a post.
 * @param {{title, coverimage, content, status}} params An object containing the params
 */
async function update (params) {
    let id = params.id;
    params.id = undefined;
    return client.updateQuery("blogpost", id ,params);
}

/**
 * Delete delete a post.
 * @param {Number} id 
 */
async function deletePost (id) {
    return client.deleteQuary("blogpost", id);
}

async function publish (id) {
    return client.query(`
    UPDATE blogpost SET 
    status = 'published', 
    publishdate = CURRENT_DATE
    WHERE id = $1
    AND status != 'published'
    RETURNING *`, [id]);
}

module.exports.setup = setup;
module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.delete = deletePost;
module.exports.publish = publish;