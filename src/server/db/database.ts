import knex from 'knex';
import logger from '../shared/logger';

const config = {
  client: 'sqlite3',
  connection: {
    filename: 'src/server/db/database.sqlite'
  },
  useNullAsDefault: true
};

export const db = knex(config);

export const startDatabase = async () => {
  try {
    if (!(await db.schema.hasTable('users'))) {
      await db.schema.createTable('users', (table) => {
        table.increments('user_id').notNullable();
        table.string('first_name').nullable();
        table.string('last_name').nullable();
        table.string('email').notNullable();
        table.boolean('admin').notNullable().defaultTo(false);
        table.boolean('active').notNullable().defaultTo(false);
        table.boolean('deleted').notNullable().defaultTo(false);
        table.string('confirmation_token').nullable();
        table.string('password').nullable();
        table.date('token_expires_at').nullable();
      });
    }

    if (!(await db.schema.hasTable('courses'))) {
      await db.schema.createTable('courses', (table) => {
        table.increments('course_id');
        table.string('name').notNullable();
        table
          .integer('user_id')
          .references('user_id')
          .inTable('users')
          .notNullable();
      });
    }

    if (!(await db.schema.hasTable('assignments'))) {
      await db.schema.createTable('assignments', (table) => {
        table.increments('assignment_id');
        table.string('name');
        table
          .integer('course_id')
          .references('course_id')
          .inTable('courses')
          .notNullable();
      });
    }

    if (!(await db.schema.hasTable('tasks'))) {
      await db.schema.createTable('tasks', (table) => {
        table.increments('task_id');
        table.json('settings');
        table
          .integer('assignment_id')
          .references('assignment_id')
          .inTable('assignments')
          .notNullable();
      });
    }

    const rootUserDoesNotExist = await db('users')
      .select()
      .then((rows) => {
        return rows.length === 0;
      });

    if (rootUserDoesNotExist) {
      await db
        .insert({
          email: process.env.ROOT_USER_EMAIL || 'admin@admin.com',
          admin: 1
        })
        .into('users');
    }

    logger.info('Database was started successfully');
  } catch (error) {
    logger.error('Error starting database:', error);
  }
};
