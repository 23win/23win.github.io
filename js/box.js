(function () {
    var maxWidth = 750;
    var baseFontSize = 100;

    function setRootFontSize() {
        var ratio = Math.min(window.innerWidth / maxWidth, 1);
        var fontSize = baseFontSize * ratio;
        document.documentElement.style.fontSize = fontSize + 'px';
    }
    setRootFontSize();
    window.addEventListener('resize', setRootFontSize);
})();