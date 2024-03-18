const ffi = require("ffi-napi");

const func = ffi.Library("./dlls/Mocha.dll", {
  API_Add: ["uint32", []],
});

const result = func.API_Add();
console.log("result by using dll: ", result);
