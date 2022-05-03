const { default: fastify } = require('fastify');
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



done()
}



module.exports=itemRoutes