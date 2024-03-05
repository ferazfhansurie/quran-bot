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
    STEP_UMUR:'step_umur',
    STEP_6_PELAJAR:'step_6',
    STEP_1_PELAJAR:'step_1',
    STEP_SEJARAH: 'step_sejarah',
    STEP_TINGGAL: 'step_tinggal',
    STEP_WEBHOOK:'step_webhook',
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
console.log(message)
  
            const sender = {
                to: message.chat_id,
                name: message.from_name
            };
  // Call the webhook before sending the response to the user
  if (message.type == "text" ) {
    // Handle step one
    if(message.text.body.includes('book appointment')){
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
    }
   
}

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
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Boleh saya tahu pilihan tarikh dan masa untuk kelas anda?' });
                            userState.set(sender.to, steps.STEP_1_PELAJAR); // Update user state
                        break;
                        }
                        if(message.action.votes[0]=== selected_Option[1])
                        {
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Baik terima kasih' });
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 'Boleh saya tahu pilihan tarikh dan masa untuk kelas anda?' });
                            userState.set(sender.to, steps.STEP_6_PELAJAR); // Update user state
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
                                await sendWhapiRequest('messages/text', { to: sender.to, body: 'Apakah nama penuh pelajar?\n' });
                                userState.set(sender.to, steps.STEP_UMUR); // Update user state
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
                                await sendWhapiRequest('messages/text', { to: sender.to, body: 'Apakah nama penuh pelajar?\n' });
                                userState.set(sender.to, steps.STEP_UMUR); // Update user state
                        break;
                        }
                        case steps.STEP_1_PELAJAR:
                            // Handle final step
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                               'Terima kasih, izinkan saya kongsikan keperluan mengambil kelas online personal' });
                               await sendWhapiRequest('messages/text', { to: sender.to, body: 
                                'Kenapa tuan/puan perlu ambil kelas online personal? \n' + 
                                '• Kelas lebih fokus 1guru 1pelajar 60 minit tidak berkongsi dengan pelajar lain\n' + 
                                '• Aktiviti mengenal dan membaca ayat Al-Quran lebih banyak dan lebih cepat pada pelajar\n' +
                                '• Banyak aktiviti yang boleh dilakukan bagi menjadikan pelajar cepat mengenal atau membaca Al-Quran \n' +
                                '• Belajar mengikut tahap pengetahuan pelajar\n' +
                                '• Guru BHQ profesional dan berskill\n'});
                                await sendWhapiRequest('messages/text', { to: sender.to, body: 'Apakah nama penuh pelajar?\n' });
                               userState.set(sender.to, steps.STEP_UMUR); // Update user state
                            break;
                            case steps.STEP_6_PELAJAR:
                                // Handle final step
                                await sendWhapiRequest('messages/text', { to: sender.to, body: 
                                   'Terima kasih, izinkan saya kongsikan keperluan mengambil kelas online kumpulan' });
                                   await sendWhapiRequest('messages/text', { to: sender.to, body: 
                                    'Kenapa tuan/ puan perlu ambil kelas online kumpulan? \n' + 
                                    '• Membantu pelajar belajar dalam kumpulan, mengajar pelajar untuk lebih toleransi antara satu sama lain\n' + 
                                    '• Waktu pembelajaran yang efektif. Masa belajar 2jam untuk 6 pelajar \n' +
                                    '• Belajar 1 kumpulan 1level  \n' +
                                    '• Guru BHQ profesional dan berskill\n'});
                                    await sendWhapiRequest('messages/text', { to: sender.to, body: 'Apakah nama penuh pelajar?\n' });
                                   userState.set(sender.to, steps.STEP_UMUR); // Update user state
                                break;
                        case steps.STEP_UMUR:
                            // Handle final step
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                               'Seterusnya, apakah umur pelajar??\n' });
                               userState.set(sender.to, steps.STEP_SEJARAH); // Update user state
                            break;
                        case steps.STEP_SEJARAH:
                            // Handle final step
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                               'Sejarah mengaji?\n' });
                               userState.set(sender.to, steps.STEP_TINGGAL); // Update user state
                            break;  
                        case steps.STEP_TINGGAL:
                            // Handle final step
                            await sendWhapiRequest('messages/text', { to: sender.to, body: 
                               'Akhir sekali, berapa lama tinggal kelas mengaji?\n' });
                               userState.set(sender.to, steps.FINISH); // Update user state
                            break;      
                        case steps.FINISH:
                        // Handle final step
                        await sendWhapiRequest('messages/text', { to: sender.to, body: 
                            'Alhamdullilah terima kasih,Team kami akan proses pesanan anda dan contact anda secepat mungkin.\n' });
                            userState.set(sender.to, steps.STEP_WEBHOOK); // Update user state
                        break;
                        case steps.STEP_WEBHOOK:
                        // Handle final step
                       
                const webhookResponse = await callWebhook('https://hook.us1.make.com/51ydvf5zruu16vkvfqpsxqq4w89cppxq',message.text.body,sender.to,sender.name);
                
                if (webhookResponse) {
                    // Send the response from the webhook to the user
                    await sendWhapiRequest('messages/text', { to: sender.to, body: webhookResponse });
                } else {
                    console.error('No valid response from webhook.');
                }

                console.log('Response sent.');
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
