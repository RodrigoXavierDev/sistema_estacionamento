(function () {
    const $ = q => document.querySelector(q);

    async function filtrarCarros() {
        const cupomPesquisa = $("#pesquisa-cupom").value.toLowerCase();
        const placaPesquisa = $("#pesquisa-placa").value.toLowerCase();
        const descricaoPesquisa = $("#pesquisa-descricao").value.toLowerCase();

        const estacionamento = await pegarEstacionamento();
        const resultadosFiltrados = estacionamento.filter(carro =>
            carro.cupom.toLowerCase().includes(cupomPesquisa) &&
            carro.placa.toLowerCase().includes(placaPesquisa) &&
            carro.descricao.toLowerCase().includes(descricaoPesquisa)
        );

        $("#estacionamento").innerHTML = "";
        resultadosFiltrados.forEach(carro => addCarroParaEstacionamento(carro));
    }

    const precos = [
        { tempo: 30, valor: 5 },
        { tempo: 60, valor: 10 },
        { tempo: 120, valor: 15 },
        { tempo: 240, valor: 20 },
        { tempo: Infinity, valor: 25 }
    ];

    const cupons = {
        "DESCONTO5": 5,
        "DESCONTO10": 10,
        "DESCONTO15": 15,
        "DESCONTO20": 20
    };

    function converterPeriodo(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }

    function calcularValor(tempoMin) {
        for (let preco of precos) {
            if (tempoMin <= preco.tempo) {
                return preco.valor;
            }
        }
        return 0;
    }

    function aplicarDesconto(valor, cupom) {
        const desconto = cupons[cupom.toUpperCase()] || 0;
        return {
            desconto: valor * (desconto / 100),
            valorFinal: valor - (valor * (desconto / 100))
        };
    }

    async function mostrarCarros() {
        const estacionamento = await pegarEstacionamento();
        $("#estacionamento").innerHTML = "";
        estacionamento.forEach(carro => addCarroParaEstacionamento(carro));
    }

    function addCarroParaEstacionamento(carro) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${carro.cupom}</td>
            <td data-tempo="${carro.entrada}">${new Date(carro.entrada).toLocaleString("pt-BR", {
                hour: "numeric", minute: "numeric"
            })}</td>
            <td>${carro.placa}</td>
            <td>${carro.descricao}</td>
            <td>
                <button class="delete">Pagar</button>
            </td>
        `;

        $("#estacionamento").appendChild(linha);
    }

    async function checkOut(info) {
        let tempoMs = new Date() - new Date(info[1].dataset.tempo);
        let tempoMin = Math.floor(tempoMs / 60000);
        let periodo = converterPeriodo(tempoMs);

        const valor = calcularValor(tempoMin);
        const cupom = info[0].textContent;
        const { desconto, valorFinal } = aplicarDesconto(valor, cupom);

        const placa = info[2].textContent;
        const msg = `O veículo ${info[3].textContent} de placa ${placa} permaneceu ${periodo} no estacionamento.
        Valor total: R$${valor.toFixed(2)}
        Cupom: ${cupom ? `${cupom} - R$${desconto.toFixed(2)}` : "Nenhum"}
        Valor final: R$${valorFinal.toFixed(2)}
        \nDeseja encerrar?`;

        if (!confirm(msg)) return;

        // Removendo o carro (implementação do endpoint de remoção necessária no servidor)
        await removerCarro(placa);
        mostrarCarros();
    }

    async function pegarEstacionamento() {
        try {
            const response = await fetch('http://localhost:3000/carros');
            if (!response.ok) throw new Error("Erro ao carregar dados");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function salvarCarro(carro) {
        try {
            const response = await fetch('http://localhost:3000/carros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carro),
            });
            if (!response.ok) throw new Error("Erro ao salvar carro");
        } catch (error) {
            console.error(error);
        }
    }

    async function removerCarro(placa) {
        try {
            const response = await fetch(`http://localhost:3000/carros/${placa}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Erro ao remover carro");
        } catch (error) {
            console.error(error);
        }
    }

    mostrarCarros();

    $("#pesquisa-cupom").addEventListener("input", filtrarCarros);
    $("#pesquisa-placa").addEventListener("input", filtrarCarros);
    $("#pesquisa-descricao").addEventListener("input", filtrarCarros);

    $("#adicionar").addEventListener("click", async e => {
        const cupom = $("#cupom").value;
        const placa = $("#placa").value;
        const descricao = $("#descricao").value;

        if (!cupom || !placa || !descricao) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const carro = { cupom, entrada: new Date(), placa, descricao };
        await salvarCarro(carro);
        addCarroParaEstacionamento(carro);

        $("#cupom").value = "";
        $("#placa").value = "";
        $("#descricao").value = "";
    });

    $("#estacionamento").addEventListener("click", async e => {
        if (e.target.className == "delete")
            await checkOut(e.target.parentElement.parentElement.cells);
    });
})();
