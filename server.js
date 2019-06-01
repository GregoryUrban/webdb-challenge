const express = require('express');
const helmet = require('helmet')

const server = express();

server.use(helmet());

server.use(express.json()); 

const projectRouter = require('./projectRouter');
server.use('/api/projects', projectRouter);

// const actionRouter = require('./actions/actionRouter'); // importing an action module - may not need this
// server.use('/api/actions', actionRouter);

server.use((err, req, res, next) => {
  res.status(500).json({
    message: "Bad Panda",
    err
  });
})

module.exports = server;
