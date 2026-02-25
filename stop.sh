#!/bin/bash
echo -e "\033[1;31m[!] MEMATIKAN SEMUA MESIN...\033[0m"
pkill -f "node" 2>/dev/null
pkill -f "tor" 2>/dev/null
echo -e "\033[1;32m[✓] Selesai. Termux sudah bersih.\033[0m"
