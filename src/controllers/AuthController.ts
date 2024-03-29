import UserService from "../services/userService";
import AuthService from "../services/authService";
import { Auth } from "../types/models";
import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { AuthModel } from "../models/AuthModel";

const userService: UserService = new UserService();
const authService: AuthService = new AuthService();

const AuthController = {
	login: async (req: Request, res: Response) => {
		try {
			const { phoneNumber, password } = req.body;
			const currentDate = new Date();
			const expirationDate = new Date(
				currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
			);

			const user = await userService.getUserForLogin(phoneNumber, password);
			if (!user) {
				return res.status(401).json({
					data: null,
					message: "Incorrect phone number or password!",
					error: "incorrect-phonenumber-or-password"
				});
			}
			if (user.status === "inactive") {
				let otp = await AuthModel.findOne({ phoneNumber: user.phoneNumber });
				if (!otp) {
					let otp: Auth = {
						phoneNumber: phoneNumber,
						otp: await authService.sendOtp(phoneNumber),
						expired: expirationDate
					};
					if (otp.otp == null) {
						return res.status(404).json({
							data: null,
							message: "Account not found!",
							error: "account-notfound"
						});
					}
					await AuthModel.create(otp).then((data) => {
						console.log(data);
					});
					return res.status(200).json({
						data: null,
						message: "OTP sent successfully!",
						error: null
					});
				}

				otp.otp = await authService.sendOtp(phoneNumber);
				await AuthModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{ otp: otp.otp }
				);
				if (otp.otp == null) {
					return res.status(404).json({
						data: null,
						message: "Account not found!",
						error: "account-notfound"
					});
				}

				return res.status(200).json({
					data: null,
					message: "OTP sent successfully!",
					error: null
				});
			}

			const payload = {
				role: user.role,
				userId: user.userId,
				userName: user.userName,
				phoneNumber: user.phoneNumber
			};
			const token = await authService.generateAccessToken(payload);

			return res.status(200).json({
				data: { user: user, token: token },
				message: "Login successfully!",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	verify: async (req: Request, res: Response) => {
		try {
			const { phoneNumber, smsotp } = req.body;

			let otp = await AuthModel.findOne({ phoneNumber: phoneNumber });
			if (!otp) {
				return res.status(404).json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			if (otp.otp === smsotp) {
				const currentDate = new Date();
				const expirationDate = new Date(
					currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
				);

				await AuthModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{
						expired: expirationDate,
						otp: ""
					}
				);
				await UserModel.findOneAndUpdate(
					{
						phoneNumber: phoneNumber
					},
					{
						status: "active"
					}
				);

				return res.status(200).json({
					data: null,
					message: "OTP verified successfully!",
					error: null
				});
			}

			return res.status(400).json({
				data: null,
				message: "Invalid OTP!",
				error: "failed"
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	resetPassword: async (req: Request, res: Response) => {
		try {
			const { phoneNumber, isVerified, password } = req.body;

			let user = await UserModel.findOne({ phoneNumber: phoneNumber });
			if (!user) {
				return res.status(404).json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			if (isVerified) {
				user.password = password;
				await UserModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{ user: user }
				);
				return res.status(200).json({
					data: null,
					message: "Reset password successfully!",
					error: null
				});
			}

			let otp = await AuthModel.findOne({ phoneNumber: user.phoneNumber });
			otp.otp = await authService.sendOtp(phoneNumber);
			return res.status(200).json({
				data: null,
				message: "OTP sent successfully!",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default AuthController;
