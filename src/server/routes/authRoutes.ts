import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import bcrypt from 'bcrypt';
import { User } from '../shared/types';

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}

const router = Router();

const requireNotAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user?.user_id) {
    return res.redirect('/');
  } else {
    return next();
  }
};

router.get('/login', requireNotAuthenticated, (req: Request, res: Response) => {
  res.render('login');
});

router.get(
  '/register',
  requireNotAuthenticated,
  (req: Request, res: Response) => {
    res.render('register');
  }
);

router.post(
  '/login',
  requireNotAuthenticated,
  async (req: Request, res: Response) => {
    const { email, password, stayLoggedIn } = req.body;

    const rows = await db('credentials').select().where({ email });

    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password))
    ) {
      console.log(`Invalid email or password`);
      return res.redirect('/login');
    }

    const users = await db('users').select().where({ email });
    req.session.user = users[0];

    if (stayLoggedIn) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    console.log(`Email<${email}> logged in successfully`);
    req.flash('success', 'Anmeldung erfolgreich!');
    res.redirect('/');
  }
);

router.post(
  '/register',
  requireNotAuthenticated,
  async (req: Request, res: Response) => {
    const { email, password, passwordRepeat } = req.body;

    const emailAlreadyRegistered = await db('credentials')
      .select()
      .where({ email })
      .then((rows) => {
        return rows.length !== 0;
      });

    if (emailAlreadyRegistered) {
      console.log(`Email<${email}> already registered`);
      return res.redirect('/register');
    }

    const user = await db('users')
      .select()
      .where({ email })
      .then((rows) => {
        return rows[0] ?? null;
      });

    if (!user) {
      console.log(`Email<${email}> not allowed to register`);
      return res.redirect('/register');
    }

    const passwordsMatch = password === passwordRepeat;

    if (!passwordsMatch) {
      console.log(`Passwords do not match`);
      req.flash('error', 'Passwörter stimmen nicht überein!');
      return res.redirect('/register');
    }

    //Password requires min 8 characters and atleast one number, lower case letter and upper case letter
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const passwordConditions = re.test(password);

    if (!passwordConditions) {
      console.log(`Password does not fullfill conditions`);
      req.flash(
        'error',
        'Das Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen Kleinbuchstaben und einen Großbuchstaben enthalten!'
      );
      return res.redirect('/register');
    }

    const encryptedPw = await bcrypt.hash(password, 10);

    await db
      .insert({
        email,
        password: encryptedPw,
        user_id: user.user_id
      })
      .into('credentials');

    await db('users').update({ active: 1 });

    console.log(`User<${email}> registered successfully`);
    return res.redirect('/login');
  }
);

export default router;
