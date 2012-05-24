


var argv = require('optimist')
  .usage('Send daily email reports\n$0 <config.json>')
  .demand(1)
  .options('p', {
    alias: 'print',
    describe: 'Print report to stdout'
  })
  .boolean('p')
  .argv;


if (argv._.length == 1) {
  var file = argv._[0];
  var Reports = require('../lib/reports');

  var reports = new Reports(file);

  if (argv.print) {
    reports.fetch(function(reports) {
      reports.forEach(function(report) {
        console.log(report.name);
        console.log('================');
        report.metrics.forEach(function(metric) {
          console.log('%s: %s', metric.name, metric.count);
        });
        console.log('');
      });
      
    });
    
  } else {
    reports.send(function() {
      console.log('Email Sent');
    });
  }
}


