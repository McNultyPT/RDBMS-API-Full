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

router.get('/:id', (req,res) => {
    const id = req.params.id

    db('cohorts')
        .where({ id })
        .then(cohort => {
            if (cohort.length > 0) {
                res.status(200).json(cohort);
            } else {
                res.status(404).json({ errorMessage: 'A cohort with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'The cohort could not be retrieved.' });
        });
});

module.exports = router;