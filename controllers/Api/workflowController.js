import { serve } from '@upstash/workflow/express'; 
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import dayjs from 'dayjs';
import Subscription from '../../models/subscriptionModel.js';

const REMINDERS = [7, 5, 3, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);    

    if(renewalDate.isBefore(dayjs())) {
        console.log(`renewal date has passed for subscription ${subscriptionId}`);
        return;
    }

    for(const beforeDays of REMINDERS) {
        const reminderDate = renewalDate.subtract(beforeDays, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${beforeDays} Days Before`, reminderDate);
        }

        await triggerReminder(context, `Reminder ${beforeDays} Days Before`);
    }

});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('getSubscription', () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`sleeping until ${label} at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`triggered ${label}`);
    });
    
};