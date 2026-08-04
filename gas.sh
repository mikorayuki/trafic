#!/bin/bash

RED='\033[1;31m'
GREEN='\033[1;32m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
MAGENTA='\033[1;35m'
NC='\033[0m'

clear
echo -e "${CYAN}==================================================${NC}"
echo -e "${GREEN}      MIKORAYUKI AUTO-DEPLOYMENT SYSTEM           ${NC}"
echo -e "${CYAN}==================================================${NC}"

rm -f stats_memory.json
echo -e "${YELLOW}[*] Inisialisasi memori awal...${NC}"

if ! command -v node &> /dev/null || ! command -v tor &> /dev/null; then
    echo -e "${RED}[!] Paket pendukung belum terinstal.${NC}"
    echo -e "${GREEN}[+] Memulai proses instalasi otomatis...${NC}"
    if command -v pkg &> /dev/null; then
        pkg update -y && pkg upgrade -y
        pkg install nodejs tor -y
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update -y
        sudo apt-get install -y nodejs tor
    fi
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[!] Menginstal modul Node.js...${NC}"
    npm install axios socks-proxy-agent chalk@4.1.2
fi

RESET_TIME=$(node -e "console.log(require('./data.json').tor_reset_seconds || 30)")

cleanup() {
    echo -e "\n${RED}[!] Sinyal penghentian diterima...${NC}"

    FINAL_TOTAL=$(node -p "try { require('./stats_memory.json').total } catch(e) { 0 }" 2>/dev/null)
    if [ -z "$FINAL_TOTAL" ]; then FINAL_TOTAL=0; fi

    pkill -f "node bot.js" 2>/dev/null
    pkill -f "tor" 2>/dev/null

    echo -e "\n${CYAN}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║ ${MAGENTA}             RINGKASAN SESI HASIL               ${CYAN}║${NC}"
    echo -e "${CYAN}╠══════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║ ${YELLOW}TOTAL TRAFFIC TERKIRIM : ${GREEN}${FINAL_TOTAL} HITS${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"

    echo -e "${GREEN}[✓] Proses dihentikan dengan aman.${NC}\n"

    rm -f stats_memory.json
    exit 0
}
trap cleanup SIGINT

echo -e "\n${GREEN}[+] Sistem siap dijalankan.${NC}"
echo -e "${YELLOW}Tekan CTRL + C untuk melihat statistik dan menghentikan.${NC}\n"

while true; do
    echo -e "${CYAN}--------------------------------------------------${NC}"
    echo -e "${CYAN}[*] Rotasi jaringan IP melalui Tor Network...${NC}"
    pkill -f "tor" 2>/dev/null
    tor > /dev/null 2>&1 &

    sleep 8

    timeout ${RESET_TIME}s node bot.js

    echo -e "\n${YELLOW}[!] Melakukan rotasi identitas jaringan baru...${NC}"
    sleep 2
done
