// const { default: fastify } = require('fastify');
const fastify = require('fastify')()
fastify.register(require('@fastify/mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,

    url: "mongodb+srv://mohit2314:Patel2314%40mongodb@todo-db.k3xcl.mongodb.net/test",
})
const { default: axios } = require('axios');
const { getItems, getItem, addItem, deleteItem, updateItem } = require('../controllers/itemsController');

// Item Schema
const Item = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        completed: { type: 'boolean' }
    }
}
//OPtions for get all items
const getItemsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Item
            }
        }
    },
    handler: getItems
}

const getItemOpts = {
    schema: {
        response: {
            200: Item
        }
    },
    handler: getItem
}

const postItemOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['name'],
            properties: {
                name: { type: 'string' },
                completed: { type: 'boolean' }
            }
        },
        response: {
            201: Item
        }
    },
    handler: addItem
}
const authResponse = {
    // type:'object',
    // properties:{
    access_token: { type: 'string' },
    // expires_in: { type: 'number' },
    // refresh_expires_in:{ type: 'number' },
    // token_type:{ type: 'string' },
    // "not-before-policy":{ type: 'number' },
    // scope:{ type: 'string' },
    // }
}
const keycloakAuthOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                client_secret: { type: 'string' },
                grant_type: { type: 'string' },
                client_id: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
}

const accessObj = {
    type: 'object',
    properties: {
        manageGroupMembership: { type: 'boolean' },
        view: { type: 'boolean' },
        mapRoles: { type: 'boolean' },
        impersonate: { type: 'boolean' },
        manage: { type: 'boolean' }
    }
}
const credentialArr = {
    type: 'array',
    items: { type: 'string' }
}
const userObj = {
    type: 'object',
    properties: {
        createdTimestamp: { type: 'number' },
        username: { type: 'string' },
        enabled: { type: 'boolean' },
        totp: { type: 'boolean' },
        emailVerified: { type: 'boolean' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        disableableCredentialTypes: credentialArr,
        requiredActions: credentialArr,
        notBefore: { type: 'number' },
        access: accessObj
    }
}

const createUserOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                // createdTimestamp: { type: 'number' },
                // username: { type: 'string' },
                // enabled: { type: 'boolean' },
                // totp: { type: 'boolean' },
                // emailVerified: { type: 'boolean' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                // disableableCredentialTypes: { type: 'array' },
                // requiredActions: { type: 'array' },
                // notBefore: { type: 'number' },
                // access: {
                //     manageGroupMembership: { type: 'boolean' },
                //     view: { type: 'boolean' },
                //     mapRoles: { type: 'boolean' },
                //     impersonate: { type: 'boolean' },
                //     manage: { type: 'boolean' }
                // }
            }
        },
        response: {
        //     // 200: userObj 
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }

    }
}



const getUserOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: userObj
            }
        }
    }
}

const pswdResetOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                user_id: { type: 'string' },
                new_pswd: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
}

const enableUserOpts={
    schema:{
        params: {
            type: 'object',
            properties: {
              user_id: {
                type: 'string',
                description: 'user id'
              }
            }
          },
          body:{
              type:'object',
              properties:{
                  enabled:{type:'boolean'}
              }
          },
          response:{
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
  
}
//  ============================================
const deleteItemOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    handler: deleteItem
}

const updateItemOpts = {
    schema: {
        response: {
            200: Item
        }
    },
    handler: updateItem
}

// MONGO DB
const addMongoOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['name'],
            properties: {
                name: { type: 'string' },
                completed: { type: 'boolean' }
            }
        },
        response: {
            201: Item
        }
    },
}

//OPtions for get all items
const getMongoOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Item
            }
        }
    },
}
const deleteMongoOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
}

