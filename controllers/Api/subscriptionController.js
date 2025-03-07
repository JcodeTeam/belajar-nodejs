import Subscription from "../../models/subriptionModel.js";

export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();

        res.status(200).json(subscriptions);

    } catch (err) {
        next(err);
    }
}

export const createSubscription = async (req, res, next) => {
    try {
        const subcription = await Subscription.create({...req.body, user: req.user._id});

        res.status(201).json({ success: true, data: subcription });

    } catch (err) {
        next(err);
    }
}

export const getUserSubscription = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(401).json({ error: "Not Your Auth" });
        }

        const subscription = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscription });

    } catch (err) {
        next(err);
    }
}