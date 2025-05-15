// Image zoom functionality
const images = document.querySelectorAll('.blog-content img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.getElementsByClassName('close')[0];

let isModalZoomed = false;
let isDetailZoomed = false;
let currentScale = 1;
let initialX, initialY, currentX, currentY, translateX = 0, translateY = 0;
let isPanning = false;
let didPan = false; // To distinguish a click from a drag-release
let panStartClientX, panStartClientY; // To calculate if significant pan occurred

images.forEach(img => {
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        resetZoomAndPan();
        modalImg.style.cursor = 'zoom-in'; 
        isModalZoomed = true;
    }
});

function closeAndResetModal() {
    modal.style.display = "none";
    resetZoomAndPan();
}

function resetZoomAndPan() {
    isModalZoomed = false;
    isDetailZoomed = false;
    isPanning = false;
    didPan = false;
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    modalImg.style.transform = 'scale(1) translate(0, 0)';
    modalImg.style.cursor = 'zoom-in'; // Set initial cursor for modal image
}

closeBtn.onclick = function() {
    closeAndResetModal();
}

modal.onclick = function(event) {
    if (event.target === modal) {
        closeAndResetModal();
    }
}

modalImg.onclick = function() {
    if (!isModalZoomed) return; 

    if (didPan) { // If a pan (drag) just occurred, don't toggle zoom.
        didPan = false; // Reset for the next interaction
        return;
    }

    if (!isDetailZoomed) { // Click to zoom IN
        currentScale = 1.75;
        translateX = 0; 
        translateY = 0;
        modalImg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
        modalImg.style.cursor = 'grab';
        isDetailZoomed = true;
    } else { // Click to zoom OUT
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        modalImg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
        modalImg.style.cursor = 'zoom-in';
        isDetailZoomed = false;
    }
}

modalImg.onmousedown = function(event) {
    if (isDetailZoomed) { 
        event.preventDefault(); 
        initialX = event.clientX - translateX;
        initialY = event.clientY - translateY;
        panStartClientX = event.clientX;
        panStartClientY = event.clientY;
        isPanning = true;
        didPan = false; // Reset didPan at the start of a potential pan
        modalImg.style.cursor = 'grabbing';
    }
}

modalImg.onmousemove = function(event) {
    if (isPanning && isDetailZoomed) {
        event.preventDefault();
        
        const deltaX = Math.abs(event.clientX - panStartClientX);
        const deltaY = Math.abs(event.clientY - panStartClientY);
        if (deltaX > 5 || deltaY > 5) { // Threshold to consider it a pan
            didPan = true;
        }

        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;
        translateX = currentX;
        translateY = currentY;
        modalImg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
}

modalImg.onmouseup = function() {
    if (isPanning) { // Only change cursor if a pan was in progress
        if (isDetailZoomed) {
             modalImg.style.cursor = 'grab';
        }
        isPanning = false;
    }
    // didPan is checked by the subsequent onclick event if it fires
}

modalImg.onmouseleave = function() {
    if (isPanning) {
        isPanning = false;
        if (isDetailZoomed) {
           modalImg.style.cursor = 'grab';
        }
    }
}

// Close on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeAndResetModal();
    }
});

// Copy button functionality
document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlockContainer = button.parentElement;
            const preElement = codeBlockContainer.querySelector('pre');
            if (preElement) {
                const codeToCopy = preElement.innerText || preElement.textContent;
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    const originalButtonContent = button.innerHTML;
                    button.innerHTML = 'Copied!';
                    button.disabled = true;
                    setTimeout(() => {
                        button.innerHTML = originalButtonContent;
                        button.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });
}); 