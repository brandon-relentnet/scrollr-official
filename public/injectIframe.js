(function () {
  if (document.getElementById("scrollr-ticker-iframe")) {
    return; // Avoid injecting multiple times
  }
  console.log("injectIframe.js is running");

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("content.html");
  iframe.style.position = "fixed";
  iframe.style.bottom = "0";
  iframe.style.left = "0";
  iframe.style.width = "100%";
  iframe.style.height = "auto"; // Let the iframe height adjust automatically
  iframe.style.zIndex = "9999";
  iframe.style.border = "none";
  iframe.id = "scrollr-ticker-iframe";
  iframe.style.pointerEvents = "none"; // Allow clicks to pass through initially
  iframe.style.overflow = "hidden"; // Ensure no overflow
  iframe.scrolling = "no"; // Remove scrollbars
  document.body.appendChild(iframe);
})();
