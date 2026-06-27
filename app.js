// Database Karyawan Preloaded (dari gambar user)
let EMPLOYEE_DB = [
    { nik: "0176D", name: "SARINAH" },
    { nik: "0177A", name: "MARITA" },
    { nik: "0178H", name: "MARIYATUN" },
    { nik: "0179E", name: "SATINEM" },
    { nik: "0180E", name: "SLAMET SETIAWAN" },
    { nik: "0181B", name: "NUR ROHMAN" },
    { nik: "0182I", name: "SURIYANTO" },
    { nik: "0183F", name: "ARI PURNAMA AJI" },
    { nik: "0184C", name: "BAGUS SAPUTRA WIJAYA" },
    { nik: "0185J", name: "TRIO SANTOSO" },
    { nik: "0186G", name: "DEPI SAPUTRA" },
    { nik: "0188A", name: "RAMADDANI HIDAYAT" },
    { nik: "0189H", name: "SUGENG PRAYITNO" },
    { nik: "0190H", name: "FERI" },
    { nik: "0191E", name: "AHMAD ZAENAL" },
    { nik: "0192B", name: "BIBIT" },
    { nik: "0193I", name: "SUJARWO" },
    { nik: "0194F", name: "MASMUDIN" },
    { nik: "0196J", name: "DARWANTO" },
    { nik: "0197G", name: "EKO YULIYANTO" },
    { nik: "0198D", name: "AGUNG KURNIAWAN" },
    { nik: "0200B", name: "M. TAMIM ZAENULLOH" },
    { nik: "0201I", name: "HERI SUPRIADI" },
    { nik: "0202F", name: "RUSMIATI" },
    { nik: "0203C", name: "WIWIK SUSANTI" },
    { nik: "0204J", name: "POPPY MERCURI" },
    { nik: "0205G", name: "DWI HARDIANTO" },
    { nik: "0206D", name: "ROHMATISA IRAWAN" },
    { nik: "0208H", name: "M. MUSTAKIM" },
    { nik: "0210E", name: "PONCO NUGROHO" },
    { nik: "0265E", name: "SAMSUL HUDA" },
    { nik: "0266B", name: "EKO PRASETYO" },
    { nik: "0268F", name: "REZA KURNIAWAN" },
    { nik: "0336D", name: "SUPRASTO" },
    { nik: "0356J", name: "SAMSUL ANAM" },
    { nik: "0370D", name: "BAYU SETIAWAN" },
    { nik: "0371A", name: "BADARUL MUKMININ" },
    { nik: "0372H", name: "WAHYU NUR ROHMAN" },
    { nik: "0373E", name: "ALI SYAHRONI" },
    { nik: "0374B", name: "SAIFUL HIDAYAT" },
    { nik: "0375I", name: "AHMAD DANANG PRATAMA" },
    // Tambahan Driver Dump Truck
    { nik: "0298E", name: "TRI SUTRISNO" },
    { nik: "0301J", name: "TONO SUSANTO" },
    { nik: "0302G", name: "MUSTANGIN ROMLI" },
    { nik: "0303D", name: "HARDI" },
    { nik: "0305H", name: "AGUS SUGIANTO" },
    { nik: "0307B", name: "SARMIN" },
    { nik: "0308I", name: "EDI PURWANTO" },
    { nik: "0309F", name: "SRIYANTO" },
    { nik: "0310F", name: "ADI WARDOYO" },
    { nik: "0341B", name: "RISANTO" },
    { nik: "0342I", name: "SAKIRAN" },
    { nik: "0343F", name: "SURYANTO" },
    { nik: "0344C", name: "SARWONO" }
];

// Database BJR per Field (Berat Janjang Rata-rata dalam Kg)
const FIELD_BJR = [
    { field: "03A01", bjr: 16.51 },
    { field: "07A01", bjr: 17.37 },
    { field: "08A01", bjr: 18.09 },
    { field: "08A02", bjr: 17.56 },
    { field: "08A03", bjr: 17.88 },
    { field: "11A01", bjr: 12.54 },
    { field: "11A02", bjr: 12.02 },
    { field: "11A03", bjr: 12.89 },
    { field: "11A04", bjr: 12.84 },
    { field: "11A05", bjr: 12.73 },
    { field: "11A06", bjr: 12.94 },
    { field: "11A07", bjr: 11.19 },
    { field: "12A01", bjr: 12.14 },
    { field: "12A02", bjr: 15.07 }
];

// State Aplikasi
const state = {
    theme: 'dark',
    activeCategory: '', // 'dump-truck', 'tractor', 'brondolan'
    records: [],
    editingRecordId: null, // ID record yang sedang diedit (null = mode baru)
    rates: {
        'dump-truck': {
            driver: 17000,   // Rp per Ton (Supir Dump Truck)
            loader: 55000   // Rp per Ton (Pemuat - total dibagi rata)
        },
        'tractor': {
            driver: 17000,   // Rp per Ton (Operator Traktor)
            loader: 33000   // Rp per Ton (Pemuat Traktor - total dibagi rata)
        },
        'brondolan': {
            kg: 250    // Rp per KG per Pekerja
        }
    },
    activeTab: 'tab-all',
    activePeriodIndex: 0,   // 0 = periode saat ini, 1 = sebelumnya, dst.
    activeCekPeriodIndex: 0 // Untuk modal Cek Penghasilan
};

// =============================================
// PERIOD HELPERS
// =============================================

// getPeriodDates(index): index 0 = periode sekarang, 1 = sebelumnya, dst.
// Periode: dari tanggal 26 bulan X sampai tanggal 25 bulan X+1
function getPeriodDates(index) {
    index = index || 0;
    const today = new Date();
    const d = today.getDate();
    let m = today.getMonth(); // 0-indexed
    let y = today.getFullYear();

    // Tentukan bulan/tahun mulai periode paling baru (index 0)
    let currentStartMonth, currentStartYear;
    if (d >= 26) {
        currentStartMonth = m;
        currentStartYear  = y;
    } else {
        // Sebelum tanggal 26, periode ini masih dimulai dari bulan lalu
        currentStartMonth = m === 0 ? 11 : m - 1;
        currentStartYear  = m === 0 ? y - 1 : y;
    }

    // Mundur 'index' bulan dari periode paling baru
    let startMonth = currentStartMonth - index;
    let startYear  = currentStartYear;
    while (startMonth < 0) { startMonth += 12; startYear--; }
    while (startMonth > 11) { startMonth -= 12; startYear++; }

    // End: tanggal 25 bulan berikutnya
    let endMonth = startMonth + 1;
    let endYear  = startYear;
    if (endMonth > 11) { endMonth = 0; endYear++; }

    return {
        start: new Date(startYear, startMonth, 26),
        end:   new Date(endYear, endMonth, 25)
    };
}

// Format period dates as "26 Jun 2026 – 25 Jul 2026"
function formatPeriodLabel(index) {
    index = index || 0;
    const { start, end } = getPeriodDates(index);
    const opts = { day: 'numeric', month: 'short', year: 'numeric' };
    const startStr = start.toLocaleDateString('id-ID', opts);
    // Untuk periode saat ini (index 0), tampilkan tanggal hari ini sebagai akhir
    if (index === 0) {
        const today = new Date();
        const endStr = today.toLocaleDateString('id-ID', opts);
        return `${startStr} – ${endStr}`;
    }
    return `${startStr} – ${end.toLocaleDateString('id-ID', opts)}`;
}

// Generate list of periods from Mei 2026 up to current period
function generatePeriodList() {
    const list = [];
    const today = new Date();
    const d = today.getDate();
    const m = today.getMonth(); // 0-indexed
    const y = today.getFullYear();
    
    let currentStartMonth = (d >= 26) ? m : (m === 0 ? 11 : m - 1);
    let currentStartYear = (d >= 26) ? y : (m === 0 ? y - 1 : y);
    
    // Hitung index untuk Mei 2026 (bulan 4)
    let monthsFromMay2026 = (currentStartYear - 2026) * 12 + (currentStartMonth - 4);
    
    let startIndex = monthsFromMay2026;
    let endIndex = 0; // Hanya sampai periode ini
    
    let periodNumber = 1;
    for (let i = startIndex; i >= endIndex; i--) {
        list.push({ 
            index: i, 
            label: formatPeriodLabel(i),
            title: `Periode ${periodNumber}`
        });
        periodNumber++;
    }
    return list;
}

// Open a floating period picker dropdown near anchorEl
// selectedIndex = currently active index
// onSelect(index) called when user picks a period
function openPeriodPicker(anchorEl, selectedIndex, onSelect) {
    // Remove any existing picker
    const existing = document.getElementById('__period-picker-dropdown');
    if (existing) existing.remove();

    const periods = generatePeriodList(12);
    const dropdown = document.createElement('div');
    dropdown.id = '__period-picker-dropdown';
    dropdown.style.cssText = `
        position: fixed;
        z-index: 9999;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm, 6px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        min-width: 200px;
        overflow-y: auto;
    `;

    periods.forEach(p => {
        const item = document.createElement('button');
        item.type = 'button';
        item.textContent = `${p.title}: ${p.label}`;
        item.style.cssText = `
            width: 100%;
            text-align: left;
            padding: 0.45rem 0.75rem;
            border: none;
            background: ${p.index === selectedIndex ? 'var(--accent-teal)' : 'transparent'};
            color: ${p.index === selectedIndex ? '#fff' : 'var(--text-primary)'};
            font-size: 0.8rem;
            font-weight: ${p.index === selectedIndex ? '600' : '500'};
            cursor: pointer;
            border-radius: 0;
            transition: background 0.15s;
        `;
        item.addEventListener('mouseenter', () => {
            if (p.index !== selectedIndex) item.style.background = 'rgba(255,255,255,0.06)';
        });
        item.addEventListener('mouseleave', () => {
            if (p.index !== selectedIndex) item.style.background = 'transparent';
        });
        item.addEventListener('click', () => {
            dropdown.remove();
            document.removeEventListener('click', outsideClick, true);
            onSelect(p.index);
        });
        dropdown.appendChild(item);
    });

    document.body.appendChild(dropdown);

    // Position it below the anchor flexibly
    const rect = anchorEl.getBoundingClientRect();
    let top = rect.bottom + 6;
    let left = rect.left;
    // Keep inside viewport horizontally
    if (left + 250 > window.innerWidth) left = window.innerWidth - 256;
    
    // Limit height to available space below the button to ensure it always opens downwards
    let availableHeight = window.innerHeight - rect.bottom - 20;
    if (availableHeight < 150) availableHeight = 150; // Minimum scrollable height
    
    dropdown.style.maxHeight = availableHeight + 'px';
    dropdown.style.top  = top + 'px';
    dropdown.style.left = left + 'px';

    // Close on outside click
    const outsideClick = (e) => {
        if (!dropdown.contains(e.target) && e.target !== anchorEl) {
            dropdown.remove();
            document.removeEventListener('click', outsideClick, true);
        }
    };
    setTimeout(() => document.addEventListener('click', outsideClick, true), 10);
}

// Update the period label text in the history section button
function updatePeriodLabel() {
    const label = document.getElementById('history-period-label');
    if (label) label.textContent = formatPeriodLabel(state.activePeriodIndex);
}

const CREDENTIALS = {
    "DARTA": "907612",
    "MATIUS": "091256",
    "IRWAN": "891283",
    "OWNER": "569716"
};

let currentUser = localStorage.getItem('dxtapremi_user') || null;

// Konfigurasi Database Online Supabase
// Masukkan URL & Anon Key Supabase Anda di bawah ini agar data sinkron online secara real-time
const SUPABASE_URL = "https://amvscipdfgtmfftegwqh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdnNjaXBkZmd0bWZmdGVnd3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODE0NzUsImV4cCI6MjA5Njc1NzQ3NX0.rtgIbwp6jCiPAY8CszG6LA5uircFrgLssWCRDUBR02c";

// Helper to get local date string YYYY-MM-DD
// Memiliki batas cut-off jam 14:00 (2 siang). Sebelum jam 2 siang, dianggap masih hari sebelumnya.
function getLocalToday() {
    const now = new Date();
    if (now.getHours() < 14) {
        now.setDate(now.getDate() - 1);
    }
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}



// --- Banner Slideshow Logic ---
let bannerImages = [];
let currentBannerIndex = 0;
let bannerInterval = null;
let isBannerPaused = false;

function loadBannerImages() {
    const saved = localStorage.getItem('dxtapremi_banner_bgs');
    if (saved) {
        try {
            bannerImages = JSON.parse(saved);
        } catch (e) {
            bannerImages = [];
        }
    }
    renderBanner();
    loadBannerFromSupabase();
}

