import { task } from "../worker/worker.js";

task("send_welcome_email", async (email) => {
  if (typeof email !== "string") {
    throw new TypeError("send_welcome_email requires an email address");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Welcome email sent to ${email}`);
});