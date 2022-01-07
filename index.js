const express = require('express')
const app = express()
const cors = require("cors");
const db = require("./models");
const port = 8080
const routes = require('./routes')
const fileUpload = require('express-fileupload')
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload({
  createParentPath: true
}))
app.use(routes);

db.sequelize.sync();

app.use(express.static("frontend/build/"));
const frontEndServer = (req, res) => {
  res.sendFile("frontend/build/index.html", { root: __dirname });
};

app.get('/', frontEndServer)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;