async function loadBannerFromSupabase() {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_settings?key=eq.banner_images&select=value`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                const remoteBanners = data[0].value;
                if (Array.isArray(remoteBanners)) {
                    bannerImages = remoteBanners;
                    localStorage.setItem('dxtapremi_banner_bgs', JSON.stringify(bannerImages));
                    renderBanner();
                }
            }
        }
    } catch (err) {
        console.error('Gagal load banner dari Supabase:', err);
    }
}

async function syncBannerToSupabase() {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return;
    try {
        const payload = {
            key: 'banner_images',
            value: bannerImages
        };
        const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            console.error('Gagal sinkron banner ke Supabase:', await response.text());
        }
    } catch (err) {
        console.error('Gagal sinkron banner ke Supabase:', err);
    }
}

function renderBanner() {
    const track = document.getElementById('banner-slideshow-track');
    const overlay = document.getElementById('banner-overlay');
    if (!track || !overlay) return;

    if (bannerImages.length === 0) {
        track.innerHTML = '';
        track.style.transform = 'translateX(0)';
        overlay.style.display = 'none';
        if (bannerInterval) {
            clearInterval(bannerInterval);
            bannerInterval = null;
        }
        return;
    }

    overlay.style.display = 'block';

    track.innerHTML = bannerImages.map((b64) => `
        <div class="banner-slide" style="flex: 0 0 100%; height: 100%; background-image: url('${b64}'); background-size: cover; background-repeat: no-repeat; background-position: center;"></div>
    `).join('');

    // Toggle pause on click
    overlay.onclick = () => {
        if (bannerImages.length > 1) {
            isBannerPaused = !isBannerPaused;
            showToast(isBannerPaused ? 'Slideshow dijeda (klik untuk melanjutkan)' : 'Slideshow dilanjutkan');
        }
    };
    
    if (bannerImages.length > 1) {
        currentBannerIndex = 0;
        track.style.transform = `translateX(0%)`;
        
        bannerInterval = setInterval(() => {
            if (isBannerPaused) return;
            currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
            track.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
        }, 5000); // Geser tiap 5 detik
    } else {
        track.style.transform = `translateX(0%)`;
    }
}

function initBannerUploader() {
    const uploadInput = document.getElementById('banner-upload');
    const btnClear = document.getElementById('btn-banner-clear');

    // --- Crop State ---
    let cropSourceImg = null;    // Original Image object
    let cropZoom = 1;
    let cropOffsetX = 0;         // Pan offset (in source image px)
    let cropOffsetY = 0;
    let cropDragging = false;
    let cropDragStartX = 0;
    let cropDragStartY = 0;
    let cropStartOffX = 0;
    let cropStartOffY = 0;
    const CROP_ASPECT = 16 / 5;  // Banner aspect ratio
    const OUTPUT_W = 2000;       // Output crop width (higher res)
    const OUTPUT_H = Math.round(OUTPUT_W / CROP_ASPECT);

    function openCropModal(imgSrc) {
        const modal = document.getElementById('modal-crop-banner');
        const canvas = document.getElementById('crop-canvas');
        const zoomSlider = document.getElementById('crop-zoom');
        const zoomLabel = document.getElementById('crop-zoom-label');
        if (!modal || !canvas) return;

        cropSourceImg = new Image();
        cropSourceImg.onload = () => {
            // Show modal FIRST so wrapper has real dimensions
            modal.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();

            // Wait one frame for browser to layout the modal
            requestAnimationFrame(() => {
                const wrapper = document.getElementById('crop-area-wrapper');
                const wrapperW = wrapper.clientWidth || 800;
                const wrapperH = wrapper.clientHeight || 500;

                // Canvas display matches wrapper 
                const displayW = wrapperW;
                const displayH = Math.min(wrapperH, Math.round(wrapperW / CROP_ASPECT) + 120);
                canvas.width = displayW;
                canvas.height = displayH;
                canvas.style.width = displayW + 'px';
                canvas.style.height = displayH + 'px';

                // Reset crop state
                cropZoom = 1;
                cropOffsetX = 0;
                cropOffsetY = 0;
                if (zoomSlider) { zoomSlider.value = 100; }
                if (zoomLabel) { zoomLabel.textContent = '100%'; }

                // Auto-fit: scale so image covers crop area
                const cropBoxW = displayW * 0.95;
                const cropBoxH = cropBoxW / CROP_ASPECT;
                const scaleToFitW = cropBoxW / cropSourceImg.width;
                const scaleToFitH = cropBoxH / cropSourceImg.height;
                const coverZoom = Math.max(scaleToFitW, scaleToFitH);
                const containZoom = Math.min(scaleToFitW, scaleToFitH);

                cropZoom = coverZoom;
                const zoomPercent = Math.round(coverZoom * 100);
                const minZoomPercent = Math.round(containZoom * 100);
                if (zoomSlider) { 
                    zoomSlider.min = Math.min(10, minZoomPercent);
                    zoomSlider.max = Math.round(coverZoom * 300);
                    zoomSlider.value = zoomPercent; 
                }
                if (zoomLabel) { zoomLabel.textContent = zoomPercent + '%'; }

                // Center image on crop box
                const scaledW = cropSourceImg.width * cropZoom;
                const scaledH = cropSourceImg.height * cropZoom;
                cropOffsetX = (scaledW - cropBoxW) / 2 / cropZoom;
                cropOffsetY = (scaledH - cropBoxH) / 2 / cropZoom;

                drawCropCanvas();
            });
        };
        cropSourceImg.src = imgSrc;
    }

    function drawCropCanvas() {
        const canvas = document.getElementById('crop-canvas');
        if (!canvas || !cropSourceImg) return;
        const ctx = canvas.getContext('2d');
        const cw = canvas.width;
        const ch = canvas.height;

        // Crop box dimensions (centered, 95% width)
        const cropBoxW = cw * 0.95;
        const cropBoxH = cropBoxW / CROP_ASPECT;
        const cropBoxX = (cw - cropBoxW) / 2;
        const cropBoxY = (ch - cropBoxH) / 2;

        // Clear canvas
        ctx.clearRect(0, 0, cw, ch);

        // Draw the image scaled & offset so crop box is the visible window
        const drawW = cropSourceImg.width * cropZoom;
        const drawH = cropSourceImg.height * cropZoom;
        const imgX = cropBoxX - cropOffsetX * cropZoom;
        const imgY = cropBoxY - cropOffsetY * cropZoom;
        ctx.drawImage(cropSourceImg, imgX, imgY, drawW, drawH);

        // Dark overlay outside crop box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        // Top
        ctx.fillRect(0, 0, cw, cropBoxY);
        // Bottom
        ctx.fillRect(0, cropBoxY + cropBoxH, cw, ch - cropBoxY - cropBoxH);
        // Left
        ctx.fillRect(0, cropBoxY, cropBoxX, cropBoxH);
        // Right
        ctx.fillRect(cropBoxX + cropBoxW, cropBoxY, cw - cropBoxX - cropBoxW, cropBoxH);

        // Crop box border
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropBoxX, cropBoxY, cropBoxW, cropBoxH);

        // Grid lines (rule of thirds)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 3; i++) {
            // Vertical
            const gx = cropBoxX + (cropBoxW / 3) * i;
            ctx.beginPath(); ctx.moveTo(gx, cropBoxY); ctx.lineTo(gx, cropBoxY + cropBoxH); ctx.stroke();
            // Horizontal
            const gy = cropBoxY + (cropBoxH / 3) * i;
            ctx.beginPath(); ctx.moveTo(cropBoxX, gy); ctx.lineTo(cropBoxX + cropBoxW, gy); ctx.stroke();
        }

        // Size label
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(cropBoxX, cropBoxY + cropBoxH - 22, 90, 22);
        ctx.fillStyle = '#fff';
        ctx.font = '11px sans-serif';
        ctx.fillText(`${OUTPUT_W} × ${OUTPUT_H}`, cropBoxX + 6, cropBoxY + cropBoxH - 7);
    }

    function getCroppedDataURL() {
        if (!cropSourceImg) return null;
        const canvas = document.getElementById('crop-canvas');
        const cw = canvas.width;
        const cropBoxW = cw * 0.95;
        const cropBoxH = cropBoxW / CROP_ASPECT;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = OUTPUT_W;
        outCanvas.height = OUTPUT_H;
        const outCtx = outCanvas.getContext('2d');
        
        // Background fill for space outside image bounds
        outCtx.fillStyle = '#0a1410'; 
        outCtx.fillRect(0, 0, OUTPUT_W, OUTPUT_H);

        const scale = OUTPUT_W / cropBoxW;
        const drawW = cropSourceImg.width * cropZoom * scale;
        const drawH = cropSourceImg.height * cropZoom * scale;
        
        const dx = -cropOffsetX * cropZoom * scale;
        const dy = -cropOffsetY * cropZoom * scale;

        outCtx.drawImage(cropSourceImg, dx, dy, drawW, drawH);
        return outCanvas.toDataURL('image/jpeg', 0.85);
    }

    // --- Mouse/Touch drag on canvas ---
    function setupCropInteractions() {
        const canvas = document.getElementById('crop-canvas');
        const zoomSlider = document.getElementById('crop-zoom');
        const zoomLabel = document.getElementById('crop-zoom-label');
        if (!canvas) return;

        // Pointer events for drag
        const startDrag = (clientX, clientY) => {
            cropDragging = true;
            cropDragStartX = clientX;
            cropDragStartY = clientY;
            cropStartOffX = cropOffsetX;
            cropStartOffY = cropOffsetY;
            canvas.style.cursor = 'grabbing';
        };
        const moveDrag = (clientX, clientY) => {
            if (!cropDragging) return;
            const dx = clientX - cropDragStartX;
            const dy = clientY - cropDragStartY;
            cropOffsetX = cropStartOffX - dx / cropZoom;
            cropOffsetY = cropStartOffY - dy / cropZoom;
            clampOffset();
            drawCropCanvas();
        };
        const endDrag = () => {
            cropDragging = false;
            canvas.style.cursor = 'move';
        };

        canvas.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
        window.addEventListener('mousemove', (e) => { moveDrag(e.clientX, e.clientY); });
        window.addEventListener('mouseup', endDrag);

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                moveDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
        canvas.addEventListener('touchend', endDrag);

        // Zoom slider
        if (zoomSlider) {
            zoomSlider.addEventListener('input', () => {
                const pct = parseInt(zoomSlider.value, 10);
                cropZoom = pct / 100;
                if (zoomLabel) zoomLabel.textContent = pct + '%';
                clampOffset();
                drawCropCanvas();
            });
        }

        // Mouse wheel zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -5 : 5;
            const minVal = parseInt(zoomSlider.min, 10) || 10;
            const maxVal = parseInt(zoomSlider.max, 10) || 200;
            let pct = Math.round(cropZoom * 100) + delta;
            pct = Math.max(minVal, Math.min(maxVal, pct));
            cropZoom = pct / 100;
            if (zoomSlider) zoomSlider.value = pct;
            if (zoomLabel) zoomLabel.textContent = pct + '%';
            clampOffset();
            drawCropCanvas();
        }, { passive: false });
    }

    function clampOffset() {
        if (!cropSourceImg) return;
        const canvas = document.getElementById('crop-canvas');
        const cw = canvas.width;
        const cropBoxW = cw * 0.95;
        const cropBoxH = cropBoxW / CROP_ASPECT;
        
        const scaledW = cropSourceImg.width * cropZoom;
        const scaledH = cropSourceImg.height * cropZoom;
        
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        
        if (scaledW >= cropBoxW) {
            maxX = (scaledW - cropBoxW) / cropZoom;
        } else {
            minX = maxX = (scaledW - cropBoxW) / 2 / cropZoom;
        }
        
        if (scaledH >= cropBoxH) {
            maxY = (scaledH - cropBoxH) / cropZoom;
        } else {
            minY = maxY = (scaledH - cropBoxH) / 2 / cropZoom;
        }
        
        cropOffsetX = Math.max(minX, Math.min(cropOffsetX, maxX));
        cropOffsetY = Math.max(minY, Math.min(cropOffsetY, maxY));
    }

    function closeCropModal() {
        const modal = document.getElementById('modal-crop-banner');
        if (modal) modal.classList.add('hidden');
        cropSourceImg = null;
    }

    // --- Wire up events ---
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                openCropModal(ev.target.result);
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        });
    }

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if(confirm('Hapus foto background banner?')) {
                bannerImages = [];
                localStorage.removeItem('dxtapremi_banner_bgs');
                renderBanner();
                syncBannerToSupabase();
                showToast('Foto background berhasil dihapus.');
            }
        });
    }

    // Crop modal buttons
    const btnCropSave = document.getElementById('btn-crop-save');
    const btnCropCancel = document.getElementById('btn-crop-cancel');
    const btnCloseCrop = document.getElementById('btn-close-crop');

    if (btnCropSave) {
        btnCropSave.addEventListener('click', () => {
            const croppedData = getCroppedDataURL();
            if (!croppedData) { closeCropModal(); return; }
            
            if (bannerImages.length >= 10) {
                showToast('Maksimal 10 foto. Hapus foto lama terlebih dahulu.', true);
                closeCropModal();
                return;
            }

            bannerImages.push(croppedData);
            try {
                localStorage.setItem('dxtapremi_banner_bgs', JSON.stringify(bannerImages));
                renderBanner();
                syncBannerToSupabase();
                showToast('Foto banner berhasil ditambahkan.');
            } catch(err) {
                bannerImages.pop();
                showToast('Gagal menyimpan foto. Storage penuh, coba resolusi lebih kecil.', true);
            }
            closeCropModal();
        });
    }

    if (btnCropCancel) btnCropCancel.addEventListener('click', closeCropModal);
    if (btnCloseCrop) btnCloseCrop.addEventListener('click', closeCropModal);

    setupCropInteractions();
    loadBannerImages();
}

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initBannerUploader();

    // Auto uppercase for all text inputs
    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || !e.target.type)) {
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            e.target.value = e.target.value.toUpperCase();
            if (start !== null) {
                e.target.setSelectionRange(start, end);
            }
        }
    });

    // Load custom employees from localStorage first (fast), then sync with Supabase
    loadCustomEmployees();

    // Icons initialization
    lucide.createIcons();

    // Set default date to today (local timezone)
    const dateInput = document.getElementById('input-tanggal');
    if (dateInput) {
        dateInput.value = getLocalToday();

        // Auto update rates on date change if it's Sunday
        dateInput.addEventListener('change', (e) => {
            const dateVal = e.target.value;
            if (!dateVal) return;

            const parts = dateVal.split('-');
            const selectedDate = new Date(+parts[0], +parts[1] - 1, +parts[2]);
            const isSunday = selectedDate.getDay() === 0;

            if (isSunday) {
                state.rates['dump-truck'].driver = 21000;
                state.rates['dump-truck'].loader = 65000;
            } else {
                state.rates['dump-truck'].driver = 17000;
                state.rates['dump-truck'].loader = 55000;
            }

            // Update UI rates inputs if dump-truck active
            if (state.activeCategory === 'dump-truck') {
                customizeFormUI('dump-truck');
            }
        });

        // Trigger change event to set initial rates based on today's day
        dateInput.dispatchEvent(new Event('change'));
    }

    // Bind Event Listeners
    initTheme();
    initNavigation();
    initAccordion();
    initDrivers();
    initLoaders();
    initLiveCalculations();
    initFormSubmit();
    initHistoryTabs();
    initExcelExport();
    initEmployeeModal();
    initAuth();
    initCekPenghasilan();
    initOwnerDeleteModal();
    initOwnerReport();
    updatePeriodLabel();

    // Bind refresh button
    const btnRefresh = document.getElementById('btn-refresh-data');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            loadRecords(true);
        });
    }

    // Load records from localStorage / Supabase
    loadRecords();

    // Sync employees from Supabase online database
    loadEmployeesFromSupabase();
});

// Theme Management
function initTheme() {
    const btnToggle = document.getElementById('btn-theme-toggle');
    const localTheme = localStorage.getItem('theme') || 'dark';

    state.theme = localTheme;
    if (state.theme === 'light') {
        document.body.classList.add('light-theme');
        btnToggle.innerHTML = '<i data-lucide="moon"></i>';
    } else {
        document.body.classList.remove('light-theme');
        btnToggle.innerHTML = '<i data-lucide="sun"></i>';
    }
    lucide.createIcons();

    btnToggle.addEventListener('click', () => {
        if (state.theme === 'dark') {
            state.theme = 'light';
            document.body.classList.add('light-theme');
            btnToggle.innerHTML = '<i data-lucide="moon"></i>';
        } else {
            state.theme = 'dark';
            document.body.classList.remove('light-theme');
            btnToggle.innerHTML = '<i data-lucide="sun"></i>';
        }
        localStorage.setItem('theme', state.theme);
        lucide.createIcons();
        showToast('Tema diubah ke ' + (state.theme === 'dark' ? 'Dark Mode' : 'Light Mode'));
    });
}

// Navigation (Menu Dashboard <-> Form)
function initNavigation() {
    const menuUtama = document.getElementById('menu-utama');
    const formSection = document.getElementById('form-section');
    const btnBack = document.getElementById('btn-back-to-menu');

    const cardDT = document.getElementById('card-dump-truck');
    const cardTR = document.getElementById('card-tractor');
    const cardKB = document.getElementById('card-ketek-brondolan');

    const openForm = (category) => {
        if (!currentUser) {
            return;
        }

        state.activeCategory = category;
        document.getElementById('active-category').value = category;

        // UI Customization based on Category
        customizeFormUI(category);

        // Reset dynamic elements in form
        resetFormInputs();

        // Hide dashboard, show form
        menuUtama.classList.add('hidden');
        formSection.classList.remove('hidden');

        // Scroll to form
        formSection.scrollIntoView({ behavior: 'smooth' });
    };

    cardDT.addEventListener('click', () => openForm('dump-truck'));
    cardTR.addEventListener('click', () => openForm('tractor'));
    cardKB.addEventListener('click', () => openForm('brondolan'));

    btnBack.addEventListener('click', () => {
        state.activeCategory = '';
        state.editingRecordId = null;
        exitEditMode();
        formSection.classList.add('hidden');
        menuUtama.classList.remove('hidden');
        resetPreview();
    });
}

// Accordion for Rate Settings
function initAccordion() {
    const trigger = document.getElementById('btn-toggle-rates');
    const content = document.getElementById('rates-settings-content');
    const chevron = trigger.querySelector('.chevron-icon');

    trigger.addEventListener('click', () => {
        content.classList.toggle('hidden');
        chevron.classList.toggle('rotate');
    });
}

// Customize Labels & Rate inputs dynamically based on category
function customizeFormUI(category) {
    const formTitle = document.getElementById('form-title');
    const labelVehicle = document.getElementById('label-vehicle');
    const inputVehicle = document.getElementById('input-vehicle');
    const labelTonnage = document.getElementById('label-tonnage');
    const inputTonnage = document.getElementById('input-tonnage');
    const spanTonnageUnit = document.getElementById('span-tonnage-unit');
    const ratesContainer = document.getElementById('rates-inputs-container');
    const titleDriverSection = document.getElementById('title-driver-section');
    const titleLoadersSection = document.getElementById('title-loaders-section');

    // Set Rates Inputs in setting accordion
    const ratesObj = state.rates[category];
    let ratesHTML = '';

    const groupCarType = document.getElementById('group-car-type');
    if (category === 'dump-truck') {
        if (groupCarType) groupCarType.classList.remove('hidden');
        formTitle.textContent = "Input Loading Bak Mati / Dump Truck";
        labelVehicle.textContent = "No. Polisi Dump Truck";
        inputVehicle.placeholder = "BK 8241 XY";
        labelTonnage.textContent = "Tonase Driver (Otomatis)";
        inputTonnage.placeholder = "0.000";
        inputTonnage.disabled = true;
        spanTonnageUnit.textContent = "Ton";
        titleDriverSection.textContent = "Data Supir";
        titleLoadersSection.textContent = "Data Pekerja Pemuat";

        ratesHTML = `
            <div class="form-group">
                <label>Tarif Supir (Rp/Ton)</label>
                <input type="number" id="rate-driver" value="${ratesObj.driver}" min="0">
            </div>
            <div class="form-group">
                <label>Tarif Pemuat (Rp/Ton)</label>
                <input type="number" id="rate-loader" value="${ratesObj.loader}" min="0">
            </div>
        `;
        // Show Potongan Ton Supir field for dump-truck
        const gpHK = document.getElementById('group-potongan-hk');
        if (gpHK) gpHK.classList.remove('hidden');
        const lblHK = document.getElementById('label-potongan-hk');
        if (lblHK) lblHK.firstChild.textContent = 'Potongan Driver ';
        const lblHKSub = document.getElementById('label-potongan-hk-sub');
        if (lblHKSub) lblHKSub.textContent = '(Opsional — dikurangi dari tonase driver)';
        // Show Tonase & Potongan Pemuat section
        const gpPemuat = document.getElementById('group-tonase-pemuat');
        if (gpPemuat) {
            gpPemuat.classList.remove('hidden');
            const lblTonnagePemuat = document.getElementById('label-tonnage-pemuat');
            if (lblTonnagePemuat) lblTonnagePemuat.firstChild.textContent = 'Tonase Loading Truck atau Damp Total ';
            const lblPotonganPemuat = document.getElementById('label-potongan-pemuat');
            if (lblPotonganPemuat) lblPotonganPemuat.firstChild.textContent = 'Potongan HK ';
        }
    } else if (category === 'tractor') {
        if (groupCarType) groupCarType.classList.add('hidden');
        formTitle.textContent = "Input Loading Traktor / Operator";
        labelVehicle.textContent = "No. Lambung Traktor";
        inputVehicle.placeholder = "TR-04";
        labelTonnage.textContent = "Total Tonase Kelompok (Manual / Otomatis dari Janjang × BJR)";
        inputTonnage.placeholder = "0.000";
        inputTonnage.disabled = false; // Operator opsional — bisa input manual
        spanTonnageUnit.textContent = "Ton";
        titleDriverSection.textContent = "Data Operator (Opsional — Field, Janjang & Tonase)";
        titleLoadersSection.textContent = "Data Pekerja Pemuat Traktor";

        ratesHTML = `
            <div class="form-group">
                <label>Tarif Operator (Rp/Ton)</label>
                <input type="number" id="rate-driver" value="${ratesObj.driver}" min="0">
            </div>
            <div class="form-group">
                <label>Tarif Pemuat (Rp/Ton)</label>
                <input type="number" id="rate-loader" value="${ratesObj.loader}" min="0">
            </div>
        `;
        // Show group tractor calc
        const gtc = document.getElementById('group-tractor-calc');
        if (gtc) {
            gtc.classList.remove('hidden');
            const fieldSelect = document.getElementById('main-tractor-field');
            if (fieldSelect.options.length <= 1) {
                const fieldOptions = FIELD_BJR.map(f =>
                    `<option value="${f.field}" data-bjr="${f.bjr}">${f.field} (BJR: ${f.bjr} Kg)</option>`
                ).join('');
                fieldSelect.innerHTML = `<option value="" disabled selected>Pilih Field</option>${fieldOptions}`;
                
                // Add event listeners for calc
                const janjangInput = document.getElementById('main-tractor-janjang');
                const bjrInput = document.getElementById('main-tractor-bjr');
                const tonInput = document.getElementById('input-tonnage');
                
                const calcTractorTonnage = () => {
                    const selectedOption = fieldSelect.options[fieldSelect.selectedIndex];
                    const bjr = parseFloat(selectedOption ? selectedOption.getAttribute('data-bjr') : 0) || 0;
                    const janjang = parseFloat(janjangInput.value) || 0;
                    bjrInput.value = bjr.toFixed(2);
                    const tonase = (janjang * bjr) / 1000;
                    tonInput.value = tonase.toFixed(3);
                    updateLiveCalculations();
                };
                
                fieldSelect.addEventListener('change', calcTractorTonnage);
                janjangInput.addEventListener('input', calcTractorTonnage);
            }
        }
        
        // Show Potongan HK; tonnage editable (operators optional)
        const gpHK2 = document.getElementById('group-potongan-hk');
        if (gpHK2) gpHK2.classList.remove('hidden');
        const lblHK2 = document.getElementById('label-potongan-hk');
        if (lblHK2) lblHK2.firstChild.textContent = 'Potongan HK ';
        const lblHK2Sub = document.getElementById('label-potongan-hk-sub');
        if (lblHK2Sub) lblHK2Sub.textContent = '(Opsional — ton yang dikurangi untuk premi pemuat)';
        // Hide Tonase Pemuat section (tractor uses single tonnage)
        const gpPemuat2 = document.getElementById('group-tonase-pemuat');
        if (gpPemuat2) gpPemuat2.classList.add('hidden');
    } else if (category === 'brondolan') {
        if (groupCarType) groupCarType.classList.add('hidden');
        formTitle.textContent = "Input Ketek Brondolan";
        labelVehicle.textContent = "Keterangan / Lokasi";
        inputVehicle.placeholder = "Blok / Area brondolan";
        labelTonnage.textContent = "Total KG Kelompok (Otomatis)";
        inputTonnage.placeholder = "0";
        spanTonnageUnit.textContent = "KG";

        // Hide the entire driver section for brondolan - not needed
        document.getElementById('drivers-section').classList.add('hidden');
        // Hide Potongan HK field for brondolan
        const gpHK3 = document.getElementById('group-potongan-hk');
        if (gpHK3) gpHK3.classList.add('hidden');
        // Hide Tonase Pemuat section for brondolan
        const gpPemuat3 = document.getElementById('group-tonase-pemuat');
        if (gpPemuat3) gpPemuat3.classList.add('hidden');

        titleLoadersSection.textContent = "Data Pekerja Brondolan & Jumlah KG";

        ratesHTML = `
            <div class="form-group">
                <label>Tarif per KG (Rp/KG)</label>
                <input type="number" id="rate-kg" value="${ratesObj.kg}" min="0">
            </div>
        `;
    }

    ratesContainer.innerHTML = ratesHTML;

    // Attach listeners to rate inputs to update state in real-time
    const rateDriverInput = document.getElementById('rate-driver');
    const rateLoaderInput = document.getElementById('rate-loader');
    const rateKgInput = document.getElementById('rate-kg');

    if (rateDriverInput) {
        rateDriverInput.addEventListener('input', (e) => {
            state.rates[category].driver = parseFloat(e.target.value) || 0;
        });
    }
    if (rateLoaderInput) {
        rateLoaderInput.addEventListener('input', (e) => {
            state.rates[category].loader = parseFloat(e.target.value) || 0;
        });
    }
    if (rateKgInput) {
        rateKgInput.addEventListener('input', (e) => {
            state.rates[category].kg = parseFloat(e.target.value) || 0;
        });
    }
    updateLiveCalculations();
}

// Reset form elements
function resetFormInputs() {
    const form = document.getElementById('premi-input-form');
    form.reset();

    // Reset date to today (local timezone)
    const dateInput = document.getElementById('input-tanggal');
    dateInput.value = getLocalToday();
    dateInput.dispatchEvent(new Event('change'));

    // Handle drivers section visibility based on category
    const driversSection = document.getElementById('drivers-section');
    if (state.activeCategory === 'brondolan') {
        // Brondolan: hide entire driver section
        driversSection.classList.add('hidden');
    } else {
        // Other categories: show driver section
        driversSection.classList.remove('hidden');
        // Clear drivers container
        document.getElementById('drivers-list-container').innerHTML = '';
        // Dump truck: always add 1 initial driver row; tractor: operators are optional
        if (state.activeCategory === 'dump-truck') {
            addDriverRow();
        }
    }

    // Clear loaders container
    document.getElementById('loaders-list-container').innerHTML = '';

    // Add one initial empty loader row
    addLoaderRow();

    // Clear Tonase/Potongan Pemuat fields (dump truck only)
    const tpEl = document.getElementById('input-tonnage-pemuat');
    if (tpEl) tpEl.value = '';
    const ppEl = document.getElementById('input-potongan-pemuat');
    if (ppEl) ppEl.value = '';

    // Reset preview
    resetPreview();

    // Hide and clear live calculations
    const liveDriver = document.getElementById('live-driver-calc');
    if (liveDriver) {
        liveDriver.innerHTML = '';
        liveDriver.classList.add('hidden');
    }
    const liveLoader = document.getElementById('live-loader-calc');
    if (liveLoader) {
        liveLoader.innerHTML = '';
        liveLoader.classList.add('hidden');
    }
    
    // Hide and reset group-tractor-calc
    const gtc = document.getElementById('group-tractor-calc');
    if (gtc) {
        if (state.activeCategory !== 'tractor') {
            gtc.classList.add('hidden');
        }
        const fieldSelect = document.getElementById('main-tractor-field');
        if (fieldSelect) fieldSelect.value = '';
        const janjangInput = document.getElementById('main-tractor-janjang');
        if (janjangInput) janjangInput.value = '';
        const bjrInput = document.getElementById('main-tractor-bjr');
        if (bjrInput) bjrInput.value = '';
    }
}

// Reset preview card
function resetPreview() {
    document.getElementById('preview-empty').classList.remove('hidden');
    document.getElementById('preview-result').classList.add('hidden');
}

// Autocomplete Search Logic for Drivers/Operators (Dynamic Rows)
function initDrivers() {
    const btnAdd = document.getElementById('btn-add-driver');
    btnAdd.addEventListener('click', () => {
        addDriverRow();
    });
}

function addDriverRow() {
    const container = document.getElementById('drivers-list-container');
    const rowId = 'driver-row-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const category = state.activeCategory;

    const row = document.createElement('div');
    row.className = category === 'tractor' ? 'loader-row tractor-operator-row' : 'loader-row';
    row.id = rowId;

    let tonnageInputHTML = '';
    if (category === 'dump-truck') {
        tonnageInputHTML = `
            <div class="form-group flex-1">
                <label>Tonase (Ton)</label>
                <div class="input-with-suffix">
                    <input type="number" class="driver-tonnage" step="0.001" min="0" placeholder="0.000" required>
                    <span class="input-suffix">Ton</span>
                </div>
            </div>
        `;
    } else if (category === 'tractor') {
        tonnageInputHTML = ``; // No individual tonnage inputs for tractor operators
    }

    const roleLabel = category === 'tractor' ? 'Operator' : 'Supir';
    row.innerHTML = `
        <div class="form-group flex-2 autocomplete-container">
            <label>Nama ${roleLabel}</label>
            <div class="input-with-icon">
                <i data-lucide="user" class="input-icon"></i>
                <input type="text" class="autocomplete-input driver-name-input" placeholder="Cari nama ${roleLabel.toLowerCase()}..." required>
            </div>
            <input type="hidden" class="driver-nik-val">
            <div class="autocomplete-dropdown hidden driver-dropdown"></div>
            <div class="selected-worker-badge hidden driver-badge">
                NIK: <span class="badge-nik">-</span>
                <button type="button" class="btn-clear-badge btn-clear-driver-badge">&times;</button>
            </div>
        </div>
        ${tonnageInputHTML}
        <button type="button" class="btn-remove-row btn-remove-driver-row" title="Hapus ${roleLabel}">
            <i data-lucide="trash"></i>
        </button>
    `;

    container.appendChild(row);
    lucide.createIcons();

    bindDriverRowEvents(row);

    // If dump-truck, bind tonnage input change to total
    if (category === 'dump-truck') {
        const tonnageInput = row.querySelector('.driver-tonnage');
        tonnageInput.addEventListener('input', () => {
            calculateTotalDriverTonnage();
        });
    }

    // If tractor, no individual events needed for tonnage since it's removed
}

function calculateTotalDriverTonnage() {
    const tonnageInputs = document.querySelectorAll('.driver-tonnage');
    let total = 0;
    tonnageInputs.forEach(input => {
        let val = parseFloat(input.value) || 0;
        if (state.activeCategory === 'dump-truck' && val > 100) {
            val = val / 1000;
        }
        total += val;
    });
    document.getElementById('input-tonnage').value = Number(total.toFixed(3));
    updateLiveCalculations();
}

function bindDriverRowEvents(row) {
    const input = row.querySelector('.driver-name-input');
    const dropdown = row.querySelector('.driver-dropdown');
    const badge = row.querySelector('.driver-badge');
    const hiddenNik = row.querySelector('.driver-nik-val');
    const btnClear = row.querySelector('.btn-clear-driver-badge');
    const btnRemove = row.querySelector('.btn-remove-driver-row');

    input.addEventListener('input', (e) => {
        const value = e.target.value.trim().toUpperCase();
        if (!value) {
            dropdown.innerHTML = '';
            dropdown.classList.add('hidden');
            return;
        }

        const matches = EMPLOYEE_DB.filter(emp => emp.name.includes(value));
        renderDropdownItems(matches, dropdown, (selectedEmp) => {
            input.value = selectedEmp.name;
            input.disabled = true;
            hiddenNik.value = selectedEmp.nik;

            badge.querySelector('.badge-nik').textContent = selectedEmp.nik;
            badge.classList.remove('hidden');
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
        });
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 200);
    });

    btnClear.addEventListener('click', () => {
        input.value = '';
        input.disabled = false;
        hiddenNik.value = '';
        badge.classList.add('hidden');
        input.focus();
    });

    btnRemove.addEventListener('click', () => {
        const container = document.getElementById('drivers-list-container');
        if (container.children.length > 1) {
            row.remove();
            if (state.activeCategory === 'dump-truck' || state.activeCategory === 'tractor') {
                calculateTotalDriverTonnage();
            }
        } else {
            const role = state.activeCategory === 'tractor' ? 'operator' : 'supir';
            showToast(`Minimal harus ada 1 ${role}.`, true);
        }
    });
}

// Render dropdown result items
function renderDropdownItems(items, dropdownElement, onSelectCallback) {
    dropdownElement.innerHTML = '';

    if (items.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'autocomplete-item';
        emptyItem.style.color = 'var(--text-muted)';
        emptyItem.textContent = 'Pekerja tidak ditemukan';
        dropdownElement.appendChild(emptyItem);
        dropdownElement.classList.remove('hidden');
        return;
    }

    items.slice(0, 5).forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const nikSpan = document.createElement('span');
        nikSpan.className = 'item-nik';
        nikSpan.textContent = item.nik;

        div.appendChild(nameSpan);
        div.appendChild(nikSpan);

        div.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent blur from hiding dropdown before selection
            onSelectCallback(item);
        });

        dropdownElement.appendChild(div);
    });

    dropdownElement.classList.remove('hidden');
}

// Loaders Rows Management
function initLoaders() {
    const btnAdd = document.getElementById('btn-add-loader');

    btnAdd.addEventListener('click', () => {
        addLoaderRow();
    });
}

function addLoaderRow() {
    const container = document.getElementById('loaders-list-container');
    const rowId = 'loader-row-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const category = state.activeCategory;

    const row = document.createElement('div');
    row.className = 'loader-row';
    row.id = rowId;

    let kgInputHTML = '';
    // If brondolan, loader has KG input
    if (category === 'brondolan') {
        kgInputHTML = `
            <div class="form-group flex-1">
                <label>Jumlah KG</label>
                <div class="input-with-suffix">
                    <input type="number" class="loader-kg" min="0" placeholder="0" required>
                    <span class="input-suffix">Kg</span>
                </div>
            </div>
        `;
    }

    row.innerHTML = `
        <div class="form-group flex-2 autocomplete-container">
            <label>Nama Pekerja</label>
            <div class="input-with-icon">
                <i data-lucide="user" class="input-icon"></i>
                <input type="text" class="autocomplete-input loader-name-input" placeholder="Cari nama pekerja..." required>
            </div>
            <input type="hidden" class="loader-nik-val">
            <div class="autocomplete-dropdown hidden loader-dropdown"></div>
            <div class="selected-worker-badge hidden loader-badge">
                NIK: <span class="badge-nik">-</span>
                <button type="button" class="btn-clear-badge btn-clear-loader-badge">&times;</button>
            </div>
        </div>
        ${kgInputHTML}
        <button type="button" class="btn-remove-row" title="Hapus Pemuat">
            <i data-lucide="trash"></i>
        </button>
    `;

    container.appendChild(row);
    lucide.createIcons();

    // Bind Autocomplete and Delete logic for this new row
    bindLoaderRowEvents(row);

    // If brondolan, register listener on KG input to recalculate total KG automatically
    if (category === 'brondolan') {
        const kgInput = row.querySelector('.loader-kg');
        kgInput.addEventListener('input', () => {
            calculateTotalBrondolanKg();
        });
    }
}

// Calculate sum of loaders KG (for Brondolan only)
function calculateTotalBrondolanKg() {
    const kgInputs = document.querySelectorAll('.loader-kg');
    let totalKg = 0;
    kgInputs.forEach(input => {
        totalKg += parseFloat(input.value) || 0;
    });
    document.getElementById('input-tonnage').value = totalKg;
}

// Bind events on a loader row
function bindLoaderRowEvents(row) {
    const input = row.querySelector('.loader-name-input');
    const dropdown = row.querySelector('.loader-dropdown');
    const badge = row.querySelector('.loader-badge');
    const hiddenNik = row.querySelector('.loader-nik-val');
    const btnClear = row.querySelector('.btn-clear-loader-badge');
    const btnRemove = row.querySelector('.btn-remove-row');

    // Autocomplete search input
    input.addEventListener('input', (e) => {
        const value = e.target.value.trim().toUpperCase();
        if (!value) {
            dropdown.innerHTML = '';
            dropdown.classList.add('hidden');
            return;
        }

        const matches = EMPLOYEE_DB.filter(emp => emp.name.includes(value));
        renderDropdownItems(matches, dropdown, (selectedEmp) => {
            input.value = selectedEmp.name;
            input.disabled = true;
            hiddenNik.value = selectedEmp.nik;

            badge.querySelector('.badge-nik').textContent = selectedEmp.nik;
            badge.classList.remove('hidden');
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
        });
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 200);
    });

    // Clear badge button
    btnClear.addEventListener('click', () => {
        input.value = '';
        input.disabled = false;
        hiddenNik.value = '';
        badge.classList.add('hidden');
        input.focus();
    });

    // Remove row button
    btnRemove.addEventListener('click', () => {
        const container = document.getElementById('loaders-list-container');
        // Ensure at least 1 row remains
        if (container.children.length > 1) {
            row.remove();
            if (state.activeCategory === 'brondolan') {
                calculateTotalBrondolanKg();
            }
            setTimeout(updateLiveCalculations, 50);
        } else {
            showToast('Minimal harus ada 1 pekerja pemuat / pengumpul.', true);
        }
    });
}

// Live calculation preview logic
function initLiveCalculations() {
    const inputs = [
        'input-potongan-hk',
        'input-tonnage-pemuat',
        'input-potongan-pemuat'
    ];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                updateLiveCalculations();
            });
        }
    });

    const btnAddLoader = document.getElementById('btn-add-loader');
    if (btnAddLoader) {
        btnAddLoader.addEventListener('click', () => {
            setTimeout(updateLiveCalculations, 50);
        });
    }

    const loadersList = document.getElementById('loaders-list-container');
    if (loadersList) {
        loadersList.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove-row') || e.target.closest('.btn-clear-loader-badge')) {
                setTimeout(updateLiveCalculations, 50);
            }
        });
    }
}

function updateLiveCalculations() {
    const category = state.activeCategory;
    const liveDriver = document.getElementById('live-driver-calc');
    const liveLoader = document.getElementById('live-loader-calc');

    if (!liveDriver || !liveLoader) return;

    if (category === 'dump-truck') {
        // Driver live calculation
        const totalTonnage = parseFloat(document.getElementById('input-tonnage').value) || 0;
        const potonganDriver = parseFloat(document.getElementById('input-potongan-hk').value) || 0;
        const driverEff = Math.max(0, totalTonnage - potonganDriver);

        if (totalTonnage > 0 || potonganDriver > 0) {
            liveDriver.innerHTML = `
                <i data-lucide="calculator" style="width: 14px; height: 14px;"></i>
                <span>Tonase Driver (${totalTonnage.toFixed(3)} Ton) - Potongan Driver (${potonganDriver.toFixed(3)} Ton) = <strong>Efektif: ${driverEff.toFixed(3)} Ton</strong></span>
            `;
            liveDriver.classList.remove('hidden');
        } else {
            liveDriver.classList.add('hidden');
        }

        // Loader live calculation
        let tonasePemuat = parseFloat(document.getElementById('input-tonnage-pemuat').value) || 0;
        if (tonasePemuat > 100) {
            tonasePemuat = tonasePemuat / 1000;
        }
        const potonganHK = parseFloat(document.getElementById('input-potongan-pemuat').value) || 0;
        const loaderEff = Math.max(0, tonasePemuat - potonganHK);
        const loaderCount = document.querySelectorAll('#loaders-list-container .loader-row').length || 1;

        if (tonasePemuat > 0 || potonganHK > 0) {
            liveLoader.innerHTML = `
                <i data-lucide="calculator" style="width: 14px; height: 14px;"></i>
                <span>Total (${tonasePemuat.toFixed(3)} Ton) - Potongan HK (${potonganHK.toFixed(3)} Ton) = <strong>Efektif: ${loaderEff.toFixed(3)} Ton</strong> <small style="margin-left: 0.25rem; font-weight: 400; color: var(--text-muted)">(${loaderEff.toFixed(3)} Ton ÷ ${loaderCount} orang = ${(loaderEff / loaderCount).toFixed(3)} Ton/org)</small></span>
            `;
            liveLoader.classList.remove('hidden');
        } else {
            liveLoader.classList.add('hidden');
        }
    } else if (category === 'tractor') {
        liveDriver.classList.add('hidden');
        
        const totalTonnage = parseFloat(document.getElementById('input-tonnage').value) || 0;
        const potonganHK = parseFloat(document.getElementById('input-potongan-hk').value) || 0;
        const loaderEff = Math.max(0, totalTonnage - potonganHK);
        const loaderCount = document.querySelectorAll('#loaders-list-container .loader-row').length || 1;

        if (totalTonnage > 0 || potonganHK > 0) {
            liveLoader.innerHTML = `
                <i data-lucide="calculator" style="width: 14px; height: 14px;"></i>
                <span>Tonase Traktor (${totalTonnage.toFixed(3)} Ton) - Potongan HK (${potonganHK.toFixed(3)} Ton) = <strong>Efektif Pemuat: ${loaderEff.toFixed(3)} Ton</strong> <small style="margin-left: 0.25rem; font-weight: 400; color: var(--text-muted)">(${loaderEff.toFixed(3)} Ton ÷ ${loaderCount} orang = ${(loaderEff / loaderCount).toFixed(3)} Ton/org)</small></span>
            `;
            liveLoader.classList.remove('hidden');
        } else {
            liveLoader.classList.add('hidden');
        }
    } else {
        liveDriver.classList.add('hidden');
        liveLoader.classList.add('hidden');
    }
    lucide.createIcons();
}

// Calculation logic
function calculateCurrentPremi() {
    const category = state.activeCategory;
    const date = document.getElementById('input-tanggal').value;
    const division = document.getElementById('input-divisi').value;
    const vehicle = document.getElementById('input-vehicle').value;

    // Get drivers list (skip for brondolan - no drivers needed)
    const driversList = [];
    let isDriversValid = true;

    if (category !== 'brondolan') {
        const driverRows = document.querySelectorAll('#drivers-list-container .loader-row');

        driverRows.forEach(row => {
            const dName = row.querySelector('.driver-name-input').value.trim();
            const dNik = row.querySelector('.driver-nik-val').value;

            if (!dName || !dNik) {
                isDriversValid = false;
                return;
            }

            let dTonnage = 0;
            if (category === 'dump-truck') {
                dTonnage = parseFloat(row.querySelector('.driver-tonnage').value) || 0;
                if (dTonnage > 100) {
                    dTonnage = dTonnage / 1000;
                }
            }

            driversList.push({
                name: dName,
                nik: dNik,
                tonnage: dTonnage,
                amount: 0
            });
        });

        // Dump truck: driver wajib; Tractor: operator opsional
        if (category === 'dump-truck' && (!isDriversValid || driversList.length === 0)) {
            showToast('Lengkapi data supir dump truck terlebih dahulu.', true);
            return null;
        }
        if (category === 'tractor' && !isDriversValid) {
            showToast('Lengkapi nama semua operator yang sudah ditambahkan.', true);
            return null;
        }
    }

    // Get loaders / workers list
    const loaderRows = document.querySelectorAll('#loaders-list-container .loader-row');
    const loadersList = [];
    let isLoadersValid = true;

    loaderRows.forEach(row => {
        const lName = row.querySelector('.autocomplete-input').value.trim();
        const lNik = row.querySelector('.loader-nik-val').value;

        if (!lName || !lNik) {
            isLoadersValid = false;
            return;
        }

        let lKg = 0;
        if (category === 'brondolan') {
            lKg = parseFloat(row.querySelector('.loader-kg').value) || 0;
        }

        loadersList.push({
            name: lName,
            nik: lNik,
            kg: lKg,
            amount: 0
        });
    });

    if (!isLoadersValid || loadersList.length === 0) {
        const label = category === 'brondolan' ? 'pekerja brondolan' : 'pemuat';
        showToast(`Lengkapi nama semua ${label} terlebih dahulu.`, true);
        return null;
    }

    let carType = '';
    if (category === 'dump-truck') {
        const selectCarType = document.getElementById('input-car-type');
        carType = selectCarType ? selectCarType.value : 'DUMP TRUCK';
    }

    // Compute Premiums
    const rates = state.rates[category];
    let totalTonnage = 0;

    // Baca Potongan HK / Potongan Supir
    const potonganEl = document.getElementById('input-potongan-hk');
    const potonganHK = (category !== 'brondolan' && potonganEl) ? (parseFloat(potonganEl.value) || 0) : 0;

    // Untuk dump-truck: baca juga Tonase Pemuat & Potongan Pemuat terpisah
    const tonasePemuatEl = document.getElementById('input-tonnage-pemuat');
    const potonganPemuatEl = document.getElementById('input-potongan-pemuat');
    let tonasePemuat = (category === 'dump-truck' && tonasePemuatEl) ? (parseFloat(tonasePemuatEl.value) || 0) : 0;
    if (category === 'dump-truck' && tonasePemuat > 100) {
        tonasePemuat = tonasePemuat / 1000;
    }
    const potonganPemuat = (category === 'dump-truck' && potonganPemuatEl) ? (parseFloat(potonganPemuatEl.value) || 0) : 0;

    let tractorField = '';
    let tractorJanjang = 0;

    if (category === 'dump-truck') {
        if (driversList.length > 0) {
            // Auto-hitung dari driver rows
            totalTonnage = driversList.reduce((acc, curr) => acc + curr.tonnage, 0);
        }
    } else if (category === 'tractor') {
        totalTonnage = parseFloat(document.getElementById('input-tonnage').value) || 0;
        const tf = document.getElementById('main-tractor-field');
        if (tf) tractorField = tf.value;
        const tj = document.getElementById('main-tractor-janjang');
        if (tj) tractorJanjang = parseFloat(tj.value) || 0;
        
        if (totalTonnage <= 0) {
            showToast('Masukkan field dan jumlah janjang untuk mendapatkan total tonase traktor.', true);
            return null;
        }
    }
    
    if (category === 'dump-truck') {
            // === SUPIR: efektif tonase setelah potongan supir (proporsional per supir) ===
            const potonganSupir = potonganHK; // input-potongan-hk dipakai utk supir di dump-truck
            driversList.forEach(driver => {
                if (carType === 'MOBIL KONTRAKTOR') {
                    driver.amount = 0;
                } else {
                    // Kurangi potongan proporsional dari tonase supir masing-masing
                    const effTonnage = totalTonnage > 0
                        ? Math.max(0, driver.tonnage - (driver.tonnage / totalTonnage) * potonganSupir)
                        : driver.tonnage;
                    driver.amount = Math.round(effTonnage * rates.driver);
                }
            });

            // === PEMUAT: menggunakan Tonase Pemuat TERPISAH ===
            const effectiveTonasePemuat = Math.max(0, tonasePemuat - potonganPemuat);
            if (loadersList.length > 0) {
                const perLoaderAmount = Math.round(effectiveTonasePemuat * rates.loader / loadersList.length);
                loadersList.forEach(loader => { loader.amount = perLoaderAmount; });
            }
        } else if (category === 'tractor') {
            // === TRACTOR: tonase tunggal (pakai potonganHK untuk pemuat) ===
            const effectiveTonnage = Math.max(0, totalTonnage - potonganHK);

            // Premi supir/operator berdasarkan tonase grup (sama rata atau penuh)
            driversList.forEach(driver => {
                driver.amount = Math.round(totalTonnage * rates.driver); // asumsikan operator dapat premi full berdasarkan tonase traktor
            });

            // Premi pemuat berdasarkan effectiveTonnage
            const perLoaderAmount = Math.round(effectiveTonnage * rates.loader / loadersList.length);
            loadersList.forEach(loader => { loader.amount = perLoaderAmount; });
        } else if (category === 'brondolan') {
        // Each worker: kg × Rp per KG
        let totalKg = 0;
        loadersList.forEach(loader => {
            loader.amount = Math.round(loader.kg * rates.kg);
            totalKg += loader.kg;
        });
        totalTonnage = totalKg; // Store total kg as tonnage field
    }

    const totalDriverAmount = driversList.reduce((acc, curr) => acc + curr.amount, 0);
    const totalLoaderAmount = loadersList.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPremiGrup = totalDriverAmount + totalLoaderAmount;

    return {
        id: 'rec_' + Date.now(),
        date,
        category,
        division,
        vehicle,
        carType,
        tractorField,
        tractorJanjang,
        tonnage: totalTonnage,
        tonnagePemuat: category === 'dump-truck' ? tonasePemuat : totalTonnage,
        potonganHK: category === 'dump-truck' ? potonganHK : potonganHK, // potonganHK = supir for DT, general for tractor
        potonganPemuat: category === 'dump-truck' ? potonganPemuat : 0,
        rates: { ...rates },
        drivers: driversList,
        loaders: loadersList,
        totalPremi: totalPremiGrup,
        createdBy: currentUser || 'Public'
    };
}

// Bind forms buttons
function initFormSubmit() {
    const btnCalc = document.getElementById('btn-calculate');
    const form = document.getElementById('premi-input-form');

    // "Hitung Premi" (Preview) button
    btnCalc.addEventListener('click', () => {
        const result = calculateCurrentPremi();
        if (result) {
            updatePreviewUI(result);
            showToast('Premi berhasil dihitung (simulasi).');
        }
    });

    // Form Submit (Save Record — New or Edit)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const result = calculateCurrentPremi();
        if (!result) return;

        const isEditing = !!state.editingRecordId;

        if (isEditing) {
            // UPDATE mode: replace existing record
            const oldId = state.editingRecordId;
            result.id = oldId; // Keep the same ID
            const idx = state.records.findIndex(r => r.id === oldId);
            if (idx > -1) {
                state.records[idx] = result;
            }
            state.editingRecordId = null;
            exitEditMode();
        } else {
            // CREATE mode: push new record
            state.records.push(result);
        }

        // Save to LocalStorage
        saveLocalRecords();

        // Update stats banner & history table
        updateStats();
        renderHistoryTable();

        // Reset form & go back to dashboard menu
        resetFormInputs();
        document.getElementById('btn-back-to-menu').click();

        // Sync to Supabase (Background)
        if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL") {
            try {
                if (isEditing) {
                    showToast('Memperbarui data online...');
                    await updateOnlineRecord(result);
                    showToast('Catatan premi berhasil diperbarui online!');
                } else {
                    showToast('Menyimpan ke database online...');
                    await insertOnlineRecord(result);
                    showToast('Catatan premi berhasil disimpan online!');
                }
            } catch (err) {
                console.error(err);
                showToast(isEditing ? 'Gagal memperbarui online. Tersimpan offline.' : 'Gagal menyimpan online. Tersimpan offline.', true);
            }
        } else {
            showToast(isEditing ? 'Catatan premi berhasil diperbarui (Offline)!' : 'Catatan premi berhasil disimpan (Offline)!');
        }
    });
}

// Update Preview visual card
function updatePreviewUI(data) {
    document.getElementById('preview-empty').classList.add('hidden');
    const prev = document.getElementById('preview-result');
    prev.classList.remove('hidden');

    // Set Text Details
    const catLabels = {
        'dump-truck': 'Loading Dump Truck',
        'tractor': 'Loading Traktor',
        'brondolan': 'Ketek Brondolan'
    };
    document.getElementById('prev-category').textContent = catLabels[data.category];
    document.getElementById('prev-date').textContent = data.date;

    let vehicleText = data.vehicle || '-';
    if (data.category === 'dump-truck' && data.carType) {
        vehicleText += ` (${data.carType})`;
    }
    document.getElementById('prev-vehicle').textContent = vehicleText;

    // Render drivers preview list (hide for brondolan)
    const driversListContainer = document.getElementById('preview-drivers-list');
    const prevDriversTitle = document.getElementById('prev-drivers-title');
    driversListContainer.innerHTML = '';

    if (data.category === 'brondolan') {
        // Hide driver preview section for brondolan
        prevDriversTitle.style.display = 'none';
        driversListContainer.style.display = 'none';
    } else {
        prevDriversTitle.style.display = '';
        driversListContainer.style.display = '';

        data.drivers.forEach(driver => {
            const item = document.createElement('div');
            item.className = 'preview-loader-item';

            const roleLabel = data.category === 'tractor' ? 'OPERATOR' : 'SUPIR';
            const infoDiv = document.createElement('div');
            let extraInfo = '';
            if (data.category === 'dump-truck') {
                const isKontraktor = (data.carType === 'MOBIL KONTRAKTOR');
                if (isKontraktor) {
                    extraInfo = `<br><small style="color:var(--text-muted)">Mobil Kontraktor (Tidak dapat premi)</small>`;
                } else {
                    const potPerDriver = data.tonnage > 0 ? (driver.tonnage / data.tonnage) * data.potonganHK : 0;
                    const effTon = Math.max(0, driver.tonnage - potPerDriver);
                    if (data.potonganHK > 0) {
                        extraInfo = `<br><small style="color:var(--text-muted)">Tonase: ${driver.tonnage.toFixed(3)} Ton | Potongan: ${potPerDriver.toFixed(3)} Ton | Efektif: ${effTon.toFixed(3)} Ton</small>`;
                    } else {
                        extraInfo = `<br><small style="color:var(--text-muted)">Tonase: ${driver.tonnage.toFixed(3)} Ton</small>`;
                    }
                }
            } else if (data.category === 'tractor') {
                extraInfo = `<br><small style="color:var(--text-muted)">Field: ${data.tractorField} | Janjang: ${data.tractorJanjang}</small>`;
            }
            infoDiv.innerHTML = `
                <span class="preview-loader-name">${driver.name}</span>
                <span class="preview-loader-nik">${driver.nik}</span>
                ${extraInfo}
            `;

            const valDiv = document.createElement('div');
            valDiv.className = 'role-amount';
            valDiv.style.fontSize = '1.05rem';
            valDiv.textContent = formatRupiah(driver.amount);

            item.appendChild(infoDiv);
            item.appendChild(valDiv);
            driversListContainer.appendChild(item);
        });
    }

    // Render loaders / workers preview list
    const loadersListContainer = document.getElementById('preview-loaders-list');
    loadersListContainer.innerHTML = '';

    data.loaders.forEach(loader => {
        const item = document.createElement('div');
        item.className = 'preview-loader-item';

        const infoDiv = document.createElement('div');
        let loaderExtra = '';
        if (data.category === 'brondolan' && loader.kg > 0) {
            loaderExtra = `<br><small style="color:var(--text-muted)">${loader.kg} Kg × Rp ${Number(data.rates.kg).toLocaleString('id-ID')}</small>`;
        } else if (data.category === 'dump-truck') {
            const tonasePemuat = data.tonnagePemuat || 0;
            const potonganPemuat = data.potonganPemuat || 0;
            const loaderEff = Math.max(0, tonasePemuat - potonganPemuat);
            const loaderCount = data.loaders.length || 1;
            const shareEff = loaderEff / loaderCount;
            if (potonganPemuat > 0) {
                loaderExtra = `<br><small style="color:var(--text-muted)">Bagian Tonase: ${shareEff.toFixed(3)} Ton (Dari total ${tonasePemuat.toFixed(3)} Ton - Pot: ${potonganPemuat.toFixed(3)} Ton)</small>`;
            } else {
                loaderExtra = `<br><small style="color:var(--text-muted)">Bagian Tonase: ${shareEff.toFixed(3)} Ton (Dari total ${tonasePemuat.toFixed(3)} Ton)</small>`;
            }
        } else if (data.category === 'tractor') {
            const tonaseTractor = data.tonnage || 0;
            const potonganHK = data.potonganHK || 0;
            const loaderEff = Math.max(0, tonaseTractor - potonganHK);
            const loaderCount = data.loaders.length || 1;
            const shareEff = loaderEff / loaderCount;
            if (potonganHK > 0) {
                loaderExtra = `<br><small style="color:var(--text-muted)">Bagian Tonase: ${shareEff.toFixed(3)} Ton (Dari total ${tonaseTractor.toFixed(3)} Ton - Pot: ${potonganHK.toFixed(3)} Ton)</small>`;
            } else {
                loaderExtra = `<br><small style="color:var(--text-muted)">Bagian Tonase: ${shareEff.toFixed(3)} Ton (Dari total ${tonaseTractor.toFixed(3)} Ton)</small>`;
            }
        }
        infoDiv.innerHTML = `
            <span class="preview-loader-name">${loader.name}</span>
            <span class="preview-loader-nik">${loader.nik}</span>
            ${loaderExtra}
        `;

        const valDiv = document.createElement('div');
        valDiv.className = 'preview-loader-val';
        valDiv.textContent = formatRupiah(loader.amount);

        item.appendChild(infoDiv);
        item.appendChild(valDiv);
        loadersListContainer.appendChild(item);
    });

    document.getElementById('prev-total-amount').textContent = formatRupiah(data.totalPremi);
}

// Render History Log Table
function renderHistoryTable() {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';

    // Get period date range
    const { start: periodStart, end: periodEnd } = getPeriodDates(state.activePeriodIndex);

    // Filter records based on active tab AND active period
    const filteredRecords = state.records.filter(rec => {
        // Period filter
        const dateParts = rec.date.split('-');
        const recDateObj = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        if (recDateObj < periodStart || recDateObj > periodEnd) return false;

        // Category tab filter
        if (state.activeTab === 'tab-all') return true;
        if (state.activeTab === 'tab-dump-truck' && rec.category === 'dump-truck') return true;
        if (state.activeTab === 'tab-tractor' && rec.category === 'tractor') return true;
        if (state.activeTab === 'tab-brondolan' && rec.category === 'brondolan') return true;
        return false;
    });

    // Sort by date descending (terbaru di atas) untuk tampilan web
    filteredRecords.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

    if (filteredRecords.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="table-empty-state">
                    <i data-lucide="database"></i>
                    <p>Tidak ada catatan premi ditemukan untuk kategori ini.</p>
                </td>
            </tr>
        `;
        lucide.createIcons();
        return;
    }

    filteredRecords.forEach((rec, index) => {
        const tr = document.createElement('tr');

        const catLabels = {
            'dump-truck': 'Dump Truck',
            'tractor': 'Traktor',
            'brondolan': 'Brondolan'
        };

        const catClasses = {
            'dump-truck': 'cat-dt',
            'tractor': 'cat-tr',
            'brondolan': 'cat-br'
        };

        // Format workers list into table cell
        let workersCellHTML = `<div class="worker-badge-cell">`;

        // Output all drivers
        rec.drivers.forEach(driver => {
            const roleLabel = rec.category === 'tractor' ? 'OPER' : 'SUPIR';
            const moneyInfo = ` <strong style="color:var(--primary-light); margin-left: 0.25rem;">(${formatRupiah(driver.amount)})</strong>`;
            workersCellHTML += `
                <div class="wb-item">
                    <span class="wb-role driver">${roleLabel}</span>
                    <span class="wb-name">${driver.name}</span>
                    <span class="wb-nik">${driver.nik}</span>${moneyInfo}
                </div>
            `;
        });

        // Output all loaders
        rec.loaders.forEach(loader => {
            const roleLabel = rec.category === 'brondolan' ? 'KTK' : 'PEMT';
            let extraInfo = '';
            if (rec.category === 'brondolan') {
                extraInfo = ` <strong style="color:var(--accent-gold); margin-left: 0.25rem;">(${loader.kg} Kg)</strong>`;
            } else {
                extraInfo = ` <strong style="color:var(--primary-light); margin-left: 0.25rem;">(${formatRupiah(loader.amount)})</strong>`;
            }
            workersCellHTML += `
                <div class="wb-item">
                    <span class="wb-role loader">${roleLabel}</span>
                    <span class="wb-name">${loader.name}</span>
                    <span class="wb-nik">${loader.nik}</span>${extraInfo}
                </div>
            `;
        });
        workersCellHTML += `</div>`;

        // Format results (Tonnage / Kg details)
        let resultDetail = '';
        if (rec.category === 'brondolan') {
            resultDetail = `Total: ${rec.tonnage} Kg`;
        } else if (rec.category === 'dump-truck') {
            const isKontraktor = (rec.carType === 'MOBIL KONTRAKTOR');
            const totalDriverTon = rec.tonnage || 0;
            const potonganDriver = rec.potonganHK || 0;
            const effDriverTon = Math.max(0, totalDriverTon - potonganDriver);

            const tonasePemuat = rec.tonnagePemuat || 0;
            const potonganPemuat = rec.potonganPemuat || 0;
            const effPemuatTon = Math.max(0, tonasePemuat - potonganPemuat);

            resultDetail = `
                <div style="margin-bottom:4px;">
                    <strong>Driver:</strong> ${totalDriverTon.toFixed(3)}T 
                    ${potonganDriver > 0 ? `<br><small style="color:var(--text-muted)">Pot: ${potonganDriver.toFixed(3)}T | Ef: ${effDriverTon.toFixed(3)}T</small>` : ''}
                </div>
                <div>
                    <strong>Pemuat:</strong> ${tonasePemuat.toFixed(3)}T 
                    ${potonganPemuat > 0 ? `<br><small style="color:var(--text-muted)">Pot: ${potonganPemuat.toFixed(3)}T | Ef: ${effPemuatTon.toFixed(3)}T</small>` : ''}
                </div>
            `;
        } else if (rec.category === 'tractor') {
            const totalDriverTon = rec.tonnage || 0;
            const potonganHK = rec.potonganHK || 0;
            const effPemuatTon = Math.max(0, totalDriverTon - potonganHK);

            resultDetail = `
                <div style="margin-bottom:4px;">
                    <strong>Operator:</strong> ${totalDriverTon.toFixed(3)}T 
                    <small style="color:var(--text-muted)">(Field: ${rec.tractorField || '-'} | ${rec.tractorJanjang || 0} Janjang)</small>
                </div>
                <div>
                    <strong>Pemuat:</strong> ${totalDriverTon.toFixed(3)}T 
                    ${potonganHK > 0 ? `<br><small style="color:var(--text-muted)">Pot: ${potonganHK.toFixed(3)}T | Ef: ${effPemuatTon.toFixed(3)}T</small>` : ''}
                </div>
            `;
        } else {
            const driverTonnages = rec.drivers.map(d => `${d.name.split(' ')[0]}: ${d.tonnage}T`).join('<br>');
            resultDetail = `Total: ${rec.tonnage} Ton<br><small style="color:var(--text-muted)">(${driverTonnages})</small>`;
        }

        // Format premium breakdown
        let formulaDetail = '';
        if (rec.category === 'brondolan') {
            const driversFormula = rec.drivers.map(d => `${d.name.split(' ')[0]}: ${formatRupiah(d.amount)}`).join('<br>');
            const loadersFormula = rec.loaders.map(l => `${l.name.split(' ')[0]}: ${formatRupiah(l.amount)}`).join('<br>');
            formulaDetail = `
                <div style="margin-bottom: 4px;"><strong>Kemudi:</strong><br>${driversFormula}</div>
                <div><strong>Pengumpul:</strong><br>${loadersFormula}</div>
            `;
        } else {
            const driversFormula = rec.drivers.map(d => `${d.name.split(' ')[0]}: ${formatRupiah(d.amount)}`).join('<br>');
            formulaDetail = `
                <div style="margin-bottom: 4px;"><strong>Supir/Oper:</strong><br>${driversFormula}</div>
                <div><strong>Pemuat:</strong><br>${rec.loaders.length} org &times; ${formatRupiah(rec.loaders[0]?.amount || 0)}</div>
            `;
        }

        let catLabelText = catLabels[rec.category];
        let catClassText = catClasses[rec.category];
        if (rec.category === 'dump-truck' && rec.carType === 'MOBIL KONTRAKTOR') {
            catLabelText = 'Mobil Kontraktor';
            catClassText = 'cat-contractor'; // kita tambahkan class baru
        }

        let vehicleTdHTML = rec.vehicle || '-';
        if (rec.category === 'dump-truck' && rec.carType) {
            vehicleTdHTML += `<br><span class="badge-car-type" style="font-size: 0.75rem; padding: 2px 6px; background: rgba(255,255,255,0.08); border-radius: 4px; display: inline-block; margin-top: 4px; font-weight: 500; color: var(--text-muted);">${rec.carType}</span>`;
        }

        let actionCellHTML = '';
        if (currentUser) {
            if (rec.createdBy === currentUser || currentUser === 'OWNER') {
                actionCellHTML = `
                    <td data-label="Aksi">
                        <div class="action-btn-group">
                            <button type="button" class="btn-edit-row" title="Edit catatan ini">
                                <i data-lucide="pencil"></i>
                            </button>
                            <button type="button" class="btn-delete-row" title="Hapus catatan ini">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                `;
            } else {
                actionCellHTML = `<td data-label="Aksi"></td>`;
            }
        }

        tr.innerHTML = `
            <td data-label="No">${index + 1}</td>
            <td data-label="Tanggal">${rec.date}</td>
            <td data-label="Kategori"><span class="cat-badge ${catClassText}">${catLabelText}</span></td>
            <td data-label="Dicatat Oleh"><span class="created-by-badge" style="font-size: 0.8rem; padding: 2px 6px; background: rgba(255,255,255,0.06); border-radius: 4px; display: inline-block; font-weight: 500;">${rec.createdBy || 'Public'}</span></td>
            <td data-label="Lokasi"><strong>${rec.division}</strong></td>
            <td data-label="Unit/Kendaraan">${vehicleTdHTML}</td>
            <td data-label="Pekerja & Peran">${workersCellHTML}</td>
            <td data-label="Hasil Kerja"><strong>${resultDetail}</strong></td>
            <td data-label="Premi" style="font-size: 0.8rem; line-height: 1.3;">${formulaDetail}</td>
            <td data-label="Total Premi"><strong style="color:var(--primary-light); font-size:1rem">${formatRupiah(rec.totalPremi)}</strong></td>
            ${actionCellHTML}
        `;

        if (currentUser && (rec.createdBy === currentUser || currentUser === 'OWNER')) {
            // Bind Edit button
            const btnEdit = tr.querySelector('.btn-edit-row');
            if (btnEdit) {
                btnEdit.addEventListener('click', () => {
                    editRecord(rec.id);
                });
            }

            // Bind Delete button
            tr.querySelector('.btn-delete-row').addEventListener('click', async () => {
                if (confirm('Apakah Anda yakin ingin menghapus catatan premi ini?')) {
                    const originalIndex = state.records.findIndex(r => r.id === rec.id);
                    if (originalIndex > -1) {
                        const recIdToDelete = rec.id;
                        state.records.splice(originalIndex, 1);
                        saveLocalRecords();
                        updateStats();
                        renderHistoryTable();

                        if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL") {
                            try {
                                showToast('Menghapus data online...');
                                await deleteOnlineRecord(recIdToDelete);
                                showToast('Catatan premi telah dihapus online.');
                            } catch (err) {
                                console.error(err);
                                showToast('Gagal menghapus online.', true);
                            }
                        } else {
                            showToast('Catatan premi telah dihapus.', true);
                        }
                    }
                }
            });
        }

        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

// ==========================================
// EDIT RECORD — Pre-populate form with existing data
// ==========================================

function editRecord(recordId) {
    const rec = state.records.find(r => r.id === recordId);
    if (!rec) {
        showToast('Catatan tidak ditemukan.', true);
        return;
    }

    // Set editing state
    state.editingRecordId = recordId;
    state.activeCategory = rec.category;
    document.getElementById('active-category').value = rec.category;

    // Customize form UI for this category
    customizeFormUI(rec.category);

    // Clear existing form rows
    document.getElementById('drivers-list-container').innerHTML = '';
    document.getElementById('loaders-list-container').innerHTML = '';

    // Show form section, hide menu
    document.getElementById('menu-utama').classList.add('hidden');
    document.getElementById('form-section').classList.remove('hidden');

    // Set metadata fields
    document.getElementById('input-tanggal').value = rec.date;
    document.getElementById('input-divisi').value = rec.division;
    document.getElementById('input-vehicle').value = rec.vehicle;

    // Set car type for dump truck
    if (rec.category === 'dump-truck' && rec.carType) {
        const selectCarType = document.getElementById('input-car-type');
        if (selectCarType) selectCarType.value = rec.carType;
    }

    // Set rates from record
    if (rec.rates) {
        if (rec.category === 'dump-truck' || rec.category === 'tractor') {
            const rateDriverInput = document.getElementById('rate-driver');
            const rateLoaderInput = document.getElementById('rate-loader');
            if (rateDriverInput && rec.rates.driver !== undefined) {
                rateDriverInput.value = rec.rates.driver;
                state.rates[rec.category].driver = rec.rates.driver;
            }
            if (rateLoaderInput && rec.rates.loader !== undefined) {
                rateLoaderInput.value = rec.rates.loader;
                state.rates[rec.category].loader = rec.rates.loader;
            }
        } else if (rec.category === 'brondolan') {
            const rateKgInput = document.getElementById('rate-kg');
            if (rateKgInput && rec.rates.kg !== undefined) {
                rateKgInput.value = rec.rates.kg;
                state.rates.brondolan.kg = rec.rates.kg;
            }
        }
    }

    // Populate drivers (for dump-truck and tractor)
    if (rec.category !== 'brondolan' && rec.drivers && rec.drivers.length > 0) {
        document.getElementById('drivers-section').classList.remove('hidden');
        rec.drivers.forEach(driver => {
            addDriverRow();
            const rows = document.querySelectorAll('#drivers-list-container .loader-row');
            const lastRow = rows[rows.length - 1];

            // Set driver name and NIK
            const nameInput = lastRow.querySelector('.driver-name-input');
            const nikHidden = lastRow.querySelector('.driver-nik-val');
            const badge = lastRow.querySelector('.driver-badge');

            nameInput.value = driver.name;
            nameInput.disabled = true;
            nikHidden.value = driver.nik;
            badge.querySelector('.badge-nik').textContent = driver.nik;
            badge.classList.remove('hidden');

            // Set tonnage for dump truck
            if (rec.category === 'dump-truck') {
                const tonnageInput = lastRow.querySelector('.driver-tonnage');
                if (tonnageInput) tonnageInput.value = driver.tonnage || 0;
            }

            // Set tractor fields
            if (rec.category === 'tractor') {
                const fieldSelect = lastRow.querySelector('.tractor-field');
                const janjangInput = lastRow.querySelector('.tractor-janjang');
                const bjrInput = lastRow.querySelector('.tractor-bjr');
                const tonInput = lastRow.querySelector('.driver-tonnage');

                if (fieldSelect && driver.field) fieldSelect.value = driver.field;
                if (janjangInput) janjangInput.value = driver.janjang || 0;
                if (bjrInput) bjrInput.value = driver.bjr ? driver.bjr.toFixed(2) : '0.00';
                if (tonInput) tonInput.value = driver.tonnage ? driver.tonnage.toFixed(3) : '0.000';
            }
        });
        calculateTotalDriverTonnage();
    }

    // Populate loaders
    if (rec.loaders && rec.loaders.length > 0) {
        rec.loaders.forEach(loader => {
            addLoaderRow();
            const rows = document.querySelectorAll('#loaders-list-container .loader-row');
            const lastRow = rows[rows.length - 1];

            const nameInput = lastRow.querySelector('.loader-name-input');
            const nikHidden = lastRow.querySelector('.loader-nik-val');
            const badge = lastRow.querySelector('.loader-badge');

            nameInput.value = loader.name;
            nameInput.disabled = true;
            nikHidden.value = loader.nik;
            badge.querySelector('.badge-nik').textContent = loader.nik;
            badge.classList.remove('hidden');

            // Set KG for brondolan
            if (rec.category === 'brondolan') {
                const kgInput = lastRow.querySelector('.loader-kg');
                if (kgInput) kgInput.value = loader.kg || 0;
            }
        });

        if (rec.category === 'brondolan') {
            calculateTotalBrondolanKg();
        }
    }

    // Set potongan and tonase pemuat fields
    if (rec.category === 'dump-truck') {
        const potonganHKInput = document.getElementById('input-potongan-hk');
        if (potonganHKInput) potonganHKInput.value = rec.potonganHK || '';
        const tonPemuatInput = document.getElementById('input-tonnage-pemuat');
        if (tonPemuatInput) tonPemuatInput.value = rec.tonnagePemuat || '';
        const potPemuatInput = document.getElementById('input-potongan-pemuat');
        if (potPemuatInput) potPemuatInput.value = rec.potonganPemuat || '';
    } else if (rec.category === 'tractor') {
        const potonganHKInput = document.getElementById('input-potongan-hk');
        if (potonganHKInput) potonganHKInput.value = rec.potonganHK || '';
        // For tractor without operators, set manual tonnage
        if (!rec.drivers || rec.drivers.length === 0) {
            document.getElementById('input-tonnage').value = rec.tonnage || 0;
        }
    }

    // Update live calculations
    updateLiveCalculations();

    // Enter edit mode UI
    enterEditMode();

    // Scroll to form
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });

    showToast(`Mode edit: mengubah catatan ${rec.category === 'dump-truck' ? 'Dump Truck' : rec.category === 'tractor' ? 'Traktor' : 'Brondolan'} — ${rec.division}`);
}

