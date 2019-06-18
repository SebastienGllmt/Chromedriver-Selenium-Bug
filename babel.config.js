module.exports = function(api) {
  api.cache(false);
  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "corejs": 2,
          "modules": "commonjs",
          "useBuiltIns": "entry"
        }
      ],
    ],
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ],
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs": 2,
          "helpers": true,
          "regenerator": true
        }
      ],
      "add-module-exports",
      [
        "@babel/plugin-proposal-class-properties",
        {
          "loose": true
        }
      ],
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-export-namespace-from",
    ],
    "env": {
      "development": {
        "plugins": [
          "@babel/plugin-transform-runtime"
        ]
      }
    }
  }
};
