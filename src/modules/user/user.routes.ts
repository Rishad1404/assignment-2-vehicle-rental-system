import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";


const router = Router();

router.get("/", auth('admin'), userControllers.getUsers);

router.get("/:userId",auth("admin","customer"), userControllers.getUser);

router.put("/:userId",auth("admin","customer"), userControllers.updateUser);

router.delete("/:userId",auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
