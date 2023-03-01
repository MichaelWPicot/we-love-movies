
exports.up = function(knex) {
    return knex.schema.createTable("reviews", (table) => {
        table.increments("review_id").primary();
        table.text("content");
        table.integer("score");
        table.integer("critic_id").unsigned().notNullable() //creates critic_id column
        table
          .foreign("critic_id") //makes critic_id a foreign key
          .references("critic_id") //that comes from the critic_id column
          .inTable("critics") //in the critics table
          .onDelete("CASCADE"); //if critics.critic_id is deleted it is also deleted here
        table
        .integer("movie_id").unsigned().notNullable();
        table
          .foreign("movie_id")
          .references("movie_id")
          .inTable("movies")
          .onDelete("CASCADE");
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
  return knex.schema.dropTable("reviews")
};
