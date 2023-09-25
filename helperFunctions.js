// named export
export const addition = function (x, y) {
  return x + y;
};

// default export
function functionA() {
  console.log("Function A");
}

function functionB() {
  console.log("Function B");
}

export default {
  functionA,
  functionB,
};