function enterEditMode() {
    const btnSave = document.getElementById('btn-save-record');
    if (btnSave) {
        btnSave.innerHTML = '<i data-lucide="check-circle"></i> Perbarui Catatan';
        btnSave.classList.add('btn-edit-mode');
    }
    const formTitle = document.getElementById('form-title');
    if (formTitle) {
        const catLabels = {
            'dump-truck': 'Dump Truck',
            'tractor': 'Traktor',
            'brondolan': 'Ketek Brondolan'
        };
        formTitle.textContent = `✏️ Edit — ${catLabels[state.activeCategory] || 'Form'}`;
    }

    // Show cancel edit banner
    const formHeader = document.querySelector('.form-header');
    if (formHeader && !document.getElementById('edit-mode-banner')) {
        const banner = document.createElement('div');
        banner.id = 'edit-mode-banner';
        banner.className = 'edit-mode-banner';
        banner.innerHTML = `
            <i data-lucide="info" style="width:16px;height:16px;flex-shrink:0;"></i>
            <span>Anda sedang mengedit catatan. Klik <strong>"Perbarui Catatan"</strong> untuk menyimpan perubahan, atau kembali ke menu untuk membatalkan.</span>
            <button type="button" id="btn-cancel-edit" class="btn-cancel-edit" title="Batalkan Edit">
                <i data-lucide="x" style="width:14px;height:14px;"></i> Batal Edit
            </button>
        `;
        formHeader.insertAdjacentElement('afterend', banner);
        lucide.createIcons();

        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            if (confirm('Batalkan pengeditan? Perubahan tidak akan disimpan.')) {
                state.editingRecordId = null;
                exitEditMode();
                resetFormInputs();
                document.getElementById('btn-back-to-menu').click();
                showToast('Pengeditan dibatalkan.');
            }
        });
    }

    lucide.createIcons();
}

