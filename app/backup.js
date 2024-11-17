(function () {
    const $ = q => document.querySelector(q);

    // Função para pegar o backup do localStorage
    function pegarBackup() {
        // Tenta pegar o backup, se não existir retorna um array vazio
        const backup = localStorage.getItem('estacionamentoBackup');
        return backup ? JSON.parse(backup) : [];
    }

    // Função para exibir o backup no HTML
    function mostrarBackup() {
        const backup = pegarBackup();
        const tbody = $("#backup_estacionamento");

        // Se não houver dados no backup, exibe uma mensagem
        if (backup.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4'>Nenhum dado de backup disponível.</td></tr>";
            return;
        }

        // Limpa o conteúdo atual
        tbody.innerHTML = "";

        // Insere os dados do backup na tabela
        backup.forEach(carro => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${carro.cupom}</td>
                <td>${new Date(carro.entrada).toLocaleString("pt-BR", {
                    hour: "numeric", minute: "numeric"
                })}</td>
                <td>${carro.placa}</td>
                <td>${carro.descricao}</td>
            `;
            tbody.appendChild(linha);
        });
    }

    // Chama a função para mostrar o backup quando o script for carregado
    document.addEventListener("DOMContentLoaded", mostrarBackup);
})();
