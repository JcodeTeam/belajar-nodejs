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

export const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Cari subscription aktif berdasarkan user
        const subscription = await Subscription.findOneAndUpdate(
            { _id: id, user: userId, status: "active" },
            { status: "cancelled", renewalDate: null }, // Set status jadi cancelled dan hapus renewalDate
            { new: true } // Return data yang sudah diperbarui
        );

        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription tidak ditemukan atau sudah dibatalkan" });
        }

        res.status(200).json({ success: true, message: "Subscription berhasil dibatalkan", data: subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan", details: error.message });
    }
};