function exitEditMode() {
    state.editingRecordId = null;

    const btnSave = document.getElementById('btn-save-record');
    if (btnSave) {
        btnSave.innerHTML = '<i data-lucide="save"></i> Simpan Catatan';
        btnSave.classList.remove('btn-edit-mode');
    }

    const banner = document.getElementById('edit-mode-banner');
    if (banner) banner.remove();

    lucide.createIcons();
}

// History tabs filtering
function initHistoryTabs() {
    // Category tabs — only inside .history-tabs
    const categoryTabContainer = document.querySelector('.history-tabs');
    const btnClearAll = document.getElementById('btn-clear-history');

    if (categoryTabContainer) {
        const catTabs = categoryTabContainer.querySelectorAll('.tab-btn');
        catTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                catTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.activeTab = tab.getAttribute('data-tab');
                renderHistoryTable();
            });
        });
    }

    // Period Dropdown
    const btnHistoryPeriod = document.getElementById('btn-history-period');
    if (btnHistoryPeriod) {
        btnHistoryPeriod.addEventListener('click', () => {
            openPeriodPicker(btnHistoryPeriod, state.activePeriodIndex, (idx) => {
                state.activePeriodIndex = idx;
                updatePeriodLabel();
                renderHistoryTable();
            });
        });
    }

    btnClearAll.addEventListener('click', async () => {
        if (currentUser === 'OWNER') {
            const passwordInput = prompt(`Masukkan password untuk akun ${currentUser} untuk menghapus data:`);
            if (passwordInput === null) return;
            if (passwordInput.trim() !== CREDENTIALS[currentUser]) {
                showToast('Password salah! Gagal mengakses fitur hapus.', true);
                return;
            }
            
            const ownerModal = document.getElementById('modal-owner-delete');
            if (ownerModal) {
                ownerModal.classList.remove('hidden');
                document.getElementById('owner-delete-start').value = getLocalToday();
                document.getElementById('owner-delete-end').value = getLocalToday();
            }
            return;
        }

        const myRecords = state.records.filter(r => r.createdBy === currentUser);
        if (myRecords.length === 0) {
            showToast('Tidak ada data premi buatan Anda untuk dibersihkan.', true);
            return;
        }

        const passwordInput = prompt(`Masukkan password untuk akun ${currentUser} untuk menghapus semua catatan:`);
        if (passwordInput === null) return;
        if (passwordInput.trim() !== CREDENTIALS[currentUser]) {
            showToast('Password salah! Gagal menghapus catatan.', true);
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus seluruh data pencatatan yang dibuat oleh ${currentUser}? Tindakan ini tidak dapat dibatalkan.`)) {
            state.records = state.records.filter(r => r.createdBy !== currentUser);
            saveLocalRecords();
            updateStats();
            renderHistoryTable();

            if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL") {
                try {
                    showToast('Membersihkan data online...');
                    await deleteMyOnlineRecords(currentUser);
                    showToast(`Semua riwayat buatan ${currentUser} telah dihapus online.`);
                } catch (err) {
                    console.error(err);
                    showToast('Gagal menghapus online.', true);
                }
            } else {
                showToast(`Semua riwayat buatan ${currentUser} telah dibersihkan.`, true);
            }
        }
    });
}

// Update App stats banner
function updateStats() {
    const today = getLocalToday();
    const todayRecords = state.records.filter(r => r.date === today);
    
    const todayRecordsCount = todayRecords.length;
    const todayPremi = todayRecords.reduce((acc, curr) => acc + curr.totalPremi, 0);

    const totalRecords = state.records.length;
    const totalPremi = state.records.reduce((acc, curr) => acc + curr.totalPremi, 0);

    let dateRangeStr = 'Belum ada data';
    if (state.records.length > 0) {
        const dates = state.records.map(r => r.date).sort();
        const oldestDate = dates[0];
        const newestDate = dates[dates.length - 1];
        
        const formatDateStr = (d) => {
            if (!d) return '';
            const p = d.split('-');
            if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
            return d;
        };
        
        if (oldestDate === newestDate) {
            dateRangeStr = `dari ${formatDateStr(oldestDate)}`;
        } else {
            dateRangeStr = `dari ${formatDateStr(oldestDate)} - ${formatDateStr(newestDate)}`;
        }
    }

    document.getElementById('stat-total-records').textContent = todayRecordsCount;
    document.getElementById('stat-total-premi').textContent = formatRupiah(todayPremi);
    
    const elSubRecords = document.getElementById('stat-sub-records');
    if (elSubRecords) {
        elSubRecords.textContent = `Total ${totalRecords} data (${dateRangeStr})`;
    }
    
    const elSubPremi = document.getElementById('stat-sub-premi');
    if (elSubPremi) {
        elSubPremi.textContent = `Total ${dateRangeStr}: ${formatRupiah(totalPremi)}`;
    }

    // Update per-category card stats
    updateCardStats();
}

// Update the daily & period total stats on each menu card
function updateCardStats() {
    const today = getLocalToday();
    const { start: pStart, end: pEnd } = getPeriodDates(0);

    // Format period label for card (e.g. "26 Jun – Sekarang")
    const periodLabel = formatPeriodLabel(0);

    const cats = ['dump-truck', 'tractor', 'brondolan'];
    const idPrefix = { 'dump-truck': 'dt', 'tractor': 'tr', 'brondolan': 'br' };

    cats.forEach(cat => {
        const prefix = idPrefix[cat];
        let todayTotal = 0;
        let periodTotal = 0;

        state.records.forEach(rec => {
            if (rec.category !== cat) return;

            const dp = rec.date.split('-');
            const recDate = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10));

            if (rec.date === today) todayTotal += rec.totalPremi;
            if (recDate >= pStart && recDate <= pEnd) periodTotal += rec.totalPremi;
        });

        const elToday = document.getElementById(`card-${prefix}-today`);
        const elPeriod = document.getElementById(`card-${prefix}-period`);
        const elPeriodLabel = document.getElementById(`card-${prefix}-period-label`);

        if (elToday) elToday.textContent = formatRupiah(todayTotal);
        if (elPeriod) elPeriod.textContent = formatRupiah(periodTotal);
        if (elPeriodLabel) elPeriodLabel.textContent = periodLabel;
    });
}

// LocalStorage helpers
function saveLocalRecords() {
    localStorage.setItem('dxtapremi_records', JSON.stringify(state.records));
}

function loadLocalRecords() {
    const saved = localStorage.getItem('dxtapremi_records');
    if (saved) {
        try {
            state.records = JSON.parse(saved);
            updateStats();
            renderHistoryTable();
        } catch (e) {
            console.error('Error loading local records', e);
        }
    }
}

// Currency format helper
function formatRupiah(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
}

// Toast message handler
function showToast(message, isWarning = false) {
    const toast = document.getElementById('toast');
    const msgSpan = document.getElementById('toast-message');

    msgSpan.textContent = message;

    if (isWarning) {
        toast.style.borderLeftColor = 'var(--danger)';
    } else {
        toast.style.borderLeftColor = 'var(--primary-light)';
    }

    toast.classList.remove('hidden');

    // Clear old timeout
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }

    toast.timeoutId = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// EXCEL EXPORT (SheetJS Integrasi)
function initExcelExport() {
    const btnExport = document.getElementById('btn-export-excel');
    const modal = document.getElementById('modal-excel-period');
    const btnClose = document.getElementById('btn-close-excel-period');
    const listContainer = document.getElementById('excel-period-list');

    if (!btnExport) return;

    btnExport.addEventListener('click', () => {
        if (state.records.length === 0) {
            showToast('Tidak ada data untuk diekspor ke Excel.', true);
            return;
        }

        if (listContainer) {
            listContainer.innerHTML = '';
            const periods = generatePeriodList(12); // Generate last 12 periods
            
            periods.forEach(p => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = p.index === 0 ? 'btn-primary' : 'btn-secondary';
                btn.style.cssText = 'padding: 0.65rem 0.8rem; font-size: 0.85rem; text-align: left; display: flex; flex-direction: column; gap: 0.15rem; border-radius: var(--radius-sm);';
                
                btn.innerHTML = `
                    <strong style="font-size: 0.9rem;">📄 ${p.title}</strong>
                    <span style="font-size: 0.75rem; opacity: 0.75; font-weight: 400;">${p.label}</span>
                `;
                
                btn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                    exportToExcel(p.index);
                });
                
                listContainer.appendChild(btn);
            });
        }

        if (modal) modal.classList.remove('hidden');
    });

    if (btnClose) btnClose.addEventListener('click', () => modal.classList.add('hidden'));
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
}

function exportToExcel(periodIndex = 0) {
    try {
        const wb = XLSX.utils.book_new();

        // Filter records by period
        const { start: periodStart, end: periodEnd } = getPeriodDates(periodIndex);
        const periodRecords = state.records.filter(rec => {
            const dp = rec.date.split('-');
            const d = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10));
            return d >= periodStart && d <= periodEnd;
        });

        if (periodRecords.length === 0) {
            showToast(`Tidak ada data untuk periode terpilih.`, true);
            return;
        }

        // ----------------------------------------------------
        // 1. SHEET RINGKASAN: Gaji/Premi per Orang Karyawan
        // ----------------------------------------------------
        const summaryMap = {};

        periodRecords.forEach(rec => {
            // Drivers
            rec.drivers.forEach(driver => {
                const dNik = driver.nik;
                const dName = driver.name;
                if (!summaryMap[dNik]) {
                    summaryMap[dNik] = { NIK: dNik, Nama: dName, DumpTruck: 0, Traktor: 0, Brondolan: 0, Total: 0 };
                }
                if (rec.category === 'dump-truck') summaryMap[dNik].DumpTruck += driver.amount;
                if (rec.category === 'tractor') summaryMap[dNik].Traktor += driver.amount;
                if (rec.category === 'brondolan') summaryMap[dNik].Brondolan += driver.amount;
                summaryMap[dNik].Total += driver.amount;
            });

            // Loaders/Pemuat
            rec.loaders.forEach(loader => {
                const lNik = loader.nik;
                const lName = loader.name;
                if (!summaryMap[lNik]) {
                    summaryMap[lNik] = { NIK: lNik, Nama: lName, DumpTruck: 0, Traktor: 0, Brondolan: 0, Total: 0 };
                }
                if (rec.category === 'dump-truck') summaryMap[lNik].DumpTruck += loader.amount;
                if (rec.category === 'tractor') summaryMap[lNik].Traktor += loader.amount;
                if (rec.category === 'brondolan') summaryMap[lNik].Brondolan += loader.amount;
                summaryMap[lNik].Total += loader.amount;
            });
        });

        const summaryRows = Object.values(summaryMap).map((item, idx) => ({
            "No": idx + 1,
            "NIK": item.NIK,
            "Nama Pekerja": item.Nama,
            "Premi Dump Truck (Rp)": item.DumpTruck,
            "Premi Traktor (Rp)": item.Traktor,
            "Premi Brondolan (Rp)": item.Brondolan,
            "Grand Total Premi (Rp)": item.Total
        }));

        const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan Premi");

        // Helper: format tanggal ke teks Indonesia kapital (contoh: RABU 10 JUNI 2026)
        function formatTanggalIndo(dateStr) {
            const hariArr = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
            const bulanArr = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
                'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
            const parts = dateStr.split('-');
            const tgl = new Date(+parts[0], +parts[1] - 1, +parts[2]);
            return `${hariArr[tgl.getDay()]} ${tgl.getDate()} ${bulanArr[tgl.getMonth()]} ${tgl.getFullYear()}`;
        }

        // ----------------------------------------------------
        // 2. SHEET LOADING DUMP TRUCK (Tabel Gabungan Pemuat & Supir)
        // ----------------------------------------------------
        const dtRecords = periodRecords
            .filter(r => r.category === 'dump-truck')
            .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
        const dtAOA = [];
        const dtMerges = [];

        // Header tunggal untuk tabel gabungan
        dtAOA.push(['NO', 'WAKTU', 'DICATAT OLEH', 'ID', 'NAMA', 'TONASE LOADING TOTAL', 'POTONGAN', 'TON BERSIH', 'PREMI/TON', 'JML HK', 'HASIL/HK']);

        let dtNo = 1;
        const kontraktorDriverRows = [];
        dtRecords.forEach(rec => {
            const recordStartRow = dtAOA.length;
            const dateStrFormatted = formatTanggalIndo(rec.date);
            const isKontraktor = (rec.carType === 'MOBIL KONTRAKTOR');

            // --- Data Pemuat (Loaders) ---
            const tonsForLoader = (rec.tonnagePemuat !== undefined && rec.tonnagePemuat > 0)
                ? rec.tonnagePemuat
                : rec.tonnage;
            const potonganPemuatVal = rec.potonganPemuat || 0;
            const effectiveTonnageLoader = Math.max(0, tonsForLoader - potonganPemuatVal);

            const loaderStartRow = dtAOA.length;
            rec.loaders.forEach((loader, lIdx) => {
                dtAOA.push([
                    dtNo++,
                    lIdx === 0 ? dateStrFormatted : null,   // WAKTU (merged seluruh record)
                    lIdx === 0 ? (rec.createdBy || 'Public') : null, // DICATAT OLEH (merged seluruh record)
                    loader.nik,                              // ID
                    loader.name,                             // NAMA
                    lIdx === 0 ? tonsForLoader : null,       // TONASE LOADING TOTAL (merged pemuat)
                    lIdx === 0 ? (potonganPemuatVal > 0 ? potonganPemuatVal : null) : null, // POTONGAN
                    lIdx === 0 ? effectiveTonnageLoader : null, // TON BERSIH
                    lIdx === 0 ? rec.rates.loader : null,    // PREMI/TON
                    lIdx === 0 ? rec.loaders.length : null,  // JML HK (angka biasa, bukan Rp)
                    loader.amount                            // HASIL/HK
                ]);
            });
            const loaderEndRow = dtAOA.length - 1;

            // Merge kolom pemuat (TONASE s/d JML HK) jika pemuat > 1
            if (rec.loaders.length > 1) {
                [5, 6, 7, 8, 9].forEach(c => {
                    dtMerges.push({ s: { r: loaderStartRow, c: c }, e: { r: loaderEndRow, c: c } });
                });
            }

            // --- Data Supir / Driver ---
            const potonganSupirVal = rec.potonganHK || 0;
            const totalDriverTon = rec.drivers.reduce((a, d) => a + (d.tonnage || 0), 0);

            rec.drivers.forEach(driver => {
                if (isKontraktor) {
                    // KONTRAKTOR: hanya tampilkan tonase, tanpa premi
                    dtAOA.push([
                        dtNo++,
                        null,                                // WAKTU (merged)
                        null,                                // DICATAT OLEH (merged)
                        rec.vehicle || driver.nik,           // ID (No. Polisi)
                        driver.name,                         // NAMA
                        driver.tonnage || null,               // TONASE (tonase saja)
                        null,                                // POTONGAN
                        null,                                // TON BERSIH
                        null,                                // PREMI/TON
                        null,                                // JML HK
                        null                                 // HASIL/HK (tidak ada premi)
                    ]);
                    kontraktorDriverRows.push(dtAOA.length - 1);
                } else {
                    // DAM: tampilkan lengkap dengan premi
                    const potPerDriver = (totalDriverTon > 0 && potonganSupirVal > 0)
                        ? parseFloat(((driver.tonnage / totalDriverTon) * potonganSupirVal).toFixed(3))
                        : null;
                    const effTon = potPerDriver ? Math.max(0, driver.tonnage - potPerDriver) : driver.tonnage;

                    dtAOA.push([
                        dtNo++,
                        null,                                // WAKTU (merged)
                        null,                                // DICATAT OLEH (merged)
                        driver.nik,                          // ID
                        driver.name,                         // NAMA
                        driver.tonnage,                      // TONASE
                        potPerDriver || null,                 // POTONGAN
                        effTon,                              // TON BERSIH
                        rec.rates.driver,                    // PREMI/TON
                        null,                                // JML HK
                        driver.amount                        // HASIL/HK (premi supir)
                    ]);
                }
            });

            const recordEndRow = dtAOA.length - 1;

            // Merge WAKTU & DICATAT OLEH untuk seluruh record (pemuat + supir)
            if (recordEndRow > recordStartRow) {
                dtMerges.push({ s: { r: recordStartRow, c: 1 }, e: { r: recordEndRow, c: 1 } });
                dtMerges.push({ s: { r: recordStartRow, c: 2 }, e: { r: recordEndRow, c: 2 } });
            }
        });

        const wsDT = XLSX.utils.aoa_to_sheet(dtAOA);

        if (dtMerges.length > 0) {
            wsDT['!merges'] = dtMerges;
        }

        // Format angka per baris
        for (let r = 1; r < dtAOA.length; r++) {
            const rowData = dtAOA[r];
            if (!rowData || rowData.length === 0) continue;
            // Skip header rows
            if (typeof rowData[0] === 'string' && isNaN(rowData[0])) continue;

            // Desimal 3: TONASE (5), POTONGAN (6), TON BERSIH (7)
            [5, 6, 7].forEach(c => {
                const addr = XLSX.utils.encode_cell({ r, c });
                if (wsDT[addr] && wsDT[addr].t === 'n') wsDT[addr].z = '#,##0.000';
            });
            // Rupiah: PREMI/TON (8)
            const addrPremi = XLSX.utils.encode_cell({ r, c: 8 });
            if (wsDT[addrPremi] && wsDT[addrPremi].t === 'n') wsDT[addrPremi].z = '"Rp "#,##0';
            // JML HK (9): angka biasa (TANPA Rp)
            const addrJmlHK = XLSX.utils.encode_cell({ r, c: 9 });
            if (wsDT[addrJmlHK] && wsDT[addrJmlHK].t === 'n') wsDT[addrJmlHK].z = '#,##0';
            // HASIL/HK (10): Rupiah
            const addrHasil = XLSX.utils.encode_cell({ r, c: 10 });
            if (wsDT[addrHasil] && wsDT[addrHasil].t === 'n') wsDT[addrHasil].z = '"Rp "#,##0';
        }

        wsDT['!cols'] = [
            { wch: 6 },  // A: NO
            { wch: 24 }, // B: WAKTU
            { wch: 18 }, // C: DICATAT OLEH
            { wch: 14 }, // D: ID
            { wch: 24 }, // E: NAMA
            { wch: 20 }, // F: TONASE LOADING TOTAL
            { wch: 12 }, // G: POTONGAN
            { wch: 14 }, // H: TON BERSIH
            { wch: 16 }, // I: PREMI/TON
            { wch: 10 }, // J: JML HK
            { wch: 16 }, // K: HASIL/HK
        ];

        // Highlight sel nama driver kontraktor dengan warna kuning
        kontraktorDriverRows.forEach(r => {
            const addr = XLSX.utils.encode_cell({ r: r, c: 4 }); // Kolom E (NAMA) index 4
            if (wsDT[addr]) {
                wsDT[addr].s = {
                    fill: { fgColor: { rgb: "FFFFFF00" } }
                };
            }
        });

        XLSX.utils.book_append_sheet(wb, wsDT, "Loading Dump Truck");

        // ----------------------------------------------------
        // 3. SHEET LOADING TRAKTOR (Format sesuai gambar)
        // ----------------------------------------------------
        const trRecords = periodRecords
            .filter(r => r.category === 'tractor')
            .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
        const trAOA = [];
        const trMerges = [];
        let trNo = 1;

        // Header Kolom: NO | WAKTU | DICATAT OLEH | ID | NAMA | TRAKTOR | FIELD | TANDAN | BJR | TONASE | PREMI | JUMLAH LOADING | JUMLAH PER ORANG
        trAOA.push(['NO', 'WAKTU', 'DICATAT OLEH', 'ID', 'NAMA', 'TRAKTOR', 'FIELD', 'TANDAN', 'BJR', 'TONASE', 'PREMI', 'JUMLAH LOADING', 'JUMLAH PER ORANG']);

        trRecords.forEach(rec => {
            const startRow = trAOA.length;
            const dateStrFormatted = formatTanggalIndo(rec.date);

            // Kita berasumsi 1 traktor group memiliki 1 driver/operator utama untuk detail traktor, field, janjang (tandan), bjr
            const primaryDriver = rec.drivers[0] || { field: '-', janjang: 0, bjr: 0, tonnage: 0, name: '-', nik: '-' };

            // Pemuat/Loaders
            rec.loaders.forEach((loader, lIdx) => {
                trAOA.push([
                    lIdx + 1,                                            // NO (1, 2, 3...)
                    lIdx === 0 ? dateStrFormatted : null,                 // WAKTU
                    lIdx === 0 ? (rec.createdBy || 'Public') : null,     // DICATAT OLEH
                    loader.nik,                                          // ID
                    loader.name,                                         // NAMA
                    lIdx === 0 ? rec.vehicle : null,                     // TRAKTOR (No. Lambung)
                    lIdx === 0 ? primaryDriver.field : null,             // FIELD
                    lIdx === 0 ? primaryDriver.janjang : null,           // TANDAN
                    lIdx === 0 ? primaryDriver.bjr : null,               // BJR
                    lIdx === 0 ? rec.tonnage : null,                     // TONASE (Total Tonase kelompok)
                    lIdx === 0 ? rec.rates.loader : null,                // PREMI (Pemuat)
                    lIdx === 0 ? rec.loaders.length : null,              // JUMLAH LOADING (Jumlah pemuat)
                    loader.amount                                        // JUMLAH PER ORANG
                ]);
            });

            // Operator/Driver
            rec.drivers.forEach((driver) => {
                trAOA.push([
                    'OPRATOR',                                           // NO (OPRATOR)
                    null,                                                // WAKTU
                    null,                                                // DICATAT OLEH
                    driver.nik,                                          // ID
                    driver.name,                                         // NAMA
                    null,                                                // TRAKTOR
                    null,                                                // FIELD
                    null,                                                // TANDAN
                    null,                                                // BJR
                    null,                                                // TONASE
                    rec.rates.driver,                                    // PREMI (Operator)
                    null,                                                // JUMLAH LOADING
                    driver.amount                                        // JUMLAH PER ORANG
                ]);
            });

            const endRow = trAOA.length - 1;
            const loadersCount = rec.loaders.length;

            // Merge WAKTU (Kolom 1 / B)
            trMerges.push({ s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } });

            // Merge DICATAT OLEH (Kolom 2 / C)
            trMerges.push({ s: { r: startRow, c: 2 }, e: { r: endRow, c: 2 } });

            // Merge detail traktor hingga JUMLAH LOADING untuk baris pemuat
            // TRAKTOR (c: 5), FIELD (c: 6), TANDAN (c: 7), BJR (c: 8), TONASE (c: 9), PREMI (c: 10), JUMLAH LOADING (c: 11)
            for (let c = 5; c <= 11; c++) {
                trMerges.push({ s: { r: startRow, c: c }, e: { r: startRow + loadersCount - 1, c: c } });
            }
        });

        const wsTR = XLSX.utils.aoa_to_sheet(trAOA);

        if (trMerges.length > 0) {
            wsTR['!merges'] = trMerges;
        }

        // Format angka desimal untuk BJR (Kolom I), Tonase (Kolom J), Rupiah untuk K dan M
        for (let r = 1; r < trAOA.length; r++) {
            // Kolom I (index 8): BJR (2 desimal, misal: 12.73)
            const addrI = XLSX.utils.encode_cell({ r, c: 8 });
            if (wsTR[addrI] && wsTR[addrI].t === 'n') {
                wsTR[addrI].z = '#,##0.00';
            }
            // Kolom J (index 9): TONASE (3 desimal, misal: 2.546)
            const addrJ = XLSX.utils.encode_cell({ r, c: 9 });
            if (wsTR[addrJ] && wsTR[addrJ].t === 'n') {
                wsTR[addrJ].z = '#,##0.000';
            }
            // Kolom K (index 10): PREMI
            const addrK = XLSX.utils.encode_cell({ r, c: 10 });
            if (wsTR[addrK] && wsTR[addrK].t === 'n') {
                wsTR[addrK].z = '"Rp "#,##0';
            }
            // Kolom M (index 12): JUMLAH PER ORANG
            const addrM = XLSX.utils.encode_cell({ r, c: 12 });
            if (wsTR[addrM] && wsTR[addrM].t === 'n') {
                wsTR[addrM].z = '"Rp "#,##0';
            }
        }

        // Lebar kolom
        wsTR['!cols'] = [
            { wch: 12 }, // A: NO
            { wch: 24 }, // B: WAKTU
            { wch: 18 }, // C: DICATAT OLEH
            { wch: 12 }, // D: ID
            { wch: 24 }, // E: NAMA
            { wch: 12 }, // F: TRAKTOR
            { wch: 10 }, // G: FIELD
            { wch: 10 }, // H: TANDAN
            { wch: 10 }, // I: BJR
            { wch: 12 }, // J: TONASE
            { wch: 16 }, // K: PREMI
            { wch: 18 }, // L: JUMLAH LOADING
            { wch: 20 }, // M: JUMLAH PER ORANG
        ];

        XLSX.utils.book_append_sheet(wb, wsTR, "Loading Traktor");

        // ----------------------------------------------------
        // 4. SHEET KETEK BRONDOLAN (Format PERSIS seperti foto)
        // ----------------------------------------------------
        const brRecords = periodRecords
            .filter(r => r.category === 'brondolan')
            .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

        // Buat AOA (Array of Arrays)
        const brAOA = [];
        const brMerges = [];
        let brNo = 1;

        // Tentukan nilai tarif kg yang dipakai (dari catatan pertama atau dari state)
        const tarifKg = brRecords.length > 0
            ? (brRecords[0].rates.kg || 250)
            : (state.rates.brondolan.kg || 250);

        // ── BARIS HEADER ──
        // Kolom: WAKTU | DICATAT OLEH | NO | ID | NAMA | HASIL KG | (empty) | RP 250/Kg | (empty) | JUMLAH PEDAPATAN
        const headerKolom = `RP ${Number(tarifKg).toLocaleString('id-ID')}/Kg`;
        brAOA.push(['WAKTU', 'DICATAT OLEH', 'NO', 'ID', 'NAMA', 'HASIL KG', '', headerKolom, '', 'JUMLAH PEDAPATAN']);

        // ── BARIS DATA ──
        brRecords.forEach(rec => {
            const rateKg = rec.rates.kg || 250;
            const labelWaktu = formatTanggalIndo(rec.date);
            const startRow = brAOA.length; // indeks baris pertama rekaman ini

            rec.loaders.forEach((loader, idx) => {
                const jmlKg = loader.kg || 0;
                const jumlahPremi = loader.amount || Math.round(jmlKg * rateKg);

                brAOA.push([
                    idx === 0 ? labelWaktu : null,                  // A: WAKTU (di-merge)
                    idx === 0 ? (rec.createdBy || 'Public') : null, // B: DICATAT OLEH (di-merge)
                    brNo++,                          // C: NO
                    loader.nik,                      // D: ID
                    loader.name,                     // E: NAMA
                    jmlKg,                           // F: HASIL KG
                    '',                              // G: (empty)
                    rateKg,                          // H: RP 250/Kg
                    '',                              // I: (empty)
                    jumlahPremi                      // J: JUMLAH PEDAPATAN
                ]);
            });

            const endRow = brAOA.length - 1;

            // Merge kolom WAKTU (col 0) & DICATAT OLEH (col 1) jika ada lebih dari 1 pekerja per hari
            if (endRow > startRow) {
                brMerges.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });
                brMerges.push({ s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } });
            }
        });

        // Buat worksheet dari AOA
        const wsBR = XLSX.utils.aoa_to_sheet(brAOA);

        // Pasang merge cells
        if (brMerges.length > 0) {
            wsBR['!merges'] = brMerges;
        }

        // Format angka Rupiah/Desimal
        for (let r = 1; r < brAOA.length; r++) {
            // Kolom F (index 5): HASIL KG
            const addrF = XLSX.utils.encode_cell({ r, c: 5 });
            if (wsBR[addrF] && wsBR[addrF].t === 'n') {
                wsBR[addrF].z = '#,##0';
            }
            // Kolom H (index 7): RP 250/Kg
            const addrH = XLSX.utils.encode_cell({ r, c: 7 });
            if (wsBR[addrH] && wsBR[addrH].t === 'n') {
                wsBR[addrH].z = '"Rp "#,##0';
            }
            // Kolom J (index 9): JUMLAH PEDAPATAN
            const addrJ = XLSX.utils.encode_cell({ r, c: 9 });
            if (wsBR[addrJ] && wsBR[addrJ].t === 'n') {
                wsBR[addrJ].z = '"Rp "#,##0';
            }
        }

        // Lebar kolom agar presisi seperti foto
        wsBR['!cols'] = [
            { wch: 24 }, // A: WAKTU
            { wch: 18 }, // B: DICATAT OLEH
            { wch: 4 }, // C: NO
            { wch: 8 }, // D: ID
            { wch: 22 }, // E: NAMA
            { wch: 10 }, // F: HASIL KG
            { wch: 3 }, // G: (empty)
            { wch: 18 }, // H: RP 250/Kg
            { wch: 3 }, // I: (empty)
            { wch: 20 }, // J: JUMLAH PEDAPATAN
        ];

        XLSX.utils.book_append_sheet(wb, wsBR, "Ketek Brondolan");

        // ----------------------------------------------------
        // Generasi File & Download
        // ----------------------------------------------------
        const todayStr = new Date().toISOString().split('T')[0];
        const periodStr = periodIndex === 0 ? 'periode-ini' : (periodIndex === 1 ? 'periode-lalu' : `periode-${periodIndex}`);
        const filename = `dxtapremi_laporan_${periodStr}_${todayStr}.xlsx`;

        XLSX.writeFile(wb, filename);
        showToast('File Excel berhasil diunduh: ' + filename);
    } catch (err) {
        console.error('Ekspor Excel gagal', err);
        showToast('Gagal mengekspor file Excel.', true);
    }
}

// ==========================================
// KELOLA DATABASE PEKERJA (EMPLOYEE DB)
// ==========================================

// NIK pekerja bawaan (hardcoded) — tidak bisa dihapus
const BUILT_IN_NIKS = new Set(EMPLOYEE_DB.map(e => e.nik));

// Tambah & Kelola Pekerja Baru secara Dinamis (dengan dua tab)
function initEmployeeModal() {
    const btnOpen = document.getElementById('btn-add-employee-modal');
    const modal = document.getElementById('modal-employee');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('form-add-employee');

    if (!btnOpen || !modal) return;

    // Inject tab UI into modal
    injectEmployeeModalTabs(modal, form);

    const openModal = () => {
        modal.classList.remove('hidden');
        switchEmpTab('tab-add');
        document.getElementById('new-emp-name').focus();
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        form.reset();
    };

    btnOpen.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    // Close on click outside modal-card
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawName = document.getElementById('new-emp-name').value.trim();
        const rawNik = document.getElementById('new-emp-nik').value.trim();

        if (!rawName || !rawNik) {
            showToast('Lengkapi nama dan ID pekerja.', true);
            return;
        }

        const name = rawName.toUpperCase();
        const nik = rawNik.toUpperCase();

        // Cek duplikasi NIK/ID
        const isDuplicate = EMPLOYEE_DB.some(emp => emp.nik === nik);
        if (isDuplicate) {
            showToast(`Pekerja dengan ID/NIK ${nik} sudah ada di database.`, true);
            return;
        }

        const newEmp = { nik, name };

        // Tambahkan ke database aktif (lokal)
        EMPLOYEE_DB.push(newEmp);
        saveCustomEmployeesLocal();

        // Simpan ke Supabase online
        await insertEmployeeOnline(newEmp);

        showToast(`Pekerja "${name}" (${nik}) berhasil disimpan ke semua akun!`);
        form.reset();
        // Refresh daftar pekerja di tab Kelola
        renderEmployeeList();
    });
}

function injectEmployeeModalTabs(modal, form) {
    const modalCard = modal.querySelector('.modal-card');
    if (!modalCard || modalCard.querySelector('.emp-tabs')) return;

    // Insert tabs BEFORE form
    const tabsHTML = `
        <div class="emp-tabs" style="display:flex;gap:0.5rem;margin-bottom:1.25rem;border-bottom:1px solid var(--border-color);padding-bottom:0.5rem;">
            <button type="button" id="emp-tab-add" class="tab-btn active" onclick="switchEmpTab('tab-add')">Tambah Pekerja</button>
            <button type="button" id="emp-tab-manage" class="tab-btn" onclick="switchEmpTab('tab-manage')">Kelola Pekerja</button>
        </div>
        <div id="emp-panel-manage" class="hidden">
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.85rem;">Daftar pekerja tambahan yang tersimpan di database bersama. Semua akun dapat menghapus.</p>
            <div id="emp-manage-list" style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:0.5rem;"></div>
        </div>
    `;
    form.insertAdjacentHTML('beforebegin', tabsHTML);
}

function switchEmpTab(tab) {
    const form = document.getElementById('form-add-employee');
    const panelManage = document.getElementById('emp-panel-manage');
    const tabAdd = document.getElementById('emp-tab-add');
    const tabManage = document.getElementById('emp-tab-manage');

    if (tab === 'tab-add') {
        form.style.display = '';
        panelManage.classList.add('hidden');
        tabAdd.classList.add('active');
        tabManage.classList.remove('active');
    } else {
        form.style.display = 'none';
        panelManage.classList.remove('hidden');
        tabAdd.classList.remove('active');
        tabManage.classList.add('active');
        renderEmployeeList();
    }
}

function renderEmployeeList() {
    const container = document.getElementById('emp-manage-list');
    if (!container) return;

    // Hanya tampilkan pekerja custom (bukan built-in)
    const customEmps = EMPLOYEE_DB.filter(e => !BUILT_IN_NIKS.has(e.nik));

    if (customEmps.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem 0;font-size:0.88rem;">Belum ada pekerja tambahan.</p>`;
        return;
    }

    container.innerHTML = '';
    customEmps.forEach(emp => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;justify-content:space-between;align-items:center;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:0.65rem 1rem;gap:0.5rem;';
        item.innerHTML = `
            <div style="flex:1;">
                <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">${emp.name}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);font-family:monospace;">NIK: ${emp.nik}</div>
            </div>
            <button type="button" class="btn-remove-emp" data-nik="${emp.nik}" title="Hapus pekerja ini"
                style="background:var(--danger-glow);border:1px solid rgba(239,68,68,0.3);color:var(--danger);width:34px;height:34px;border-radius:var(--radius-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all var(--transition-fast);">
                <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
            </button>
        `;
        container.appendChild(item);
    });

    lucide.createIcons();

    // Bind delete buttons
    container.querySelectorAll('.btn-remove-emp').forEach(btn => {
        btn.addEventListener('click', async () => {
            const nik = btn.getAttribute('data-nik');
            const emp = EMPLOYEE_DB.find(e => e.nik === nik);
            if (!emp) return;

            if (confirm(`Hapus pekerja "${emp.name}" (${nik}) dari semua akun?`)) {
                // Hapus dari lokal
                EMPLOYEE_DB = EMPLOYEE_DB.filter(e => e.nik !== nik);
                saveCustomEmployeesLocal();

                // Hapus dari Supabase
                await deleteEmployeeOnline(nik);

                showToast(`Pekerja "${emp.name}" berhasil dihapus dari semua akun.`);
                renderEmployeeList();
            }
        });
    });
}

