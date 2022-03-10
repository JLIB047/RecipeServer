// server.js file

const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const mongoose = require('mongoose');

const db = async () => await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});


const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json);

 //if in production, serve client/build as static assets
 //if (process.env.NODE_ENV === 'production') {
   //  app.use(express.static(path.join(__dirname, '../client/build')));
 //};

 //app.get('*', (req, res) => {
   // res.sendFile(path.join(__dirname, '../client/build/index.html'));
 //});

db.once('open',  () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`GraphQL server readt at http://localhost:${PORT}${server.graphqlPath}`);
});
};

startServer();