const express = require('express');
const router = express.Router();

//libs
const Messages = require('../src/lib/Messages');

/* GET home page. */
router.get('/list', (req, res, next) => {
    Messages.list('@Room:nTPpgJD6', messages =>{
        console.log(messages);
        res.json(messages);
    });
    
});

module.exports = router;