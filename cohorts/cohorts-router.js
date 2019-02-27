const router = require('express').Router();
const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

router.get('/', (req,res) => {
    db('cohorts')
        .then(cohorts => {
            res.status(200).json(cohorts);
        })
        .catch(() => {
            res.status(500).json({ error: 'The cohorts could not be retrieved.' });
        });
});

module.exports = router;