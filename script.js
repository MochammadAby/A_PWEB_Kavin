const defaultDataJoki = [
  {
    id: "1",
    kode: "ML-01",
    nama: "Epic ke Legend",
    kategori: "Mobile Legends",
    stok: "10",
    harga: "50000",
    tanggal: "2026-04-21",
  },
  {
    id: "2",
    kode: "ML-02",
    nama: "Legend ke Mythic",
    kategori: "Mobile Legends",
    stok: "3",
    harga: "100000",
    tanggal: "2026-04-21",
  },
  {
    id: "3",
    kode: "VL-01",
    nama: "Iron ke Gold",
    kategori: "Valorant",
    stok: "5",
    harga: "150000",
    tanggal: "2026-04-22",
  },
];

let jokiData =
  JSON.parse(localStorage.getItem("dataJokssFinal")) || defaultDataJoki;
let editId = null;

// DOM Selection
const form = document.getElementById("form-joki");
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search-input");
const checkboxes = document.querySelectorAll(".filter-chk");

const updateStats = (data) => {
  const totalItem = data.length;
  const totalNilai = data.reduce(
    (acc, curr) => acc + Number(curr.stok) * Number(curr.harga),
    0,
  );
  const stokMenipis = data.filter((item) => Number(item.stok) < 5).length;

  document.getElementById("stat-total").textContent = totalItem;
  document.getElementById("stat-nilai").textContent =
    totalNilai.toLocaleString("id-ID");
  document.getElementById("stat-menipis").textContent = stokMenipis;
};

const renderTable = (data) => {
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td>${item.kategori}</td>
            <td>${item.stok}</td>
            <td>Rp ${Number(item.harga).toLocaleString("id-ID")}</td>
            <td>${item.tanggal}</td>
            <td class="td-aksi">
                <button class="btn-edit-tbl" data-id="${item.id}">Edit</button>
                <button class="btn-delete-tbl" data-id="${item.id}">Hapus</button>
            </td>
        `;
    tableBody.appendChild(tr);
  });

  updateStats(data);
};

// isi custom
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const kode = document.getElementById("kode").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const kategori = document.getElementById("kategori").value;
  const stok = document.getElementById("stok").value;
  const harga = document.getElementById("harga").value;
  const tanggal = document.getElementById("tanggal").value;
  const errorMsg = document.getElementById("error-msg");

  if (!kode || !nama || !kategori || !stok || !harga || !tanggal) {
    errorMsg.style.display = "block";
    return;
  }
  errorMsg.style.display = "none";

  const newData = {
    id: editId || Date.now().toString(),
    kode,
    nama,
    kategori,
    stok,
    harga,
    tanggal,
  };

  if (editId) {
    // edit array
    jokiData = jokiData.map((item) => (item.id === editId ? newData : item));
    editId = null;
    document.getElementById("btn-submit").textContent = "Simpan Paket Baru";
  } else {
    jokiData.push(newData);
  }

  // nyimpan ke lokal storage
  localStorage.setItem("dataJokssFinal", JSON.stringify(jokiData));
  form.reset();
  renderFilteredData();
});

// edit hapus tabelnya
tableBody.addEventListener("click", (e) => {
  const id = e.target.getAttribute("data-id");

  if (e.target.classList.contains("btn-delete-tbl")) {
    if (confirm("Yakin mau hapus paket joki ini?")) {
      jokiData = jokiData.filter((item) => item.id !== id);
      localStorage.setItem("dataJokssFinal", JSON.stringify(jokiData));
      renderFilteredData();
    }
  }

  if (e.target.classList.contains("btn-edit-tbl")) {
    const item = jokiData.find((d) => d.id === id);
    if (item) {
      document.getElementById("kode").value = item.kode;
      document.getElementById("nama").value = item.nama;
      document.getElementById("kategori").value = item.kategori;
      document.getElementById("stok").value = item.stok;
      document.getElementById("harga").value = item.harga;
      document.getElementById("tanggal").value = item.tanggal;

      editId = item.id;
      document.getElementById("btn-submit").textContent = "Update Paket Joki";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});

// cari filter
const renderFilteredData = () => {
  const keyword = searchInput.value.toLowerCase();

  const checkedCategories = Array.from(checkboxes)
    .filter((chk) => chk.checked)
    .map((chk) => chk.value);

  const filtered = jokiData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(keyword) ||
      item.kode.toLowerCase().includes(keyword);
    const matchCategory =
      checkedCategories.length === 0 ||
      checkedCategories.includes(item.kategori);

    return matchSearch && matchCategory;
  });

  renderTable(filtered);
};

// pencarian
searchInput.addEventListener("input", renderFilteredData);

// chechkbox filter
checkboxes.forEach((chk) => {
  chk.addEventListener("change", renderFilteredData);
});

// Init
renderFilteredData();
