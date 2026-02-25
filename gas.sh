#!/bin/bash

RED='\033[1;31m'
GREEN='\033[1;32m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
NC='\033[0m' 

cleanup() {
    echo -e "\n${RED}[!] MENGHENTIKAN MESIN...${NC}"
    pkill -f "node bot.js" 2>/dev/null
    pkill -f "tor" 2>/dev/null
    echo -e "${GREEN}[✓] SEMUA BERSIH! Termux aman.${NC}\n"
    exit 0
}

trap cleanup SIGINT

clear # Hapus layar cuma 1 kali di awal jalannya script
echo -e "${CYAN}==========================================${NC}"
echo -e "${GREEN}  [+] GHOST-ENGINE V4 STARTED [+]${NC}"
echo -e "${YELLOW}Tekan CTRL + C kapan saja untuk BERHENTI.${NC}"
echo -e "${CYAN}==========================================${NC}\n"

while true; do
    echo -e "${CYAN}------------------------------------------${NC}"
    echo -e "${CYAN}[*] Mendapatkan IP Negara Baru dari Tor...${NC}"
    pkill -f "tor" 2>/dev/null
    tor > /dev/null 2>&1 &
    
    # Tunggu Tor membangun jalur (sekitar 10-12 detik)
    sleep 12
    
    # Jalankan Node.js
    timeout 50s node bot.js
    
    echo -e "\n${YELLOW}[!] Limit waktu sesi habis / Koneksi direset. Bersiap ganti IP...${NC}"
    sleep 2
done
