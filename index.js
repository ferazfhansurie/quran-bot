const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const OpenAI = require('openai');
const config = require('./config');

const openai = new OpenAI({
    apiKey: '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',
    endpoint: 'https://api.openai.com'
});

async function handleNewMessages(req, res) {
    const JUTA_AGENT_ID = 'asst_2pYk0Z14FwskCX8UIxDDQmyS';
    try {
        console.log('Handling new messages...');
        const receivedMessages = req.body.messages;

        for (const message of receivedMessages) {
            if (message.from_me) break;

            const sender = {
                to: message.chat_id,
                name:message.from_name
            };

            if (message.type === 'text') {
                console.log('Received text message:', message);

                // Call the webhook before sending the response to the user
                const webhookResponse = await callWebhook('https://hook.us1.make.com/ip9bkgkfweqnpkyv1akwkqtgi065y4hp',message.text.body,sender.to,sender.name);
                
                if (webhookResponse) {
                    // Send the response from the webhook to the user
                    await sendWhapiRequest('messages/text', { to: sender.to, body: webhookResponse });
                } else {
                    console.error('No valid response from webhook.');
                }

                console.log('Response sent.');
            } else if (message.type === 'image') {
                console.log('Received image message:', message);

                // Call the webhook before sending the response to the user
            const webhookResponse = await callWebhook("https://hook.us1.make.com/8i6ikx22ov6gkl5hvjtssz22uw9vu1dq",message.text.body,sender.to,sender.name);
                await sendWhapiRequest('messages/text', { to: sender.to, body: "IMAGE RECEIVED" });
                if (webhookResponse) {
                    // Send the response from the webhook to the user
                   
                } else {
                    console.error('No valid response from webhook.');
                }

                console.log('Response sent.');
            } else {
                // Handle non-text messages here
            }
        }

        res.send('All messages processed');
    } catch (e) {
        console.error('Error:', e.message);
        res.send(e.message);
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

const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Bot is running');
});

app.post('/hook/messages', handleNewMessages);

const port = config.port || (config.botUrl.indexOf('https:') === 0 ? 443 : 80);
app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
