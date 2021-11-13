const { users, brands, links } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const data = req.body;
  data.role = "customer";

  const schema = Joi.object({
    email: Joi.string().min(7).email().required(),
    password: Joi.string().min(7).required(),
    fullName: Joi.string().min(2).required(),
    role: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    const isUserExist = await users.findOne({
      where: {
        email: data.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    if (isUserExist) {
      return res.send({
        status: "failed",
        message: "please use another email address",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(data.password, salt);

    const regUser = await users.create({
      email: data.email,
      password: encryptedPassword,
      fullName: data.fullName,
      role: data.role,
    });

    const dataToken = {
      id: regUser.id,
    };
    const token = jwt.sign(dataToken, process.env.SECRET_KEY);

    res.send({
      status: "success",
      data: {
        user: {
          email: regUser.email,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const data = req.body;

  const schema = Joi.object({
    email: Joi.string().min(7).email().required(),
    password: Joi.string().min(7).required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });
  }
  try {
    const existedUser = await users.findOne({
      where: {
        email: data.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    if (!existedUser) {
      return res.send({
        status: "failed",
        message: "Please enter valid email address",
      });
    }

    const isValid = await bcrypt.compare(
      req.body.password,
      existedUser.password
    );

    if (!isValid) {
      return res.send({
        status: "failed",
        message: "Email and password did not match",
      });
    }

    const dataToken = {
      id: existedUser.id,
    };
    const token = jwt.sign(dataToken, process.env.SECRET_KEY);

    res.send({
      status: "success",
      data: {
        user: {
          id: existedUser.id,
          email: existedUser.email,
          fullName: existedUser.fullName,
          role: existedUser.role,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
        message: "User not found",
      });
    }

    res.send({
      status: "success",
      data: {
        user: dataUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
