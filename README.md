[![build status](https://secure.travis-ci.org/jgallen23/cube-reports.png)](http://travis-ci.org/jgallen23/cube-reports)
#Cube Reports

This is a tool to help you send daily reports from your [cube](http://square.github.com/cube/) data.

##Installation

	npm install cube-reports

##Usage

Edit the sample-config.json to put in the metrics that you care most about and then run:

	cube-reports config.json

##Email settings

You need to provide your own smtp information to send emails.  You can see what the config object looks like here: 

[https://github.com/andris9/Nodemailer#setting-up-smtp](https://github.com/andris9/Nodemailer#setting-up-smtp)
