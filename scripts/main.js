(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
/*jshint indent: 2, node: true, nomen: true, browser: true*/
/*global React */

'use strict';
module.exports = React.createClass({displayName: 'exports',
  render: function () {
    return (game( {n:50, m:31}));
  }
});

var game = React.createClass({displayName: 'game',

  getInitialState: function () {
    //initialize a grid with all values set to false
    var n = this.props.n;
    var m = this.props.m;
    var settings = [];
    for(var i = 0; i < n; i++) {
        var row = [];
        for(var j = 0; j < m; j++) {
          row[j] = false;
        }
        settings[i] = row;
    }
    return ({settings: settings, running: false, interval: null});
  },

  toggleCell: function (i, j) {
    var settings = this.state.settings;
    settings[i][j] = !settings[i][j];
    this.setState({settings: settings});
  },

  tick: function () {
    var settings = this.state.settings;
    var maxI = this.props.n - 1;
    var maxJ = this.props.m - 1;

    var getNeighbours = function (i, j) {
      var left =  (i === 0) ? maxI : (i - 1);
      var right = (i === maxI) ? 0 : (i + 1);
      var top =   (j === 0) ? maxJ : (j - 1);
      var bot =   (j === maxJ) ? 0 : (j + 1);
      var neighbours = [settings[i][top], 
                        settings[i][bot],
                        settings[left][top],
                        settings[left][bot],
                        settings[right][top],
                        settings[right][bot],
                        settings[left][j],
                        settings[right][j]];

      return neighbours;
    };

    var countNeighbours = function (i, j) {
      var neighbours = getNeighbours(i, j);
      var count = neighbours.reduce(function (total, elem) { return(elem ? total+1 : total) }, 0);
      return count;
    };

    var computeNextState = function (i, j) {
      var count = countNeighbours(i, j),
          current = settings[i][j],
          next = null;
      if(current) {// any living cell with exactly 2 or 3 n. keeps on living
        if( count == 2 || count == 3) { next = true; }
        else { next = false; } // if less than 2 or more than 3 then it dies
      }
      else {
        if(count == 3) { next = true; } // any dead cell with exactly 3 n. becomes alive
        else { next = false; } // all other cases it keeps being dead
      }
      return next;
    };


    var newSettings = [];

    settings.forEach(function (row, i){
      newSettings[i] = [];
      row.forEach(function (elem, j){
        newSettings[i][j] = computeNextState(i, j);
      });
    });
    this.setState({settings: newSettings});
  },

  toggleRunning: function () {
    //console.log("toggleRunning");
    var running = !this.state.running,
        interval = this.state.interval;
    this.tick(); //we run this once so we dont have to wait 1000ms for the first tick
    if(running === true) { interval = setInterval(this.tick, 300); }
    else { clearInterval(interval); }
    
    this.setState({running: running, interval: interval, settings: this.state.settings});
    
  },

  resetAllCells: function () {
    clearInterval(this.state.interval);
    this.setState(this.getInitialState());
  },

  render: function () {
  	return (
        /* jshint ignore:start */
        React.DOM.div(null, 
          grid( {running:this.state.running, settings:this.state.settings, toggleCell:this.toggleCell, n:this.props.n, m:this.props.m}),
          React.DOM.div(null, 
            toggleRunningButton( {running:this.state.running, handleClick:this.toggleRunning} ),
            resetButton( {handleClick:this.resetAllCells} )
          )
        )
        /* jshint ignore:end */
  	);
  }
});

var cell = React.createClass({displayName: 'cell',

  toggle: function () {
    this.props.toggleCell(this.props.i, this.props.j);
  },

  render: function () {
    var W = this.props.cellSize,
        H = W,
        i = this.props.i,
        j = this.props.j,
        x = i*W,
        y = j*H;

    var setting = this.props.setting;
    var style;
    if (setting === true) {style = {fill: "#000000", strokeWidth: "0.5", stroke: "#000000"};}
    else {style = {fill: "#ffffff", strokeWidth: "0.5", stroke: "#000000"};}

    var toggle = this.toggle;

    return (
      /* jshint ignore:start */  
      React.DOM.rect( {x:x, y:y, width:W, height:H, style:style, onClick:toggle})
      /* jshint ignore:end */
    );
  }
});

var grid = React.createClass({displayName: 'grid',
  render: function () {
    var settings = this.props.settings,
        toggleCell = this.props.toggleCell,
        cellSize = 15,
        width = cellSize * this.props.n,
        height = cellSize * this.props.m;
    return (
      /* jshint ignore:start */  
      React.DOM.svg( {width:width, height:height}, 
        settings.map(
          function (row, i) {
            return(
              row.map(
                function (elem, j) {
                  return (cell( {cellSize:cellSize, setting:elem, i:i, j:j, toggleCell:toggleCell} ));
                }
              )
            );
          }
        )
      )
      /* jshint ignore:end */
    );
  }
});

var toggleRunningButton = React.createClass({displayName: 'toggleRunningButton',
  render: function () {
    var handleClick = this.props.handleClick
    var running = this.props.running;
    /* jshint ignore:start */
    return (React.DOM.button( {onClick:handleClick}, running ? "stop":"run"));
    /* jshint ignore:end */
    //
  }
}); 

var resetButton = React.createClass({displayName: 'resetButton',
  render: function () {
    var handleClick = this.props.handleClick;
    return (React.DOM.button( {onClick:handleClick}, "reset"));
  }
});
},{}],2:[function(require,module,exports){
/** @jsx React.DOM */
/*jshint indent: 2, node: true, nomen: true, browser: true*/
/*global React */
'use strict';

var app = require('./app.jsx');

React.renderComponent(
  /* jshint ignore:start */
  app(null ),
  document.getElementById('app')
  /* jshint ignore:end */
);

},{"./app.jsx":1}]},{},[2]);