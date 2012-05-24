var request = require('request');
var resistance = require('resistance');
var strf = require('strf');
var time = require('time');

var Report = function(host, obj, timezone) {
  this.host = host;
  this.name = obj.name;
  this.metrics = obj.metrics;
  this.to = obj.to;
  this.timezone = timezone;
};

Report.prototype.fetch = function(cb) {
  var self = this;

  var now = new time.Date();
  if (this.timezone) {
    now.setTimezone(this.timezone);
  }
  var today = new time.Date(now.getFullYear(), now.getMonth(), now.getDate());
  var tomorrow = new time.Date(today.getTime() + 1000*60*60*24);

  var start = today.toISOString();
  var stop = tomorrow.toISOString();

  var queue = resistance.queue(function(metric, done) {
    var url = strf('{host}/1.0/metric?expression={expression}&start={start}&stop={stop}&step={step}', {
      host: self.host,
      expression: metric.expression,
      start: start,
      stop: stop,
      step: 3600000
    });

    request({ 
      url: url,
      json: true
    }, function(err, res, body) {
      var count = 0;
      body.forEach(function(item) {
        count += item.value;
      });
      metric.count = count;
      metric.start = start;
      metric.stop = stop;
      metric.date = today.getTime();
      done(metric);
    });

  });

  queue.push(this.metrics);
  queue.run(function(results) {
    cb(results);
  });
};

Report.prototype.toString = function() {
  return this.data.name;
};

module.exports = Report;
