document.getElementById("downloadBtn").addEventListener("click", async () => {
    const erroDiv = document.getElementById("erro");
    erroDiv.textContent = "";

    try {
        
        const tiposSelecionados = [];
        if (document.getElementById("pdf").checked) tiposSelecionados.push("pdf");
        if (document.getElementById("mp3").checked) tiposSelecionados.push("mp3");
        if (document.getElementById("docs").checked) tiposSelecionados.push("docs");


        if (tiposSelecionados.length === 0) {
            throw new Error("Selecione pelo menos um tipo de arquivo para download.");
        }

        const regex = new RegExp(`\\.(${tiposSelecionados.join("|")})$`, "i");

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                func: (regexString) => {
                    const regex = new RegExp(regexString, "i");
                    return Array.from(document.querySelectorAll("a"))
                        .map(a => a.href)
                        .filter(href => regex.test(href));
                },
                args: [regex.source]
            },
            (results) => {
                try {
                    if (!results || !results[0]?.result || results[0].result.length === 0) {
                        throw new Error("Não existem arquivos para fazer o download.");
                    }

                    let links = results[0].result;
                    links.forEach(url => chrome.downloads.download({ url }));
                } catch (err) {
                    erroDiv.textContent = " Erro " + err.message;
                }
            }
        );
    } catch (err) {
        erroDiv.textContent = " Erro " + err.message;
    }
});
