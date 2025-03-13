const express = require("express");
const adminUser = require("../MODEL/adminRegister.model");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");


//post user details...........................................
const postRegister= async (req, res) => {
   console.log(req.body)
  try {
    const {fullName,phone,email,address,userName,password, confirm_password } = req.body;
   
    if (password !== confirm_password) {
      return res.status(400).send("Passwords do not match");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async(err, hashPassword) => {
        const password = hashPassword;
        const adminList = await adminUser.find();
        const imageUrls = `https://api-sanjeevani.tejusdigi.com/ASSETS/admin/${req.file.filename}`;
        const fileName=req.file.fileName
        const userAdmin = new adminUser({
            userName,
            password,
            fullName,
            phone,
            email,
            address,
            imageUrls,
            fileName
          });
          userAdmin.save();
          res.status(200).send("Admin add successfully");
      });
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//get registered user details................................
const getRegister=async (req, res) => {
  try {
    const findAdmin = await adminUser.find({});
    res.status(200).send(findAdmin);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//get registered user details................................
const getSingleRegister=async (req, res) => {
      try {
      const { id } = req.params;
        const findAdmin = await adminUser.findbyId(id);
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
    let newPassword = updatedData.password;
    if (newPassword) {
      if (updatedData.password !== updatedData.confirm_password) {
        return res.status(400).send("Passwords do not match");
      }

      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(updatedData.password, salt);
      updatedData.password = newPassword;
    }
    if (req.file) {
      const imageUrls = `https://api-sanjeevani.tejusdigi.com/ASSETS/admin/${req.file.filename}`;
      updatedData.imageUrls = imageUrls;
      updatedData.fileName = req.file.fileName;
    }

    const updatedAdmin = await adminUser.findByIdAndUpdate(id, updatedData, { new: true });

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
    
        const deletedAdmin = await adminUser.findByIdAndDelete(id);
        
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
    
