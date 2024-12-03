function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.style.display = 'none';
        section.classList.remove('hero-section', 'd-flex', 'align-items-center', 'text-left', 'mb-3');
    });
    const activeSections = document.querySelectorAll(`#${sectionId}`);
    activeSections.forEach(function(section) {
        section.style.display = 'block';
        section.classList.add('hero-section', 'd-flex', 'align-items-center', 'text-left', 'mb-3');
    });
}
