const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSubscriber:{
      type: Boolean,
      default: false
    },
    subscription_id: String,
    profilePhoto: {
      type: String,
      default: "/images/avatar.webp",
    },
    profilePhotoId: {
      type: String,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    //add automatically 'createAt' and 'updatedAt'
  }
);
//Hash password called before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("password has been hashed");
  next();
});

//methods
userSchema.methods.createVerifyAccountToken = async function () {
  //1. create a raw token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  //2. Now we hash the token
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  //3. setup the token's lifespan
  this.accountVerificationTokenExpires = Date.now() + 1000 * 60 * 15; //expires in 15 minutes

  //4. return the raw token
  return verificationToken;
};

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
