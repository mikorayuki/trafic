# Mikorayuki Traffic Engine v9.0

![NodeJS](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=nodedotjs)
![Tor](https://img.shields.io/badge/Tor-SOCKS5-purple?style=for-the-badge&logo=torbrowser)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Mikorayuki Traffic Engine** adalah sistem otomatisasi pengujian beban jaringan dan simulasi pengunjung berbasis Node.js yang dilengkapi dengan rotasi proxy Tor SOCKS5, penyamaran User-Agent dinamis, header HTTP modern, serta manajemen sesi statistik real-time.

---

## ⚡ Fitur Utama

- **Rotasi IP Otomatis melalui Jaringan Tor:** Mengubah identitas IP dan sirkuit jaringan secara berkala setiap interval waktu tertentu.
- **Parallel Burst Shooting:** Mengirimkan permintaan HTTP secara paralel menggunakan asynchronous Promise handler untuk efisiensi tinggi.
- **Dynamic Header Spoofing:** Rotasi otomatis User-Agent (Chrome, Safari, Firefox, Edge di berbagai OS) dan header Sec-CH-UA untuk menghindari deteksi firewall sederhana.
- **Auto Memory Tracking:** Menyimpan total hits secara real-time dan menampilkan statistik lengkap saat sesi dihentikan.
- **Dual Mode (Proxy / Direct):** Mendukung penggunaan proxy SOCKS5 Tor maupun mode direct connection melalui konfigurasi `data.json`.
- **Multi-Platform Deployment:** Dapat dijalankan di Termux (Android), Ubuntu, Debian, CentOS, maupun macOS.

---

## 🛠️ Persyaratan Sistem

- **Node.js:** Versi 16.x atau lebih baru
- **Tor Service:** Untuk fitur rotasi IP SOCKS5
- **NPM Package:** `axios`, `socks-proxy-agent`, `chalk@4.1.2`

---

## 🚀 Panduan Instalasi & Penggunaan

### 1. Clone Repository
```bash
git clone https://github.com/mikorayuki/trafic.git
cd trafic
```

### 2. Berikan Izin Eksekusi Script
```bash
chmod +x gas.sh stop.sh
```

### 3. Konfigurasi Target
Edit file `data.json` sesuai dengan kebutuhan pengujian:

```json
{
  "target_url": "https://zulfanfuadi.my.id",
  "delay_ms": 500,
  "burst_power": 10,
  "tor_reset_seconds": 30,
  "request_timeout_ms": 8000,
  "use_tor": true
}
```

#### Deskripsi Parameter `data.json`:
- `target_url`: URL target yang akan diaudit/diuji.
- `delay_ms`: Jeda antar siklus pengiriman request (dalam milidetik).
- `burst_power`: Jumlah request paralel yang dikirim dalam 1 siklus.
- `tor_reset_seconds`: Durasi rotasi IP jaringan Tor (dalam detik).
- `request_timeout_ms`: Batas waktu maksimal timeout HTTP request.
- `use_tor`: Set `true` untuk menggunakan proxy Tor SOCKS5, atau `false` untuk mode direct.

---

## 💻 Cara Menjalankan

### Menjalankan Engine (Auto-Deploy)
```bash
./gas.sh
```

Script akan secara otomatis memeriksa dan menginstal dependensi (Node.js & Tor), mengaktifkan proxy, dan mulai menjalankan traffic engine.

### Menghentikan Engine & Melihat Ringkasan Hasil
- Tekan **`CTRL + C`** pada terminal saat `./gas.sh` berjalan.
- Atau jalankan script penghenti di jendela terminal terpisah:
```bash
./stop.sh
```

---

## 📁 Struktur File Project

```text
trafic/
├── bot.js             # Engine utama pengirim HTTP request paralel
├── data.json          # File konfigurasi target dan performa
├── gas.sh             # Script automatisasi jalankan engine & rotasi Tor
├── stop.sh            # Script pemutus seluruh proses background
├── petunjuk.txt       # Panduan cepat eksekusi
└── package.json       # Modul dependensi Node.js
```
