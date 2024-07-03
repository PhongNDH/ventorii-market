import mongoose from 'mongoose';

const connect = async (req, res) => {
  try {
    console.log('Connecting...');
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database!');
    return connection;
  } catch (error) {
    res.status(500).json({
      message: 'Error to connect to Database',
    });
    console.log('Get fucking error: ' + error);
    throw new Error(error);
  }
};

export default connect;
