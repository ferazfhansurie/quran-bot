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
    STEP_THREE: 'step_three',
    STEP_FOUR: 'step_four',
    FINISH: 'finish'
};

// Store user state (current step)
const userState = new Map();

async function handleNewMessages(req, res) {
    const BILLERT_AGENT_ID = 'asst_2pYk0Z14FwskCX8UIxDDQmyS';
    try {
   
        const receivedMessages = req.body.messages;
        //console.log('Handling new messages...',receivedMessages);
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
                   //const webhookResponse = await callWebhook('https://hook.us1.make.com/ip9bkgkfweqnpkyv1akwkqtgi065y4hp',message.text.body,sender.to,sender.name);
                    // Handle initial step
                    await sendWhapiRequest('messages/text', { to: sender.to, body: 'Assalamualaikum' });
                    userState.set(sender.to, steps.STEP_ONE); // Update user state
                    break;
                    case steps.STEP_ONE:
                        // Handle step one
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 'Terima kasih tuan/puan kerana berminat untuk mendapatkan perkhidmatan mengaji bersama BHQ (baca huruf Quran)' });
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 
                            'Kelas Online Personal:\n' + // Add new line for bullet points
                            '• Frekuensi: 4 kali sebulan\n' + // Bullet point 1
                            '• Yuran: RM240 (4 sesi) / RM480 (8 sesi)\n'});
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 
                            'Kelas Online Kumpulan:\n' + 
                            '• Frekuensi: 4 kali sebulan\n' + 
                            '• Yuran: RM480 (4 sesi) / RM960 (8 sesi)\n'});
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 
                            'Kelas Offline Personal:\n' + 
                            '• Frekuensi: 4 kali sebulan\n' + 
                            '• Yuran: RM240 (4 sesi) / RM480 (8 sesi)\n'});
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 
                            'Kelas Offline Kumpulan:\n' + 
                            '• Frekuensi: 4 kali sebulan\n' + 
                            '• Yuran: RM480 (4 sesi) / RM960 (8 sesi)\n'});
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 
                            'Kelas Offline Mingguan (Pusat Kota Damansara):\n' + 
                            '• Frekuensi: 4 kali sebulan\n' + 
                            '• Yuran: RM100 sebulan (6 pelajar) / RM600 (6 pelajar)\n'});
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 'Boleh saya tahu pilihan kelas yang dicari?' });
                    const pollParams = {
                        to: sender.to,
                        title: 'Boleh saya tahu pilihan kelas yang dicari?',
                        options: ['Kelas Online', 'Kelas Offline', 'Kelas ke pusat Al-Quran Di Kota Damansara'],
                        count: 1,
                        view_once: true
                    };
                    webhook = await sendWhapiRequest('/messages/poll', pollParams);
                    console.log('result',webhook.message.poll.results);
                    userState.set(sender.to, steps.STEP_TWO); // Update user state
                    break;
                    case steps.STEP_TWO:
                        
                        let selectedOption = [];
                        for (const result of webhook.message.poll.results) {
                            selectedOption.push (result.id);
                        }
                        
                        if(message.action.votes[0]=== selectedOption[0])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Kelas online personal/kumpalan sesuai bagi pelajar kanak-kanak 11 tahun keatas, remaja dan dewasa sahaja' });
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Flexbile waktu dan hari melalui platform DIGITAL' });
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Kelas kumpulan akan dikumpulkan mengikut kesesuaian level pelajar' });
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Untuk teruskan, boleh saya tahu pilihan kelas anda personal atau berkumpulan?' });
                            const pollParams = {
                                to: sender.to,
                                title: 'Boleh saya tahu pilihan kelas yang dicari?',
                                options: ['Kelas online personal 1 guru 1 pelajar', 'Kelas online kumpulan 1 guru 6 pelajar'],
                                count: 1,
                                view_once: true
                            };
                            webhook = await sendWhapiRequest('/messages/poll', pollParams);
                            console.log('result',webhook.message.poll.results);
                            userState.set(sender.to, steps.STEP_THREE); // Update user state
                            break;
                        }
                        if(message.action.votes[0]===selectedOption[1])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Terima kasih, izinkan saya kongsikan keperluan mengambil kelas offline personal'});
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                                'Kenapa tuan/ puan perlu ambil kelas mengaji offline personal?\n' + 
                                '• Keselamatan terjamin, rumah adalah tempat paling selamat untuk anda dan keluarga anda\n' + 
                                '• Tidak perlu tempuh jem kerana guru yang akan hadir ketempat pelajar\n' +
                                '• Belajar lebih fokus dan cepat kenal dan baca Al-Quran\n' +
                                '• Guru BHQ profesional dan berskill\n'});
                                userState.set(sender.to, steps.FINISH); // Update user state
                        break;
                        }
                        if(message.action.votes[0]===selectedOption[2])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Terima kasih'});
                            const pollParams = {
                                to: sender.to,
                                title: 'Boleh saya tahu pilihan kelas yang dicari?',
                                options: ['Kelas Mingguan', 'Kelas Harian'],
                                count: 1,
                                view_once: true
                            };
                            webhook = await sendWhapiRequest('/messages/poll', pollParams);
                            console.log('result',webhook.message.poll.results);
                            userState.set(sender.to, steps.STEP_FOUR); // Update user state
                        break;
                        }
                        
                        case steps.STEP_THREE:
                            let selected_Option = [];
                        for (const result of webhook.message.poll.results) {
                            selected_Option.push (result.id);
                        }
                        if(message.action.votes[0]=== selected_Option[0])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Baik terima kasih' });
                            userState.set(sender.to, steps.FINISH); // Update user state
                        break;
                        }
                        if(message.action.votes[0]=== selected_Option[1])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Baik terima kasih, izinkan saya kongsikan keperluan mengambil kelas online personal' });
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                                'Kenapa tuan/ puan perlu ambil kelas mengaji offline personal?\n' + 
                                '• Membantu pelajar belajar dalam kumpulan, mengajar pelajar untuk lebih toleransi antara satu sama lain\n' + 
                                '• Waktu pembelajaran yang efektif. Masa belajar 2jam untuk 6 pelajar\n' +
                                '• Belajar 1 kumpulan 1 level\n' +
                                '• Guru BHQ profesional dan berskill\n'});
                                userState.set(sender.to, steps.FINISH); // Update user state
                        break;
                        }
                        
                        case steps.STEP_FOUR:
                            let selected_Option2 = [];
                        for (const result of webhook.message.poll.results) {
                            selected_Option2.push (result.id);
                        }
                        if(message.action.votes[0]=== selected_Option2[0])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Terima kasih, izinkan saya kongsikan keperluan mengambil kelas ke pusat Al-Quran Di Kota Damansara' });
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                                'Kenapa tuan puan perlu ambil kelas mengaji dipusat Al-Quran BHQ\n' + 
                                '• Membantu pelajar belajar dalam kumpulan, mengajar pelajar untuk lebih toleransi antara satu sama lain \n' + 
                                '• Waktu pembelajaran yang efektif. Masa belajar 2jam untuk 6 pelajar\n' +
                                '• Belajar 1 kumpulan 1 level\n' +
                                '• Guru BHQ profesional dan berskill\n'+
                                '• Berhawa dingin dan keselamatan terjamin (Insyaallah)\n'+
                                '• Waktu dan hari flexible\n' });
                                userState.set(sender.to, steps.FINISH); // Update user state
                        break;
                        }
                        if(message.action.votes[0]=== selected_Option2[1])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Terima kasih, izinkan saya kongsikan keperluan mengambil kelas ke pusat Al-Quran Di Kota Damansara' });
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                                'Kenapa tuan puan perlu ambil kelas mengaji dipusat Al-Quran BHQ secara harian\n' + 
                                '• Kelas dijalankan setiap hari\n' + 
                                '• Isnin - jumaat 2sesi pagi dan petang\n' +
                                '• 1 guru 12 pelajar sahaja\n' +
                                '• Kelas berhawa dingin dan keselamatan terjamin, CCTV\n' +
                                '• Guru BHQ profesional dan berskill\n'});
                                userState.set(sender.to, steps.FINISH); // Update user state
                        break;
                        }
                        case steps.FINISH:
                        // Handle final step
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 
                            'Boleh saya dapatkan detail pelajar?\n' + 
                            '• Apakah nama penuh pelajar?\n' + 
                            '• Berapakah umur pelajar?\n' +
                            '• Sejarah mengaji?\n' +
                            '• berapa lama tinggal kelas mengaji?\n'});
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
