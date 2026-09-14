// ==========================================
// Lógica de Mapa Interativo (Minimapa)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const viewport = document.getElementById("mapa-viewport");
    const wrapper = document.getElementById("mapa-wrapper");
    
    if (!viewport || !wrapper) return;

    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let scale = 1;
    const maxScale = 1.8; // Limite máximo de zoom
    const minScale = 0.8; // Limite mínimo de zoom

    function updateMapTransform() {
      // O transform-origin: 0 0 no CSS faz com que o mapa sempre comece no canto.
      viewport.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // DRAG (Arrastar)
    wrapper.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      wrapper.style.cursor = "grabbing";
      viewport.style.transition = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateMapTransform();
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      wrapper.style.cursor = "grab";
      viewport.style.transition = "transform 0.1s ease-out";
    });

    // ZOOM
    document.getElementById("btn-zoom-in").addEventListener("click", () => {
      scale = Math.min(maxScale, scale + 0.2);
      updateMapTransform();
    });

    document.getElementById("btn-zoom-out").addEventListener("click", () => {
      scale = Math.max(minScale, scale - 0.2);
      updateMapTransform();
    });

    // CENTRALIZAR
    document.getElementById("btn-centralizar").addEventListener("click", () => {
      scale = 1;
      translateX = 0;
      translateY = 0;
      viewport.style.transition = "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
      updateMapTransform();
      setTimeout(() => {
        viewport.style.transition = "transform 0.1s ease-out";
      }, 300);
    });

    // SCROLL ZOOM
    wrapper.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      scale = Math.min(maxScale, Math.max(minScale, scale + delta));
      updateMapTransform();
    });
});