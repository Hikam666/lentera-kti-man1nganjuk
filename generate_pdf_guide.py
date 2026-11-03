import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running Header
        self.drawString(20 * mm, 282 * mm, "Lentera KTI — Panduan Penggunaan Aplikasi")
        self.drawRightString(190 * mm, 282 * mm, "MAN 1 Nganjuk · TA 2026/2027")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

        # Running Footer
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 11 * mm, "Pedoman Penulisan KTI · Gaya Sitasi APA Edisi Ke-7 · Pemilik: Mustagfiroh")
        page_str = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(190 * mm, 11 * mm, page_str)

        self.restoreState()

def build_pdf(filename="Panduan_Penggunaan_Aplikasi_Lentera_KTI_MAN1Nganjuk.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=20 * mm
    )

    styles = getSampleStyleSheet()

    # Palette
    C_NAVY = colors.HexColor("#0F2657")
    C_BLUE = colors.HexColor("#1D4FB0")
    C_ACCENT = colors.HexColor("#2A5FD9")
    C_INK = colors.HexColor("#1E2A44")
    C_MUTED = colors.HexColor("#475569")
    C_BG_SOFT = colors.HexColor("#F8FAFC")
    C_BORDER = colors.HexColor("#E2E8F0")
    C_TEAL = colors.HexColor("#0D9488")
    C_GREEN = colors.HexColor("#15803D")

    # Typography Styles
    title_cover = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=C_NAVY,
        alignment=1, # Center
        spaceAfter=10
    )

    sub_cover = ParagraphStyle(
        'CoverSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=C_BLUE,
        alignment=1,
        spaceAfter=15
    )

    meta_cover = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=C_MUTED,
        alignment=1
    )

    h1 = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=C_NAVY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2 = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=C_BLUE,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=C_INK,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body,
        fontName='Helvetica-Bold'
    )

    bullet = ParagraphStyle(
        'Bullet',
        parent=body,
        leftIndent=14,
        bulletIndent=5,
        spaceAfter=3
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=body,
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#0C4A6E")
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=C_INK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold'
    )

    story = []

    # ==================== COVER PAGE ====================
    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph("BUKU PANDUAN PENGGUNAAN", ParagraphStyle('TopLabel', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, textColor=C_ACCENT, alignment=1, spaceAfter=8)))
    story.append(Paragraph("APLIKASI LENTERA KTI", title_cover))
    story.append(HRFlowable(width="60%", thickness=2, color=C_BLUE, spaceBefore=4, spaceAfter=14))
    story.append(Paragraph("Media Inovasi Pembelajaran Bahasa Indonesia pada Materi Karya Tulis Ilmiah (KTI) Kelas XI", sub_cover))
    story.append(Spacer(1, 15 * mm))

    # Badge Box in Cover
    badge_data = [
        [Paragraph("<b>Landasan Pedoman:</b> Pedoman Penulisan KTI (Paper) MAN 1 Nganjuk TA 2026/2027", meta_cover)],
        [Paragraph("<b>Standar Sitasi:</b> American Psychological Association (APA) Edisi Ke-7", meta_cover)],
        [Paragraph("<b>Bingkai Karakter:</b> Nilai Kurikulum Berbasis Cinta (KBC)", meta_cover)],
    ]
    badge_table = Table(badge_data, colWidths=[150 * mm])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EEF2FA")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#C7D9FE")),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(badge_table)

    story.append(Spacer(1, 45 * mm))

    # Cover Footer
    story.append(Paragraph("<b>Disusun dan Dikembangkan Oleh:</b>", ParagraphStyle('DevBy', parent=meta_cover, fontName='Helvetica-Bold', fontSize=10, textColor=C_NAVY, spaceAfter=2)))
    story.append(Paragraph("<b>MUSTAGFIROH</b><br/>Guru Bahasa Indonesia — MAN 1 Nganjuk<br/>Kementerian Agama Republik Indonesia", meta_cover))
    story.append(PageBreak())

    # ==================== BAB I: PENGENALAN ====================
    story.append(Paragraph("BAB I: PENGENALAN &amp; KETENTUAN POKOK KTI", h1))
    story.append(Paragraph(
        "<b>Lentera KTI</b> adalah media pembelajaran berbasis web yang dirancang khusus untuk mendampingi "
        "murid kelas XI MAN 1 Nganjuk dalam menyusun proposal riset dan karya tulis ilmiah (paper). "
        "Aplikasi ini mengacu sepenuhnya pada <i>Pedoman Penulisan KTI (Paper) MAN 1 Nganjuk Tahun Ajaran 2026/2027</i> "
        "dan menerapkan standar sitasi <b>APA Edisi Ke-7</b>.",
        body
    ))
    story.append(Paragraph(
        "Seluruh proses pemeriksaan berjalan secara otomatis berbasis aturan (<i>rule-based heuristics</i>) "
        "langsung di peramban pengguna (<i>client-side</i>). Hal ini memastikan naskah murid tetap terjaga kerahasiaannya, "
        "tidak membutuhkan biaya server/database, dan dapat diakses dengan sangat cepat baik dari laptop maupun telepon pintar.",
        body
    ))

    # Callout Info Box
    callout_data = [[
        Paragraph(
            "<b>PENTING DIPAHAMI:</b><br/>"
            "Aplikasi Lentera KTI berfungsi sebagai <b>alat bantu telaah awal mandiri</b>. Keputusan penerimaan, "
            "pengesahan naskah, dan penilaian substansi keilmuan tetap berada sepenuhnya di bawah wewenang <b>Guru Pembimbing</b>.",
            callout_text
        )
    ]]
    callout_table = Table(callout_data, colWidths=[170 * mm])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0F9FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BAE6FD")),
        ('LINELEFT', (0, 0), (0, 0), 4, colors.HexColor("#0284C7")),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("1.1 Sistematika Paper (Tujuh Bagian Pokok) &amp; Batas Kata", h2))
    story.append(Paragraph(
        "Naskah karya tulis ilmiah (paper) di MAN 1 Nganjuk wajib memuat tujuh bagian terstruktur. "
        "Tiap bagian memiliki batas maksimal kata yang diatur dalam pedoman resmi:",
        body
    ))

    # Table of sections
    t_data = [
        [Paragraph("No", table_header), Paragraph("Bagian Sistematika", table_header), Paragraph("Batas Kata Maksimal", table_header), Paragraph("Keterangan Pokok", table_header)],
        [Paragraph("1", table_cell), Paragraph("Abstrak", table_cell_bold), Paragraph("≤ 300 kata", table_cell), Paragraph("Ringkasan latar belakang, tujuan, metode, hasil, dan simpulan", table_cell)],
        [Paragraph("2", table_cell), Paragraph("BAB I Pendahuluan", table_cell_bold), Paragraph("≤ 1.000 kata", table_cell), Paragraph("Latar belakang, rumusan masalah, tujuan, manfaat riset, dan KBC", table_cell)],
        [Paragraph("3", table_cell), Paragraph("BAB II Kajian Teori &amp; Tinjauan Pustaka", table_cell_bold), Paragraph("≤ 1.500 kata", table_cell), Paragraph("Landasan teori relevan &amp; riset terdahulu dengan sitasi APA", table_cell)],
        [Paragraph("4", table_cell), Paragraph("BAB III Metode Riset", table_cell_bold), Paragraph("≤ 1.000 kata", table_cell), Paragraph("Jenis riset, pendekatan, teknik pengumpulan &amp; analisis data", table_cell)],
        [Paragraph("5", table_cell), Paragraph("BAB IV Hasil &amp; Pembahasan", table_cell_bold), Paragraph("≤ 3.000 kata", table_cell), Paragraph("Sajian data empirik, analisis temuan, dan insersi nilai KBC", table_cell)],
        [Paragraph("6", table_cell), Paragraph("BAB V Penutup", table_cell_bold), Paragraph("≤ 750 kata", table_cell), Paragraph("Simpulan yang menjawab rumusan masalah dan saran operasional", table_cell)],
        [Paragraph("7", table_cell), Paragraph("Daftar Pustaka", table_cell_bold), Paragraph("Tidak dibatasi", table_cell), Paragraph("Wajib menggunakan gaya APA Edisi Ke-7 (prinsip korespondensi)", table_cell)],
    ]
    table_sec = Table(t_data, colWidths=[10 * mm, 50 * mm, 35 * mm, 75 * mm])
    table_sec.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), C_NAVY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, C_BG_SOFT]),
        ('PADDING', (0, 0), (-1, -1), 4.5),
    ]))
    story.append(table_sec)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("1.2 Tiga Tema Riset Resmi Madrasah", h2))
    story.append(Paragraph("Setiap riset murid kelas XI wajib mengacu pada salah satu dari tiga tema berikut:", body))
    story.append(Paragraph("• <b>Integrasi Keislaman dan Keilmuan (Ekoteologi):</b> Menghubungkan sains dengan tauhid, etika lingkungan Islam, dan ayat kauniyah.", bullet))
    story.append(Paragraph("• <b>Sustainable Development Goals (SDGs):</b> Inovasi pemecahan isu keberlanjutan (sosial, ekonomi, lingkungan, pendidikan, dan kesehatan).", bullet))
    story.append(Paragraph("• <b>Transformasi Digital untuk Pembangunan Nasional:</b> Pemanfaatan teknologi komputasi, media digital, dan otomasi dalam pemecahan masalah.", bullet))

    story.append(Paragraph("1.3 Lima Nilai Pokok Kurikulum Berbasis Cinta (KBC)", h2))
    story.append(Paragraph(
        "KBC adalah bingkai nilai khas madrasah yang wajib disisipkan secara harmonis pada Latar Belakang dan Pembahasan:",
        body
    ))
    story.append(Paragraph("1. <b>Cinta Allah SWT dan Rasul-Nya:</b> Ibadah, rasa syukur, teladan sirah nabawiyah, dan sifat welas asih (rahmah).", bullet))
    story.append(Paragraph("2. <b>Cinta Ilmu:</b> Menuntut ilmu sebagai ibadah, nalar kritis, pembelajar sepanjang hayat, dan literasi teknologi bijak.", bullet))
    story.append(Paragraph("3. <b>Cinta Lingkungan:</b> Merawat ciptaan Allah, kepedulian ekologis, dan menghindari perusakan alam (fasad).", bullet))
    story.append(Paragraph("4. <b>Cinta Diri dan Sesama Manusia:</b> Menjaga kesehatan mental, empati, persaudaraan (ukhuwah), dan toleransi (tasamuh).", bullet))
    story.append(Paragraph("5. <b>Cinta Tanah Air:</b> Hubbul wathan minal iman, menjunjung kearifan lokal, dan kontribusi bagi kemajuan bangsa.", bullet))

    story.append(PageBreak())

    # ==================== BAB II: ANALISIS TEKS ====================
    story.append(Paragraph("BAB II: PANDUAN FITUR ANALISIS TEKS PAPER", h1))
    story.append(Paragraph(
        "Fitur <b>Analisis Teks</b> digunakan untuk menelaah naskah paper lengkap (BAB I s.d. BAB V) sebelum diserahkan "
        "ke guru pembimbing. Alat ini bekerja mendeteksi struktur naskah, memeriksa batas kata per bab, mengenali sitasi APA, "
        "serta mengevaluasi kualitas kebahasaan sesuai kaidah EYD Edisi V.",
        body
    ))

    story.append(Paragraph("2.1 Langkah-Langkah Penggunaan", h2))
    story.append(Paragraph("1. Buka menu <b>Analisis Teks</b> pada panel navigasi di sebelah kiri.", bullet))
    story.append(Paragraph("2. Salin (copy) draf naskah paper Anda, lalu tempelkan (paste) ke dalam kolom area teks yang tersedia.", bullet))
    story.append(Paragraph("3. Klik tombol biru <b>Analisis Teks</b>. Hasil telaah instan akan muncul di bawahnya dalam hitungan detik.", bullet))
    story.append(Paragraph("4. Anda juga dapat menekan <b>Muat Contoh Paper</b> untuk melihat demonstrasi naskah yang memenuhi pedoman.", bullet))
    story.append(Paragraph("5. Tombol <b>Bersihkan</b> digunakan untuk mengosongkan kolom teks kembali.", bullet))

    story.append(Paragraph("2.2 Komponen Hasil Pemeriksaan", h2))
    story.append(Paragraph("Setelah tombol Analisis Teks ditekan, sistem menampilkan enam bagian evaluasi:", body))

    story.append(Paragraph("• <b>Skor Kelengkapan Sistematika (X/7):</b> Menunjukkan berapa banyak dari 7 bagian pokok yang terdeteksi dalam naskah.", bullet))
    story.append(Paragraph("• <b>Daftar Periksa &amp; Batas Kata:</b> Setiap bagian diberi tanda centang hijau (✓) jika ditemukan, lengkap dengan jumlah kata aktual. Jika melebihi batas kata pedoman, label merah 'Melebihi Batas' akan ditampilkan.", bullet))
    story.append(Paragraph("• <b>Tinjauan Visual Naskah:</b> Teks naskah Anda ditampilkan kembali dengan sorotan visual khusus:", bullet))
    story.append(Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;- <i>Blok Kuning:</i> Judul penanda bagian/bab yang berhasil dikenali sistem.<br/>&nbsp;&nbsp;&nbsp;&nbsp;- <i>Garis Bawah Putus-putus Teal:</i> Format sitasi APA Edisi Ke-7 yang teridentifikasi.", bullet))
    story.append(Paragraph("• <b>Catatan Sitasi &amp; Korelasi:</b> Menampilkan jumlah sitasi APA yang terdeteksi dan mengingatkan pentingnya prinsip korespondensi (setiap nama dalam naskah harus tercantum di Daftar Pustaka).", bullet))

    story.append(Paragraph("2.3 Lembar Telaah Naskah (Review Card)", h2))
    story.append(Paragraph(
        "Sistem menyajikan lembar telaah kualitatif yang menguraikan:",
        body
    ))
    story.append(Paragraph("1. <b>Kekuatan Naskah:</b> Poin-poin positif naskah yang telah memenuhi ketentuan pedoman.", bullet))
    story.append(Paragraph("2. <b>Saran Perbaikan / Catatan Revisi:</b> Daftar rekomendasi hal-hal yang wajib disunting kembali oleh murid.", bullet))
    story.append(Paragraph("3. <b>Kesesuaian Antarunsur:</b> Algoritma memeriksa apakah kata kunci pada Rumusan Masalah BAB I terjawab secara nyata pada pembahasan dan simpulan di BAB IV &amp; BAB V.", bullet))
    story.append(Paragraph("4. <b>Efektivitas Penggunaan Bahasa:</b> Menguji 3 kriteria bahasa ilmiah:", bullet))
    story.append(Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;a. <i>Jelas &amp; Objektif:</i> Mendeteksi kata informal (<i>gue, aku, banget</i>) dan ungkapan subjektif (<i>menurut saya</i>).", bullet))
    story.append(Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;b. <i>Kalimat Efektif:</i> Mendeteksi pleonasme (<i>agar supaya, adalah merupakan</i>) dan kalimat terlalu panjang (>32 kata).", bullet))
    story.append(Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;c. <i>Ejaan EYD V:</i> Mendeteksi singkatan tidak baku (<i>yg, dgn, tdk</i>) dan tanda desimal titik pada bilangan kuantitatif (misal <i>3,5%</i> bukan <i>3.5%</i>). <b>Catatan:</b> Tautan URL website, DOI (<i>10.xxxx/...</i>), dan nomor subbab (<i>1.1</i>) otomatis dikecualikan agar alamat tautan tidak rusak.", bullet))

    story.append(Paragraph("2.4 Mengunduh Hasil Analisis", h2))
    story.append(Paragraph(
        "Klik tombol <b>Unduh Hasil Analisis Teks (.txt)</b> di bagian bawah untuk menyimpan berkas laporan telaah ke komputer/HP. "
        "Laporan ini dapat dilampirkan atau dikirimkan kepada guru pembimbing sebagai bukti telaah mandiri.",
        body
    ))

    story.append(PageBreak())

    # ==================== BAB III: SIMULATOR RISET ====================
    story.append(Paragraph("BAB III: PANDUAN FITUR SIMULATOR RISET (PROPOSAL)", h1))
    story.append(Paragraph(
        "Fitur <b>Simulator Riset</b> dirancang untuk membimbing murid menyusun rencana riset (proposal) secara bertahap "
        "dalam <b>13 langkah berurutan</b> sesuai Bab II Pedoman KTI MAN 1 Nganjuk. Setiap langkah dilengkapi panduan penulisan, "
        "batasan kata, dan umpan balik langsung.",
        body
    ))

    story.append(Paragraph("3.1 Tiga Belas Langkah Proposal", h2))
    steps_data = [
        ("1. Tema Riset", "Pilih 1 dari 3 tema riset resmi madrasah."),
        ("2. Judul Riset", "Berbentuk frasa ringkas, maksimal 15 kata, bukan kalimat tanya, tidak diakhiri titik."),
        ("3. Identitas Penyusun", "Nama lengkap anggota (maks. 3 orang), NISN, kelas, dan nama guru pembimbing."),
        ("4. Latar Belakang Riset", "Maks. 450 kata. Memuat 6 unsur: kondisi umum, data empirik, masalah, riset terdahulu, urgensi solusi, dan nilai KBC."),
        ("5. Rumusan Masalah", "Kalimat tanya operasional, lugas, dan bertanda tanya (?)."),
        ("6. Tujuan Riset", "Pernyataan positif yang sejalan dan menjawab rumusan masalah."),
        ("7. Manfaat Riset", "Menguraikan manfaat teoretis (keilmuan) dan manfaat praktis (aplikatif)."),
        ("8. Kajian Teori", "Maks. 350 kata. Memaparkan konsep teori kunci disertai sitasi APA."),
        ("9. Tinjauan Pustaka", "Maks. 500 kata. Memuat minimal 2 sitasi riset terdahulu dan penegasan orisinalitas/kebaruan riset."),
        ("10. Hipotesis", "Opsional (dapat dikosongkan untuk penelitian kualitatif deskriptif)."),
        ("11. Metode Riset", "Maks. 750 kata. Memuat 4 subkomponen: jenis riset, pendekatan, teknik pengumpulan, dan rencana analisis data."),
        ("12. Jadwal, Lokasi & Anggaran", "Rincian lokasi penelitian, jadwal pelaksanaan riset, dan estimasi biaya."),
        ("13. Daftar Pustaka Sementara", "Minimal 2 entri sumber rujukan bergaya APA 7th dengan tahun dalam tanda kurung, misal (2020) atau (t.t.). Mendukung format multibaris secara otomatis.")
    ]
    for s_title, s_desc in steps_data:
        story.append(Paragraph(f"• <b>{s_title}:</b> {s_desc}", bullet))

    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("3.2 Navigasi &amp; Fitur Simpan Otomatis (Auto-Save)", h2))
    story.append(Paragraph(
        "• <b>Indikator Lingkaran Langkah (Step Dots):</b> Bagian atas simulator menampilkan nomor 1 s.d. 13. "
        "Lingkaran ungu menandakan langkah aktif, lingkaran hijau bertanda (✓) menandakan bagian sudah terisi dan valid, "
        "sedangkan lingkaran abu-abu menandakan bagian yang belum lengkap.<br/>"
        "• <b>Penyimpanan Otomatis (LocalStorage):</b> Setiap huruf yang Anda ketikkan tersimpan secara otomatis "
        "di memori lokal peramban. Jika Anda tidak sengaja memuat ulang halaman atau laptop mati, draf Anda tetap aman tersimpan.<br/>"
        "• <b>Tombol Reset Isian:</b> Tombol di sudut kanan atas untuk mengosongkan seluruh formulir jika ingin memulai dari awal.",
        body
    ))

    story.append(Paragraph("3.3 Pratinjau Draf &amp; Telaah Keselarasan Proposal", h2))
    story.append(Paragraph(
        "Pada langkah ke-13, tombol hijau <b>Lihat Draf Rencana Riset</b> akan aktif. Saat ditekan, sistem akan mengompilasi "
        "seluruh isian Anda menjadi naskah proposal utuh, menilai keselarasan antarunsur (Rumusan ↔ Tujuan, Tema ↔ Judul, Latar ↔ Tinjauan), "
        "mengevaluasi insersi nilai KBC pada Latar Belakang, serta menyediakan tombol <b>Unduh sebagai .txt</b>.",
        body
    ))

    story.append(PageBreak())

    # ==================== BAB IV: CEK SIMILARITAS ====================
    story.append(Paragraph("BAB IV: PANDUAN FITUR CEK SIMILARITAS NASKAH", h1))
    story.append(Paragraph(
        "Fitur <b>Cek Similaritas</b> membantu murid melatih kejujuran akademik dan keterampilan parafrasa dengan "
        "membandingkan draf tulisan murid terhadap naskah rujukan sesuai batas toleransi Pedoman KTI (maksimal 30%).",
        body
    ))

    story.append(Paragraph("4.1 Prinsip Kerja Metode Shingle 5-Kata", h2))
    story.append(Paragraph(
        "Pemeriksaan kemiripan dilakukan secara lokal di peramban menggunakan algoritma <i>word shingle 5-gram</i>. "
        "Teks dinormalisasi dan dipecah menjadi rangkaian frasa 5 kata berturutan. Frasa yang identik pada Naskah A (Draf Murid) "
        "dan Naskah B (Sumber Pembanding) dihitung persentasenya terhadap total kata naskah.",
        body
    ))

    # Similarity Table
    sim_table_data = [
        [Paragraph("Tingkat Kemiripan", table_header), Paragraph("Status", table_header), Paragraph("Tindakan yang Diperlukan Murid", table_header)],
        [Paragraph("≤ 15%", table_cell_bold), Paragraph("<font color='#15803D'><b>BAIK (Aman)</b></font>", table_cell), Paragraph("Kemiripan rendah. Pertahankan orisinalitas kalimat.", table_cell)],
        [Paragraph("16% – 30%", table_cell_bold), Paragraph("<font color='#B45309'><b>CUKUP (Waspada)</b></font>", table_cell), Paragraph("Masih dalam batas toleransi. Periksa apakah kutipan sudah diberi sitasi APA yang benar.", table_cell)],
        [Paragraph("> 30%", table_cell_bold), Paragraph("<font color='#B91C1C'><b>PERLU DIPERBAIKI</b></font>", table_cell), Paragraph("Melebihi toleransi pedoman! Wajib memparafrasa kalimat yang disorot merah dengan gaya sendiri.", table_cell)],
    ]
    table_sim = Table(sim_table_data, colWidths=[35 * mm, 45 * mm, 90 * mm])
    table_sim.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), C_NAVY),
        ('GRID', (0, 0), (-1, -1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, C_BG_SOFT]),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(table_sim)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("4.2 Cara Menggunakan Fitur Pencari Kalimat Kunci ke Google", h2))
    story.append(Paragraph("1. Tempelkan draf tulisan murid pada kolom <b>Naskah A</b>.", bullet))
    story.append(Paragraph("2. Klik tombol <b>Cari Kalimat Kunci di Google</b> di bawah Naskah A. Sistem akan otomatis memilah kalimat khas (≥8 kata).", bullet))
    story.append(Paragraph("3. Klik tombol <b>Cari di Google</b> pada kalimat yang muncul. Google akan terbuka di tab baru mencari sumber persisnya.", bullet))
    story.append(Paragraph("4. Salin teks sumber yang Anda temukan di internet ke kolom <b>Naskah B</b>, lalu klik tombol biru <b>Cek Similaritas</b>.", bullet))
    story.append(Paragraph("5. Kalimat yang persis sama akan ditandai dengan <b>blok merah</b> pada pratinjau hasil.", bullet))

    # ==================== BAB V: REVIEW KBC ====================
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("BAB V: PANDUAN FITUR REVIEW INSERSI KBC", h1))
    story.append(Paragraph(
        "Kurikulum Berbasis Cinta (KBC) bukanlah tema riset tersendiri, melainkan <b>bingkai nilai luhur</b> "
        "yang disisipkan pada Latar Belakang dan Pembahasan paper (Lampiran 5 dan 7 Pedoman KTI).",
        body
    ))

    story.append(Paragraph("5.1 Lima Kriteria Penilaian Insersi KBC", h2))
    story.append(Paragraph("Sistem mengevaluasi lima kriteria pokok secara objektif:", body))
    story.append(Paragraph("1. <b>Penyebutan Eksplisit:</b> Istilah 'Kurikulum Berbasis Cinta' atau 'KBC' wajib tertulis eksplisit.", bullet))
    story.append(Paragraph("2. <b>Penyebutan Nama Nilai:</b> Menyebut minimal 1 dari 5 nilai pokok (Cinta Allah & Rasul, Cinta Ilmu, Cinta Lingkungan, Cinta Diri & Sesama, Cinta Tanah Air).", bullet))
    story.append(Paragraph("3. <b>Pengaitan dengan Topik/Temuan:</b> Menggunakan frasa penghubung seperti <i>'sejalan dengan'</i>, <i>'wujud nyata dari'</i>, atau <i>'mencerminkan'</i>.", bullet))
    story.append(Paragraph("4. <b>Penjelasan Makna Nilai:</b> Menjelaskan konsep nilai mengacu pada materi Lampiran 7 (minimal 2 kata kunci konsep).", bullet))
    story.append(Paragraph("5. <b>Proporsionalitas Bingkai:</b> Porsi KBC tidak boleh melebihi 40% teks dan judul riset tidak boleh memusatkan KBC.", bullet))

    story.append(Paragraph("5.2 Fitur Salin Contoh Kalimat", h2))
    story.append(Paragraph(
        "Pada bagian bawah hasil review KBC, tersedia menu lipat <b>Contoh kalimat insersi</b>. Murid dapat menekan "
        "tombol <b>Salin</b> untuk menduplikasi kalimat baku yang siap disesuaikan dengan topik riset masing-masing.",
        body
    ))

    story.append(PageBreak())

    # ==================== BAB VI: AKSES & PENUTUP ====================
    story.append(Paragraph("BAB VI: AKSES APLIKASI &amp; INTEGRITAS AKADEMIK", h1))
    story.append(Paragraph("6.1 Cara Mengakses Aplikasi Lentera KTI", h2))
    story.append(Paragraph(
        "Aplikasi Lentera KTI dapat dibuka kapan saja melalui peramban internet (Google Chrome, Microsoft Edge, Safari, Mozilla Firefox) "
        "tanpa perlu mengunduh atau memasang aplikasi dari toko aplikasi.",
        body
    ))
    story.append(Paragraph("• <b>Alamat Repositori GitHub:</b> https://github.com/Hikam666/lentera-kti-man1nganjuk", bullet))
    story.append(Paragraph("• <b>Alamat Website Resmi (Vercel):</b> https://lentera-kti-man1nganjuk.vercel.app", bullet))

    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("6.2 Komitmen Integritas &amp; Etika Akademik", h2))
    story.append(Paragraph(
        "Karya tulis ilmiah adalah sarana melatih kejujuran, ketekunan, dan nalar kritis. Dalam menulis KTI di MAN 1 Nganjuk, "
        "setiap murid diharapkan menjunjung tinggi nilai-nilai luhur:",
        body
    ))
    story.append(Paragraph("1. <b>Kejujuran Data:</b> Menyajikan data dan fakta penelitian secara jujur tanpa rekayasa (fabrikasi atau falsifikasi).", bullet))
    story.append(Paragraph("2. <b>Penghormatan Hak Cipta:</b> Wajib menyertakan sitasi gaya APA Edisi Ke-7 untuk setiap ide, teori, atau kalimat yang dikutip dari karya orang lain.", bullet))
    story.append(Paragraph("3. <b>Membiasakan Parafrasa:</b> Menuliskan kembali gagasan dari sumber bacaan dengan susunan kalimat sendiri tanpa mengubah makna aslinya.", bullet))
    story.append(Paragraph("4. <b>Konsultasi Berkelanjutan:</b> Menjadikan catatan dari aplikasi Lentera KTI sebagai bahan diskusi awal saat sesi bimbingan tatap muka bersama guru pembimbing.", bullet))

    story.append(Spacer(1, 10 * mm))

    # Closing Signature Box
    sig_data = [
        [Paragraph("<b>Mengetahui dan Mengesahkan,</b>", ParagraphStyle('SigHeader', parent=body, alignment=1))],
        [Spacer(1, 15 * mm)],
        [Paragraph("<b>MUSTAGFIROH</b><br/>NIP. Guru Bahasa Indonesia<br/><b>MAN 1 Nganjuk</b>", ParagraphStyle('SigName', parent=body, fontName='Helvetica-Bold', alignment=1))],
    ]
    sig_table = Table(sig_data, colWidths=[170 * mm])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(sig_table)

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF berhasil dibuat: {filename}")

if __name__ == '__main__':
    build_pdf()
