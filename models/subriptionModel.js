import mongoose from "mongoose";

// Definisikan schema
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "subription name is requaired"],
        trim: true,
        minLength: 5,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, "price is requaired"],
        min: [0, "price must be greater than 0"]
    },
    currency: {
        type: String,
        enum: ["IDR", "USD", "EUR"],
        default: "IDR"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
        type: String,
        enum: ["sport", "technology", "food", "other"],
        required: [true, "category is requaired"],
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, "payment method is requaired"],
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "start date must be greater than today"
        }

    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "renewal date must be greater than start date"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true } );

// auto calculate renewal date
subscriptionSchema.pre("save", function (next) {
    const renewalPeriod = { 
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365
    };

    if(!this.renewalDate){
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }

    if(this.renewalDate < new Date()){
        this.status = "expired";
    }
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;