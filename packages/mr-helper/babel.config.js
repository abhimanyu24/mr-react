// module.exports = {
//   // plugins: ['babel-plugin-styled-components'],
//   presets: ['@babel/preset-env', '@babel/preset-react']
// };
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs"
        // targets: {
        //   node: "current"
        // }
      }
    ],

    // "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        useBuiltIns: true,
        // useSpread: true,
        throwIfNamespace: false
      }
    ]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-runtime"
    // [
    //   "@babel/plugin-proposal-async-generator-functions",
    //   {
    //     regenerator: true
    //   }
    // ]
  ]
  // env: {
  //   test: {
  //     plugins: ["@babel/plugin-transform-modules-commonjs"]
  //   }
  // }
};
