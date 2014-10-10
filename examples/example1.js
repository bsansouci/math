var assert = require("assert");
var math = require("../math");

// You use math.solve on an array containing one function and at least two
// numbers (or bignumbers)
console.log("1 + 2 = ", math.solve([
  1, math.plus, 2
]).toString()); // 3

console.log("1 + (1 + 3) = ", math.solve([
  1, math.plus, [1, math.plus, 3]
]).toString()); // 5

console.log("(1 + 3) + 2 = ", math.solve([
  [1, math.plus, 3],
  math.plus,
  2
]).toString()); // 6
console.log("(1 + 3) + (2 + 4) = ", math.solve([
  [1, math.plus, 3],
  math.plus,
  [2, math.plus, 4]
]).toString()); // 10

console.log("(1 - 2) + (1 - 2 - 3)", math.solve([
  [1, math.minus, 2],
  math.plus,
  [1, math.minus, 2, math.minus, 3]
]).toString());

// this previous example is actually a little redundant. You could do this
// [math.minus, 1, 2, 3] instead of [1, math.minus, 2, math.minus, 3]

// every function is applied in order onto all the numbers inside an array
console.log("1 + 2 + 3 + 4 + 5 = ", math.solve(
  [math.plus, 1, 2, 3, 4, 5]
).toString()); // 1 + 2 + 3 + 4 + 5 = 15
console.log("1 * 2 * 3 * 4 * 5 = ", math.solve(
  [math.times, 1, 2, 3, 4, 5]
).toString()); // 120

// You can declare bignumbers and do math on those
var x = math.n("10");
var y = math.n("10");
var z = math.n("10");

console.log("10 * 10 * 10 = ", math.solve(
  [math.times, x, y, z]
).toString()); // 1000

// This means almost infinite precision (right now it's a constant inside
// bignumber called DECIMAL_PLACES, that you can change with
// math.n.config({DECIMAL_PLACES: 500}))
var goldenRatio = math.solve([
  [1, math.plus, [math.sqrt, 5]],
  math.div,
  2
]);
console.log(goldenRatio.toString());

math.n.config({DECIMAL_PLACES: 500});
var irrational = math.solve([math.sqrt, 2]);
console.log(irrational.toString());



// The main problem right now is that it's slow
// Uncomment this to test
// (the first loop takes me 5924ms)

// var t = Date.now();
// var x = math.n(0);
// for (var i = 0; i < 1000000; i++) {
//   x = math.solve([1, math.plus, x]);
// }
// console.log(Date.now() - t);

// var t2 = Date.now();
// var x2 = 0;
// for (var i = 0; i < 1000000; i++) {
//   x2 = 1 + x2;
// }
// console.log(Date.now() - t2);