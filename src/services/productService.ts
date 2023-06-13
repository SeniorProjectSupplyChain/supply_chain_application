import { User, Product } from "../types/models";
import { getUserByUserId } from "./userService";
import { ProductModel } from "../models/ProductModel";
import {
	evaluateGetWithNoArgs,
	evaluateTransactionUserObjProductId
} from "../app";
import moment from "moment";
import { addHours, format, parse } from "date-fns";

export const checkExistedProduct = async (productId: string) => {
	const isExisted = await ProductModel.exists({ productId: productId });
	return Boolean(isExisted);
};

export const getAllProducts = async (userId: string) => {
	const userObj = await getUserByUserId(userId);
	const products = await evaluateGetWithNoArgs("GetAllProducts", userObj);
	// const product02 = await getProductById(userObj, "Product2")
	// 		if(product02 && products.length==1 || products.length>=2 && products[1].productId != "Product2") {
	// 			let array1 = products.filter((item:any) => item.productId == "Product1");
	// 			let array2 = products.filter((item:any) => item.productId != "Product1");
	// 			const productIdList = [
	// 				"Product3",
	// 				"Product4",
	// 				"Product5",
	// 				"Product6",
	// 				"Product7",
	// 				"Product8",
	// 				"Product9",
	// 			]
	// 			let productList = array1
	// 			productList.push(product02)
	// 			for (let id of productIdList) {
	// 				const product = await getProductById(userObj, id)
	// 				productList.push(product)
	// 			}
	// 			productList = productList.concat(array2)
	// 			for (let product of productList) {
	// 				for (let date of product.dates) {
	
	
	// 					const originalDateString = date.time;
	// 					const originalFormat = "YYYY-MM-DD HH:mm:ss.S Z";
	// 					const targetFormat = "YYYY-MM-DD HH:mm:ss.SZ";
	
	// 					const convertedDateString = moment(originalDateString, originalFormat)
	// 					.utcOffset("+07:00")
	// 					.format(targetFormat);
	// 					date.time = convertedDateString
	// 				}
	
	// 				if (product.expireTime != '') {
	// 					const dateString = product.expireTime;
	// 					const parsedDate = parse(dateString, 'MMM d, yyyy, hh:mm:ss a', new Date());
	// 					const formattedDate = format(addHours(parsedDate, 5), "yyyy-MM-dd HH:mm:ss.Sxxx");
	// 					product.expireTime = formattedDate
	// 				}
	// 			}
	// 			return productList
	// 		}
	return products;
};

export const getProductById = async (userObj: User, productId: string) => {
	const product = await evaluateTransactionUserObjProductId(
		"GetProduct",
		userObj,
		productId
	);
	return product;
};

export const createProduct = async (productObj: Product) => {
	const isExistedProduct: boolean = await checkExistedProduct(
		productObj.productId
	);

	if (isExistedProduct) {
		return {
			data: null,
			message: "productid-existed"
		};
	}

	const createdProduct = await ProductModel.create(productObj)
		.then((data: any) => {
			console.log("success", data);
			return data;
		})
		.catch((error: any) => {
			console.log("error", error);
			return error;
		});

	if (createdProduct) {
		return { data: createdProduct, message: "successfully" };
	} else {
		return { data: createdProduct, message: "failed" };
	}
};
