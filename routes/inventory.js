var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventory');
let mongoose = require('mongoose');

// Validate ObjectId helper
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// GET all inventories
router.get('/', async function (req, res) {
    try {
        let data = await inventoryController.GetAllInventories();
        if (data.error) {
            res.status(400).send(data);
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// GET inventory by ID (with product join)
router.get('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let data = await inventoryController.GetInventoryById(id);
        if (data.error) {
            res.status(404).send(data);
        } else if (!data) {
            res.status(404).send({
                message: 'Inventory not found'
            });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// GET inventory by product ID
router.get('/product/:productId', async function (req, res) {
    try {
        let productId = req.params.productId;
        let data = await inventoryController.GetInventoryByProductId(productId);
        if (data.error) {
            res.status(404).send(data);
        } else if (!data) {
            res.status(404).send({
                message: 'Inventory not found for this product'
            });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// ADD STOCK
router.post('/add-stock', async function (req, res) {
    try {
        let { product, quantity } = req.body;

        if (!product) {
            return res.status(400).send({
                message: 'Product ID is required'
            });
        }

        if (!isValidObjectId(product)) {
            return res.status(400).send({
                message: 'Invalid Product ID format'
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).send({
                message: 'Quantity must be a positive number'
            });
        }

        let result = await inventoryController.AddStock(product, quantity);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.send({
                message: `Added ${quantity} items to stock`,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// REMOVE STOCK
router.post('/remove-stock', async function (req, res) {
    try {
        let { product, quantity } = req.body;

        if (!product) {
            return res.status(400).send({
                message: 'Product ID is required'
            });
        }

        if (!isValidObjectId(product)) {
            return res.status(400).send({
                message: 'Invalid Product ID format'
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).send({
                message: 'Quantity must be a positive number'
            });
        }

        let result = await inventoryController.RemoveStock(product, quantity);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.send({
                message: `Removed ${quantity} items from stock`,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// RESERVATION - Decrease stock and increase reserved
router.post('/reservation', async function (req, res) {
    try {
        let { product, quantity } = req.body;

        if (!product) {
            return res.status(400).send({
                message: 'Product ID is required'
            });
        }

        if (!isValidObjectId(product)) {
            return res.status(400).send({
                message: 'Invalid Product ID format'
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).send({
                message: 'Quantity must be a positive number'
            });
        }

        let result = await inventoryController.ReserveStock(product, quantity);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.send({
                message: `Reserved ${quantity} items`,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// SOLD - Decrease reserved and increase soldCount
router.post('/sold', async function (req, res) {
    try {
        let { product, quantity } = req.body;

        if (!product) {
            return res.status(400).send({
                message: 'Product ID is required'
            });
        }

        if (!isValidObjectId(product)) {
            return res.status(400).send({
                message: 'Invalid Product ID format'
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).send({
                message: 'Quantity must be a positive number'
            });
        }

        let result = await inventoryController.MarkAsSold(product, quantity);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.send({
                message: `Marked ${quantity} items as sold`,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

module.exports = router;
