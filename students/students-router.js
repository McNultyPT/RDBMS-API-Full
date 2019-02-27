const router = require('express').Router();
const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

router.get('/', (req, res) => {
    db('students')
        .then(students => {
            res.status(200).json(students);
        })
        .catch(() => {
            res.status(500).json({ error: 'The students could not be retrieved.' });
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id

    db('students')
        .where({ id })
        .then(student => {
           if (student.length > 0) {
               res.status(200).json(student);
           } else {
               res.status(404).json({ errorMessage: 'A student with that ID does not exist.' });
           }
        })
        .catch(() => {
            res.status(500).json({ error: 'The student could not be retrieved.' });
        });
});

module.exports = router;