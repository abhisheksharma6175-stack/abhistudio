const Service = require("../models/Service");

exports.createService = async (req, res, next) => {
  try {
    const { name, description, duration, price } = req.body;
    if (!name || !description || !duration || !price || !req.file) return res.status(400).json({ error: "All fields and image are required." });
    const service = await Service.create({ name, description, duration: Number(duration), price: Number(price), image: req.file.path });
    res.status(201).json({ service });
  } catch (error) {
    next(error);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.json({ services });
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const updates = { name: req.body.name, description: req.body.description, duration: Number(req.body.duration), price: Number(req.body.price) };
    if (req.file) updates.image = req.file.path;
    const service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ service });
  } catch (error) {
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};