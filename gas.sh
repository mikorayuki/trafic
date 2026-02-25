#!/bin/bash

RED='\033[1;31m'
GREEN='\033[1;32m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
NC='\033[0m' 

clear
echo -e "${CYAN}==================================================${NC}"
echo -e "${GREEN}      MIKORAYUKI AUTO-DEPLOYMENT SYSTEM           ${NC}"
echo -e "${CYAN}==================================================${NC}"

# 1. CEK DAN INSTAL DEPENDENCIES OTOMATIS
echo -e "${YELLOW}[*] Mengecek sistem operasi dan dependencies...${NC}"
if ! command -v node &> /dev/null || ! command -v tor &> /dev/null; then
    echo -e "${RED}[!] Node.js atau Tor belum terinstal!${NC}"
    echo -e "${GREEN}[+] Memulai instalasi otomatis (Mohon tunggu)...${NC}"
    pkg update -y && pkg upgrade -y
    pkg install nodejs tor -y
    echo -e "${GREEN}[✓] Node.js & Tor berhasil diinstal!${NC}"
fi

# 2. CEK MODUL NPM
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[!] Modul sistem belum lengkap. Menginstal NPM...${NC}"
    npm install axios socks-proxy-agent chalk@4.1.2
    echo -e "${GREEN}[✓] Instalasi modul selesai!${NC}"
fi

# 3. BACA PENGATURAN WAKTU DARI JSON
# Mengambil nilai tor_reset_seconds dari data.json menggunakan Node.js inline
RESET_TIME=$(node -e "console.log(require('./data.json').tor_reset_seconds || 45)")

# 4. FUNGSI AUTO-CLEANUP SAAT CTRL+C
cleanup() {
    echo -e "\n${RED}[!] MENGHENTIKAN MIKORAYUKI ENGINE...${NC}"
    pkill -f "node bot.js" 2>/dev/null
    pkill -f "tor" 2>/dev/null
    echo -e "${GREEN}[✓] SEMUA BERSIH! Termux aman.${NC}\n"
    exit 0
}
trap cleanup SIGINT

echo -e "\n${GREEN}[+] SISTEM SIAP! MEMULAI SERANGAN TRAFFIC...${NC}"
echo -e "${YELLOW}Tekan CTRL + C kapan saja untuk BERHENTI AMAN.${NC}\n"

# 5. LOOPING UTAMA (GANTI IP & GAS TRAFFIC)
while true; do
    echo -e "${CYAN}--------------------------------------------------${NC}"
    echo -e "${CYAN}[*] Merekrut IP Negara Baru dari Tor Network...${NC}"
    pkill -f "tor" 2>/dev/null
    tor > /dev/null 2>&1 &
    
    # Tunggu Tor membangun jalur
    sleep 10
    
    # Jalankan Node.js sesuai waktu dari data.json
    timeout ${RESET_TIME}s node bot.js
    
    echo -e "\n${YELLOW}[!] Memutar IP Tor untuk Unique Visitor baru...${NC}"
    sleep 2
done
