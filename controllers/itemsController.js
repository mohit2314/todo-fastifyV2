const { v4: uuidv4 } = require("uuid");
let items = require("../items");
const fastify=require('fastify')

const getItems = (req, reply) => {
  reply.send(items);
};

const getItem = (req, reply) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === id);
  reply.send(item);
};

const addItem =async (req, reply) => {
  const { name,completed } = req.body;
  const item = {
    id: uuidv4(),
    name,
    completed
  };

  items = [...items, item];
  // const todoCollection= this.mongo.client.db('test').collection('todoCollection')
  // const todoCollection = this.mongo.db.collection("todoCollection");
  // const result = await todoCollection.insertOne(item);
  reply.code(201).send(item);
};

const deleteItem = (req, reply) => {
  const { id } = req.params;

  items = items.filter((item) => item.id !== id);

  reply.send({
    message: `Item ${id} has been removed`,
  });
};

const updateItem = (req, reply) => {
  const { id } = req.params;
  const { name,completed } = req.body;

  items = items.map((item) => 
    (item.id === id ? { id, name,completed } : item))
  
  item = items.find((item) => item.id == id);

  reply.send(item);
};

module.exports = {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
};
