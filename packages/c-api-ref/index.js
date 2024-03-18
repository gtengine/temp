const ffi = require("ffi-napi");

const func = ffi.Library("./dlls/Mocha.dll", {
  API_Add: ["int", ["int", "int"]],
});

const result = func.API_Add(10, 10);
console.log("result by using dll: ", result);