// Simpan daftar pekerja custom ke localStorage (hanya non-built-in)
function saveCustomEmployeesLocal() {
    const customEmps = EMPLOYEE_DB.filter(e => !BUILT_IN_NIKS.has(e.nik));
    localStorage.setItem('dxtapremi_custom_employees', JSON.stringify(customEmps));
}

// Load pekerja custom dari localStorage (saat offline / pertama kali)
function loadCustomEmployees() {
    try {
        const customEmps = JSON.parse(localStorage.getItem('dxtapremi_custom_employees') || '[]');
        if (customEmps.length > 0) {
            // Tambahkan yang belum ada
            customEmps.forEach(emp => {
                if (!EMPLOYEE_DB.some(e => e.nik === emp.nik)) {
                    EMPLOYEE_DB.push(emp);
                }
            });
        }
    } catch (e) {
        console.error('Gagal memuat pekerja tambahan dari LocalStorage', e);
    }
}

// Sinkronisasi pekerja dari Supabase (online)
async function loadEmployeesFromSupabase() {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_employees?select=*&order=created_at.desc`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });
        if (!response.ok) return;
        const data = await response.json();

        // Merge: tambahkan yang belum ada di EMPLOYEE_DB lokal
        let changed = false;
        data.forEach(row => {
            const nik = row.nik ? row.nik.toUpperCase() : '';
            const name = row.name ? row.name.toUpperCase() : '';
            if (nik && name && !EMPLOYEE_DB.some(e => e.nik === nik)) {
                EMPLOYEE_DB.push({ nik, name });
                changed = true;
            }
        });

        // Hapus dari lokal yang sudah dihapus di Supabase (custom employees saja)
        const onlineNiks = new Set(data.map(r => (r.nik || '').toUpperCase()));
        const filteredLocal = EMPLOYEE_DB.filter(e => BUILT_IN_NIKS.has(e.nik) || onlineNiks.has(e.nik));
        if (filteredLocal.length !== EMPLOYEE_DB.length) {
            EMPLOYEE_DB = filteredLocal;
            changed = true;
        }

        if (changed) {
            saveCustomEmployeesLocal();
        }
    } catch (err) {
        console.error('Gagal sinkronisasi pekerja dari Supabase:', err);
    }
}

// Insert pekerja baru ke Supabase
async function insertEmployeeOnline(emp) {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_employees`, {
            method: 'POST',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({ nik: emp.nik, name: emp.name })
        });
        if (!response.ok) console.error('Gagal menyimpan pekerja ke Supabase');
    } catch (err) {
        console.error('Gagal menyimpan pekerja ke Supabase:', err);
    }
}

