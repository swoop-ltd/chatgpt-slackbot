import dotenv from 'dotenv-safe'
import { Configuration, OpenAIApi } from 'openai';

dotenv.config()

const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // add this
  appToken: process.env.SLACK_APP_TOKEN // add this
});

const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.message(async ({ message, say }) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: message,
    });

    await say(completion);
  } catch (err) {
    await say("ERROR: Something went wrong, please try again after a while.")
    console.log(err)
  }
});

// Listens to mention
app.event('app_mention', async ({ event, context, client, say }) => {
  const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: event.text,
  });

  await say(completion);
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running at port 4000!');
})();
