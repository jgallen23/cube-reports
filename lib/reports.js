var Report = require('./report');
var resistance = require('resistance');
var nodemailer = require('nodemailer');
var fs = require('fs');
var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

var Reports = function(config) {
  if (typeof config === 'string') {
    config = JSON.parse(fs.readFileSync(config, 'utf8'));
  }

  this.config = config;
  this.items = config.reports.map(function(obj) {
    return new Report(config.cubeHost, obj, config.timezone);
  });
};

Reports.prototype.fetch = function(cb) {
  
  var queue = resistance.queue(function(report, done) {
    report.fetch(function(data) {
      done(report);
    });
  });

  queue.push(this.items);

  queue.run(function(results) {
    if (cb) {
      cb(results);
    }
  });
};

Reports.prototype.send = function(cb) {
  var self = this;
  var template = fs.readFileSync(__dirname + '/../views/report.html', 'utf8');

  var transport = nodemailer.createTransport("SMTP", this.config.email);

  var queue = resistance.queue(function(report, done) {
    var html = ejs.render(template, report);
    var mailObj = {
      from: self.config.email.from,
      to: (typeof report.to === 'string') ? report.to : report.to.join(','),
      subject: report.name + ' for ' + new Date().toDateString(),
      html: html
    };
    transport.sendMail(mailObj, done);
  });

  this.fetch(function(reports) {
    queue.push(reports);
    queue.run(cb);
  });

};

Reports.prototype.print = function(cb) {
  this.fetch(function(reports) {
    reports.forEach(function(report) {
      console.log(report.name);
      console.log('================');
      report.metrics.forEach(function(metric) {
        console.log('%s: %s', metric.name, metric.count);
      });
      console.log('');
    });
    if (cb) cb();
  });
};

module.exports = Reports;
