if (process.env.NODE_ENV === "production") {
  module.exports = React;
} else {
  module.exports = require("../node_modules/react");
}
