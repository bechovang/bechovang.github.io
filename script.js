        // Image zoom functionality
        const images = document.querySelectorAll('.blog-content img');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = document.getElementsByClassName('close')[0];
        
        images.forEach(img => {
            img.onclick = function() {
                modal.style.display = "block";
                modalImg.src = this.src;
            }
        });
        
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
        
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
        
        // Close on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
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