// Hapus pekerja dari Supabase berdasarkan NIK
async function deleteEmployeeOnline(nik) {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_employees?nik=eq.${encodeURIComponent(nik)}`, {
            method: 'DELETE',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });
        if (!response.ok) console.error('Gagal menghapus pekerja dari Supabase');
    } catch (err) {
        console.error('Gagal menghapus pekerja dari Supabase:', err);
    }
}

function initAuth() {
    const btnLoginLogout = document.getElementById('btn-login-logout');
    const modalLogin = document.getElementById('modal-login');
    const btnCloseLogin = document.getElementById('btn-close-login-modal');
    const btnCancelLogin = document.getElementById('btn-cancel-login-modal');
    const formLogin = document.getElementById('form-login');

    // Handle click on Login/Logout button
    btnLoginLogout.addEventListener('click', () => {
        if (currentUser) {
            // Logout
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                currentUser = null;
                localStorage.removeItem('dxtapremi_user');
                showToast('Anda telah keluar.');
                updateAuthUI();
            }
        } else {
            // Open login modal
            modalLogin.classList.remove('hidden');
            document.getElementById('login-username').focus();
        }
    });

    const closeLogin = () => {
        modalLogin.classList.add('hidden');
        formLogin.reset();
    };

    btnCloseLogin.addEventListener('click', closeLogin);
    btnCancelLogin.addEventListener('click', closeLogin);

    modalLogin.addEventListener('click', (e) => {
        if (e.target === modalLogin) {
            closeLogin();
        }
    });

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('login-username').value.trim().toUpperCase();
        const passwordInput = document.getElementById('login-password').value.trim();

        if (CREDENTIALS[usernameInput] && CREDENTIALS[usernameInput] === passwordInput) {
            currentUser = usernameInput;
            localStorage.setItem('dxtapremi_user', currentUser);
            showToast(`Selamat datang, ${currentUser}!`);
            closeLogin();
            updateAuthUI();
        } else {
            showToast('Username atau Password salah!', true);
        }
    });

    updateAuthUI();
}

function updateAuthUI() {
    const btnLoginLogout = document.getElementById('btn-login-logout');
    const btnAddEmployee = document.getElementById('btn-add-employee-modal');
    const btnClearHistory = document.getElementById('btn-clear-history');
    const menuUtama = document.getElementById('menu-utama');
    const formSection = document.getElementById('form-section');

    const btnOwnerReport = document.getElementById('btn-owner-report');

    if (currentUser) {
        // Logged in
        btnLoginLogout.innerHTML = `<i data-lucide="log-out"></i> <span id="login-btn-text">Keluar (${currentUser})</span>`;
        btnLoginLogout.classList.remove('btn-primary');
        btnLoginLogout.classList.add('btn-danger-outline');

        btnAddEmployee.classList.remove('hidden');
        btnClearHistory.classList.remove('hidden');
        if (currentUser === 'OWNER' && btnOwnerReport) {
            btnOwnerReport.classList.remove('hidden');
        } else if (btnOwnerReport) {
            btnOwnerReport.classList.add('hidden');
        }

        const btnBannerControls = document.getElementById('banner-controls');
        if (currentUser === 'OWNER' && btnBannerControls) {
            btnBannerControls.classList.remove('hidden');
        } else if (btnBannerControls) {
            btnBannerControls.classList.add('hidden');
        }

        // Show navigation menu if we aren't in form section
        if (state.activeCategory) {
            menuUtama.classList.add('hidden');
            formSection.classList.remove('hidden');
        } else {
            menuUtama.classList.remove('hidden');
            formSection.classList.add('hidden');
        }

        // Show card footers for logged in users
        document.querySelectorAll('.menu-card').forEach(card => {
            card.style.cursor = 'pointer';
            const footer = card.querySelector('.card-footer');
            if (footer) footer.style.display = 'flex';
        });

    } else {
        // Not logged in
        btnLoginLogout.innerHTML = `<i data-lucide="log-in"></i> <span id="login-btn-text">Masuk</span>`;
        btnLoginLogout.classList.add('btn-primary');
        btnLoginLogout.classList.remove('btn-danger-outline');

        btnAddEmployee.classList.add('hidden');
        btnClearHistory.classList.add('hidden');
        if (btnOwnerReport) btnOwnerReport.classList.add('hidden');
        
        const btnBannerControls = document.getElementById('banner-controls');
        if (btnBannerControls) btnBannerControls.classList.add('hidden');

        // Allow visitors to see cards, but not the forms
        menuUtama.classList.remove('hidden');
        formSection.classList.add('hidden');
        state.activeCategory = '';

        // Hide card footers for visitors and remove pointer cursor
        document.querySelectorAll('.menu-card').forEach(card => {
            card.style.cursor = 'default';
            const footer = card.querySelector('.card-footer');
            if (footer) footer.style.display = 'none';
        });
    }

    lucide.createIcons();

    // Toggle column header visibility
    const colActions = document.querySelectorAll('.col-action');
    colActions.forEach(el => {
        if (currentUser) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });

    // Re-render table rows to hide/show delete button
    renderHistoryTable();
}

// ==========================================
// KELOLA DATABASE ONLINE (SUPABASE REST API)
// ==========================================

async function fetchOnlineRecords() {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return null;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_records?select=*&order=date.asc,id.asc`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    });
    if (!response.ok) throw new Error("Gagal mengambil data dari Supabase");
    const data = await response.json();
    return data.map(item => ({
        id: item.id,
        date: item.date,
        category: item.category,
        division: item.division,
        vehicle: item.vehicle,
        carType: item.car_type,
        tonnage: parseFloat(item.tonnage),
        potonganHK: (item.rates && item.rates.potonganHK) ? parseFloat(item.rates.potonganHK) : 0,
        tonnagePemuat: (item.rates && item.rates.tonnagePemuat) ? parseFloat(item.rates.tonnagePemuat) : 0,
        potonganPemuat: (item.rates && item.rates.potonganPemuat) ? parseFloat(item.rates.potonganPemuat) : 0,
        rates: item.rates,
        drivers: item.drivers,
        loaders: item.loaders,
        totalPremi: parseFloat(item.total_premi),
        createdBy: item.created_by
    }));
}

