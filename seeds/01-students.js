
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: "Jim Bob", cohort_id: '1'},
        {name: "Cletus", cohort_id: '1'},
        {name: "Bubba Ray", cohort_id: '2'}
      ]);
    });
};
