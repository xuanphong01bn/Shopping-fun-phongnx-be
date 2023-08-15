import Product from "../models/product";
import slugify from "slugify";
import User from "../models/user";
import moment from "moment";
const mongoose = require("mongoose");
const create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: error.message,
    });
  }
};

const listAll = async (req, res) => {
  const { type } = req?.body;
  const categoryId =
    type == "phone" ? "64c9ab4891a693d9d7e8980f" : "64c71ca1abb4f381e6225719";
  try {
    const allProduct = await Product.find({
      category: new mongoose.Types.ObjectId(categoryId),
    })
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort({ createdAt: "desc" });
    res.status(200).json(allProduct);
  } catch (error) {
    res.json({
      err: error.message,
    });
  }
};

const productGoodSales = async (req, res) => {
  try {
    const allProduct = await Product.find({})
      .limit(5)
      .populate("category")
      .populate("subs")
      .sort({ sold: -1 });
    res.status(200).json(allProduct);
  } catch (error) {
    res.json({
      err: error.message,
    });
  }
};
const remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Create delete failed");
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.find({ slug: req.params.slug })
      .populate("subs")
      .populate("category");
    res.json(product);
  } catch (error) {
    res.json({
      err: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productUpdate = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body
    );
    res.json(productUpdate);
  } catch (error) {
    res.json({ err: error.message });
  }
};

const list = async (req, res) => {
  try {
    //sort: createAt/updateAt     .order:desc/asc:
    const { sort, order, page, perPage } = req.query;
    console.log(req.query);
    const currentPage = page || 1;
    const per = perPage || 5;
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort({ [sort]: order })
      .limit(per);

    res.json(products);
  } catch (error) {
    res.json(error);
  }
};

const productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  console.log("product----- :", product);
  const user = await User.findOne({ email: req.user.email });
  const { star, comment } = req.body;
  console.log("user :", user);
  //check if user da rate chua
  console.log("Checkkkkk user -------:", user._id.toString());
  let existRating = product?.ratings.find(
    (e) => e.postedBy == user._id.toString()
  );
  console.log("exist rating :", existRating);
  if (!!existRating) {
    let ratingUpdate = await Product.updateOne(
      {
        ratings: { $elemMatch: existRating },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.timeRating": moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      },
      {
        new: true,
      }
    ).exec();
    const updatedProduct = await Product.findOne({
      ratings: { $elemMatch: existRating },
    });
    console.log("update star");
    res.json(ratingUpdate);
  } else {
    let ratingAdd = await Product.findByIdAndUpdate(
      product?._id,
      {
        $push: {
          ratings: {
            star,
            postedBy: user._id,
            name: user?.name,
            comment,
            timeRating: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        },
      },
      {
        new: true,
      }
    );
    console.log("add star");

    res.json(ratingAdd);
  }
};
const handleQuery = async (req, res, body) => {
  // const result = await Product.createIndex({ description: "text" });
  // console.log(`Index created: ${result}`);
  const { text, price, categoryList, brand, sortPrice } = body;
  console.log("price :", price);
  const filterObject = {
    // $text: { $search: text },
    title: { $regex: text || "", $options: "i" },
    price: {
      $gte: price?.[0],
      $lte: price?.[1],
    },
    category: { $in: categoryList },
    brand: { $in: brand },
  };
  if (text == undefined || text.length == 0) delete filterObject.text;
  if (price == undefined) delete filterObject.price;
  if (categoryList == undefined || categoryList?.length == 0)
    delete filterObject.category;
  if (brand == undefined || brand?.length == 0) delete filterObject.brand;
  console.log("filter object :", filterObject);
  const filterSort = {
    price:
      sortPrice == "Cao-Thấp"
        ? "desc"
        : sortPrice == "Thấp-Cao"
        ? "asc"
        : undefined,
  };
  if (sortPrice == "undefined") delete filterSort.price;
  const products = await Product.find(filterObject)
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .sort(filterSort)
    // .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

const searchFilter = async (req, res) => {
  // const { query } = req.body;
  if (req.body) {
    // console.log("query :", query);
    await handleQuery(req, res, req.body);
  }
};
const getProductMuchRating = async (req, res) => {
  const { type } = req?.body;
  const categoryId =
    type == "phone" ? "64c9ab4891a693d9d7e8980f" : "64c71ca1abb4f381e6225719";
  const result = await Product.aggregate([
    {
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    },
    {
      $unwind: "$ratings",
    },

    {
      $group: {
        _id: "$_id",
        ratings: { $push: "$ratings" },
        title: { $first: "$title" },
        description: { $first: "$description" },
        images: { $first: "$images" },
        slug: { $first: "$slug" },
        price: { $first: "$price" },
        // ratings: { $first: "$ratings" },

        ratings_avg: { $avg: "$ratings.star" },
      },
    },
    {
      $sort: { ratings_avg: -1 },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        ratings: 1,
        ratings_avg: 1,
        images: 1,
        slug: 1,
        price: 1,
      },
    },
  ]);
  console.log(result);
  res.json(result);
};
const getSimilarProduct = async (req, res) => {
  const subId = req.params.subId;
  const result = await Product.find({
    subs: subId,
  })
    .sort({ createdAt: -1 })
    .limit(5);
  // console.log(result);
  res.json(result);
};

const getSimiRangePriceProduct = async (req, res) => {
  const price = +req.params.price;
  const result = await Product.find({
    price: { $gte: price - 1000000, $lte: price + 2500000 },
    category: new mongoose.Types.ObjectId("64c9ab4891a693d9d7e8980f"),
  })
    .sort({ createdAt: -1 })
    .limit(5);
  res.json(result);
};

module.exports = {
  create: create,
  listAll: listAll,
  remove: remove,
  getProductBySlug: getProductBySlug,
  updateProduct: updateProduct,
  list: list,
  productStar: productStar,
  searchFilter,
  getProductMuchRating,
  getSimilarProduct,
  getSimiRangePriceProduct,
  productGoodSales,
};
