const router = require('express').Router();
const Users = require('../../models/User');
const uuid = require('uuid');


/**
 * Endpoint to create the user
 */
router.post('/', async(req, res)=> {
    try{
        const newUser = {
            id: uuid.v4(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        // const {name, email, password} = req.body;
        // const id = id: uuid.v4()
        console.log(newUser);
        const user = await Users.create(newUser);
        res.status(201).json(user);
    } catch (e) {
       let message;
       // 11000 is a code that says it already exists
       if(e.code == 11000){
        message = "User already exists"
       } else {
        message = e.message;
       }
       console.log(e);
       res.status(400).json(message)
    }
})



/**
 * Endpoint to login the user
 * Requesting the email and password and searching if it exists
 */
router.post('/login', async(req,res) => {
    try {
        const {email, password} = req.body; // We try to extract it from the body object
        const user = await Users.findByCredentials(email,password) // Trying to find the user
        user.status = 'online'; // Before sending the user back
        await user.save();
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json(e.message)
    }
})


router.get('/list', (req, res) =>{
    Users.find().then((foundUser) => res.json(foundUser));
});

router.get('/list/:name', async (req, res) => {
    const found = await Users.find({name: req.params.name});
    console.log(found)

    if (found) {
        res.json(found);
    } else {
        res.status(404).json({msg: `Unable to find User Name: ${req.params.name}`})
    }
});

router.get('/credentials/:email', async (req, res) => {
    const found = await Users.find({email: req.params.email});
    console.log(found)

    if (found) {
        res.json(found);
    } else {
        res.status(404).json({msg: `Unable to find User Email: ${req.params.email}`})
    }
});

router.get('/:id', async (req, res) => {
    const found = await Users.find({id: req.params.id});
    console.log(found);

    if (found) {
        res.json(found);
    } else {
        res.status(404).json({msg: `Unable to find User ID: ${req.params.id}`})
    }
});

module.exports = router;