#!/usr/bin/nodejs --max-old-space-size=8192
var fs = require('fs');

var initXML = fs.readFileSync('./Annex60.Controls.Continuous.Examples.LimPID_init.xml');

var mod = require('./Annex60.Controls.Continuous.Examples.LimPID.js');
mod.FS_createDataFile("/", 'Annex60.Controls.Continuous.Examples.LimPID_init.xml', initXML, true, false);
mod.FS_createLazyFile("/", 'Annex60.Controls.Continuous.Examples.LimPID_info.xml', 'Annex60.Controls.Continuous.Examples.LimPID_info.xml', true, false);
mod.callMain(process.argv.slice(2));

var fname = 'Annex60.Controls.Continuous.Examples.LimPID_res.mat';
var content = mod.OpenModelica_readFile(fname);
fs.writeFileSync(fname,content);