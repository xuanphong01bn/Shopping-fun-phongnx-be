import Category from "../models/category";
import Cart from "../models/cart";
import Product from "../models/product";
import User from "../models/user";
import Order from "../models/order";
import express from "express";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
const fs = require("fs");
const APP_PORT = 3000;
const APP_HOST = "localhost"; //
const GOOGLE_MAILER_CLIENT_ID =
  "185101515936-p4oppj9l3sphf9f91o80l0ugpevkbdee.apps.googleusercontent.com";
const GOOGLE_MAILER_CLIENT_SECRET = "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";
const GOOGLE_MAILER_REFRESH_TOKEN =
  "1//04QHP_U-g9FTvCgYIARAAGAQSNwF-L9IrEdxbNuwtFTLBvjwt00P2XZxE6IPqTNlvpVlyzBSL0E7vLZlWVSPaDwUS-15wn5textY";
const ADMIN_EMAIL_ADDRESS = "donhatphong94@gmail.com";

// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});
const updateStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const status = req.body.status;
  let orderChose = await Order.findOneAndUpdate(
    { _id: orderId },
    { orderStatus: status },
    { new: true }
  );

  if (!orderChose) res.json({ update: false });
  else res.json({ update: true, orderChose });
};

const getAllOrderAdmin = async (req, res) => {
  const userOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("products.product")
    .populate("orderedBy");
  res.json(userOrders);
};
const getDetailOrderAdmin = async (req, res) => {
  const id = req?.params?.orderId;
  const userOrders = await Order.findById(id)
    .sort({ createdAt: -1 })
    .populate("products.product")
    .populate("orderedBy");
  res.json(userOrders);
};

const sendEmailAdmin = async (req, res) => {
  try {
    // Lấy thông tin gửi lên từ client qua body
    const { email, subject, content, path } = req.body;
    if (!email || !subject || !content)
      throw new Error("Please provide email, subject and content!");

    /**
     * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
     * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
     */
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token;

    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    // mailOption là những thông tin gửi từ phía client lên thông qua API
    const mailOptions = {
      to: email, // Gửi đến ai?
      subject: subject, // Tiêu đề email
      attachments: [
        {
          filename: "file.pdf",
          path: path,
          contentType: "application/pdf",
        },
      ],
      html: `<h3>${content}</h3>`, // Nội dung email
    };

    // Gọi hành động gửi email
    await transport.sendMail(mailOptions);

    // Không có lỗi gì thì trả về success
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    // Có lỗi thì các bạn log ở đây cũng như gửi message lỗi về phía client
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
};
const checkFileExist = async (req, res) => {
  const path = req.body.path;
  console.log("Path :", path);
  const checkFileExists = (filePath) => {
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  };

  const fileExists = await checkFileExists(path);

  if (fileExists) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
};

const orderByDay = async (req, res) => {
  var startDate = new Date();
  const daySubtract = req.body.daySubtract;
  startDate.setDate(startDate.getDate() - daySubtract);

  const count = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        numOrder: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  return res.json({ count });
};
const revenue = async (req, res) => {
  var startYear = new Date("2023-01-01");
  var endYear = new Date("2023-12-31");

  const reve = await Order.aggregate([
    {
      $match: {
        // lọc bản gi
        createdAt: { $gte: startYear, $lte: endYear },
        orderStatus: "Completed",
      },
    },
    {
      $group: {
        //nhóm lại bản ghi trả về trường total amount
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
        totalAmount: { $sum: "$paymentIntent.amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
  return res.json({ reve });
};
const updateSoldAndStockProduct = async (req, res) => {
  const { arrayProductUpdate } = req.body;
  console.log("Check array prod update -------", arrayProductUpdate);
  for (const product of arrayProductUpdate) {
    const idProd = product?.id;
    const count = +product?.count;
    const productUpdate = await Product.find({ _id: idProd });
    if (productUpdate?.length) {
      console.log("pro la ------ :", productUpdate);

      const sold = +productUpdate[0]?.sold;
      const quantity = +productUpdate[0]?.quantity;
      console.log("number :", sold, quantity, count);
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: idProd },
        {
          sold: sold + count,
          quantity: quantity - count,
        },
        {
          new: true,
        }
      );
    }
  }

  res.json("update sold done");
};
module.exports = {
  updateStatus: updateStatus,
  getAllOrderAdmin: getAllOrderAdmin,
  sendEmailAdmin: sendEmailAdmin,
  checkFileExist,
  orderByDay,
  revenue,
  updateSoldAndStockProduct,
  getDetailOrderAdmin,
};
