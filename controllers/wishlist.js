import Wishlist from "../models/wishlist";
import User from "../models/user";
//create
const createList = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    await Wishlist.deleteMany({ createWishlistBy: user?.id });
    const { listProducts } = req.body;

    const createList = await new Wishlist({
      listProducts,
      createWishlistBy: user?.id,
    }).save();
    res.json(createList);
  } catch (error) {
    console.log("Check error :", error);
    res.status(400).json(error.message);
  }
};

//list
const getWishList = async (req, res) => {
  const id = req.params.userId;
  res.json(
    await Wishlist.find({ createWishlistBy: id })
      .sort({ createAt: -1 })
      .populate("listProducts")
  );
};

const updateWishlist = async (req, res) => {
  const { idProduct } = req?.body;
  const user = await User.findOne({ email: req.user.email });
  const wishlist = await Wishlist.find({ createWishlistBy: user?.id });
  const newList = wishlist?.[0]?.listProducts?.filter((x) => x != idProduct);
  console.log("new------ :", newList);
  await Wishlist.findOneAndUpdate(
    { createWishlistBy: user?.id },
    {
      listProducts: newList,
    },
    { new: true } // This option returns the updated document
  );
  res.json("Update done");
};
const hehe = async (req, res) => {
  return res.json("hehe");
}; //
module.exports = {
  getWishList,
  createList,
  updateWishlist,
  hehe,
};
