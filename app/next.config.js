const withTM = require('next-transpile-modules');
const modulesToTranspile = ['@keebify/core', 'three'];

module.exports = withTM(modulesToTranspile)({
  // webpack: (config, options) => {
  //   console.log(config, options);
  //   return;
  // },
});
