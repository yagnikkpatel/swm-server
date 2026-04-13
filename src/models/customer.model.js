import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
    },
    addresses: [
      {
        address: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
      },
    ],
    pricePerJug: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
