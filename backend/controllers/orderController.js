import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Create order
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Check if the user is the buyer, the seller of any product in the order, or an admin
    const isBuyer = order.user._id.toString() === req.user._id.toString();
    const isSeller = order.orderItems.some(
      item => item.seller.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'admin';

    if (isBuyer || isSeller || isAdmin) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    // Update product sales count
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { salesCount: item.qty } }
      );
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Seller/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if the user is a seller of any product in the order or an admin
    const isSeller = order.orderItems.some(
      item => item.seller.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      res.status(401);
      throw new Error('Not authorized to update this order');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.trackingNumber = req.body.trackingNumber || '';
    order.shippingStatus = 'Delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update shipping status
// @route   PUT /api/orders/:id/shipping
// @access  Private/Seller/Admin
const updateShippingStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if the user is a seller of any product in the order or an admin
    const isSeller = order.orderItems.some(
      item => item.seller.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      res.status(401);
      throw new Error('Not authorized to update this order');
    }

    order.shippingStatus = req.body.shippingStatus;
    order.trackingNumber = req.body.trackingNumber || order.trackingNumber;

    if (req.body.shippingStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get seller orders
// @route   GET /api/orders/sellerorders
// @access  Private/Seller
const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'orderItems.seller': req.user._id,
  }).populate('user', 'name email');
  
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateShippingStatus,
  getMyOrders,
  getSellerOrders,
  getOrders,
};