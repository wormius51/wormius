const Client = require('pg').Client;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

function setup () { 
  if (process.env.DATABASE_URL) {
    client.connect();
  }
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
 * @param {Array<{fieldName: String, value}>} params 
 * @param {Function} callback 
 */
async function insertQuery(tableName, params = [], callback = undefined) {
  let queryText = "";
  let paramsText = ""
  let values = [];
  params.forEach(param => {
    if (param.value != undefined) {
      if (paramsText.length != 0)
      paramsText += ", ";
      paramsText += param.fieldName;
      values.push(param.value);
    }
  });
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
 * @param {Array<{fieldName: String, value}>} params An array of {fieldName, value}
 */
function getOptionalParamQueryString (params = [], startingIndex = 1, seperator = ",") {
  let s = "";
  let j = 0;
  for (let i = 0; i < params.length; i++) {
    if (params[i].value != undefined)  {
      if (s.length != 0)
        s+= seperator + " ";
      s += params[i].fieldName + " = $" + (startingIndex + j) + " ";
      j++;
    }
  }
  return s;
}

/**
 * Updates a row in the table
 * @param {String} tableName
 * @param {Number} id 
 * @param {Array<{fieldName: String, value}>} params An array of {fieldName, value}
 * @param {Function} callback 
 */
async function updateQuery (tableName, id, params = [], callback = undefined) {
  let queryText = 'UPDATE ' + tableName + ' SET ';
  if (params.every(param => param.value == undefined))
    throw new WebException(400, "Tried to do update with no values");
  queryText += getOptionalParamQueryString(params, 2);
  queryText += 'WHERE id = $1 RETURNING *';
  let values = [id];
  params.forEach(param => {
    if (param.value != undefined)
      values.push(param.value);
  });
  return query(queryText, values, callback);
}

/**
 * Reads rows that match the params
 * @param {String} tableName 
 * @param {Array<{fieldName, value}>} params 
 * @param {Function} callback 
 */
async function selectQuery (tableName, params = [], callback) {
  let queryText = 'SELECT * FROM ' + tableName + ' WHERE ';
  return fillInWhere(queryText, params, callback);
}

/**
 * Reads rows that match the params
 * @param {String} tableName 
 * @param {Array<{fieldName, value}>} params 
 * @param {Function} callback 
 */
 async function countQuery (tableName, params = [], callback) {
  let queryText = 'SELECT COUNT(*) FROM ' + tableName + ' WHERE ';
  return fillInWhere(queryText, params, callback);
}

async function fillInWhere (queryText, params = [], callback) {
    if (params.every(param => param.value == undefined))
      queryText += "TRUE";
    else 
      queryText += getOptionalParamQueryString(params, 1, "AND");
    let values = [];
    params.forEach(param => {
      if (param.value != undefined)
        values.push(param.value);
    });
    return query(queryText, values, callback);
}


module.exports.setup = setup;
module.exports.query = query;
module.exports.insertQuery = insertQuery;
module.exports.updateQuery = updateQuery;
module.exports.selectQuery = selectQuery;
module.exports.countQuery = countQuery;