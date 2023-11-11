const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    approve: {
      type: Boolean,
      default: false,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
    rooms: {
      type: Array,
      items: {
        room_type: {
          type: String,
        },
        price_per_nigh: {
          type: Number,
        },
        total_room_available: {
          type: Number,
        },
        room_image: {
          type: String,
        },
      },
    },
    images: {
      type: Array,
      items: {
        type: String,
      },
    },
    feedbacks: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hotel", hotelSchema, "hotels");
