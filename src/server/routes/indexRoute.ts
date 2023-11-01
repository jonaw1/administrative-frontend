import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db/database";

const router = Router();

const requireAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user?.user_id) {
    return res.redirect("back");
  } else {
    return next();
  }
};

router.get("/", (req: Request, res: Response) => {
  res.render("index");
});

router.get("/forgot-pw", (req: Request, res: Response) => {
  res.render("forgot-pw");
});

router.post("/forgot-pw", (req: Request, res: Response) => {
  // Send email
  req.flash("success", "Email zum Ändern des Passworts wurde versendet. Bitte bestätigen Sie den darin enthaltenen Link");
  res.redirect("/forgot-pw");
});

router.post("/logout", requireAuthenticated, (req: Request, res: Response) => {
  delete req.session.user;
  res.redirect("back");
});

router.post(
  "/profile",
  requireAuthenticated,
  async (req: Request, res: Response) => {
    const { first_name, last_name, email } = req.body;
    const user_id = req.session.user?.user_id;

    const users = await db("users")
      .update({ first_name, last_name, email }, "*")
      .where({ user_id });
    await db("credentials").update({ email }).where({ user_id });

    req.session.user = users[0];

    res.redirect("back");
  }
);

export default router;
