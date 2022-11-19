function centerId (smallEl, bigEl) {
    bigRect = bigEl.getBoundingClientRect();
    smallRect = bigEl.getBoundingClientRect();
    
    xOffset = (bigRect.width - smallRect.width)/2;
    yOffset = (bigRect.height - smallRect.height)/2;

    smallEl.style.left = xOffset + 'px';
    smallEl.style.top = yOffset + 'px'; 
}