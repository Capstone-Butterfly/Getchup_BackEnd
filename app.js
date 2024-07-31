const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes'); //same as ('./routes/index')
const verifyToken = require('./middleware/authMiddleware');

require('dotenv').config();

require('./models/db');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.path === '/api/v1/login' || req.path === '/api/v1/createAccount') {
      return next();
    }
    return verifyToken(req, res, next);
  });
app.use('/api/v1', router);
app.get("/", (req, res, next) => {
   res.json({
        status:200,
        message: "Hello from Getchup!! "

   })
});

app.get("/*", (req, res, next) => {
    res.contentType = 'text/plain';
    res.status(404);
    res.send("Not found");
});

app.listen(8080, () => {
    console.log("Server running on port 8080.");
});
