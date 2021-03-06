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

// router.get('/:id', (req, res) => {
//     const id = req.params.id

//     db('students')
//         .where({ id })
//         .then(student => {
//            if (student.length > 0) {
//                res.status(200).json(student);
//            } else {
//                res.status(404).json({ errorMessage: 'A student with that ID does not exist.' });
//            }
//         })
//         .catch(() => {
//             res.status(500).json({ error: 'The student could not be retrieved.' });
//         });
// });

router.get('/:id', (req, res) => {
    const id = req.params.id;

    db('cohorts')
        .where({ id })
        .then(cohort => {
            db('students')
                .where({ cohort_id: id })
                .then(students => {
                    cohort.students = students;
                    
                    res.status(200).json(cohort)
                })
        })
        .catch(() => {
            res.status(500).json({ error: 'The student could not be retrieved.' });
        });
});

router.post('/', (req, res) => {
    const studentInfo = req.body;

    if (!studentInfo.name || !studentInfo.cohort_id)
        return res.status(400).json({ errorMessage: 'Please provide a name and cohort ID for the student.' });

    db('students')
        .insert(studentInfo)
        .then(ids => {
            const [id] = ids;

            db('students')
                .where({ id })
                .then(student => {
                    res.status(201).json(student);
                });
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while saving the student.' });
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db('students')
        .where ({ id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(204).json({ message: 'Student was deleted.' })
            } else {
                res.status(204).json({ errorMessage: 'A student with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while deleting that student.' });
        });
});

router.put('/:id', (req, res) => {
    const studentInfo = req.body;
    const id = req.params.id;

    if (!studentInfo.name)
        return res.status(400).json({ errorMessage: 'Please provide a name for the student.' });

    db('students')
        .where({ id })
        .update(studentInfo)
        .then(count => {
            if (count > 0) {
                db('students')
                    .where({ id })
                    .then(student => {
                        res.status(200).json(student);
                    });
            } else {
                res.status(404).json({ errorMessage: 'A student with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while updating the student information.' });
        });
});

module.exports = router;