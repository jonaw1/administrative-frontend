import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import logger from '../shared/logger';

const router = Router();

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user?.admin) {
    return res.redirect('/');
  } else {
    return next();
  }
};

router.get('/users', requireAdmin, async (req: Request, res: Response) => {
  const users = await db.select().from('users').whereNot('deleted', 1);
  res.render('users', { users });
});

router.post('/users/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const currUserEmail = req.session?.user?.email;
  const users = await db('users')
    .where({ user_id: id })
    .update({ deleted: true }, ['email']);
  await db('users').where({ user_id: id }).update({ deleted: true });
  logger.info(
    `<${currUserEmail}> successfully deleted user <${users[0].email}>`
  );
  req.flash('success', `Nutzer ${users[0].email} wurde erfolgreich gelöscht!`);
  res.redirect('/users');
});

router.post('/users', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  body.email = body.email.trim().toLowerCase();

  const currUserEmail = req.session?.user?.email;

  const user = await db('users')
    .select()
    .where({ email: body.email })
    .then((rows) => {
      return rows[0] ?? null;
    });

  if (!!user) {
    logger.info(
      `<${currUserEmail}> tried to add user <${body.email}>, but email already added`
    );
    req.flash('error', `Email ${body.email} existiert bereits!`);
    return res.redirect('/users');
  }

  await db('users').insert(body);
  logger.info(`<${currUserEmail}> successfully added user <${body.email}>`);
  req.flash('success', `Email ${body.email} wurde erfolgreich hinzugefügt!`);
  res.redirect('/users');
});

export default router;
