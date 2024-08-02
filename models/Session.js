import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  token: { 
    type: String, 
    required: true 
  },
  loginTime: { 
    type: Date, 
    default: Date.now, 
    required: true 
  }
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
