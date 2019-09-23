const path = require('path');
const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
//console.log(__dirname + '/../public');
console.log(publicPath);

var app = express();
app.use(express.static(publicPath));

app.get('/',(req,res) => {
  res.render('index.html')
});
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
