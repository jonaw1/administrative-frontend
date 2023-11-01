import knex from "knex";

const config = {
  client: "sqlite3",
  connection: {
    filename: "src/server/db/database.sqlite",
  },
  useNullAsDefault: true,
};

export const db = knex(config);

export const startDatabase = async () => {
  try {
    if (!(await db.schema.hasTable("users"))) {
      await db.schema.createTable("users", (table) => {
        table.increments("user_id").notNullable();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("email").notNullable();
        table.boolean("admin").notNullable().defaultTo(false);
        table.boolean("active").notNullable().defaultTo(false);
        table.boolean("deleted").notNullable().defaultTo(false);
      });
    }

    if (!(await db.schema.hasTable("credentials"))) {
      await db.schema.createTable("credentials", (table) => {
        table
          .integer("user_id")
          .references("user_id")
          .inTable("users")
          .notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.boolean("deleted").notNullable().defaultTo(false);
      });
    }

    if (!(await db.schema.hasTable("courses"))) {
      await db.schema.createTable("courses", (table) => {
        table.increments("course_id");
        table.string("name").notNullable();
        table
          .integer("user_id")
          .references("user_id")
          .inTable("users")
          .notNullable();
      });
    }

    if (!(await db.schema.hasTable("assignments"))) {
      await db.schema.createTable("assignments", (table) => {
        table.increments("assignment_id");
        table.string("name");
        table
          .integer("course_id")
          .references("course_id")
          .inTable("courses")
          .notNullable();
      });
    }

    if (!(await db.schema.hasTable("tasks"))) {
      await db.schema.createTable("tasks", (table) => {
        table.increments("task_id");
        table.json("settings");
        table
          .integer("assignment_id")
          .references("assignment_id")
          .inTable("assignments")
          .notNullable();
      });
    }

    const rootUserDoesNotExist = await db("users")
      .select()
      .then((rows) => {
        return rows.length === 0;
      });

    if (rootUserDoesNotExist) {
      await db
        .insert({
          first_name: "Admin",
          last_name: "Admin",
          email: "admin@admin.com",
          admin: 1,
        })
        .into("users");
    }

    console.log("Database was started successfully");
  } catch (error) {
    console.error("Error starting database:", error);
  }
};
