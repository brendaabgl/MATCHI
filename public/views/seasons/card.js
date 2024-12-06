

    const cardsPerPage = 3;
    const cards = document.querySelectorAll('.card');

    function changePage(pageNumber, event) {
    // Mencegah halaman bergulir ke atas
    if (event) {
        event.preventDefault();
    }

    // Sembunyikan semua kartu
    cards.forEach(card => card.style.display = 'none');

    // Hitung indeks awal dan akhir untuk halaman tertentu
    const start = (pageNumber - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    // Tampilkan kartu sesuai indeks halaman
    for (let i = start; i < end && i < cards.length; i++) {
        cards[i].style.display = 'block';
    }
    }

    function navigateTo(season){
        const link = '../../browse.html?season='+season;
        window.top.location.href = link;
    }

    // Tampilkan halaman pertama saat pertama kali dimuat
    changePage(1);

        function selectFilter(btn) {
            // Reset semua tombol
            document.querySelectorAll('.filter-btn').forEach(button => {
                button.style.backgroundColor = '#eaeaea';
                button.style.color = 'black';
            });
            // Set tombol aktif
            btn.style.backgroundColor = '#000';
            btn.style.color = 'white';
        }
