var moment = require('moment');


var s = moment().valueOf();
console.log(s);
var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'));
