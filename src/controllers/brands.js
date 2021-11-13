const { users, brands, links } = require("../../models");
const cloudinary = require("../utils/cloudinary");
var fs = require("fs");

exports.publish = async (req, res) => {
  const { id } = req.params;
  let { formLinks } = req.body;

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "wayslink",
      use_filename: true,
      unique_filename: false,
    });

    const data = {
      brandImage: result.public_id,
      brandName: req.body.brandName,
      description: req.body.description,
      user_id: id,
      brandUrl: req.body.brandUrl,
    };

    let newBrand = await brands.create(data);

    let newBrandData = await brands.findOne({
      where: {
        id: newBrand.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const linksArray = JSON.parse(formLinks);
    const linksData = linksArray.map((v) => ({
      ...v,
      brand_id: newBrand.id,
      clickCount: 0,
    }));

    await links.bulkCreate(linksData);

    let brandLinks = await links.findAll({
      where: {
        brand_id: newBrand.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        brand: {
          ...newBrandData.dataValues,
          brandImage: process.env.FILE_PATH + newBrandData.brandImage,
        },
        links: brandLinks,
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

exports.getBrands = async (req, res) => {
  const { id } = req.params;
  try {
    let brandsData = await brands.findAll({
      where: {
        user_id: id,
      },
      include: [
        {
          model: links,
          as: "myLinks",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const allBrands = brandsData.map(function (data, index) {
      return {
        id: data.id,
        brandName: data.brandName,
        description: data.description,
        params1: data.brandUrl,
        brandUrl: process.env.SERVER_PATH + data.brandUrl + `/${data.id}`,
        user_id: data.user_id,
        brandImage: process.env.FILE_PATH + data.brandImage,
        myLinks: data.myLinks
          .map((v) => {
            return v.clickCount;
          })
          .reduce((accumulator, element) => {
            return accumulator + element;
          }, 0),
      };
    });

    res.send({
      status: "success",
      data: {
        brands: allBrands,
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

exports.getBrand = async (req, res) => {
  const { id } = req.params;

  try {
    let brandData = await brands.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    let linksData = await links.findAll({
      where: {
        brand_id: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const newLinksData = JSON.parse(JSON.stringify(linksData)).map((v) => ({
      ...v,
      linkImageUrl: process.env.FILE_PATH + v.linkImage,
    }));

    let newBrandData = JSON.parse(JSON.stringify(brandData));
    let dataBrand = {
      ...newBrandData,
      brandImage: process.env.FILE_PATH + brandData.brandImage,
      hostUrl: process.env.FILE_PATH,
    };

    res.send({
      status: "success",
      data: {
        brand: dataBrand,
        myLinks: newLinksData,
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

exports.editBrand = async (req, res) => {
  const { id } = req.params;
  let { formLinks } = req.body;

  try {
    let existBrand = await brands.findOne({
      where: {
        id,
      },
    });

    const data = {
      brandName: req.body.brandName,
      description: req.body.description,
      brandUrl: req.body.brandUrl,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "wayslink",
        use_filename: true,
        unique_filename: false,
      });
      data.brandImage = result.public_id;
    }

    let newBrand = await brands.update(data, {
      where: {
        id: parseInt(id),
      },
    });

    let newBrandData = await brands.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const linksArray = JSON.parse(formLinks);

    await links.bulkCreate(linksArray, {
      updateOnDuplicate: ["titleLink", "titleUrl", "clickCount", "linkImage"],
    });

    let brandLinks = await links.findAll({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (req.file) {
      fs.unlink("uploads/" + existBrand.brandImage, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("File deleted");
        }
      });
    }

    res.send({
      status: "success",
      data: {
        brand: {
          ...newBrandData.dataValues,
          brandImage: process.env.FILE_PATH + newBrandData.brandImage,
        },
        links: brandLinks,
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

exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    let brandData = await brands.findOne({
      where: {
        id,
      },
    });

    await brands.destroy({
      where: {
        id,
      },
    });

    await links.destroy({
      where: {
        brand_id: id,
      },
    });

    fs.unlink("uploads/" + brandData.brandImage, (err) => {
      if (err) {
        console.log(err);
        res.send({
          status: "failed",
          message: "Cannot delete file",
        });
      } else {
        console.log("File deleted");
        res.send({
          status: "success",
          message: "File successfully deleted",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getLinks = async (req, res) => {
  const { id } = req.params;

  try {
    const linksData = await links.findAll({
      where: {
        brand_id: id,
      },
    });

    res.send({
      status: "success",
      data: linksData,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addLinkCount = async (req, res) => {
  const { id } = req.params;

  try {
    let linkData = await links.findOne({
      where: {
        id,
      },
    });

    const data = {
      clickCount: linkData.clickCount + 1,
    };

    let addCount = await links.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: "succcess",
      message: `Link ${id} succesfully added 1 click count`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    fs.unlink("uploads/1636003320822-hokben.png", (err) => {
      if (err) {
        console.log(err);
        res.send({
          status: "failed",
          message: "Cannot delete file",
        });
      } else {
        console.log("File deleted");
        res.send({
          status: "success",
          message: "File successfully deleted",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getHost = async (req, res) => {
  try {
    res.send({
      status: "success",
      data: process.env.FILE_PATH,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
