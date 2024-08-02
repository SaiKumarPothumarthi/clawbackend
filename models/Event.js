import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  name: String,
  date: Date,
  eventby:String,
  location: String,
  description: String
}); 

export default model('Event', eventSchema);
