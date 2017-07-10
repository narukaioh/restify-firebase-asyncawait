'use strict'

//dependencias
const admin     = require('firebase-admin')
const restify   = require('restify')

// Setup
const serviceAccount = require('./tutorial-async-await-firebase.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tutorial-async-await.firebaseio.com/'
})

const db        = admin.database()
const app       = restify.createServer()


//config
app.use(restify.plugins.bodyParser())


//API
app.get('/:userId', async (req , res) => {
    const { userId } = req.params
    const email = await db.ref(`/email/${userId}`).once('value')
    res.send(email.val())
})

app.post('/', (req, res) => {
    const { userId, email } = req.body
    db.ref(`/email/${userId}`).push(email, err => {
        if (err) {
            res.sendStatus(500)
        }
        res.sendStatus(201)
    })
})

app.listen(8080)