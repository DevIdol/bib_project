import express, { Router, Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import { isAdmin, isUser } from "../middlewares/IsAuth";

const renderRoute: Router = express.Router();

//show home
renderRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.access_token;
  res.render("index", { token });
});

//show pets
renderRoute.get("/pets", (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.access_token;
  res.render("pet", { token });
});

//show register form
renderRoute.get(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.access_token;
    !token && res.render("register");
    token && res.redirect("/");
  }
);

//show login form
renderRoute.get("/login", (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.access_token;
  !token && res.render("login");
  token && res.redirect("/");
});

//show favorite page
renderRoute.get(
  "/favorites",
  isUser,
  (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.access_token;
    res.render("favorite", { user: req.user, token });
  }
);

// show manage account
renderRoute.get(
  "/account",
  isUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;
      const user: any = req.user;
      const users = await User.findById(user._id);
      res.render("account", { user: users, token });
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  }
);

//show dashboard
renderRoute.get(
  "/admin",
  isAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.access_token;
    let user: any = req.user;
    res.render("admin", { user, token });
  }
);

//show forgot-password
renderRoute.get(
  "/forgot-password",
  (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.access_token;
    if (!token) {
      res.render("forgot-password");
    } else {
      res.render("not-found", { error: "Page Not Found!" });
    }
  }
);
//=================
// Manage User
// ================

//Edit From Load

export default renderRoute;
