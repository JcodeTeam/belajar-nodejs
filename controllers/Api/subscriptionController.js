import { workflowClient } from "../../config/upstash.js";
import Subscription from "../../models/subriptionModel.js";
import {SERVER_URL} from "../../config/env.js";

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
        const subcription = await Subscription.create({
            ...req.body, 
            user: req.user._id,
        });

        // await workflowClient.trigger({
        //     url: `${SERVER_URL}/api/subs/${subcription._id}`,
        // })

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/workflows/subs/reminder`,
            body: {
                subscriptionId: subcription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });


        res.status(201).json({ success: true, data: { subcription, workflowRunId } });

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

export const deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const subs = await Subscription.findByIdAndDelete(id);

        if (!subs) {
            return res.status(404).json({ error: "Subscription tidak ditemukan" });
        }

        res.status(201).json({ message: "Subscription berhasil dihapus", data: { subs } });
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};