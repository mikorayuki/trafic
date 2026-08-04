const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const { SocksProxyAgent } = require('socks-proxy-agent');

const config = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const statsFile = './stats_memory.json';

let httpsAgent = null;
if (config.use_tor !== false) {
    httpsAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');
}

let globalTotal = 0;
if (fs.existsSync(statsFile)) {
    try {
        globalTotal = JSON.parse(fs.readFileSync(statsFile, 'utf8')).total || 0;
    } catch (e) {
        globalTotal = 0;
    }
}

function saveStats() {
    fs.writeFileSync(statsFile, JSON.stringify({ total: globalTotal }));
}

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.40 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0"
];

const REFERERS = [
    "https://www.google.com/search?q=zulfan+fuadi",
    "https://www.google.com/",
    "https://t.co/",
    "https://www.facebook.com/",
    "https://github.com/mikorayuki",
    "https://mikorayuki.my.id/",
    "https://bing.com/"
];

const ACCEPT_LANGUAGES = [
    "en-US,en;q=0.9,id;q=0.8",
    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "en-GB,en;q=0.9",
    "ja-JP,ja;q=0.9,en;q=0.8"
];

let sessionStats = { success: 0, failed: 0 };
let currentIp = "FETCHING IP...";

function getOS(ua) {
    if (ua.includes('Windows')) return chalk.bgBlue.white.bold(' WIN ');
    if (ua.includes('Android')) return chalk.bgGreen.black.bold(' AND ');
    if (ua.includes('iPhone') || ua.includes('Mac OS')) return chalk.bgMagenta.white.bold(' MAC ');
    if (ua.includes('Linux')) return chalk.bgYellow.black.bold(' LINUX ');
    return chalk.bgGray.white.bold(' SYS ');
}

async function getTorIP() {
    if (!httpsAgent) return "DIRECT";
    try {
        const res = await axios.get('https://api.ipify.org?format=json', { httpsAgent, timeout: 8000 });
        return res.data.ip;
    } catch (err) {
        return "STEALTH-IP";
    }
}

console.clear();
console.log(chalk.hex('#00FFCC').bold(`
███╗   ███╗██╗██╗  ██╗██████╗ ██████╗  █████╗ ██╗   ██╗██╗   ██╗██╗  ██╗██╗
████╗ ████║██║██║ ██╔╝██╔═══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██║   ██║██║ ██╔╝██║
██╔████╔██║██║█████╔╝ ██║   ██║██████╔╝███████║ ╚████╔╝ ██║   ██║█████╔╝ ██║
██║╚██╔╝██║██║██╔═██╗ ██║   ██║██╔══██╗██╔══██║  ╚██╔╝  ██║   ██║██╔═██╗ ██║
██║ ╚═╝ ██║██║██║  ██╗╚██████╔╝██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██╗██╗
╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝`));

console.log(chalk.cyan.bold("\n======================================================================="));
console.log(chalk.yellow("  ENGINE    : ") + chalk.white.bold("MIKORAYUKI TRAFFIC ENGINE v9.0 (ADVANCED)"));
console.log(chalk.yellow("  TARGET    : ") + chalk.green(config.target_url));
console.log(chalk.yellow("  POWER     : ") + chalk.red.bold(`BURST x${config.burst_power}`) + chalk.gray(` | Interval: ${config.delay_ms}ms`));
console.log(chalk.cyan.bold("======================================================================="));

async function fireSingleShot() {
    const reqId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const fullUrl = `${config.target_url}?ref=trfc_${reqId}&t=${Date.now()}`;
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const referer = REFERERS[Math.floor(Math.random() * REFERERS.length)];
    const acceptLang = ACCEPT_LANGUAGES[Math.floor(Math.random() * ACCEPT_LANGUAGES.length)];
    const osBadge = getOS(ua);

    const headers = {
        'User-Agent': ua,
        'Referer': referer,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': acceptLang,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Chromium";v="123", "Not:A-Brand";v="8"',
        'Sec-Ch-Ua-Mobile': ua.includes('Mobile') ? '?1' : '?0',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Upgrade-Insecure-Requests': '1'
    };

    const requestOptions = {
        headers,
        timeout: config.request_timeout_ms
    };

    if (httpsAgent) {
        requestOptions.httpsAgent = httpsAgent;
    }

    try {
        const startReq = Date.now();
        const res = await axios.get(fullUrl, requestOptions);
        const ping = Date.now() - startReq;

        sessionStats.success++;
        globalTotal++;
        saveStats();

        console.log(
            chalk.cyan(`[${reqId}] `) +
            osBadge + chalk.green(` HIT ${res.status} `) +
            chalk.yellow(`${ping}ms `.padEnd(7)) +
            chalk.magenta.bold(`| TOTAL: ${globalTotal} `) +
            chalk.gray(`| IP: ${currentIp}`)
        );
    } catch (err) {
        sessionStats.failed++;
        console.log(
            chalk.cyan(`[${reqId}] `) +
            osBadge + chalk.bgRed.white(` ERR/TO `) +
            chalk.gray(`| IP: ${currentIp}`)
        );
    }
}

async function startBot() {
    console.log(chalk.yellow(`\n[*] Mendeteksi identitas IP...`));
    currentIp = await getTorIP();
    console.log(chalk.green(`[+] IP TERKONEKSI: `) + chalk.bgGreen.black.bold(` ${currentIp} `));

    console.log(chalk.yellow(`[*] Verifikasi koneksi ke target server...`));
    try {
        const checkOptions = { timeout: 15000 };
        if (httpsAgent) checkOptions.httpsAgent = httpsAgent;

        const check = await axios.head(config.target_url, checkOptions);
        console.log(chalk.green(`[+] TARGET ONLINE (Status: ${check.status})`));
        console.log(chalk.cyan(`[*] Memulai sistem parallel burst traffic...\n`));

        setInterval(() => {
            let promises = [];
            for (let i = 0; i < config.burst_power; i++) {
                promises.push(fireSingleShot());
            }
            Promise.allSettled(promises);
        }, config.delay_ms);

    } catch (err) {
        console.log(chalk.red(`[-] GAGAL TERHUBUNG: `) + chalk.bgRed.white(` ${currentIp} `) + chalk.red(` terhalang atau offline.`));
        process.exit(1);
    }
}

startBot();
