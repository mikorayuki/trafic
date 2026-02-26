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

# ==========================================
# RESET MEMORI: Mulai dari 0 setiap kali ./gas.sh dijalankan
# ==========================================
rm -f stats_memory.json
echo -e "${YELLOW}[*] Memori dibersihkan. Memulai kalkulasi dari 0...${NC}"

# 1. CEK DAN INSTAL DEPENDENCIES OTOMATIS
if ! command -v node &> /dev/null || ! command -v tor &> /dev/null; then
    echo -e "${RED}[!] Node.js atau Tor belum terinstal!${NC}"
    echo -e "${GREEN}[+] Memulai instalasi otomatis (Mohon tunggu)...${NC}"
    pkg update -y && pkg upgrade -y
    pkg install nodejs tor -y
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[!] Menginstal NPM Modul...${NC}"
    npm install axios socks-proxy-agent chalk@4.1.2
fi

RESET_TIME=$(node -e "console.log(require('./data.json').tor_reset_seconds || 45)")

# ==========================================
# FUNGSI AUTO-CLEANUP & MISSION SUMMARY (SAAT CTRL+C)
# ==========================================
cleanup() {
    echo -e "\n${RED}[!] SINYAL BERHENTI DITERIMA. MENGHENTIKAN ENGINE...${NC}"
    
    # Ambil angka total terakhir dari file JSON menggunakan Node.js inline
    FINAL_TOTAL=$(node -p "try { require('./stats_memory.json').total } catch(e) { 0 }" 2>/dev/null)
    if [ -z "$FINAL_TOTAL" ]; then FINAL_TOTAL=0; fi

    # Matikan proses background
    pkill -f "node bot.js" 2>/dev/null
    pkill -f "tor" 2>/dev/null
    
    # Tampilkan Ringkasan Misi
    echo -e "\n${CYAN}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║ ${MAGENTA}             MISSION ACCOMPLISHED!              ${CYAN}║${NC}"
    echo -e "${CYAN}╠══════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║ ${YELLOW}TOTAL TRAFFIC TERKIRIM : ${GREEN}${FINAL_TOTAL} HITS${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
    
    echo -e "${GREEN}[✓] SEMUA MESIN DIMATIKAN! Termux kembali normal.${NC}\n"
    
    # Bersihkan file memori agar tidak nyampah di folder
    rm -f stats_memory.json
    exit 0
}
trap cleanup SIGINT

echo -e "\n${GREEN}[+] SISTEM SIAP! MEMULAI SERANGAN TRAFFIC...${NC}"
echo -e "${YELLOW}Tekan CTRL + C kapan saja untuk MELIHAT TOTAL & BERHENTI.${NC}\n"

# 2. LOOPING UTAMA
while true; do
    echo -e "${CYAN}--------------------------------------------------${NC}"
    echo -e "${CYAN}[*] Merekrut IP Negara Baru dari Tor Network...${NC}"
    pkill -f "tor" 2>/dev/null
    tor > /dev/null 2>&1 &
    
    sleep 10
    
    timeout ${RESET_TIME}s node bot.js
    
    echo -e "\n${YELLOW}[!] Memutar IP Tor untuk Unique Visitor baru...${NC}"
    sleep 2
done
