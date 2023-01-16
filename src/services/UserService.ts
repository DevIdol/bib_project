import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import Token from "../models/Token";
import User from "../models/UserModel";

//verify email
export const verifyEmailService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors: any[] = [];
  try {
    const user: any = await User.findOne({ _id: req.params.id });
    if (!user) {
      errors.push({ message: "User Not Found!" });
    }
    const token: any = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      errors.push({ message: "Token Not Found!" });
    }

    if (errors.length > 0) {
      res.render("verify-email", { errors });
    } else {
      await User.updateOne({ _id: user.id }, { $set: { verified: true } });
      await token.remove();
      res.render("verify-email", { message: "Email verified successfully!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//get users
export const getUsersService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.json({
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

//show update username form
export const editUsernameService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  try {
    const user = await User.findById(req.params.id);
    res.render("edit-username", { user, token });
  } catch (error) {
    res.render("not-found", {
      error: "404 | Page Not Found!",
    });
  }
};

//show update email form
export const editUserEmailService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  try {
    const user = await User.findById(req.params.id);
    res.render("edit-email", { user, token });
  } catch (error) {
    res.render("not-found", {
      error: "404 | Page Not Found!",
    });
  }
};

//show update password form
export const editUserPasswordService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  try {
    const user = await User.findById(req.params.id);
    res.render("edit-password", { user, token });
  } catch (error) {
    res.render("not-found", {
      error: "404 | Page Not Found!",
    });
  }
};

//update user
export const updateUserService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    req.flash("success", "Updated Success!");
    res.redirect("/account");
  } catch (error: any) {
    console.log(error);
  }
};
//change password
export const updateUserPasswordService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  let user: any = await User.findOne({ _id: req.params.id });
  const { currentPassword, password, confirmPass } = req.body;
  let errors: any[] = [];
  try {
    const verifiedPassword = await bcrypt.compare(currentPassword, user.password);
    if (!currentPassword || !password || !confirmPass) {
      errors.push({ message: "Input fields can't be empty!" });
    }
    if (!verifiedPassword) {
      errors.push({ message: "Current password is wrong!" });
    }
    if (password !== confirmPass) {
      errors.push({ message: "Password do not match!" });
    }
    if (password.length < 6) {
      errors.push({ message: "Password should be at least 6 characters!" });
    }
    if (errors.length > 0) {
      res.render("edit-password", {
        errors,
        currentPassword,
        password,
        confirmPass,
        token,
        user,
      });
    } else {
      user.password = password;
      await user.save();
      req.flash("success", "Password changed successfully!");
      res.redirect("/account");
    }
  } catch (error) {
    console.log(error);
  }
};
