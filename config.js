module.exports = {
    // API endpoint URL
    apiUrl: "https://gate.whapi.cloud",
    // API token from your channel
    token: "DhYJvEr6cXGkgruARbKiUDymj0tic68H",
// The ID of the group to which we will send the message. Use to find out the ID: https://whapi.readme.io/reference/getgroups
    group: '120363167596599603@g.us',
// The ID of the product we will send for the example. Create a product in your WhatsApp and find out the product ID: https://whapi.readme.io/reference/getproducts
    product: '6559353560856703',
    // Bot`s URL (for static file). Webhook Link to your server. At ( {server link}/hook ), when POST is requested, processing occurs
    botUrl: "https://18d5-2001-e68-624c-3300-54d4-2781-d9d2-f2a3.ngrok-free.app/hook",
    // Bot's Port (for hook handler). Don't use 443 port.
    port: "80"
}
