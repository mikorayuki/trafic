const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const { SocksProxyAgent } = require('socks-proxy-agent');

const config = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const httpsAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 Chrome/121.0.6167.164 Mobile",
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0",
    "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 Edge/119.0.0.0"
];

let stats = { success: 0, failed: 0, total: 0 };
let currentIp = "MENDAPATKAN IP...";

// Fungsi Ekstrak OS dari User Agent
function getOS(ua) {
    if (ua.includes('Windows')) return chalk.bgBlue.white.bold(' WIN ');
    if (ua.includes('Android')) return chalk.bgGreen.black.bold(' AND ');
    if (ua.includes('iPhone') || ua.includes('Mac OS')) return chalk.bgWhite.black.bold(' MAC/iOS ');
    if (ua.includes('Linux')) return chalk.bgYellow.black.bold(' LINUX ');
    return chalk.bgGray.white.bold(' UNK ');
}

// Fungsi Pelacak IP Tor
async function getTorIP() {
    try {
        const res = await axios.get('https://api.ipify.org?format=json', { httpsAgent, timeout: 10000 });
        return res.data.ip;
    } catch (err) {
        return "IP TERSEMBUNYI (Stealth)";
    }
}

console.log(chalk.hex('#00FFCC').bold(`
███╗   ███╗██╗██╗  ██╗██████╗ ██████╗  █████╗ ██╗   ██╗██╗   ██╗██╗  ██╗██╗
████╗ ████║██║██║ ██╔╝██╔═══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██║   ██║██║ ██╔╝██║
██╔████╔██║██║█████╔╝ ██║   ██║██████╔╝███████║ ╚████╔╝ ██║   ██║█████╔╝ ██║
██║╚██╔╝██║██║██╔═██╗ ██║   ██║██╔══██╗██╔══██║  ╚██╔╝  ██║   ██║██╔═██╗ ██║
██║ ╚═╝ ██║██║██║  ██╗╚██████╔╝██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██╗██║
╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝`));

console.log(chalk.cyan.bold("\n=================================================================="));
console.log(chalk.yellow("  PROJECT  : ") + chalk.white.bold("MIKORAYUKI TRAFFIC ENGINE v7.0 (PHANTOM)"));
console.log(chalk.yellow("  TARGET   : ") + chalk.green(config.target_url));
console.log(chalk.yellow("  POWER    : ") + chalk.red.bold(`PARALLEL BURST x${config.burst_power}`) + chalk.gray(` | Interval: ${config.delay_ms}ms`));
console.log(chalk.yellow("  ROUTING  : ") + chalk.magenta.bold(`TOR SOCKS5`) + chalk.gray(` | Auto-Reset: ${config.tor_reset_seconds}s`));
console.log(chalk.cyan.bold("=================================================================="));

async function fireSingleShot() {
    const reqId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const fullUrl = `${config.target_url}?visitor=${reqId}&t=${Date.now()}`;
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const osBadge = getOS(ua);
    
    const headers = { 
        'User-Agent': ua, 
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    };

    try {
        const startReq = Date.now();
        const res = await axios.get(fullUrl, { headers, httpsAgent, timeout: config.request_timeout_ms });
        const ping = Date.now() - startReq;
        stats.success++;
        
        console.log(
            chalk.cyan(`[${reqId}] `) + 
            osBadge + chalk.green(` HIT ${res.status} `) + 
            chalk.yellow(`${ping}ms `.padEnd(7)) +
            chalk.white(`| S: ${stats.success} | F: ${stats.failed} `) + 
            chalk.gray(`| IP: `) + chalk.magenta(currentIp)
        );
    } catch (err) {
        stats.failed++;
        console.log(
            chalk.cyan(`[${reqId}] `) + 
            osBadge + chalk.bgRed.white(` ERR Blokir/TO `) + 
            chalk.gray(`| IP `) + chalk.magenta(currentIp) + chalk.gray(` delay/mati.`)
        );
    }
}

async function startBot() {
    console.log(chalk.yellow(`\n[*] Mengekstrak Identitas IP Tor Sesi Ini...`));
    currentIp = await getTorIP();
    console.log(chalk.green(`[+] IDENTITAS TERDETEKSI: `) + chalk.bgGreen.black.bold(` ${currentIp} `));

    console.log(chalk.yellow(`[*] Melakukan Handshake ke server MIKORAYUKI...`));
    try {
        const check = await axios.head(config.target_url, { httpsAgent, timeout: 15000 });
        console.log(chalk.green(`[+] SERVER ONLINE! (Status: ${check.status})`));
        console.log(chalk.cyan(`[*] Membuka keran PARALLEL BURST TRAFFIC...\n`));
        
        setInterval(() => {
            let promises = [];
            for(let i = 0; i < config.burst_power; i++) {
                promises.push(fireSingleShot());
            }
            Promise.all(promises);
        }, config.delay_ms);
        
    } catch (err) {
        console.log(chalk.red(`[-] KONEKSI GAGAL: IP `) + chalk.bgRed.white(` ${currentIp} `) + chalk.red(` terhalang Firewall.`));
        console.log(chalk.yellow(`[*] Bypass diaktifkan. Meminta rotasi IP baru dari sistem...\n`));
        process.exit(1); 
    }
}

startBot();
