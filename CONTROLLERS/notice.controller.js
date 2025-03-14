const noticeModel = require("../MODEL/notice.model");

const { default: mongoose } = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");

//*************************get for Notice***************************
const getAllNotice = async (req, res) => {
  try {
    const allNotice = await noticeModel.find();
    res.json(allNotice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//*************************single Notice get*******************************

const getSingleNotice = async (req, res) => {
  try {
    const findNotice = await noticeModel.findById(req.params.id);

    if (findNotice == null) {
      return res.status(400).json({ message: "Notice not found" });
    } else {
      res.json(findNotice);
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//***********************************post for Notice****************************

const postNotice = async (req, res) => {
      console.log(req.body)
  try {
    const { notice, remark } = req.body;
      const newNotice = new noticeModel({
            notice, remark
      });

      await newNotice.save();
      res.status(201).json({
        message: "Event added successfully",
        data: newNotice,
      });
    }
   catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//********************************put for Notice********************************

const putNotice = async (req, res) => {
  const { notice, remark } = req.body;
  console.log(req.body);
  try {
    const updatedEvent = await noticeModel.findOneAndUpdate({ _id: new ObjectId(req.params.id) },
    { $set: req.body });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


//************************delete for Notice***************************

const deleteNotice = async (req, res) => {
  try {

    const eventId = req.params.id;
    const deleteEvent = await noticeModel.findOneAndDelete({ _id: new ObjectId(eventId) });
    if (!deleteEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
      res.json({ message: "Event deleted successfully" , deleteEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllNotice,
  getSingleNotice,
  postNotice,
  putNotice,
  deleteNotice,
};
