let radios = document.querySelectorAll('input[type=radio][name="media"]');
    radios.forEach(radio => radio.addEventListener('change', handleMediaChange));