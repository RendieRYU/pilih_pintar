/* ── Helper: generate e-commerce search links ─────────── */
function makeLinks(productName) {
  const q = encodeURIComponent(productName);
  return [
    { store: "Tokopedia", url: `https://www.tokopedia.com/search?q=${q}` },
    { store: "Shopee", url: `https://shopee.co.id/search?keyword=${q}` },
    { store: "Blibli", url: `https://www.blibli.com/jual/${q}` },
  ];
}

/* ── Fallback mock data (used when backend is offline) ── */
const MOCK_DATA = {
  mouse: [
    {
      name: "Logitech G304 Lightspeed",
      price: "Rp 399.000",
      matchScore: 96,
      pros: [
        "Sensor HERO 12K, akurasi tinggi untuk gaming kompetitif",
        "Wireless dengan latensi rendah 1ms, tanpa kabel ribet",
      ],
      cons: ["Desain kurang ergonomis untuk tangan besar"],
      links: makeLinks("Logitech G304 Lightspeed"),
    },
    {
      name: "Razer Viper Mini",
      price: "Rp 349.000",
      matchScore: 90,
      pros: [
        "Ultra-ringan 61g, cocok untuk flick cepat di FPS",
        "Sensor optik 8500 DPI, sangat presisi",
      ],
      cons: ["Kabel bawaan agak kaku, perlu paracord tambahan"],
      links: makeLinks("Razer Viper Mini"),
    },
    {
      name: "Fantech Helios XD5",
      price: "Rp 459.000",
      matchScore: 84,
      pros: [
        "Wireless dual-mode (2.4GHz + Bluetooth), fleksibel",
        "Baterai tahan hingga 80 jam, charging via USB-C",
      ],
      cons: ["Software Fantech kurang intuitif dibanding brand besar"],
      links: makeLinks("Fantech Helios XD5"),
    },
  ],
  tws: [
    {
      name: "QCY MeloBuds ANC",
      price: "Rp 349.000",
      matchScore: 95,
      pros: [
        "Bass kuat dengan driver 10mm, ada ANC aktif",
        "Harga sangat terjangkau, value for money terbaik",
      ],
      cons: ["Build quality plastik, kurang premium di tangan"],
      links: makeLinks("QCY MeloBuds ANC"),
    },
    {
      name: "Soundpeats Air4 Pro",
      price: "Rp 489.000",
      matchScore: 88,
      pros: [
        "Suara balanced dengan bass boost mode",
        "Mendukung LDAC codec untuk kualitas audio hi-res",
      ],
      cons: ["Agak bulky, kurang cocok untuk telinga kecil"],
      links: makeLinks("Soundpeats Air4 Pro"),
    },
    {
      name: "KZ Castor Improved",
      price: "Rp 275.000",
      matchScore: 82,
      pros: [
        "Dual driver (DD + BA), detail vokal sangat jernih",
        "Harga paling murah di kelasnya dengan kualitas studio",
      ],
      cons: ["Isolasi pasif saja, tidak ada ANC"],
      links: makeLinks("KZ Castor Improved"),
    },
  ],
  laptop: [
    {
      name: "Acer Aspire 5 (A515-58M)",
      price: "Rp 8.999.000",
      matchScore: 94,
      pros: [
        "Intel Core i5-1335U, performa kencang untuk multitasking",
        "SSD 512GB + RAM 8GB, booting & loading app super cepat",
      ],
      cons: ["Layar IPS agak redup di bawah sinar matahari langsung"],
      links: makeLinks("Acer Aspire 5 A515-58M"),
    },
    {
      name: "Lenovo IdeaPad Slim 3",
      price: "Rp 7.499.000",
      matchScore: 87,
      pros: [
        "Desain tipis ringan 1.63 kg, mudah dibawa kemana-mana",
        "Baterai tahan 8+ jam, cocok untuk mahasiswa mobile",
      ],
      cons: ["Performa grafis terbatas, kurang untuk editing video berat"],
      links: makeLinks("Lenovo IdeaPad Slim 3"),
    },
    {
      name: "ASUS Vivobook 14 (X1404ZA)",
      price: "Rp 7.999.000",
      matchScore: 83,
      pros: [
        "Layar 14 inch FHD IPS dengan anti-glare coating",
        "Keyboard ergonomis dengan numpad, nyaman untuk ngetik lama",
      ],
      cons: [
        "Cooling system standar, bisa agak hangat saat multitasking berat",
      ],
      links: makeLinks("ASUS Vivobook 14 X1404ZA"),
    },
  ],
  smartwatch: [
    {
      name: "Amazfit Bip 5",
      price: "Rp 899.000",
      matchScore: 93,
      pros: [
        "Bisa balas WA & baca notif lengkap langsung dari jam",
        "GPS built-in + 120 sport mode, fitur sangat lengkap",
      ],
      cons: ["Layar kurang tajam di bawah sinar matahari terik"],
      links: makeLinks("Amazfit Bip 5"),
    },
    {
      name: "Xiaomi Redmi Watch 4",
      price: "Rp 649.000",
      matchScore: 88,
      pros: [
        "Layar AMOLED 1.97 inch besar & jernih",
        "Baterai tahan 18 hari, jarang perlu charging",
      ],
      cons: ["Fitur balas pesan terbatas di beberapa HP non-Xiaomi"],
      links: makeLinks("Xiaomi Redmi Watch 4"),
    },
    {
      name: "Haylou Watch S8",
      price: "Rp 299.000",
      matchScore: 80,
      pros: [
        "Harga paling murah dengan layar AMOLED",
        "Sensor SpO2 & heart rate 24 jam, fitur kesehatan lengkap",
      ],
      cons: ["Tidak bisa balas WA, hanya notifikasi masuk saja"],
      links: makeLinks("Haylou Watch S8"),
    },
  ],
  keyboard: [
    {
      name: "Royal Kludge RK68",
      price: "Rp 459.000",
      matchScore: 95,
      pros: [
        "Tri-mode (wireless 2.4G, BT, kabel), fleksibel untuk segala setup",
        "Hot-swappable switches, bisa ganti switch tanpa solder",
      ],
      cons: ["Keycap bawaan ABS, cepat kilap setelah pemakaian lama"],
      links: makeLinks("Royal Kludge RK68"),
    },
    {
      name: "Fantech MAXFIT67 MK858",
      price: "Rp 599.000",
      matchScore: 89,
      pros: [
        "Gasket mount, typing feel empuk dan satisfying",
        "RGB per-key, software kustomisasi lengkap",
      ],
      cons: ["Agak berat (800g), kurang portable untuk dibawa-bawa"],
      links: makeLinks("Fantech MAXFIT67 MK858"),
    },
    {
      name: "Redragon K530 Draconic",
      price: "Rp 549.000",
      matchScore: 83,
      pros: [
        "Layout 60% compact, hemat ruang di meja",
        "Baterai 2000mAh tahan berminggu-minggu",
      ],
      cons: ["Tidak ada tombol arrow dedicated, butuh adaptasi"],
      links: makeLinks("Redragon K530 Draconic"),
    },
  ],
};

/**
 * Fallback: cocokkan query ke mock data jika backend offline.
 * Return null jika tidak ada kategori yang cocok.
 */
export function getMockProducts(query) {
  const q = query.toLowerCase();
  const keywordMap = [
    {
      keys: ["mouse", "mice", "gaming mouse", "wireless mouse"],
      cat: "mouse",
    },
    {
      keys: ["tws", "earbuds", "earphone", "headset", "bass", "anc"],
      cat: "tws",
    },
    {
      keys: ["laptop", "notebook", "coding", "tugas berat", "kuliah"],
      cat: "laptop",
    },
    {
      keys: ["smartwatch", "jam tangan", "watch", "balas wa"],
      cat: "smartwatch",
    },
    {
      keys: ["keyboard", "mechanical", "mekanikal", "keycap", "typing"],
      cat: "keyboard",
    },
  ];

  for (const { keys, cat } of keywordMap) {
    if (keys.some((k) => q.includes(k))) {
      return MOCK_DATA[cat];
    }
  }

  return null;
}
