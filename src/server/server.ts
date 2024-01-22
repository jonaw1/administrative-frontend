import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import indexRoute from './routes/indexRoute';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import session from 'express-session';
import { startDatabase } from './db/database';
import KnexSessionStore, { StoreFactory } from 'connect-session-knex';
import { db } from './db/database';
import flash from 'connect-flash';
import { User } from './shared/types';
import dotenv from 'dotenv';
import logger from './shared/logger';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const KnexStore: StoreFactory = KnexSessionStore(session);
app.use(
  session({
    store: new KnexStore({
      knex: db,
      tablename: 'sessions',
      createtable: true
    }),
    secret: process.env.SESSION_SECRET ?? 'your-session-secret',
    resave: true,
    saveUninitialized: false
  })
);
app.use(flash());

// Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'client', 'views'));

// Serve static files from the "assets" directory
app.use(express.static(path.join(__dirname, '..', 'client', 'assets')));

// Send session information to all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success = req.flash('success')[0];
  res.locals.error = req.flash('error')[0];
  res.locals.user = req.session?.user;
  next();
});

app.use('/', indexRoute);
app.use('/', authRoutes);
app.use('/', adminRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error:', err.stack);
  res.status(500).send('Something broke!');
  next();
});

startDatabase().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
});
