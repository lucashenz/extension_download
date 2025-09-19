document.getElementById("downloadBtn").addEventListener("click", async () => {
    
    const erroDiv = document.getElementById("erro");
    erroDiv.textContent = "";

    try {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                func: () => {
                    return Array.from(document.querySelectorAll("a"))
                        .map(a => a.href)
                        .filter(href => href.match(/\.(pdf|mp3)$/i)); // formatos
                }
            },
            (results) => {
                try {
                    
                    if (!results || !results[0]?.result || results[0].result.length === 0) {
                        throw new Error("Nao existem arquivos para fazer o download.");
                    }

                    let links = results[0].result;

                    links.forEach(url => {
                        chrome.downloads.download({ url });
                    });
                } catch (err) {
                    erroDiv.textContent = err.message;
                }
            }
        );
    } catch (err) {
        erroDiv.textContent = "Erro inesperado: " + err.message;
    }
});
