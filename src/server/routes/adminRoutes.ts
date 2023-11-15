import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import { stringToTitleCase } from '../shared/utils';

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

router.post('/users', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  body.first_name = stringToTitleCase(body.first_name.trim());
  body.last_name = stringToTitleCase(body.last_name.trim());
  body.email = body.email.trim().toLowerCase();
  await db('users').insert(req.body);
  req.flash('success', `Nutzer<${body.email}> wurde erfolgreich hinzugefügt!`);
  res.redirect('/users');
});

router.delete(
  '/users/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const users = await db('users')
      .where({ user_id: id })
      .update({ deleted: true }, ['email']);
    await db('credentials').where({ user_id: id }).update({ deleted: true });
    req.flash(
      'success',
      `Nutzer<${users[0].email}> wurde erfolgreich gelöscht!`
    );
    res.redirect('/users');
  }
);

export default router;
