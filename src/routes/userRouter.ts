import express from "express";
import UserController from "../controllers/UserController";
import UserRole from "../middlewares/authentication/UserRole";
import { jwtGuard } from "../middlewares/authentication/jwtGuard";
import { Roles } from "../middlewares/authentication/roleGuard";

const router = express.Router();

router.post("/create", UserController.createUser);

router.get(
	"/all",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	UserController.getAllUsers
);

router.get(
	"/:userId",
	jwtGuard,
	Roles(
		UserRole.SUPPLIER,
		UserRole.MANUFACTURER,
		UserRole.DISTRIBUTOR,
		UserRole.RETAILER,
		UserRole.CONSUMER
	),
	UserController.getUser
);

export default router;
