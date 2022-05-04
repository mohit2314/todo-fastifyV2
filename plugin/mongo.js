const fastify = require('fastify');
const fastifyPlugin = require("fastify-plugin");
async function dbConnector(fastify, options, done) {
  console.log(options);
  fastify.register(require('@fastify/mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    
    url: "mongodb+srv://mohit2314:Patel2314%40mongodb@todo-db.k3xcl.mongodb.net/test",
  
  })
}
module.exports = fastifyPlugin(dbConnector);
