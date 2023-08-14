import admin from "../firebase/index";
import User from "../models/user";

const authCheck = async (req, res, next) => {
  // console.log("Check req header :", req.headers); //token
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    console.log("Firebase user in auth check ", firebaseUser);
    // console.log("hehe");
    req.user = firebaseUser; // thằng này chạy trước controller => controller nhận user info ở req
    next();
  } catch (error) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

const adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource. Access denied",
    });
  } else {
    next();
  }
};

module.exports = {
  authCheck: authCheck,
  adminCheck: adminCheck,
};
