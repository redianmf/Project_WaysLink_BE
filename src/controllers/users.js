// Controllers
const { users } = require("../../models");
const { Op } = require("sequelize");

const Joi = require("joi");

exports.getUsers = async (req, res) => {
  try {
    const allUsers = await users.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: { users: allUsers },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return res.send({
        status: "failed",
        message: "User not found",
      });
    }

    res.send({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;

  try {
    const checkEmail = await users.findOne({
      where: {
        email: req.body.email,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (checkEmail) {
      return res.send({
        status: "failed",
        message: "Please use another email address",
      });
    }

    const data = {
      fullName: req.body.fullName,
      email: req.body.email,
    };

    const schema = Joi.object({
      email: Joi.string().min(7).email().required(),
      fullName: Joi.string().min(2).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }

    await users.update(data, {
      where: {
        id,
      },
    });

    const newUser = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await users.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      data: {
        id,
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
