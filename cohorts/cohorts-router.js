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

router.get('/:id/students', (req, res) => {
    const id = req.params.id;

    db('cohorts')
        .where({ id })
        .first()
        .then(cohort => {
            db('students')
                .where({ cohort_id: id })
                .then(students=> {
                    cohort.students = students;
                    res.status(200).json(cohort)
                })
        })
        .catch(() => {
            res.status(500).json({ error: 'The students for that cohort could not be retrieved.' });
        });
});

router.post('/', (req, res) => {
    const cohortInfo = req.body;

    if (!cohortInfo.name)
        return res.status(400).json({ errorMessage: 'Please provide a name for the cohort.' });

    db('cohorts')
        .insert(req.body)
        .then(ids => {
            const [id] = ids;

            db('cohorts')
                .where({ id })
                .then(cohort => {
                    res.status(201).json(cohort);
                });
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while saving the cohort.' });
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db('cohorts')
        .where({ id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(204).json({ message: 'Cohort was deleted.' });
            } else {
                res.status(404).json({ errorMessage: 'A cohort with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while deleting that cohort.' });
        });
});

router.put('/:id', (req, res) => {
    const cohortInfo = req.body;
    const id = req.params.id;

    if (!cohortInfo.name)
        return res.status(400).json({ errorMessage: 'Please provide a name for the cohort.' });

    db('cohorts')
        .where({ id })
        .update(cohortInfo)
        .then(count => {
            if (count > 0) {
                db('cohorts')
                    .where({ id })
                    .then(cohort => {
                        res.status(200).json(cohort);
                    });
            } else {
                res.status(404).json({ errorMessage: 'A cohort with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while updating the cohort information.' });
        });
});

module.exports = router;