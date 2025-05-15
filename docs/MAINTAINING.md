# Maintaining This Project

This document provides guidelines for maintaining this blog project.

## Project Structure

The project is structured as follows:

*   `index.html`: The main HTML file for the blog content.
*   `style.css`: Contains all the CSS rules for styling the blog.
*   `script.js`: Contains all the JavaScript code for interactive functionalities (e.g., image modal, copy buttons).
*   `images/`: This directory stores all the images used in the blog posts.
*   `docs/`: This directory contains documentation related to the project, including this file.

## Updating Blog Content

1.  **Modify `index.html`**:
    *   To add a new blog post, it's recommended to create a new HTML file (e.g., `post-title.html`) and link to it from `index.html` or a main "Bài viết" (Articles) page if you create one. For now, content is directly in `index.html`.
    *   Edit the content within the `<article class="blog-content">` section.
    *   Use appropriate HTML tags for headings (`<h2>`, `<h3>`), paragraphs (`<p>`), code blocks (`<pre><code>`), images (`<img>`), lists (`<ol>`, `<ul>`), etc.
    *   Ensure new images are placed in the `images/` directory and referenced correctly.
    *   If adding new code snippets that need a copy button, ensure they are wrapped in a `<div class="code-block-container">` and the `<pre><code>` structure is followed by a `<button class="copy-btn">...</button>` as per existing examples.

2.  **Update Styles (if needed)**:
    *   If new styles are required, add them to `style.css`.
    *   Try to use existing CSS variables (e.g., `var(--primary-color)`) for consistency.

3.  **Update Scripts (if needed)**:
    *   If new interactive features are added, update or add new JavaScript functions in `script.js`.

## Dependencies

This project currently uses:

*   HTML
*   CSS
*   Vanilla JavaScript (no external libraries or frameworks)

## Code Style

*   **HTML**: Maintain clean and semantic HTML. Use indentation for readability.
*   **CSS**: Follow existing conventions for class naming and structure.
*   **JavaScript**: Follow standard JavaScript best practices. Ensure code is readable and commented where necessary.

## Reporting Issues or Suggesting Improvements

*   If you find any bugs or have suggestions for improvements, you can:
    *   Create an issue on the GitHub repository (if applicable).
    *   Contact the maintainer (Bechovang) directly.

## Future Considerations

*   **Multiple Posts**: Implement a system for managing multiple blog posts (e.g., separate HTML files per post, a templating system, or a static site generator).
*   **Navigation**: Improve navigation between posts or sections.
*   **SEO**: Add more meta tags and structured data for better search engine optimization.

---

This is a starting point. Feel free to update and expand this document as the project evolves. 