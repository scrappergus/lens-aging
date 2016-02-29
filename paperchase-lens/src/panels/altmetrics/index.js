"use strict";

var Panel = require('lens/reader').Panel;
var AltmetricsController = require('./altmetrics_controller');

var panel = new Panel({
  name: "altmetrics",
  type: 'resource',
  title: 'Altmetrics',
  icon: 'fa-bar-chart-o',
});

panel.createController = function(doc) {
  return new AltmetricsController(doc, this.config);
};

module.exports = panel;
