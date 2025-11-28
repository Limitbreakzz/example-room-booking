const prisma = require('../prisma');

exports.getUsers = async (req, res) => {
    try {
    const users = await prisma.room.findMany();

    res.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to fetch users' },
    });
  }
};

exports.getUserById = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: userId },
    });

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'user not found',
      });
    }

    res.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to fetch user' },
    });
  }
};

exports.createUser = async (req, res) => {
    const { name, email, password, tel } = req.body;

  if (!name || typeof tel !== 'number') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request body',
      error: {
        detail: 'name is required and tel must be a number',
      },
    });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        tel: tel || null,
      },
    });

    
    res.status(201).json({
      status: 'success',
      message: 'USer created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to create user' },
    });
  }
};

exports.updateUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
  const { name, email, password, tel } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }

  if (!name || typeof tel !== 'number') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request body',
      error: {
        detail: 'name is required and tel must be a number',
      },
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password,
        tel: tel ?? null,
      },
    });

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);

    // Prisma error: record not found
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to update user' },
    });
  }
};

exports.deleteUser = async (req, res) => {
    const UserId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      status: 'success',
      message: 'User deleted successfully',
      data: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: { detail: 'Unable to delete user' },
    });
  }
};