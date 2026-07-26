// =============================================

function initAiAssistant() {
    const btnOpen    = document.getElementById('btn-ai-assistant');
    const btnClose   = document.getElementById('btn-close-ai-voice');
    const modal      = document.getElementById('modal-ai-voice');
    const textEl     = document.getElementById('ai-voice-text');
    const statusEl   = document.getElementById('ai-voice-status');
    const avatarEl   = document.getElementById('ai-voice-avatar');
    const listenEl   = document.getElementById('ai-listen-indicator');
    const listenLabel= document.getElementById('ai-listen-label');

    if (!btnOpen || !modal) return;

    const synth = window.speechSynthesis;

    // === SpeechRecognition (Web API) ===
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let waitingForName = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;
    }

    // ---- Speech Output ----
    function speak(text, onDone) {
        if (!synth) { if (onDone) onDone(); return; }
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang   = 'id-ID';
        utter.rate   = 0.9;
        utter.pitch  = 1.05;
        utter.volume = 1;

        const voices = synth.getVoices();
        const idVoice = voices.find(v => v.lang.startsWith('id')) ||
                        voices.find(v => v.lang.startsWith('ms'));
        if (idVoice) utter.voice = idVoice;

        utter.onstart = () => {
            avatarEl.classList.add('speaking');
            statusEl.classList.add('speaking');
            statusEl.textContent = 'Berbicara...';
        };
        utter.onend = () => {
            avatarEl.classList.remove('speaking');
            statusEl.classList.remove('speaking');
            statusEl.textContent = 'Siap';
            if (onDone) onDone();
        };
        utter.onerror = () => {
            avatarEl.classList.remove('speaking');
            statusEl.classList.remove('speaking');
            if (onDone) onDone();
        };
        synth.speak(utter);
    }

    function setDisplay(html) { textEl.innerHTML = html; }

    // ---- Tampilkan / sembunyikan indikator mikrofon ----
    function showListening(label) {
        listenEl.classList.remove('hidden');
        listenLabel.textContent = label || 'Mendengarkan...';
        statusEl.textContent = 'Mendengarkan...';
    }
    function hideListening() {
        listenEl.classList.add('hidden');
        statusEl.textContent = 'Memproses...';
    }

    // ---- Aktifkan mikrofon untuk mendengar nama ----
    function startListeningForName() {
        waitingForName = true;
        setDisplay('Halo! ðŸ‘‹ Selamat datang di <strong>Asisten DxtaPremi</strong>.<br><br>ðŸŽ¤ <em>Silakan sebutkan nama Anda...</em>');

        if (!recognition) {
            // Fallback: browser tidak support, tampilkan pesan
            setDisplay('âš ï¸ Browser Anda tidak mendukung pengenalan suara.<br>Coba gunakan <strong>Google Chrome</strong>.');
            statusEl.textContent = 'Tidak didukung';
            return;
        }

        showListening('Sebutkan nama Anda...');

        recognition.onresult = (event) => {
            hideListening();
            // Ambil kandidat terbaik dari semua alternatif
            let spokenName = '';
            for (let i = 0; i < event.results[0].length; i++) {
                spokenName = event.results[0][i].transcript.trim();
                if (spokenName) break;
            }
            waitingForName = false;
            processSpokenName(spokenName);
        };

        recognition.onerror = (e) => {
            hideListening();
            waitingForName = false;
            const msg = e.error === 'not-allowed'
                ? 'Akses mikrofon ditolak. Izinkan mikrofon di browser Anda.'
                : 'Tidak mendengar suara. Coba lagi.';
            setDisplay(`âš ï¸ ${msg}`);
            speak(msg, () => {
                setTimeout(() => startListeningForName(), 1000);
            });
        };

        recognition.onend = () => {
            if (waitingForName) {
                // Tidak ada suara terdeteksi â€” coba lagi
                hideListening();
                waitingForName = false;
                const retry = 'Saya tidak mendengar. Silakan sebutkan nama Anda sekali lagi.';
                setDisplay('ðŸ˜• Tidak terdengar...<br><em>Silakan sebutkan nama Anda sekali lagi.</em>');
                speak(retry, () => startListeningForName());
            }
        };

        recognition.start();
    }

    // ---- Proses nama yang diucapkan ----
    function processSpokenName(rawName) {
        setDisplay(`Mencari data untuk <strong>"${rawName}"</strong>...`);
        statusEl.textContent = 'Mencari...';

        const found = findWorkerName(rawName);

        if (!found) {
            const notFound = `Maaf, nama ${rawName} tidak ditemukan dalam data. Pastikan nama sesuai dengan yang tercatat.`;
            setDisplay(`ðŸ˜” Maaf, nama <strong>"${rawName}"</strong> tidak ditemukan.<br><small style="color:var(--text-muted)">Pastikan nama sesuai dengan data yang tercatat.</small>`);
            speak(notFound, () => {
                setTimeout(() => startListeningForName(), 600);
            });
            return;
        }

        const earnings = getWorkerEarnings(found);
        const total    = earnings.reduce((s, f) => s + f.amount, 0);

        if (earnings.length === 0) {
            const noData = `Halo ${found}! Nama Anda ditemukan, namun belum ada catatan pendapatan saat ini.`;
            setDisplay(`Halo <strong>${found}</strong>! ðŸ‘‹<br>Nama ditemukan, tapi belum ada catatan pendapatan.`);
            speak(noData);
            return;
        }

        // Bangun rincian per jenis pekerjaan
        const jobMap = {};
        earnings.forEach(f => {
            if (!jobMap[f.job]) jobMap[f.job] = { count: 0, total: 0, dates: [] };
            jobMap[f.job].count++;
            jobMap[f.job].total += f.amount;
            jobMap[f.job].dates.push(f.date);
        });

        const period = formatPeriodLabel(state.activeCekPeriodIndex);
        const totalText = `Selamat ${found}! Total pendapatan Anda adalah ${formatRupiahSpoken(total)}.`;
        const detailLines = Object.entries(jobMap).map(([job, d]) => {
            const first = d.dates[d.dates.length - 1];
            const last  = d.dates[0];
            return `Sebagai ${job}: ${d.count} kali, dari tanggal ${first} sampai ${last}, total ${formatRupiahSpoken(d.total)}.`;
        });
        const fullSpeech = `${totalText} Rincian: ${detailLines.join(' ')}`;

        // HTML tampilan
        const jobRows = Object.entries(jobMap).map(([job, d]) =>
            `<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.35rem 0;border-bottom:1px solid rgba(255,255,255,0.06);gap:0.5rem">
                <div>
                    <div style="font-size:0.85rem;font-weight:600">${job}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${d.dates[d.dates.length-1]} s/d ${d.dates[0]} â€¢ ${d.count}x</div>
                </div>
                <span style="color:#f59e0b;font-weight:700;white-space:nowrap">${formatRupiah(d.total)}</span>
            </div>`
        ).join('');

        setDisplay(`
            ðŸŽ‰ <strong>Selamat, ${found}!</strong><br>
            <small style="color:var(--text-muted)">Periode: ${period}</small><br><br>
            ${jobRows}
            <div style="display:flex;justify-content:space-between;margin-top:0.6rem;padding-top:0.6rem;border-top:1px solid rgba(16,185,129,0.35);font-weight:700">
                <span>ðŸ’° Total</span>
                <span style="color:#10b981;font-size:1.05rem">${formatRupiah(total)}</span>
            </div>`);

        speak(fullSpeech);
    }

    // ---- Buka modal ----
    btnOpen.addEventListener('click', () => {
        modal.classList.remove('hidden');
        hideListening();
        statusEl.classList.remove('speaking');
        setDisplay('Halo! ðŸ‘‹ Selamat datang di <strong>Asisten DxtaPremi</strong>.<br><br>Siapa nama Anda?');

        const greetText = 'Halo! Selamat datang di Asisten DxtaPremi. Siapa nama Anda?';
        speak(greetText, () => {
            startListeningForName();
        });
    });

    // ---- Tutup modal ----
    function closeModal() {
        synth && synth.cancel();
        recognition && recognition.abort();
        modal.classList.add('hidden');
        hideListening();
        waitingForName = false;
        avatarEl.classList.remove('speaking');
        statusEl.classList.remove('speaking');
        statusEl.textContent = 'Siap';
    }
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // ---- Helper: Rupiah dalam bentuk ucapan ----
    function formatRupiahSpoken(amount) {
        if (amount >= 1000000) {
            const juta = (amount / 1000000).toFixed(1).replace('.0', '');
            return `${juta} juta rupiah`;
        }
        if (amount >= 1000) {
            return `${Math.round(amount / 1000)} ribu rupiah`;
        }
        return `${amount} rupiah`;
    }

    // ---- Cari nama pekerja ----
    function findWorkerName(input) {
        const upper = input.toUpperCase().trim();
        // Cek EMPLOYEE_DB
        const dbMatch = EMPLOYEE_DB.find(e => {
            const en = e.name.toUpperCase();
            if (en === upper) return true;
            return upper.split(/\s+/).filter(Boolean).every(w => en.includes(w));
        });
        if (dbMatch) return dbMatch.name;
        // Cek records
        const allNames = new Set();
        state.records.forEach(rec =>
            [...rec.drivers, ...rec.loaders].forEach(p => { if (p.name) allNames.add(p.name.toUpperCase()); })
        );
        for (const nm of allNames) {
            if (nm === upper) return nm;
            if (upper.split(/\s+/).filter(Boolean).every(w => nm.includes(w))) return nm;
        }
        return null;
    }

    // ---- Kumpulkan pendapatan ----
    function getWorkerEarnings(name) {
        const nl = name.toLowerCase();
        const out = [];
        state.records.forEach(rec => {
            rec.drivers.forEach(d => {
                if (d.name && d.name.toLowerCase() === nl) {
                    const job = rec.category === 'tractor' ? 'Operator Traktor' : 'Supir Dump Truck';
                    out.push({ date: rec.date, job, amount: d.amount || 0 });
                }
            });
            rec.loaders.forEach(l => {
                if (l.name && l.name.toLowerCase() === nl) {
                    const job = rec.category === 'brondolan' ? 'Pengumpul Brondolan'
                              : rec.category === 'tractor'   ? 'Pemuat Traktor'
                              :                                'Pemuat Dump Truck';
                    out.push({ date: rec.date, job, amount: l.amount || 0 });
                }
            });
        });
        return out.sort((a, b) => b.date.localeCompare(a.date));
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAiAssistant, 500);
});

