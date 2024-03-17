const { check } = require('express-validator')
const { validateResults } = require('../helpers/validateHelper')

const validateCreate = [
    check('name')
        .exists()
        .not()
        .isEmpty(),
    check('email')
        .exists()
        .not()
        .isEmpty()
        .isEmail(),
    check('password')
        .exists()
        .not()
        .isEmpty(),
        check('rol')
        .exists(),
    (req, res, next) => {
        validateResults(req, res, next)
    }

]

const validateLogin = [
    check('email')
        .exists()
        .not()
        .isEmpty()
        .isEmail(),
    check('password')
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResults(req, res, next)
    }

]



module.exports = { validateCreate, validateLogin}