        // Image zoom functionality
        const images = document.querySelectorAll('.blog-content img');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = document.getElementsByClassName('close')[0];
        
        let currentScale = 1;
        let translateX = 0;
        let translateY = 0;
        let isDetailZoomed = false; // True if currentScale indicates a zoomed-in state
        let isPanning = false; // True while pan gesture is active

        // Hammer.js instance for modal image
        // Ensure Hammer.js is loaded before this script runs
        let hammer; 

        images.forEach(img => {
            img.onclick = function() {
                modal.style.display = "block";
                modalImg.src = this.src;
                resetZoomAndPan(); // Reset states for the new image
                
                // Initialize Hammer.js for the modal image if not already done
                // Or re-initialize if properties need to be reset specific to modal opening
                if (!hammer) {
                    hammer = new Hammer(modalImg);
                    hammer.get('pinch').set({ enable: true });
                    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 5 }); // Pan in all directions

                    hammer.on('tap', handleTap);
                    hammer.on('panstart', handlePanStart);
                    hammer.on('panmove', handlePanMove);
                    hammer.on('panend', handlePanEnd);
                    hammer.on('pinchstart', handlePinchStart);
                    hammer.on('pinchmove', handlePinchMove);
                    hammer.on('pinchend', handlePinchEnd);
                }
            }
        });
        
        function updateTransform() {
            modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        }
        
        function updateCursor() {
            if (isPanning) {
                modalImg.style.cursor = 'grabbing';
            } else if (isDetailZoomed) {
                modalImg.style.cursor = 'grab';
            } else {
                modalImg.style.cursor = 'zoom-in';
            }
        }
        
        function resetZoomAndPan() {
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            isDetailZoomed = false;
            isPanning = false;
            updateTransform();
            updateCursor(); // Set initial cursor correctly (should be zoom-in)
        }
        
        function closeAndResetModal() {
            modal.style.display = "none";
            resetZoomAndPan(); 
            // If Hammer instance exists and needs cleanup when modal is always hidden, do it here.
            // For now, it's reused when modal reappears.
        }
        
        closeBtn.onclick = closeAndResetModal;
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeAndResetModal();
            }
        }
        
        // Close on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closeAndResetModal();
            }
        });

        // Hammer.js event handlers
        let initialScaleOnPinch;
        let initialTranslateXOnPan, initialTranslateYOnPan;

        function handleTap(event) {
            console.log('Tap event triggered');
            console.log('Before tap - isDetailZoomed:', isDetailZoomed, 'currentScale:', currentScale);

            if (isDetailZoomed) { // If currently zoomed in, tap to zoom out
                console.log('Tapping to zoom OUT');
                currentScale = 1;
                translateX = 0;
                translateY = 0;
            } else { // If currently zoomed out, tap to zoom in to a default detail level
                console.log('Tapping to zoom IN');
                currentScale = 1.75; 
                translateX = 0; // Reset pan on tap-to-zoom
                translateY = 0;
            }
            isDetailZoomed = currentScale > 1.05; // Update detail zoom state (add a small threshold)
            console.log('After tap - isDetailZoomed:', isDetailZoomed, 'currentScale:', currentScale);
            updateTransform();
            updateCursor();
        }
        
        function handlePanStart(event) {
            if (isDetailZoomed) {
                isPanning = true;
                initialTranslateXOnPan = translateX;
                initialTranslateYOnPan = translateY;
                updateCursor();
            }
        }
        
        function handlePanMove(event) {
            if (isPanning) { // Only pan if isPanning is true (set in panstart if detailZoomed)
                translateX = initialTranslateXOnPan + event.deltaX;
                translateY = initialTranslateYOnPan + event.deltaY;
                updateTransform();
            }
        }
        
        function handlePanEnd(event) {
            if (isPanning) {
                isPanning = false;
                updateCursor();
            }
        }
        
        function handlePinchStart(event) {
            isPanning = false; // Stop any panning if pinch starts
            initialScaleOnPinch = currentScale;
            // No need to change cursor immediately, pinchmove will handle it if scale changes
        }
        
        function handlePinchMove(event) {
            currentScale = initialScaleOnPinch * event.scale;
            // Add constraints to scale if desired, e.g., Math.max(0.5, Math.min(currentScale, 4));
            currentScale = Math.max(0.25, Math.min(currentScale, 5)); // Example constraints

            isDetailZoomed = currentScale > 1.05;
            updateTransform();
            updateCursor(); // Cursor might change based on isDetailZoomed
        }
        
        function handlePinchEnd(event) {
            // State (currentScale, isDetailZoomed) is already updated in pinchmove
            // Update cursor one last time in case
            updateCursor();
        }

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