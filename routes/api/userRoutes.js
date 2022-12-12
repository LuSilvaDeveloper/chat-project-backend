const router = require('express').Router();
const User = require('../../models/User');


/**
 * Endpoint to create the user
 */
router.post('/', async(req, res)=> {
    try{
        const {name, email, password} = req.body;
        console.log(req.body);
        const user = await User.create({name, email, password});
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
        const user = await User.findByCredentials(email,password) // Trying to find the user
        user.status = 'online'; // Before sending the user back
        await user.save();
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json(e.message)
    }
})

router.get('/', (req, res) =>{
    User.find().then((foundUser) => res.json(foundUser));
})

module.exports = router;