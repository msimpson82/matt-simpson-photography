(function(){
    // Blog gallery lightbox — works with sp-gallery-item inside .blog-gallery
    var galleries = document.querySelectorAll('.blog-gallery');
    if (!galleries.length) return;

    // Collect all gallery images
    var images = [];
    var allItems = document.querySelectorAll('.blog-gallery .sp-gallery-item');

    allItems.forEach(function(item) {
        var img = item.querySelector('img');
        images.push({
            src: item.getAttribute('data-src') || img.src,
            alt: item.getAttribute('data-alt') || img.alt,
            caption: item.getAttribute('data-caption') || ''
        });
    });

    if (!images.length) return;

    // Create lightbox
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'blogLightbox';
    lb.innerHTML = '<div class="lightbox-close" id="blogLbClose"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>'
        + '<div class="lightbox-nav lightbox-prev" id="blogLbPrev"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"></polyline></svg></div>'
        + '<img class="lightbox-image" id="blogLbImage" src="" alt="">'
        + '<div class="lightbox-nav lightbox-next" id="blogLbNext"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"></polyline></svg></div>'
        + '<div class="lightbox-counter" id="blogLbCounter"></div>';
    document.body.appendChild(lb);

    var lbImg = document.getElementById('blogLbImage');
    var lbCounter = document.getElementById('blogLbCounter');
    var idx = 0;

    function showLb(i) {
        idx = i;
        lbImg.src = images[idx].src;
        lbImg.alt = images[idx].alt;
        lbCounter.textContent = (idx + 1) + ' / ' + images.length;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLb() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    allItems.forEach(function(item, i) {
        item.addEventListener('click', function() { showLb(i); });
    });

    document.getElementById('blogLbClose').addEventListener('click', closeLb);
    lb.addEventListener('click', function(e) { if (e.target === lb) closeLb(); });

    document.getElementById('blogLbPrev').addEventListener('click', function(e) {
        e.stopPropagation();
        showLb((idx - 1 + images.length) % images.length);
    });
    document.getElementById('blogLbNext').addEventListener('click', function(e) {
        e.stopPropagation();
        showLb((idx + 1) % images.length);
    });

    document.addEventListener('keydown', function(e) {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') showLb((idx - 1 + images.length) % images.length);
        if (e.key === 'ArrowRight') showLb((idx + 1) % images.length);
    });
})();
