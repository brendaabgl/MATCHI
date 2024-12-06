     // Fungsi untuk menampilkan detail modal
     function viewDetails(item) {
        document.getElementById('modalDetails').innerHTML = 'Discover the latest trends and highlights from ' + item + '. Join us to explore the fashion world like never before!';
        var myModal = new bootstrap.Modal(document.getElementById('fashionWeekModal'));
        myModal.show();
        }