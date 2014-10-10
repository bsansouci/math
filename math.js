/*jslint node: true */
"use strict";

module.exports = (function() {
  // Using bignumber for all the mathematical logic
  var bn = require("./lib/bignumber");

  // This function returns a function that will call name on the givn arguments
  function trans(name) {
    return function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if(args.length === 1) {
        return args[0][name]();
      }
      return args.reduce(function(acc, val) {
        return acc[name].call(acc, val);
      });
    };
  }

  // plus(1, 2, 3) === plus(plus(1, 2), 3)
  // minus(1, 2, 3) === minus(minus(1, 2), 3)
  // minus(1, 2, 3, 4, 5) === minus(minus(minus(minus(1, 2), 3), 4), 5)

  var toString = Object.prototype.toString;
  function isArray(obj) {
    return toString.call(obj) == '[object Array]';
  }

  // This simply recursively goes down the sub-arrays until it hits bignumber
  // objects and calls the function in the sub-array.
  // A sub-array doesn't have an ordering, so
  // [1, 2, plus] === [1, plus, 2] === [plus, 1, 2]
  function solve(arr, precision) {
    var variables = [];
    var operator = null;
    arr.map(function(val) {
      switch(typeof val) {
        case 'function':
          operator = val;
          break;
        case 'number':
          variables.push(bn(val));
          break;
        default:
          variables.push(val);
          break;
      }
    });

    // We do a depth first search to resolve every element
    variables = variables.map(function(val) {
      if(isArray(val)) {
        return solve(val);
      }
      return val;
    });
    return operator.apply(this, variables);
  }

  var obj = {
    solve: solve,
    n: bn
  };
  // Change all the functions to become unrelated to the objects (they look
  // like so at least)
  for(var i in bn.prototype) {
    obj[i] = trans(i);
  }

  return obj;
})();