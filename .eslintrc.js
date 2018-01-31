module.exports = {
  "rules": {
    "no-console": process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-underscore-dangle": ["error", {"allow": ["_config"]}]
  },
  "globals": {
    "_config": false
  },
  "extends": "airbnb-base"
}