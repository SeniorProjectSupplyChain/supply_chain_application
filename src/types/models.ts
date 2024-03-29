import { UserRole, UserStatus, ProductStatus, OrderStatus } from "./types";

export interface UserForRegister {
	email: string;
	password: string;
	fullName: string;
	avatar: string;
	phoneNumber: string;
	address: string;
	role: UserRole;
	signature: string;
}

export interface User {
	userId?: string;
	userCode: string;
	email: string;
	password: string;
	userName: string;
	fullName: string;
	avatar: string;
	phoneNumber: string;
	address: string;
	role: UserRole;
	roleId: number;
	status?: UserStatus;
	signature: string;
}

export type TokenPayload = {
	role: UserRole;
	userId: string;
	userName: string;
	phoneNumber: string;
};

export type DecodeUser = {
	userId: string;
	role: string;
	userName: string;
	phoneNumber: string;
	iat: number;
	exp: number;
};

export type ProductDate = {
	status: ProductStatus;
	time: string;
	actor: Actor;
};

export type Product = {
	productId: string;
	productCode: string;
	productName: string;
	image: string[];
	dates: ProductDate[];
	expireTime: string;
	price: string;
	amount: string;
	unit: string;
	status: ProductStatus;
	description: string;
	certificateUrl: string;
	supplier: Actor;
	qrCode: string;
};

export type ProductCommercial = {
	productCommercialId: string;
	productId: string;
	productCode: string;
	productName: string;
	image: string[];
	dates: ProductDate[];
	expireTime: string;
	price: string;
	unit: string;
	status: ProductStatus;
	description: string;
	certificateUrl: string;
	qrCode: string;
};

export type ProductForCultivate = {
	productName: string;
	productCode: string;
	price: string;
	amount: string;
	unit: string;
	description: string;
	certificateUrl: string;
	image: string[];
};

export type ProductForUpdate = {
	productId: string;
	productName: string;
	price: string;
	amount: string;
	unit: string;
	description: string;
	certificateUrl: string;
	image: string[];
};

export type ProductHistory = {
	record: Product;
	txId: string;
	timestamp: Date;
	isDelete: boolean;
};

export type Auth = {
	phoneNumber: string;
	otp: string;
	expired: Date;
};

export type ProductItem = {
	product: Product;
	quantity: string;
};

export type ProductCommercialItem = {
	product: ProductCommercial;
	quantity: string;
};

export type Actor = {
	email: string;
	userName: string;
	fullName: string;
	avatar: string;
	phoneNumber: string;
	address: string;
	role: UserRole;
	userId: string;
};

export type DeliveryStatus = {
	deliveryDate: string;
	status: OrderStatus;
	address: string;
	actor: Actor;
};

export type Order = {
	orderId: string;
	productItemList: ProductCommercialItem[];
	deliveryStatuses: DeliveryStatus[];
	signature: string[];
	status: OrderStatus;
	manufacturer: Actor;
	distributor: Actor;
	retailer: Actor;
	qrCode: string;
	createDate: string;
	updateDate: string;
	finishDate: string;
};

export type ProductIdItem = {
	productId: string;
	quantity: string;
};

export type ProductIdQRCodeItem = {
	productId: string;
	quantity: string;
	qrCode: string;
};

export type OrderPayloadForCreate = {
	productIdItems: ProductIdItem[];
	signatures: string[];
	deliveryStatus: {
		address: string;
	};
	qrCode: string;
};

export type OrderForCreate = {
	productIdQRCodeItems: ProductIdQRCodeItem[];
	signatures: string[];
	deliveryStatus: {
		address: string;
	};
	qrCode: string;
};

export type OrderForUpdateFinish = {
	orderId: string;
	signature: string;
	deliveryStatus: {
		address: string;
	};
};

export type CartForCreate = {
	productIdItems: ProductIdItem[];
};

export type ManufacturedProduct = {
	product: Product;
	date: string;
};

export type ProductNumber = {
	product: Product;
	count: number;
};

export type ProductTime = {
	product: Product;
	date: string;
};

export type OrderedProductId = Record<string, ProductNumber>;
export type OrderedProductTime = Record<string, ProductTime>;
