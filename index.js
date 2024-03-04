const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const OpenAI = require('openai');
const config = require('./config');

const openai = new OpenAI({
    apiKey: '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',
    endpoint: 'https://api.openai.com'
});

const app = express();
app.use(bodyParser.json());

// Define workflow steps
const steps = {
    START: 'start',
    STEP_ONE: 'step_one',
    STEP_TWO: 'step_two',
    FINISH: 'finish'
};

// Store user state (current step)
const userState = new Map();

async function handleNewMessages(req, res) {
    const BILLERT_AGENT_ID = 'asst_2pYk0Z14FwskCX8UIxDDQmyS';
    try {
   
        const receivedMessages = req.body.messages;
        console.log('Handling new messages...',receivedMessages);
        for (const message of receivedMessages) {
            if (message.from_me) break;

            const sender = {
                to: message.chat_id,
                name: message.from_name
            };

            // Get current step or set to START if not defined
            let currentStep = userState.get(sender.to) || steps.START;

            switch (currentStep) {
                case steps.START:
                    const webhookResponse = await callWebhook('https://hook.us1.make.com/ip9bkgkfweqnpkyv1akwkqtgi065y4hp',message.text.body,sender.to,sender.name);
                    // Handle initial step
                    const pollParams = {
                        to: sender.to,
                        title: 'Cik kerja sebagai apa?',
                        options: ['Kerajaan', 'Swasta', 'Pencen'],
                        count: 1,
                        view_once: true
                    };
                    await sendWhapiRequest('/messages/poll', pollParams);
                    userState.set(sender.to, steps.STEP_ONE); // Update user state
                    break;
                case steps.STEP_ONE:
                    // Handle step one
                    await sendWhapiRequest('messages/text', { to: sender.to, body: 'You are now in Step One. Please enter some text.' });
                    userState.set(sender.to, steps.STEP_TWO); // Update user state
                    break;
                case steps.STEP_TWO:
                    // Handle step two
                    await sendWhapiRequest('messages/text', { to: sender.to, body: 'You are now in Step Two. Please enter some text.' });
                    userState.set(sender.to, steps.FINISH); // Update user state
                    break;
                case steps.FINISH:
                    // Handle final step
                    await sendWhapiRequest('messages/text', { to: sender.to, body: 'Thank you for completing the workflow!' });
                    userState.delete(sender.to); // Reset user state
                    break;
                default:
                    // Handle unrecognized step
                    console.error('Unrecognized step:', currentStep);
                    break;
            }
        }

        res.send('All messages processed');
    } catch (e) {
        console.error('Error:', e.message);
        res.status(500).send('Internal Server Error');
    }
}
async function callWebhook(webhook,senderText,senderNumber,senderName) {
    console.log('Calling webhook...');
    const webhookUrl = webhook;
    const body = JSON.stringify({ senderText,senderNumber,senderName }); // Include sender's text in the request body
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });
    const responseData = await response.text(); // Get response as text
    console.log('Webhook response:', responseData); // Log raw response
 return responseData;
}

async function sendWhapiRequest(endpoint, params = {}, method = 'POST') {
    console.log('Sending request to Whapi.Cloud...');
    const options = {
        method: method,
        headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    };
    const url = `${config.apiUrl}/${endpoint}`;
    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    console.log('Whapi response:', JSON.stringify(jsonResponse, null, 2));
    return jsonResponse;
}

app.get('/', function (req, res) {
    res.send('Bot is running');
});

app.post('/hook/messages', handleNewMessages);

const port = config.port || (config.botUrl.indexOf('https:') === 0 ? 443 : 80);
app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
