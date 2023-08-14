import Sub from "../models/sub";
import slugify from "slugify";

//create
const create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const sub = await new Sub({
      name,
      parent,
      slug: slugify(name),
    });
    await sub.save();
    res.json(sub);
  } catch (error) {
    console.log("Check error :", error);
    res.status(400).json(error.message);
  }
};

//list
const list = async (req, res) => {
  res.json(await Sub.find({}).sort({ createAt: -1 }).exec());
};

//read
const read = async (req, res) => {
  const sub = await SubmitEvent.findOne({ slug: req.params.slug });
  res.json(sub);
};

//update
const update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name), parent },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send("Update failed");
  }
};

//delete
const remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Sub delete failed");
  }
};

module.exports = {
  create: create,
  list: list,
  read: read,
  update: update,
  remove: remove,
};
