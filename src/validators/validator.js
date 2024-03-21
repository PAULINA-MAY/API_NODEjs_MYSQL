const { check } = require('express-validator')
const { validateResults } = require('../helpers/validateHelper')

const validateCreate = [
    check('firstNames')
        .exists()
        .not()
        .isEmpty(),
        check('lastNames')
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