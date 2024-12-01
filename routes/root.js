const express = require('express')
const router = express.Router()
const path = require('path')


// the '^' means at the beginning of the string only and the '$' means at the end of the 
// string only. So in this case it will only match if the requested route is only a slash '/'
// the | means or.
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router