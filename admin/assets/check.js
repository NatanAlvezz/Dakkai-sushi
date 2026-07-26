(() => {
  "use strict";

  const arquivos = [
    "./assets/app.css",
    "./assets/shell.js"
  ];

  arquivos.forEach(async (arquivo) => {
    try {
      const resposta = await fetch(arquivo, { cache: "no-store" });

      if (!resposta.ok) {
        console.error(`❌ Arquivo não encontrado: ${arquivo}`);
        return;
      }

      console.log(`✅ Arquivo carregado: ${arquivo}`);
    } catch (erro) {
      console.error(`❌ Erro ao verificar ${arquivo}`, erro);
    }
  });

  console.log("✅ Verificação do Dakkai OS iniciada.");
})();
