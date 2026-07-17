/* ==========================
   Project Page Script
   Wang Xingqi Portfolio
========================== */

/* ==========================
   图片双击预览功能
========================== */

document.addEventListener('DOMContentLoaded', function() {

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryImgs = document.querySelectorAll('.project-gallery img');

    galleryImgs.forEach(img => {
        img.addEventListener('dblclick', function() {
            lightboxImg.src = this.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

});