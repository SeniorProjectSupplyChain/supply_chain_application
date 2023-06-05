import { Express } from "express";
import imageRouter from "./imageRouter";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";
import distributorRouter from "./distributorRouter";
import retailerProductRouter from "./retailerProductRouter";

function routing(app: Express) {
	app.use("/image", imageRouter);
	app.use("/auth", authRouter);
	app.use("/user", userRouter);
	app.use("/product", productRouter);
	app.use("/order", orderRouter);
	app.use("/distributor", distributorRouter);
	app.use("/retailer", retailerProductRouter);

	app.use("*", (req, res, next) => {
		res.status(404).json({
			message: "not-found",
			error: "not-found"
		});
	});
}

export default routing;
