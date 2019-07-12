const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {type: 'String', required: true},
  last_name: {type: 'String', required: true},
  email: {type: 'String', required: true},
  password: {type: 'String', required: true, minlength: 6, maxlength: 32},
  membership_status: {type: Boolean, default: false},
  admin: {type: Boolean, default: false},
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

UserSchema.virtual('name').get(() => {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model('Post', PostSchema);