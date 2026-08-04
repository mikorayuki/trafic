#!/bin/bash
echo -e "\033[1;31m[!] Menghentikan seluruh proses engine...\033[0m"
pkill -f "node bot.js" 2>/dev/null
pkill -f "tor" 2>/dev/null
rm -f stats_memory.json
echo -e "\033[1;32m[✓] Seluruh proses berhasil dihentikan.\033[0m"