const updateMongoOpts = {
    schema: {
        response: {
            200: Item
        }
    },
}
// ==============
function itemRoutes(fastify, options, done) {
    var access_token_stored = '';
    //get access token
    fastify.post('/getAccessToken', keycloakAuthOpts, async function (req, reply) {
        const { username, client_secret, grant_type, client_id } = req.body
        try {
            const {
                data: { access_token }, } = await axios({
                    method: "POST",
                    url: `http://localhost:8080/realms/myRealm/protocol/openid-connect/token`,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    data: `username=${username}&client_secret=${client_secret}&grant_type=${grant_type}&client_id=${client_id}`
                });
            access_token_stored = access_token
            console.log("API RESPONES", access_token);
            reply.send({ message: `Access Token for client ${client_id} is ${access_token}` })
        } catch (err) { }
    })

    //Get all users
    fastify.get('/getAllUsers', getUserOpts, async function (req, reply) {
        // const { user_id, new_pswd } = req.body
        try {
            console.log("***************", access_token_stored);

            let response = await axios({
                method: "GET",
                url: `http://localhost:8080/admin/realms/myRealm/users`,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token_stored}` },
            });
            reply.send(response.data)
        } catch (err) { }
    })

    //change user password
    fastify.put('/changeUserPassword', pswdResetOpts, async function (req, reply) {
        const { user_id, new_pswd } = req.body
        try {
            console.log("CHANGE USER PSWD");

            await axios({
                method: "PUT",
                url: `http://localhost:8080/admin/realms/myRealm/users/${user_id}/reset-password`,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token_stored}` },
                data: `{"type":"password","value":"${new_pswd}","temporary":false}`
            });
            reply.send({ message: `Password for user ${user_id} has been reset . New Password:-${new_pswd}` })
        } catch (err) { }
    })

    // ENable/Disable user
    fastify.put('/enableUser/:user_id', enableUserOpts, async function (req, reply) {
        const { enabled } = req.body
        const {user_id} = req.params
        console.log("USER ID",user_id)
        try {
            
            await axios({
                method: "PUT",
                url: `http://localhost:8080/admin/realms/myRealm/users/${user_id}`,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token_stored}` },
                data: `{"enabled": ${enabled}}`
            });
            // console.log("*******NEW USER",newUser.data)
            reply.send({ message: `User ${user_id} enabled state has been updated to ${enabled}` })
        } catch (err) { 
            console.log(err.response)
        }
    })

    //create New user
    fastify.post('/createNewUser', createUserOpts, async function (req, reply) {
        const { firstName, lastName, email } = req.body
        let userResponse=null;
        try {
          userResponse =   await axios({
                method: "POST",
                url: `http://localhost:8080/admin/realms/myRealm/users`,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token_stored}` },
                data: {"username": `${firstName + lastName}`,"firstName": `${firstName}`,"lastName": `${lastName}`,"email":`${email}`}
            });
            // console.log("*******NEW USER",newUser.data)
            reply.send({ message: `new user created ${userResponse}` })
        } catch (error) { 
            console.log(error.response.message);
            console.log(error.response.data);  
            console.log(error.response.status);  
            console.log(error.response.headers); 
            reply.send({message:`Error data ${userResponse} ${error.response.data} Error Msg: ${error.response.message} Error Status: ${error.response.status} Error Header: ${error.response.headers}`})
        }
    })

    //get all items
    fastify.get('/getAllTask', getItemsOpts)


    //return single item
    fastify.get('/getTask/:id', getItemOpts)

    //add item
    fastify.post('/addTask', postItemOpts)

    //delete Item
    fastify.delete('/deleteTask/:id', deleteItemOpts)

    //Update Item
    fastify.put('/updateTask/:id', updateItemOpts)

    //-- Add task in mongoDb 
    fastify.post('/addMongoTask', addMongoOpts, async function (req, reply) {
        // Or this.mongo.client.db('mydb').collection('users')
        const { name, completed } = req.body
        const todoCollection = this.mongo.db.collection('todoCollection')
        // const item={
        //     name:"Karan",
        //     completed:false
        // }
        let item = {
            name, completed,
            _id: this.mongo.ObjectId()
        }
        const result = await todoCollection.insertOne(item);
        reply.send(result)
    })

    //Get all task in mongoDB
    fastify.get('/getAllMongoTask', getMongoOpts, async function (req, reply) {
        const todoCollection = this.mongo.db.collection('todoCollection')
        const result = await todoCollection.find({ completed: false });
        console.log("REsult", result)
        reply.send(result.map(res => res.toJSON()))
    })

    //Delete Task in mongoDB
    fastify.delete('/deleteMongoTask/:id', deleteMongoOpts, async function (req, reply) {
        // Or this.mongo.client.db('mydb').collection('users')
        const { id } = req.params
        const todoCollection = this.mongo.db.collection('todoCollection')


        const result = await todoCollection.deleteOne({ _id: this.mongo.ObjectId(id) });

        reply.send({ message: `Item ${id} has been removed ${result}` })
    })

    //Update Task in mongoDB
    fastify.put('/updateMongoTask/:id', updateMongoOpts, async function (req, reply) {
        // Or this.mongo.client.db('mydb').collection('users')
        const { id } = req.params
        const { completed } = req.body
        const todoCollection = this.mongo.db.collection('todoCollection')
        console.log("COMPLETED STATUS", completed)

        const result = await todoCollection.findOneAndUpdate({ _id: this.mongo.ObjectId(id) }, { $set: { completed: completed } });

        reply.send({ message: `Item ${id} has been updated ${result}` })
    })

    done()
    // })

}

module.exports = itemRoutes