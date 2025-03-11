const eventsModel = require("../MODEL/events.model");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

//*************************get for fandq***************************
const getAllEvents = async (req, res) => {
  try {
    const allEvents = await eventsModel.find();
    res.json(allEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//*************************single fandq get*******************************

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
    const { eventName, eventDate, remarks, time } = req.body;

    if (!eventName || !eventDate || !remarks || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const date = new Date(eventDate);
    const monthNumber = date.getMonth();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = months[monthNumber];
    const eventDoc = await eventsModel.findOne({ "events.month": month });

    if (eventDoc) {
      const monthIndex = eventDoc.events.findIndex(
        (event) => event.month === month
      );
      eventDoc.events[monthIndex].eventsList.push({
        eventName,
        eventDate,
        remarks,
        time,
      });

      await eventDoc.save();
      res.status(201).json({ eventDoc });
    } else {
      const newEvent = new eventsModel({
        events: [
          {
            month,
            eventsList: [
              {
                eventName,
                eventDate,
                remarks,
                time,
              },
            ],
          },
        ],
      });

      await newEvent.save();
      res.status(201).json({
        message: "Event added successfully",
        data: newEvent,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//********************************put for fandq********************************

const putEvents = async (req, res) => {
  const { month, eventName, eventDate, remarks, time } = req.body;
  console.log(req.body);
  try {
    const updatedEvent = await eventsModel.findOneAndUpdate(
      {
        "events.month": month,
        "events.eventsList.eventName": eventName,
      },
      {
        $set: {
          "events.$.eventsList.$[elem].eventDate": eventDate,
          "events.$.eventsList.$[elem].remarks": remarks,
          "events.$.eventsList.$[elem].time": time,
        },
      },
      {
        arrayFilters: [{ "elem.eventName": eventName }],
        new: true,
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = putEvents;

//************************delete for fandq***************************

const deleteEvents = async (req, res) => {
      const { id } = req.params;
  console.log(id);
  try {
    const deletedEvent = await eventsModel.findOne({"eventsList._id":new mongoose.Types.ObjectId(id)});
console.log(deletedEvent)
 
    if (deletedEvent)
      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
    res.json({ message: "Delete successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEvents,
  getSingleEvents,
  postEvents,
  putEvents,
  deleteEvents,
};
