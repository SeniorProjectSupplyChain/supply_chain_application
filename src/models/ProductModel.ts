import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema, Document } from "mongoose";
import { ProductStatus, ProductStatusArray } from "../types/types";

interface ProductDates {
	cultivated: string;
	harvested: string;
	imported: string;
	manufacturered: string;
	exported: string;
	distributed: string;
	selling: string;
	sold: string;
}

interface ProductActors {
	supplierId: string;
	manufacturerId: string;
	distributorId: string;
	retailerId: string;
}

interface Product extends Document {
	productId: string;
	productName: string;
	image: string[];
	dates: ProductDates;
	actors: ProductActors;
	expireTime: string;
	price: string;
	amount: string;
	unit: string;
	status: ProductStatus;
	description: string;
	certificateUrl: string;
	supplierId: string;
	qrCode: string;
}

const ProductSchema: Schema<Product> = new Schema<Product>({
	productId: { type: String, default: uuidv4 },
	productName: { type: String, required: true },
	image: { type: [String], required: true },
	dates: {
		cultivated: { type: String },
		harvested: { type: String },
		imported: { type: String },
		manufacturered: { type: String },
		exported: { type: String },
		distributed: { type: String },
		sold: { type: String }
	},
	actors: {
		supplierId: { type: String },
		manufacturerId: { type: String },
		distributorId: { type: String },
		retailerId: { type: String }
	},
	expireTime: { type: String },
	price: { type: String, required: true, default: "0" },
	amount: { type: String, required: true, default: "0" },
	unit: { type: String, required: true, default: "kg" },
	status: {
		type: String,
		enum: ProductStatusArray,
		required: true,
		default: "CULTIVATING"
	},
	description: { type: String, required: true },
	certificateUrl: { type: String, required: true },
	supplierId: { type: String, required: true },
	qrCode: { type: String, required: true }
});

const ProductModel = mongoose.model<Product>("Product", ProductSchema);

export { Product, ProductModel };