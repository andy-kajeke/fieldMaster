require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('body-parser-xml')(bodyParser);
const app = express();
const systemRouter = require('./routes/system.router');

app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true,     // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false // Only put nodes in array if >1
    }
}));

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(process.env.APP_PORT, () => {
  console.log('server is running at http://localhost:' + process.env.APP_PORT);
});

// Initialize routes
systemRouter(app);