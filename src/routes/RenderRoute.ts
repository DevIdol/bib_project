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
  "/personal-info",
  isUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;
      const user: any = req.user;
      const users = await User.findById(user._id);
      res.render("personal-info", { user: users, token });
    } catch (error) {
      console.log(error);
    }
  }
);

// show setting
renderRoute.get(
  "/setting",
  isUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;
      const user: any = req.user;
      const users = await User.findById(user._id);
      res.render("setting", { user: users, token });
    } catch (error) {
      console.log(error);
    }
  }
);

//show dashboard
renderRoute.get(
  "/admin",
  isAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    const user = req.user;
    const users = await User.find();
    console.log(users);
    res.render("admin", { user, users, token });
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