async function insertOnlineRecord(rec) {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return false;
    const payload = {
        id: rec.id,
        date: rec.date,
        category: rec.category,
        division: rec.division,
        vehicle: rec.vehicle,
        car_type: rec.carType,
        tonnage: rec.tonnage,
        rates: { ...rec.rates, potonganHK: rec.potonganHK || 0, tonnagePemuat: rec.tonnagePemuat || 0, potonganPemuat: rec.potonganPemuat || 0 },
        drivers: rec.drivers,
        loaders: rec.loaders,
        total_premi: rec.totalPremi,
        created_by: rec.createdBy
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_records`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Gagal menyimpan data ke Supabase");
    return true;
}

async function updateOnlineRecord(rec) {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return false;
    const payload = {
        date: rec.date,
        category: rec.category,
        division: rec.division,
        vehicle: rec.vehicle,
        car_type: rec.carType,
        tonnage: rec.tonnage,
        rates: { ...rec.rates, potonganHK: rec.potonganHK || 0, tonnagePemuat: rec.tonnagePemuat || 0, potonganPemuat: rec.potonganPemuat || 0 },
        drivers: rec.drivers,
        loaders: rec.loaders,
        total_premi: rec.totalPremi,
        created_by: rec.createdBy
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_records?id=eq.${rec.id}`, {
        method: "PATCH",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Gagal memperbarui data di Supabase");
    return true;
}

async function deleteOnlineRecord(id) {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return false;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_records?id=eq.${id}`, {
        method: "DELETE",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    });
    if (!response.ok) throw new Error("Gagal menghapus data di Supabase");
    return true;
}

async function deleteOnlineRecordsByDate(startDate, endDate) {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return false;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_records?date=gte.${startDate}&date=lte.${endDate}`, {
        method: "DELETE",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    });
    if (!response.ok) throw new Error("Gagal menghapus data di Supabase");
    return true;
}

function initOwnerDeleteModal() {
    const modal = document.getElementById('modal-owner-delete');
    const btnClose = document.getElementById('btn-close-owner-delete');
    const btnConfirm = document.getElementById('btn-confirm-owner-delete');
    const inputStart = document.getElementById('owner-delete-start');
    const inputEnd = document.getElementById('owner-delete-end');

    if (!modal) return;

    btnClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    btnConfirm.addEventListener('click', async () => {
        const start = inputStart.value;
        const end = inputEnd.value;

        if (!start || !end) {
            showToast('Pilih rentang tanggal yang valid.', true);
            return;
        }

        if (start > end) {
            showToast('Tanggal akhir tidak boleh lebih awal dari tanggal mulai.', true);
            return;
        }

        if (!confirm(`Hapus SEMUA data dari tanggal ${start} sampai ${end}? Tindakan ini permanen.`)) {
            return;
        }

        // Delete locally
        state.records = state.records.filter(r => r.date < start || r.date > end);
        saveLocalRecords();
        updateStats();
        renderHistoryTable();

        modal.classList.add('hidden');

        // Delete from Supabase
        if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL") {
            try {
                showToast('Menghapus data online...');
                await deleteOnlineRecordsByDate(start, end);
                showToast(`Data rentang ${start} hingga ${end} berhasil dihapus online.`);
            } catch (err) {
                console.error(err);
                showToast('Gagal menghapus data online rentang tersebut.', true);
            }
        } else {
            showToast(`Data rentang ${start} hingga ${end} berhasil dihapus lokal.`, true);
        }
    });
}

