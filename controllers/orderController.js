const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const { generatePaypalAccessToken } = require("../config/token");
const twoDecimals = require("../utils/twoDecimals");
const axios = require("axios");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// @desc Create new order
// @route POST /api/orders
// @access Private

module.exports.createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  console.log(req.body);
  try {
    if (
      orderItems === undefined ||
      shippingAddress === undefined ||
      paymentMethod === undefined ||
      taxPrice === undefined ||
      shippingPrice === undefined ||
      totalPrice === undefined
    )
      throw new Error("Some informations are missing");

    if (orderItems.length === 0) throw new Error("No order items");

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    res.json(createOrder);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc GET ORDER BY ID
// @route GET /api/orders/:id
// @access Private
module.exports.fetchOrderById = asyncHandler(async (req, res) => {
  try {
    const id = req.params?.id;

    //check if valid id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid URL");
    }

    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      throw new Error("order not found");
    }
    res.json(order);
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
module.exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const id = req.params?.id;

    //check if valid id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid URL");
    }

    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      throw new Error("order not found");
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    //all paymentResult comes from paypal
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc create an order
// @route POST /api/orders/create-order
// @access Private
module.exports.createPaypalOrder = asyncHandler(async (req, res) => {
  try {
    /*** CHECK THE BODY ***/
    const items = req.body?.items;
    if (!items || items.length === 0) throw new Error("Order is empty");

    const { address, city, country, postalCode } = req.body?.shippingAddress;
    if (!address || !city || !country || !postalCode)
      throw new Error("Incorrect address format");

    const { paymentMethod } = req.body;
    if (!paymentMethod) throw new Error("Payment Method is missing");

    /*** ADDITIONNAL : CHECK IF PRODUCT STILL AVAILABLE ***/

    /*** CALCULATE AMOUNT ***/
    //create a new array of ids to check if value haven't been modify by client
    const ids = items.map((item) => item._id);
    const products = await Product.find(
      { _id: { $in: ids } },
      { _id: 1, name: 1, price: 1, countInStock: 1, image: 1 }
    );

    //Store the products to compare with req.body.items
    const storeProducts = new Map();
    products.map((product) =>
      storeProducts.set(product._id.toString(), {
        name: product.name,
        price: product.price,
        countInStock: product.countInStock,
        image: product.image,
      })
    );

    //Item Price
    const itemsPrice = twoDecimals(
      items.reduce(
        (acc, item) => acc + storeProducts.get(item._id).price * item.qty,
        0
      )
    );

    //Shipping Price
    const shippingPrice =
      itemsPrice >= parseInt(process.env.SHIPPING_FREE)
        ? 0
        : parseInt(process.env.SHIPPING_VALUE);

    //Total Price
    const totalPrice = twoDecimals(shippingPrice + itemsPrice);

    //Tax Price
    const taxPrice = twoDecimals(totalPrice * 0.2);

    /*** GENERATE ACCESS TOKEN ***/
    const accessToken = await generatePaypalAccessToken();

    /*** PAYPAL REST API - CREATE ORDER ***/
    const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`;
    const payload = JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: totalPrice,
          },
        },
      ],
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const order = await axios.post(url, payload, config);

    /*** SAVE ORDER IN DATABASE ***/
    const orderItems = items.map((item) => {
      return {
        _id: item._id,
        name: storeProducts.get(item._id).name,
        image: storeProducts.get(item._id).image,
        price: storeProducts.get(item._id).price,
        qty: item.qty,
      };
    });

    const createOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      user: req.user._id,
      orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod,
      transaction_id: order.data.id,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const orderSaved = await createOrder.save();
    console.log("order created : ", orderSaved);

    /*** UPDATE THE QTY ***/
    orderItems.forEach(async (item) => {
      try {
        const productUpdated = await Product.findByIdAndUpdate(
          item._id,
          { $inc: { countInStock: -item.qty } },
          { new: true }
        );
        console.log("Product Updated : ", productUpdated);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    res.json(order.data);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw error;
  }
});

// @desc capture payment
// @route POST /api/orders/:orderID/capture
// @access Public
module.exports.capturePayment = asyncHandler(async (req, res) => {
  /*** GET TRANSACTION ID ***/
  const { orderID } = req.params;

  try {
    /*** GENERATE ACCESS TOKEN ***/
    const accessToken = await generatePaypalAccessToken();

    /*** PAYPAL REST API - CAPTURE PAYMENT ***/
    const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const captureData = await axios.post(url, {}, config);

    /*** UPDATE ORDER  ***/
    const paymentResult = {
      payer_id: captureData.data.payer.payer_id,
      email_address: captureData.data.payer.email_address,
      status: captureData.data.status,
      update_time:
        captureData.data.purchase_units[0].payments.captures[0].update_time,
    };
    const order = await Order.findOneAndUpdate(
      { transaction_id: orderID },
      { $set: { isPaid: true, paymentResult: paymentResult } },
      { new: true }
    );
    console.log("Order has been updated : ", order);
    res.json(order._id);
  } catch (error) {
    res.status(500);
    throw error;
  }
});

// @desc Cancel order
// @route PUT /api/orders/:orderID/cancel
// @access Private
module.exports.cancelOrder = asyncHandler(async (req, res) => {
  const { orderID } = req.params;
  try {
    const order = await Order.findOne({
      user: req.user._id,
      transaction_id: orderID,
    });
    order.orderItems.forEach(async (item) => {
      try {
        await Product.findOneAndUpdate(
          { _id: item._id },
          { $inc: { countInStock: +item.qty } }
        );
        console.log(
          `Product ${item.name} has been updated +${item.qty} in Stock`
        );
      } catch (error) {
        throw error;
      }
    });
    res.status(200).json("ok");
  } catch (error) {
    res.status(500);
    throw error;
  }
});

// @desc get Invoice
// @route GET /api/orders/get-invoice
// @access Private
module.exports.getInvoice = asyncHandler(async (req, res) => {
  const invoiceName = "nodemailer.pdf";
  const invoicePath = path.join("client", "public", "invoices", invoiceName);

  // This line opens the file as a readable stream
  const readStream = fs.createReadStream(invoicePath);

  // This will wait until we know the readable stream is actually valid before piping
  readStream.on("open", () => {
    // This just pipes the read stream to the response object (which goes to the client)
    res.contentType("application/pdf");
    res.status(200);
    readStream.pipe(res);
  });

  // Catch errors that happen while creating the readable stream (usually invalid names)
  readStream.on("error", function (err) {
    res.status(404);
    throw new error(err);
  });
});

// @desc create Invoice
// @route GET /api/orders/create-invoice/:id
// @access Public
module.exports.generatePdf = asyncHandler(async (req, res) => {
  const orderID = req.params.id;
  const invoiceName = `invoice-${orderID}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);

  const order = await Order.findOne({ _id: orderID }).populate({path: "user",
  select: "firstName lastName "});
  const day = order.createdAt.getUTCDate();
  const month = order.createdAt.getUTCMonth() + 1;
  const year = order.createdAt.getUTCFullYear();
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(invoicePath));
  doc.pipe(res);

  doc.image(path.join("data", "logo", "invoice-logo.jpg"), 50, 45, {
      width: 100,
    })
    .fontSize(20)
    .text("FACTURE", { align: "right" })
    .fillColor("gray")
    .text(`${day}/${month}/${year}`, { align: "right" })
    .moveDown();

  doc.fontSize(14)
    .fillColor('black')
    .text("Société", 50, 200)
    .text("Blue Woman In Love", 50,220)
    .text("29 Chemin des Cerisier", 50, 240)
    .text("6900 Lyon", 50, 260)
    .text("Client", 300, 200)
    .text(`${order.user.firstName} ${order.user.lastName}`, 300, 220)
    .text(order.shippingAddress.address, 300, 240)
    .text(`${order.shippingAddress.postalCode} ${order.shippingAddress.city}`, 300, 260)
    .moveDown();

  doc.end();
});
