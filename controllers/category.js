import Category from "../models/category";
import slugify from "slugify";
import Sub from "../models/sub";
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name),
    });
    await category.save();
    res.json(category);
  } catch (error) {
    console.log("Check error :", error);
    res.status(400).json(error.message);
  }
};

const list = async (req, res) => {
  res.json(await Category.find({}).sort({ createAt: -1 }).exec());
};

const read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  res.json(category);
};

const update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send("Update failed");
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Create delete failed");
  }
};

const getSubs = async (req, res) => {
  try {
    const subs = await Sub.find({ parent: req.params._id });
    res.json(subs);
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  create: create,
  list: list,
  read: read,
  update: update,
  remove: remove,
  getSubs: getSubs,
};
