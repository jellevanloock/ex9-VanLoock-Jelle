var mongoose = require("mongoose");
var bewegingSchema = mongoose.Schema({
            bewegingid: {
                type: Number,
                required: true,
                unique: true
            },
            beginlocatie: {
                type: Object,
                required: true
            },
            eindlocatie: {
                type: Object,
                required: true
            },
            duur: {
                type: String,
                required: true
            },
            weer: {
                type: String
            },
            beweging: {
                type: String,
                required: true
            }
});
var Beweging = module.exports = mongoose.model('Beweging', bewegingSchema);

module.exports = {
    saveBewegingen: function (beweging, callback) {
        Beweging.create(beweging, callback);

    },

    AllBewegingen : function(callback) {
        Beweging.find(callback);
    },

    findBewegingen : function(id, callback){
        Beweging.find({bewegingid:id}, callback);
    }
};