const express = require("express");
import User from "../models/user";
const createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    { name: email.split("@")[0], picture },
    { new: true }
  );
  // find by email, update name, picture, new:true=>return record after update
  if (user) {
    console.log("USER UPDATED :", user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture,
    });
    newUser.save();
    console.log("USER Create :", newUser);
    res.json(newUser);
  }
};
const currentUser = async (req, res) => {
  const { email } = req.user;
  // User.findOne({ email }).exec((err, user) => {
  //   if (err) throw new Error(err);
  //   res.json(user);
  // });
  const user = await User.findOne({ email });
  if (!user) res.json({ message: "User not exist" });
  if (user) res.json(user);
};
module.exports = {
  createOrUpdateUser: createOrUpdateUser,
  currentUser: currentUser,
};
