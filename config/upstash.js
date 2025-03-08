import { Client as WorkflowClient } from "@upstash/workflow";

export const workflowClient = new WorkflowClient({
  url: process.env.QSTASH_URL,
  token: process.env.QSTASH_TOKEN
});