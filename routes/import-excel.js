const express = require ("express")
const router = express.Router();
const controller = require('./../controllers/import-excel');

router.post('/', controller.insertData)

module.exports = router