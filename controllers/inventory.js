let inventoryModel = require('../schemas/inventory');
let productModel = require('../schemas/products');

module.exports = {
    GetAllInventories: async function () {
        try {
            return await inventoryModel.find().populate({
                path: 'product',
                select: 'title price description'
            });
        } catch (error) {
            return { error: error.message };
        }
    },

    GetInventoryById: async function (id) {
        try {
            return await inventoryModel.findById(id).populate({
                path: 'product',
                select: 'title price description'
            });
        } catch (error) {
            return { error: error.message };
        }
    },

    GetInventoryByProductId: async function (productId) {
        try {
            return await inventoryModel.findOne({ product: productId }).populate({
                path: 'product',
                select: 'title price description'
            });
        } catch (error) {
            return { error: error.message };
        }
    },

    CreateInventory: async function (productId) {
        try {
            let newInventory = new inventoryModel({
                product: productId,
                stock: 0,
                reserved: 0,
                soldCount: 0
            });
            await newInventory.save();
            return newInventory;
        } catch (error) {
            return { error: error.message };
        }
    },

    AddStock: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                return { error: 'Quantity must be greater than 0' };
            }
            let inventory = await inventoryModel.findOneAndUpdate(
                { product: productId },
                { 
                    $inc: { stock: quantity },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            ).populate({
                path: 'product',
                select: 'title price description'
            });

            if (!inventory) {
                return { error: 'Inventory not found' };
            }
            return inventory;
        } catch (error) {
            return { error: error.message };
        }
    },

    RemoveStock: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                return { error: 'Quantity must be greater than 0' };
            }

            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                return { error: 'Inventory not found' };
            }

            if (inventory.stock < quantity) {
                return { error: 'Insufficient stock available' };
            }

            inventory = await inventoryModel.findOneAndUpdate(
                { product: productId },
                { 
                    $inc: { stock: -quantity },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            ).populate({
                path: 'product',
                select: 'title price description'
            });

            return inventory;
        } catch (error) {
            return { error: error.message };
        }
    },

    ReserveStock: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                return { error: 'Quantity must be greater than 0' };
            }

            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                return { error: 'Inventory not found' };
            }

            if (inventory.stock < quantity) {
                return { error: 'Insufficient stock available for reservation' };
            }

            inventory = await inventoryModel.findOneAndUpdate(
                { product: productId },
                { 
                    $inc: { stock: -quantity, reserved: quantity },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            ).populate({
                path: 'product',
                select: 'title price description'
            });

            return inventory;
        } catch (error) {
            return { error: error.message };
        }
    },

    MarkAsSold: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                return { error: 'Quantity must be greater than 0' };
            }

            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                return { error: 'Inventory not found' };
            }

            if (inventory.reserved < quantity) {
                return { error: 'Insufficient reserved stock to mark as sold' };
            }

            inventory = await inventoryModel.findOneAndUpdate(
                { product: productId },
                { 
                    $inc: { reserved: -quantity, soldCount: quantity },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            ).populate({
                path: 'product',
                select: 'title price description'
            });

            return inventory;
        } catch (error) {
            return { error: error.message };
        }
    }
};
