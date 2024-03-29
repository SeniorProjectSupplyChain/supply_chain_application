import OrderService from "./orderService";
import ProductService from "./productService";
import { UserModel } from "../models/UserModel";
import { User, Order } from "../types/models";
import {
	ManufacturedProduct,
	OrderedProductTime,
	OrderedProductId,
	Product,
	ProductIdItem,
	ProductNumber,
	ProductTime
} from "../types/models";

const orderService: OrderService = new OrderService();
const productService: ProductService = new ProductService();

class RetailerService {
	getManufacturedProducts = async (userId: string) => {
		try {
			const products = await productService.getAllProducts(userId);
			let manufacturedProducts: ManufacturedProduct[] = [];

			products.forEach((product: any) => {
				if (product.status == "MANUFACTURED") {
					manufacturedProducts.push({
						product: product,
						date: product.dates[3].time
					});
				}
			});

			const sortedProducts = manufacturedProducts.sort((a, b) =>
				b.date.localeCompare(a.date)
			);

			return sortedProducts;
		} catch (error) {
			console.log("getManufacturedProducts", error.message);
			return null;
		}
	};

	getAllOrderedProducts = async (userObj: User) => {
		try {
			const products: Product[] = await productService.getAllProducts(
				userObj.userId
			);
			const orders: Order[] = await orderService.getAllOrdersOfRetailer(
				userObj,
				userObj.userId,
				"SHIPPED"
			);
			let orderedProductTimes: OrderedProductTime = {};

			orders.map((order) =>
				order.productItemList.map((productItem) => {
					const productId = productItem.product.productId;
					if (orderedProductTimes[productId] == undefined) {
						orderedProductTimes[productId] = {
							product: products.find((p) => p.productId == productId),
							date: order.finishDate
						};
					}
				})
			);

			// Calculation
			const entries: [string, ProductTime][] =
				Object.entries(orderedProductTimes);
			entries.sort((a, b) => b[1].date.localeCompare(a[1].date));
			const result: ProductTime[] = entries.map(([key, value]) => ({
				product: value.product,
				date: value.date
			}));

			return result;
		} catch (error) {
			console.log("getAllOrderedProducts", error.message);
			return null;
		}
	};

	getPopularOrderedProducts = async (userObj: User) => {
		try {
			const products: Product[] = await productService.getAllProducts(
				userObj.userId
			);
			const orders: Order[] = await orderService.getAllOrdersOfRetailer(
				userObj,
				userObj.userId,
				"SHIPPED"
			);
			let orderedProductIds: OrderedProductId = {};

			orders.map((order) =>
				order.productItemList.map((productItem) => {
					const pId = productItem.product.productId;
					if (orderedProductIds[pId]) {
						orderedProductIds[pId].count = orderedProductIds[pId].count + 1;
					} else {
						orderedProductIds[pId] = {
							product: products.find((p) => p.productId == pId),
							count: 1
						};
					}
				})
			);

			// Calculation
			const entries: [string, ProductNumber][] =
				Object.entries(orderedProductIds);
			entries.sort((a, b) => b[1].count - a[1].count);
			const result: ProductNumber[] = entries.map(([key, value]) => ({
				product: value.product,
				count: value.count
			}));

			return result;
		} catch (error) {
			console.log("getPopularOrderedProducts", error.message);
			return null;
		}
	};

	getCartByRetailerId = async (userId: string) => {
		try {
			const user = await UserModel.findOne({ userId: userId });
			return user.cart;
		} catch (error) {
			console.log("getProductByRetailerId", error.message);
			return null;
		}
	};

	addCartByRetailerId = async (userId: string, cartObj: ProductIdItem) => {
		try {
			const user = await UserModel.findOneAndUpdate(
				{ userId: userId },
				{ cart: [cartObj] },
				{ new: true }
			);
			return user.cart;
		} catch (error) {
			console.log("addCartByRetailerId", error.message);
			return null;
		}
	};

	updateCartByRetailerId = async (userId: string, cartObj: ProductIdItem[]) => {
		try {
			const user = await UserModel.findOneAndUpdate(
				{ userId: userId },
				{ cart: cartObj },
				{ new: true }
			);
			return user.cart;
		} catch (error) {
			console.log("updateCartByRetailerId", error.message);
			return null;
		}
	};

	deleteCart = async (userId: string) => {
		try {
			const deleted = await UserModel.findOneAndUpdate(
				{ userId: userId },
				{ cart: [] },
				{ new: true }
			);
			return deleted.cart;
		} catch (error) {
			console.log("deleteCart", error.message);
			return null;
		}
	};
}

export default RetailerService;
