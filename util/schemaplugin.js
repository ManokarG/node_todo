module.exports = function(schema) {

  var updateDate = function(next){
    var self = this;
    var now=new Date();
    self.updatedAt = now;
    if ( !self.createdAt ) {
      self.createdAt = now;
    }
    next()
  };
  // update date for bellow 4 methods
  schema.pre('save', updateDate)
    .pre('update', updateDate)
    .pre('findOneAndUpdate', updateDate)
    .pre('findByIdAndUpdate', updateDate);
};