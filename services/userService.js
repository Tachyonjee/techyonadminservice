const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teachers");
const Student = require("../models/student");
const roleService = require("./role.service");
const Class = require("../models/classModel");
const Subject = require("../models/subjectModel");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, roleId: user.roleId },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // Token valid for 1 hour
    }
  );
};

// Register User with Role Handling
exports.registerUser = async ({ name, username, password, roleId, mobileNumber, email, subjectId, classId }) => {
  let newUser = null;
  try {
    console.log('Registering user with data:', { name, username, roleId, subjectId, classId });

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Validate role exists
    console.log('Validating role with ID:', roleId);
    const role = await roleService.getRoleById(roleId);
    if (!role) {
      throw new Error("Invalid role specified");
    }
    console.log('Found role:', role);

    // Role-specific validations
    let subject = null;
    let classObj = null;

    if (role.name === "teacher") {
      if (!subjectId) throw new Error("Subject ID is required for teachers");
      // Validate subject exists
      console.log('Validating subject with ID:', subjectId);
      subject = await Subject.findById(subjectId);
      if (!subject) {
        throw new Error("Invalid subject specified");
      }
      console.log('Found subject:', subject);

      if (!classId) throw new Error("Class ID is required for teachers");
      // Validate class exists
      console.log('Validating class with ID:', classId);
      classObj = await Class.findById(classId);
      if (!classObj) {
        throw new Error("Invalid class specified");
      }
      console.log('Found class:', classObj);
    } else if (role.name === "student") {
      if (!classId) throw new Error("Class ID is required for students");
      // Validate class exists
      console.log('Validating class with ID:', classId);
      classObj = await Class.findById(classId);
      if (!classObj) {
        throw new Error("Invalid class specified");
      }
      console.log('Found class:', classObj);
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Base User
    console.log('Creating user with roleId:', roleId);
    newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      mobileNumber,
      email,
      roleId,
    });
    console.log('Created user:', newUser);

    // Role-specific inserts
    if (role.name === "teacher") {
      console.log('Creating teacher record');
      await Teacher.create({ 
        userId: newUser._id, 
        subject: subjectId,
        class: classId
      });
    } else if (role.name === "student") {
      console.log('Creating student record');
      await Student.create({ 
        userId: newUser._id, 
        class: classId 
      });
    }

    // Get user with populated role
    console.log('Getting user with populated role');
    const userWithRole = await User.findById(newUser._id).populate('roleId');
    console.log('User with role:', userWithRole);
    return userWithRole;
  } catch (error) {
    console.error('Error in registerUser:', error);
    // If user was created but role-specific creation failed, delete the user
    if (newUser) {
      console.log('Rolling back user creation due to error');
      await User.findByIdAndDelete(newUser._id);
    }
    throw error;
  }
};

// Login User
exports.loginUser = async (username, password) => {
  try {
    // Check if user exists and populate role
    const user = await User.findOne({ username }).populate('roleId');
    console.log("user", user);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    // Get role-specific data
    let roleData = {
      role: user.roleId ? user.roleId.name : null
    };
    if (user.roleId.name === "teacher") {
      const teacherData = await Teacher.findOne({ userId: user._id })
        .populate('subject')
        .populate('class');
      roleData = {
        ...roleData,
        subject: teacherData?.subject,
        class: teacherData?.class
      };
    } else if (user.roleId.name === "student") {
      const studentData = await Student.findOne({ userId: user._id })
        .populate('class');
      roleData = {
        ...roleData,
        class: studentData?.class
      };
    }

    // Generate JWT Token
    const token = generateToken(user);
    

    // Return response with role and user info
    return {
      message: "Login successful",
      token,
      role: user.roleId ? user.roleId.name : null,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        mobileNumber: user.mobileNumber,
        email: user.email,
        roleId: user.roleId ? user.roleId._id : null,
        role: user.roleId ? user.roleId.name : null,
        ...roleData
      },
    };
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error(error.message);
  }
};

// Get User by ID
exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).populate('roleId');
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Update User
exports.updateUser = async (userId, updateData) => {
  try {
    // If role is being updated, validate it exists
    if (updateData.roleId) {
      const role = await roleService.getRoleById(updateData.roleId);
      if (!role) {
        throw new Error("Invalid role specified");
      }
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).populate('roleId');

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

