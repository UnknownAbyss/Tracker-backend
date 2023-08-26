const axios = require('axios');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Users = require('../models/user');


router.get('/', (req, res) => {
  res.json({msg: 'auth: pong'});
});

router.post('/login', async (req, res) => {
    let {user, pass} = req.body;
    out = await Users.findOne({user: user, pass: pass});

    if (out) {
        var token = jwt.sign({ user: out.user }, process.env.JWT);
        res.json(
            {
                msg: 'Login successful',
                token: token,
                code: 0
            }
        );
    } else {
        res.json(
            {
                msg: 'Login Error',
                token: "",
                code: 1
            }
        );
    }
})

app.get('*', (req, res) => {
    res.json({'msg': 'Unknown Auth Route'});
});

module.exports = router;