function initOwnerReport() {
    const btnOpen = document.getElementById('btn-owner-report');
    const modal = document.getElementById('modal-owner-report');
    const btnClose = document.getElementById('btn-close-owner-report');
    const btnExcel = document.getElementById('btn-owner-report-excel');
    const reportBody = document.getElementById('owner-report-body');

    if (!btnOpen || !modal) return;

    let reportData = []; // Store the data to be exported

    btnOpen.addEventListener('click', () => {
        if (currentUser !== 'OWNER') return;

        // Generate report data
        const today = new Date();
        const currentMonth = today.getMonth(); // 0-11
        const currentYear = today.getFullYear();
        const cutoffDate = new Date(currentYear, currentMonth, 26); // Before 26th of this month

        const summaryMap = {};

        state.records.forEach(rec => {
            const dateParts = rec.date.split('-');
            const recDateObj = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));

            // Only include records before the 25th of the current month
            if (recDateObj < cutoffDate) {
                // Add drivers (Exclude Dump Truck and Kontraktor)
                if (rec.category !== 'dump-truck' && rec.carType !== 'MOBIL KONTRAKTOR') {
                    rec.drivers.forEach(driver => {
                        if (!summaryMap[driver.nik]) {
                            summaryMap[driver.nik] = { nik: driver.nik, name: driver.name, total: 0 };
                        }
                        summaryMap[driver.nik].total += driver.amount;
                    });
                }
                
                // Add loaders
                rec.loaders.forEach(loader => {
                    if (!summaryMap[loader.nik]) {
                        summaryMap[loader.nik] = { nik: loader.nik, name: loader.name, total: 0 };
                    }
                    summaryMap[loader.nik].total += loader.amount;
                });
            }
        });

        // Convert map to array, calculate fee, and filter out those with 0 total
        reportData = Object.values(summaryMap).filter(item => item.total > 0).map(item => {
            const fee = item.total * 0.04;
            const netTotal = item.total - fee;
            return {
                nik: item.nik,
                name: item.name,
                total: item.total,
                fee: fee,
                netTotal: netTotal
            };
        });

        // Sort by Total Descending
        reportData.sort((a, b) => b.total - a.total);

        // Render Table
        reportBody.innerHTML = '';
        const reportFoot = document.getElementById('owner-report-foot');
        if (reportFoot) reportFoot.innerHTML = '';

        if (reportData.length === 0) {
            reportBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 1rem; color: var(--text-muted);">Tidak ada data hasil kerja sebelum tanggal 26 bulan ini.</td></tr>';
        } else {
            let sumTotal = 0;
            let sumFee = 0;
            let sumNetTotal = 0;

            reportData.forEach(row => {
                sumTotal += row.total;
                sumFee += row.fee;
                sumNetTotal += row.netTotal;

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 0.75rem;">${row.nik}</td>
                    <td style="padding: 0.75rem; font-weight: 500;">${row.name}</td>
                    <td style="padding: 0.75rem;">${formatRupiah(row.total)}</td>
                    <td style="padding: 0.75rem; color: var(--danger); font-weight: 600;">${formatRupiah(row.fee)}</td>
                    <td style="padding: 0.75rem; color: var(--accent-gold); font-weight: 700;">${formatRupiah(row.netTotal)}</td>
                `;
                reportBody.appendChild(tr);
            });

            // Render Foot
            if (reportFoot) {
                const trFoot = document.createElement('tr');
                trFoot.innerHTML = `
                    <td colspan="2" style="padding: 0.75rem; text-align: right; color: var(--text-secondary);">GRAND TOTAL</td>
                    <td style="padding: 0.75rem;">${formatRupiah(sumTotal)}</td>
                    <td style="padding: 0.75rem; color: var(--danger);">${formatRupiah(sumFee)}</td>
                    <td style="padding: 0.75rem; color: var(--accent-gold);">${formatRupiah(sumNetTotal)}</td>
                `;
                reportFoot.appendChild(trFoot);
            }
        }

        modal.classList.remove('hidden');
    });

    btnClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    btnExcel.addEventListener('click', () => {
        if (reportData.length === 0) {
            showToast('Tidak ada data untuk diekspor.', true);
            return;
        }

        try {
            const wb = XLSX.utils.book_new();
            const excelRows = reportData.map((row, index) => ({
                "NO": index + 1,
                "ID": row.nik,
                "NAMA": row.name,
                "TOTAL HASIL KERJA": row.total,
                "FEE 4%": row.fee,
                "PENDAPATAN BERSIH": row.netTotal
            }));

            // Add Grand Total Row
            const sumTotal = reportData.reduce((acc, curr) => acc + curr.total, 0);
            const sumFee = reportData.reduce((acc, curr) => acc + curr.fee, 0);
            const sumNetTotal = reportData.reduce((acc, curr) => acc + curr.netTotal, 0);

            excelRows.push({
                "NO": "",
                "ID": "",
                "NAMA": "GRAND TOTAL",
                "TOTAL HASIL KERJA": sumTotal,
                "FEE 4%": sumFee,
                "PENDAPATAN BERSIH": sumNetTotal
            });

            const ws = XLSX.utils.json_to_sheet(excelRows);

            // Formatting columns for Currency
            for (let r = 1; r <= excelRows.length; r++) {
                const cols = [3, 4, 5]; // Indexes for TOTAL HASIL KERJA, FEE 4%, PENDAPATAN BERSIH
                cols.forEach(c => {
                    const addr = XLSX.utils.encode_cell({ r, c });
                    if (ws[addr] && ws[addr].t === 'n') ws[addr].z = '"Rp "#,##0';
                });
            }

            ws['!cols'] = [
                { wch: 5 },  // NO
                { wch: 15 }, // ID
                { wch: 30 }, // NAMA
                { wch: 22 }, // TOTAL HASIL KERJA
                { wch: 18 }, // FEE 4%
                { wch: 22 }, // PENDAPATAN BERSIH
            ];

            XLSX.utils.book_append_sheet(wb, ws, "Laporan Pendapatan Pekerja");
            XLSX.writeFile(wb, "Laporan_Pendapatan_Pekerja_Owner.xlsx");
            showToast('File Excel berhasil diunduh!');
        } catch (e) {
            console.error(e);
            showToast('Gagal mengekspor Excel.', true);
        }
    });
}

async function deleteMyOnlineRecords(username) {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") return false;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/dxtapremi_records?created_by=eq.${username}`, {
        method: "DELETE",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    });
    if (!response.ok) throw new Error("Gagal menghapus data di Supabase");
    return true;
}

async function loadRecords(forceRefresh = false) {
    // 1. Tampilkan data lokal terlebih dahulu agar cepat
    const saved = localStorage.getItem('dxtapremi_records');
    if (saved) {
        try {
            state.records = JSON.parse(saved);
            updateStats();
            renderHistoryTable();
        } catch (e) {
            console.error('Gagal memuat data lokal', e);
        }
    }

    // 2. Hubungkan ke database online jika tersedia
    if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL") {
        try {
            if (forceRefresh) {
                showToast('Menyegarkan data online...');
            }
            const onlineRecords = await fetchOnlineRecords();
            if (onlineRecords) {
                state.records = onlineRecords;
                saveLocalRecords(); // Backup ke lokal
                updateStats();
                renderHistoryTable();
                if (forceRefresh) {
                    showToast('Data berhasil disegarkan online!');
                }
            }
        } catch (err) {
            console.error(err);
            showToast('Gagal terhubung online. Menggunakan data offline.', true);
        }
    } else if (forceRefresh) {
        showToast('Database online belum dikonfigurasi.', true);
    }
}

// Cek Penghasilan Modal Logic
function initCekPenghasilan() {
    const btnOpen = document.getElementById('btn-cek-penghasilan');
    const btnClose = document.getElementById('btn-close-cek-modal');
    const modal = document.getElementById('modal-cek-penghasilan');
    const btnCari = document.getElementById('btn-cek-cari');
    const inputNama = document.getElementById('input-cek-nama');
    const resultContainer = document.getElementById('cek-result-container');
    const totalAmount = document.getElementById('cek-total-amount');
    const historyBody = document.getElementById('cek-history-body');
    const emptyState = document.getElementById('cek-empty-state');
    const dropdown = document.getElementById('cek-nama-dropdown');

    if (!btnOpen || !modal) return;

    // Autocomplete Logic
    inputNama.addEventListener('input', (e) => {
        const value = e.target.value.trim().toUpperCase();
        if (!value) {
            if (dropdown) {
                dropdown.innerHTML = '';
                dropdown.classList.add('hidden');
            }
            return;
        }

        // Kumpulkan semua nama dari EMPLOYEE_DB dan riwayat catatan (records)
        const allNamesMap = new Map();
        
        // Dari EMPLOYEE_DB
        EMPLOYEE_DB.forEach(emp => {
            allNamesMap.set(emp.name.toUpperCase(), emp.nik);
        });
        
        // Dari data riwayat yang sudah dicatat
        state.records.forEach(rec => {
            rec.drivers.forEach(d => {
                if (d.name) allNamesMap.set(d.name.toUpperCase(), d.nik || '-');
            });
            rec.loaders.forEach(l => {
                if (l.name) allNamesMap.set(l.name.toUpperCase(), l.nik || '-');
            });
        });

        const combinedList = Array.from(allNamesMap, ([name, nik]) => ({ name, nik }));
        const matches = combinedList.filter(emp => emp.name.includes(value));
        
        if (dropdown) {
            renderDropdownItems(matches, dropdown, (selectedEmp) => {
                inputNama.value = selectedEmp.name;
                dropdown.classList.add('hidden');
                dropdown.innerHTML = '';
                performSearch(); // Auto-search
            });
        }
    });

    inputNama.addEventListener('blur', () => {
        setTimeout(() => {
            if (dropdown) dropdown.classList.add('hidden');
        }, 200);
    });

    btnOpen.addEventListener('click', () => {
        modal.classList.remove('hidden');
        inputNama.value = '';
        resultContainer.classList.add('hidden');
        setTimeout(() => inputNama.focus(), 100);
    });

    btnClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    const btnCekPeriode = document.getElementById('btn-cek-periode');
    const lblCekPeriode = document.getElementById('cek-periode-label');
    
    // Initialize label
    if (lblCekPeriode) lblCekPeriode.textContent = formatPeriodLabel(state.activeCekPeriodIndex);

    if (btnCekPeriode) {
        btnCekPeriode.addEventListener('click', () => {
            openPeriodPicker(btnCekPeriode, state.activeCekPeriodIndex, (idx) => {
                state.activeCekPeriodIndex = idx;
                if (lblCekPeriode) lblCekPeriode.textContent = formatPeriodLabel(idx);
                if (inputNama.value.trim()) performSearch();
            });
        });
    }

    const performSearch = () => {
        const query = inputNama.value.trim().toLowerCase();
        if (!query) {
            showToast('Masukkan nama pekerja terlebih dahulu.', true);
            return;
        }

        // Use shared period helper
        const { start: periodStart, end: periodEnd } = getPeriodDates(state.activeCekPeriodIndex);

        let total = 0;
        const findings = [];

        // Search in records
        state.records.forEach(rec => {
            const dateParts = rec.date.split('-');
            const recDateObj = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
            
            const include = recDateObj >= periodStart && recDateObj <= periodEnd;

            if (include) {
                // Check drivers
                rec.drivers.forEach(driver => {
                    if (driver.name.toLowerCase().includes(query)) {
                        total += driver.amount;
                        let peran = rec.category === 'tractor' ? 'Operator' : 'Supir';
                        let jobLabel = rec.category === 'dump-truck' ? 'Dump Truck' : (rec.category === 'tractor' ? 'Traktor' : 'Brondolan');
                        findings.push({
                            date: rec.date,
                            job: `${jobLabel} (${peran})`,
                            amount: driver.amount
                        });
                    }
                });
                // Check loaders
                rec.loaders.forEach(loader => {
                    if (loader.name.toLowerCase().includes(query)) {
                        total += loader.amount;
                        let peran = rec.category === 'brondolan' ? 'Pengumpul' : 'Pemuat';
                        let jobLabel = rec.category === 'dump-truck' ? 'Dump Truck' : (rec.category === 'tractor' ? 'Traktor' : 'Brondolan');
                        findings.push({
                            date: rec.date,
                            job: `${jobLabel} (${peran})`,
                            amount: loader.amount
                        });
                    }
                });
            }
        });

        // Sort findings by date descending
        findings.sort((a, b) => b.date.localeCompare(a.date));

        // Render results
        resultContainer.classList.remove('hidden');
        totalAmount.textContent = formatRupiah(total);
        historyBody.innerHTML = '';

        if (findings.length === 0) {
            emptyState.classList.remove('hidden');
            historyBody.parentElement.style.display = 'none';
        } else {
            emptyState.classList.add('hidden');
            historyBody.parentElement.style.display = 'table';
            
            findings.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                
                tr.innerHTML = `
                    <td style="padding: 0.5rem 0.75rem; color: var(--text-secondary);">${item.date}</td>
                    <td style="padding: 0.5rem 0.75rem; font-weight: 500;">${item.job}</td>
                    <td style="padding: 0.5rem 0.75rem; font-weight: 700; color: var(--accent-gold);">${formatRupiah(item.amount)}</td>
                `;
                historyBody.appendChild(tr);
            });
        }
    };

    btnCari.addEventListener('click', performSearch);
    inputNama.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}
