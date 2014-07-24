var http   = require('http');
var parseRes = require('./parse');

var req = {
  host: 'api.qz.com',
  path: '/0/things/srccon/dailyBrief'
};

function getStream (res) {
  var str = '';

  res.on('data', function (chunk) {
    str += chunk;
  });

  res.on('error', function (err) {
    console.error(err);
  });

  res.on('end', function () {
    var json = JSON.parse(str);
    parseRes(json);
  });
}

module.exports = function () {
  http.get(req, getStream);
};
