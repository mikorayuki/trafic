const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const { SocksProxyAgent } = require('socks-proxy-agent');

const config = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const httpsAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) Chrome/121.0.6167.164 Mobile",
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0"
];

let stats = { success: 0, failed: 0, total: 0 };

console.log(chalk.hex('#00FFCC').bold(`
███╗   ███╗██╗██╗  ██╗██████╗ ██████╗  █████╗ ██╗   ██╗██╗   ██╗██╗  ██╗██╗
████╗ ████║██║██║ ██╔╝██╔═══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██║   ██║██║ ██╔╝██║
██╔████╔██║██║█████╔╝ ██║   ██║██████╔╝███████║ ╚████╔╝ ██║   ██║█████╔╝ ██║
██║╚██╔╝██║██║██╔═██╗ ██║   ██║██╔══██╗██╔══██║  ╚██╔╝  ██║   ██║██╔═██╗ ██║
██║ ╚═╝ ██║██║██║  ██╗╚██████╔╝██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██╗██║
╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝`));

console.log(chalk.cyan.bold("\n==========================================================="));
console.log(chalk.yellow("  PROJECT  : ") + chalk.white.bold("MIKORAYUKI TRAFFIC ENGINE v5.0 (OP MODE)"));
console.log(chalk.yellow("  TARGET   : ") + chalk.green(config.target_url));
console.log(chalk.yellow("  POWER    : ") + chalk.red.bold(`BURST x${config.burst_power}`) + chalk.gray(` | IP Reset: ${config.tor_reset_seconds}s`));
console.log(chalk.cyan.bold("==========================================================="));

async function fireWeapon() {
    const reqId = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Tambahkan query unik dan cache-buster agar Cloudflare merekam sebagai kunjungan real
    const fullUrl = `${config.target_url}?visitor=${reqId}&t=${Date.now()}`;
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    const headers = { 
        'User-Agent': ua, 
        'Cache-Control': 'no-cache',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    };

    try {
        const startReq = Date.now();
        const res = await axios.get(fullUrl, { headers, httpsAgent, timeout: 10000 });
        const ping = Date.now() - startReq;
        stats.success++;
        
        console.log(
            chalk.cyan(`[${reqId}] `) + 
            chalk.bgGreen.black(` HIT `) + chalk.green(` ${res.status} `) + 
            chalk.yellow(`${ping}ms `) +
            chalk.white(`| Sukses: ${stats.success} | Gagal: ${stats.failed}`)
        );
    } catch (err) {
        stats.failed++;
        console.log(
            chalk.cyan(`[${reqId}] `) + 
            chalk.bgRed.white(` ERR `) + chalk.red(` Rute IP Terblokir `) + 
            chalk.gray(`| Menunggu rotasi IP berikutnya...`)
        );
    }
}

async function startBot() {
    console.log(chalk.yellow(`\n[*] Mengecek rute Tor ke server MIKORAYUKI...`));
    try {
        const check = await axios.head(config.target_url, { httpsAgent, timeout: 15000 });
        console.log(chalk.green(`[+] SERVER TERHUBUNG! (Status: ${check.status})`));
        console.log(chalk.cyan(`[*] Memulai penetrasi traffic Burst Fire...\n`));
        
        setInterval(() => {
            for(let i = 0; i < config.burst_power; i++) {
                fireWeapon();
            }
        }, config.delay_ms);
        
    } catch (err) {
        console.log(chalk.red(`[-] KONEKSI GAGAL: IP Tor saat ini jelek/diblokir.`));
        console.log(chalk.yellow(`[*] Menghentikan sesi agar gas.sh bisa mengganti IP Tor...\n`));
        process.exit(1); 
    }
}

startBot();
