const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static('app'));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
        return true;
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
        return true;
      });
    });
  }
}

app.post('/cars', async function(req, res) {
  const {type} = req.body;

  const typeId = await databaseQuery(
    `select id from types where type = '${type}'`
  );
  const productData = await databaseQuery(
    `select img, id from trucks where type_id = '${typeId[0].id}'`
  );

  res.send(JSON.stringify(productData));
})

app.post('/orderedcars', async function(req, res) {
  const orderedCars = await databaseQuery(
    `select truck_id from orders`
  );

  res.send(JSON.stringify(orderedCars));
})

app.post('/orders', async function(req, res) {
  const {truck_id, userDataName, userDataPhone} = req.body;

  const orderedCars = await databaseQuery(
    `insert into orders (truck_id, user_name, user_phone) values (${truck_id}, '${userDataName}', '${userDataPhone}');`
  );

  res.send(JSON.stringify({msg: '202'}));
})

app.post('/message', async function(req, res) {
  const {phone, name, msg} = req.body;

  try {
    await databaseQuery(
      `insert into consultation (phone, name, msg) values ('${phone}', '${name}', '${msg}')`
    );
    res.send(JSON.stringify({code: 0}));
  } catch(ex) {
    res.send(JSON.stringify({code: 1}));
  }
})

app.post('/achivements', async function(req, res) {
  const images = await databaseQuery(
    `select image from achivements`
  );

  res.send(JSON.stringify(images));
})

const databaseQuery = async function(query) {
  const database = new Database({
    host: 'localhost',
    database: 'gengergen',
    user: 'mysql',
    password: 'mysql'
  });

  const dataFromDatabase = await database.query(query).then(rows => rows);
  const result = await database.close().then(() => dataFromDatabase);
  return result;
};

http.createServer(app).listen(PORT);
