import express, { Router } from "express";
import {
  verifyEmail,
  getUsers,
  editUsername,
  editUserEmail,
  updateUser,
  editUserPassword,
  updateUserPassword,
  userSetting,
  deleteUser,
} from "../controllers/UserController";
import { isAdmin, isUser } from "../middlewares/IsAuth";

const userRoute: Router = express.Router();

//verify email
userRoute.get("/:id/verify/:token", verifyEmail);

//get users
userRoute.get("/", isAdmin, getUsers);

//show update user form
userRoute.get("/edit-username/:id", isUser, editUsername);
userRoute.get("/edit-email/:id", isUser, editUserEmail);
userRoute.get("/edit-password/:id", isUser, editUserPassword);

//update user
userRoute.put("/:id", isUser, updateUser);
userRoute.put("/:id", isUser, userSetting);
userRoute.post("/:id", isUser, updateUserPassword);

//delete user
userRoute.delete("/:id", isUser, deleteUser);

export default userRoute;
