const express = require('express');
const router = express.Router();

router.get('/roomDetail',(req,res) => {
     res.render('roomDetail');
});

module.exports = router;