const eventsModel = require("../MODEL/events.model");

const { default: mongoose } = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");

//*************************get for Events***************************
const getAllEvents = async (req, res) => {
  try {
    const allEvents = await eventsModel.find();
    res.json(allEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//*************************single Events get*******************************

const getSingleEvents = async (req, res) => {
  try {
    const findEvents = await eventsModel.findById(req.params.id);

    if (findEvents == null) {
      return res.status(400).json({ message: "Events not found" });
    } else {
      res.json(findEvents);
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//***********************************post for Events****************************

const postEvents = async (req, res) => {
  try {
    const { title, date, batch, starttime, endtime, remarks } = req.body;
      const newEvent = new eventsModel({
        title, date, batch, starttime, endtime, remarks
      });

      await newEvent.save();
      res.status(201).json({
        message: "Event added successfully",
        data: newEvent,
      });
    }
   catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//********************************put for Events********************************

const putEvents = async (req, res) => {
  const { month, eventName, eventDate, remarks, time } = req.body;
  console.log(req.body);
  try {
    const updatedEvent = await eventsModel.findOneAndUpdate({ _id: new ObjectId(req.params.id) },
    { $set: req.body });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


//************************delete for Events***************************

const deleteEvents = async (req, res) => {
  try {

    const eventId = req.params.id;
    const deleteEvent = await eventsModel.findOneAndDelete({ _id: new ObjectId(eventId) });
    if (!deleteEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
      res.json({ message: "Event deleted successfully" , deleteEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEvents,
  getSingleEvents,
  postEvents,
  putEvents,
  deleteEvents,
};
