import Category from "../models/category";
import Notification from "../models/notification";

const getNotification = async (req, res) => {
  const notiInfo = await Notification.find({});
  res.json(notiInfo);
};

const addNotification = async (req, res) => {
  const noti = req?.body;
  const newNoti = await Notification(noti).save();
  res.json(newNoti);
};

const getListNoti = async (req, res) => {
  const listNoti = await Notification.find({}).sort({ createdAt: -1 });
  res.json(listNoti);
};

module.exports = {
  getNotification,
  addNotification,
  getListNoti,
};
