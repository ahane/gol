/** @jsx React.DOM */
/*jshint indent: 2, node: true, nomen: true, browser: true*/
/*global React */

'use strict';
module.exports = React.createClass({
  getInitialState: function () {
    return ({running: false});
  },

  toggleRunning: function () {
    console.log("toggleRunning");
    this.setState({running: !this.state.running});
  },

  render: function () {
  	return (
        /* jshint ignore:start */
        <div>
          <grid n={100} m={80} />
          <toggleRunningButton running={this.state.running} handleClick={this.toggleRunning}/>
        </div>
        /* jshint ignore:end */
  	);
  }
});

var cell = React.createClass({

  toggle: function () {
    this.props.toggleCell(this.props.i, this.props.j);
  },

  render: function () {
    var W = 10;
    var H = 10;
    var i = this.props.i;
    var j = this.props.j;
    var setting = this.props.setting;
    var style;
    if (setting === true) {style = {fill: "#ffffff", strokeWidth: "1", stroke: "#000000"};}
    else {style = {fill: "#000000", strokeWidth: "1", stroke: "#ffffff"};}

    var x = i*10;
    var y = j*10;
    
    var toggle = this.toggle;

    return (
      /* jshint ignore:start */  
      <rect x={x} y={y} width={W} height={H} style={style} onClick={toggle}/>
      /* jshint ignore:end */
    );
  }
});

var grid = React.createClass({

  getInitialState: function () {
    var n = this.props.n;
    var m = this.props.m;
    var settings = [];
    for(var i = 0; i < n; i++) {
      (function () {//IIFE
        var row = [];
        for(var j = 0; j < m; j++) {
          row[j] = true;
        }
        settings[i] = row;
      }());
    }


    /*optimize branch*/


    return ({settings: settings});
  },

  toggleCell2: function (i, j) {
    var settings = this.state.settings;
    settings[i][j] = !settings[i][j];
    this.setState({settings: settings});
  },

  render: function () {
    var settings = this.state.settings;
    var xMargin = 20;
    var yMargin = 20;
    var toggleCell = this.toggleCell2;
    var style = {width: "400", height:"400"};


    /*var cells = settings.map(function (row, i) {
      return(
        row.map(function (elem, j) {
          console.log("running inner loop");
          var x = xMargin+(j*10);
          var y = yMargin+(i*10);
          var toggle = toggleCell.bind(null, i, j);
          return (<cell settings={settings}i={i} j={j} toggle={toggle}/>);
        })
      );
    });/*

    var cellsFlat = [];
    cellsFlat = cellsFlat.concat.apply(cellsFlat, cells);
    */
    return (
      /* jshint ignore:start */  
      <svg style={style}>
        {settings.map(
          function (row, i) {
              return(
                row.map(
                  function (elem, j) {
                    return (<cell setting={elem} i={i} j={j} toggleCell={toggleCell} />);
                  }
                )
              );
          }
        )}
      </svg>

      /* jshint ignore:end */
      );
  }
});

var toggleRunningButton = React.createClass({
  render: function () {
    var handleClick = this.props.handleClick
    var running = this.props.running;
    var text;
    if (running === true) {text = "stop";}
    else {text = "run";}
    /* jshint ignore:start */
    return (<span><button onClick={handleClick}>{text}</button></span>);
    /* jshint ignore:end */
    //
  }
}); 