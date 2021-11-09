const Client = require('pg').Client;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

function setup () { 
  if (!client || !client.connectionString) {
    console.error("Not connected to a database");
    return;
  }
  client.connect().then(() => {
    setupTables();
  }).catch(err => {
    console.error(err);
  });
}

function setupTables () {
  Promise.all([
    require('./blog/blog-post').setup
  ]).catch(err => {
    console.error(err);
  })
}

async function query (sql, values = [], callback = undefined) {
  return new Promise((resolve, reject) => {
    client.query(sql, values, (err, res) => {
        if (err) {
          console.log(err.message);
          reject(err.message);
        } else {
          if (callback) {
            callback(res);
          }
          resolve(res);
        }
    });
  }); 
}

/**
 * Inserts a row to the table.
 * @param {String} tableName 
 * @param {*} params An object containing all the params 
 * @param {Function} callback 
 */
async function insertQuery(tableName, params = {}, callback = undefined) {
  let queryText = "";
  let paramsText = ""
  let values = [];
  for (const [key, value] of Object.entries(params)) {
    if (paramsText.length != 0)
        paramsText += ", ";
    paramsText += key;
    values.push(value);
  }
  queryText = "INSERT INTO " + tableName + " ";
  if (values.length != 0) {
    queryText += "(" + paramsText + ") VALUES(";
    for (let i = 0; i < values.length; i++) {
      if (i != 0)
        queryText += ", ";
      queryText += "$" + (i + 1);
    }
    queryText += ") ";
  } else {
    queryText += "DEFAULT VALUES ";
  }
  queryText += "RETURNING *";
  return query(queryText, values, callback);
}

/**
 * Returns fieldName = $x part of the query for params that are defined.
 * @param {Number} startingIndex The index at which the optional arguments start in the query
 * @param {*} params An object containing the params
 */
function getOptionalParamQueryString (params = {}, startingIndex = 1, seperator = ",") {
  let s = "";
  let j = 0;
  for (const [key, value] of Object.entries(params)) {
    if (value != undefined)  {
      if (s.length != 0)
        s+= seperator + " ";
      s += key + " = $" + (startingIndex + j) + " ";
      j++;
    }
  }
  return s;
}

/**
 * Updates a row in the table
 * @param {String} tableName
 * @param {Number} id 
 * @param {*} params An object containing the params
 * @param {Function} callback 
 */
async function updateQuery (tableName, id, params = {}, callback = undefined) {
  let queryText = 'UPDATE ' + tableName + ' SET ';
  if (Object.entries(params).length == 0)
    throw new WebException(400, "Tried to do update with no values");
  queryText += getOptionalParamQueryString(params, 2);
  queryText += 'WHERE id = $1 RETURNING *';
  let values = Object.values(params);
  values.unshift = id;
  return query(queryText, values, callback);
}

/**
 * Reads rows that match the params
 * @param {String} tableName 
 * @param {*} params An object containing the params 
 * @param {{colname, acsending}} ordering 
 * @param {Function} callback 
 */
async function selectQuery (tableName, params = {}, ordering, callback) {
  let queryText = 'SELECT * FROM ' + tableName + ' WHERE ';
  return fillInWhere(queryText, params, callback, ordering);
}

/**
 * Reads rows that match the params
 * @param {String} tableName 
 * @param {*} params An object containing the params 
 * @param {Function} callback 
 */
 async function countQuery (tableName, params = {}, callback) {
  let queryText = 'SELECT COUNT(*) FROM ' + tableName + ' WHERE ';
  return fillInWhere(queryText, params, callback);
}

async function fillInWhere (queryText, params = {}, callback, ordering) {
    if (Object.entries(params).length == 0)
      queryText += "TRUE";
    else 
      queryText += getOptionalParamQueryString(params, 1, "AND");
    let values = Object.values(params);
    if (ordering && ordering.colname) {
      queryText += " ORDER BY " + ordering.colname + " ";
      queryText += ordering.acsending ? "ACS" : "DESC";
    }
    return query(queryText, values, callback);
}

async function deleteQuary (tableName, id, callback) {
  let queryText = `DELETE FROM ${tableName} WHERE id = $1`;
  return query(queryText, [id], callback);
}

module.exports.setup = setup;
module.exports.query = query;
module.exports.insertQuery = insertQuery;
module.exports.updateQuery = updateQuery;
module.exports.selectQuery = selectQuery;
module.exports.countQuery = countQuery;
module.exports.deleteQuary = deleteQuary;