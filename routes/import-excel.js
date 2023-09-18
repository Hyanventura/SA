import express from 'express'
const router = express.Router()
import controller from './../controllers/import-excel'

router.post('/', controller.insertData)

module.exports = router