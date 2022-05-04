// const { default: fastify } = require('fastify');
const fastify = require('fastify')()
fastify.register(require('@fastify/mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    
      url: "mongodb+srv://mohit2314:Patel2314%40mongodb@todo-db.k3xcl.mongodb.net/test",
  })
const {getItems,getItem,addItem,deleteItem,updateItem}= require('../controllers/itemsController');

// Item Schema
const Item= {
    type:'object',
    properties:{
        id:{type:'string'},
        name:{type:'string'},
        completed:{type:'boolean'}
    }
}
//OPtions for get all items
const getItemsOpts={
    schema:{
        response:{
            200:{
                type:'array',
                items:Item
            }
        }
    },
    handler:getItems
}

const getItemOpts={
    schema:{
        response:{
            200:Item
        }
    },
    handler:getItem
}

const postItemOpts={
    schema:{
        body:{
            type:'object',
            required:['name'],
            properties:{
                name:{type:'string'},
                completed:{type:'boolean'}
            }
        },
        response:{
            201:Item
        }
    },
    handler:addItem
}

const deleteItemOpts={
    schema:{
        response:{
            200:{
                type:'object',
                properties:{
                    message:{type:'string'}
                }
            }
        }
    },
    handler:deleteItem
}

const updateItemOpts={
    schema:{
        response:{
            200:Item
        }
    },
    handler:updateItem
}

// MONGO DB
const addMongoOpts={
    schema:{
        body:{
            type:'object',
            required:['name'],
            properties:{
                name:{type:'string'},
                completed:{type:'boolean'}
            }
        },
        response:{
            201:Item
        }
    },
}

//OPtions for get all items
const getMongoOpts={
    schema:{
        response:{
            200:{
                type:'array',
                items:Item
            }
        }
    },
}
const deleteMongoOpts={
    schema:{
        response:{
            200:{
                type:'object',
                properties:{
                    message:{type:'string'}
                }
            }
        }
    },
}

const updateMongoOpts={
    schema:{
        response:{
            200:Item
        }
    },
}
// ==============
function itemRoutes(fastify,options,done){
  
    //get all items
fastify.get('/getAllTask',getItemsOpts)


//return single item
fastify.get('/getTask/:id', getItemOpts)

//add item
fastify.post('/addTask',postItemOpts)

//delete Item
fastify.delete('/deleteTask/:id',deleteItemOpts)

//Update Item
fastify.put('/updateTask/:id',updateItemOpts)

//-- Add task in mongoDb 
fastify.post('/addMongoTask',addMongoOpts, async function (req, reply) {
    // Or this.mongo.client.db('mydb').collection('users')
    const {name,completed} =req.body
    const todoCollection = this.mongo.db.collection('todoCollection')
    // const item={
    //     name:"Karan",
    //     completed:false
    // }
    let item= {name,completed,
    _id:this.mongo.ObjectId()
    }
    const result = await todoCollection.insertOne(item);
    reply.send(result)
  })

  //Get all task in mongoDB
  fastify.get('/getAllMongoTask',getMongoOpts, async function (req, reply) {
    const todoCollection = this.mongo.db.collection('todoCollection')    
    const result = await todoCollection.find({completed:false});
    console.log("REsult",result)
    reply.send(result.map(res => res.toJSON()))
  })

  //Delete Task in mongoDB
  fastify.delete('/deleteMongoTask/:id',deleteMongoOpts, async function (req, reply) {
    // Or this.mongo.client.db('mydb').collection('users')
    const {id} =req.params
    const todoCollection = this.mongo.db.collection('todoCollection')

   
    const result = await todoCollection.deleteOne({_id:this.mongo.ObjectId(id)});
  
    // if the id is an ObjectId format, you need to create a new ObjectId
    // const id = this.mongo.ObjectId(req.params.id)
    // todoCollection.findOne({ id }, (err, user) => {
    //   if (err) {
    //     reply.send(err)
    //     return
    //   }
    //   reply.send(user)
    // })
    reply.send( {message: `Item ${id} has been removed ${result}`})
  })

  //Update Task in mongoDB
  fastify.put('/updateMongoTask/:id',updateMongoOpts, async function (req, reply) {
    // Or this.mongo.client.db('mydb').collection('users')
    const {id} =req.params
    const{completed}= req.body
    const todoCollection = this.mongo.db.collection('todoCollection')
console.log("COMPLETED STATUS",completed)
   
    const result = await todoCollection.findOneAndUpdate({_id:this.mongo.ObjectId(id)},{$set:{ completed:completed}});
  
    // if the id is an ObjectId format, you need to create a new ObjectId
    // const id = this.mongo.ObjectId(req.params.id)
    // todoCollection.findOne({ id }, (err, user) => {
    //   if (err) {
    //     reply.send(err)
    //     return
    //   }
    //   reply.send(user)
    // })
    reply.send( {message: `Item ${id} has been updated ${result}`})
  })

done()
// })

}

module.exports=itemRoutes