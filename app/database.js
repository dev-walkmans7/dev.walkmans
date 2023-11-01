const mongoose = require('mongoose');

module.exports = async () => {
  try {
    // await mongoose.connect('mongodb://localhost/my_database');
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb+srv://walkmanDb:YqJuqr6aCrRSgWeL@walkmans.urbphy7.mongodb.net/?retryWrites=true&w=majority&appName=walkman', {
      useNewUrlParser: true,
      useUnifiedTopology: true      
    });
    
    console.log('DB connected successfully');
  } catch (error) {
    console.error(error);
  }
}
