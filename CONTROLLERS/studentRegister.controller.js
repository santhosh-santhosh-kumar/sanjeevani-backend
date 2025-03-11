const express = require("express");
const studentUser = require("../MODEL/studentRegister.model");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");


//post user details...........................................
const postRegister= async (req, res) => {
  try {
    const { userName,password, confirm_password } = req.body;
    console.log( userName,password, confirm_password)

    if (password !== confirm_password) {
      return res.status(400).send("Passwords do not match");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async(err, hashPassword) => {
        const password = hashPassword;
        const adminList = await studentUser.find();
        const userAdmin = new studentUser({
            userName,
            password,
            confirm_password
          });
          userAdmin.save();
          res.status(200).send("User add successfully");
      });
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//get registered user details................................
const getRegister=async (req, res) => {
  try {
    const findAdmin = await studentUser.find({});
    res.status(200).send(findAdmin);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//get registered user details................................
const getSingleRegister=async (req, res) => {
      try {
      const { id } = req.params;
        const findAdmin = await studentUser.findbyId(id);
        res.status(200).send(findAdmin);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    };
    

//edit the registered user......................................
const updateRegister = async (req, res) => {
      try {
        const { id } = req.params;
        const updatedData = req.body;
    
        const updatedAdmin = await studentUser.findByIdAndUpdate(id, updatedData, { new: true });
    
        if (!updatedAdmin) {
          return res.status(404).send("Admin not found");
        }
    
        res.status(200).send(updatedAdmin);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

//delete the redistered user......................................
const deleteRegister = async (req, res) => {
      try {
        const { id } = req.params;
    
        const deletedAdmin = await studentUser.findByIdAndDelete(id);
        
        if (!deletedAdmin) {
          return res.status(404).send("Admin not found");
        }
    
        res.status(200).send("Admin deleted successfully");
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    module.exports = {
      getRegister,
      getSingleRegister,
      postRegister,
      updateRegister,
      deleteRegister,
    };
    
