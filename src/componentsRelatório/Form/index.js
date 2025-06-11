import React, { useState } from "react";
import Grid from "../../../src/components/Grid";
import * as C from "./styles";

const Form = ({ transactionsList, setTransactionsList }) => {
  const [filtro, setFiltro] = useState("");

  const handleFiltrar = () => {
    const listaFiltrada = transactionsList.filter((item) =>
      item.desc.toLowerCase().includes(filtro.toLowerCase())
    );
    setTransactionsList(listaFiltrada);
  };

  const handleReset = () => {
    // Aqui você deve recarregar a lista original. Se ela vier de um banco ou API, chame novamente.
    window.location.reload(); // Alternativa temporária só para resetar.
  };

  return (
    <>
      <div>
        <C.Wrapper>
          <C.Container>
            <C.InputContent>
              <C.Label>Pesquisar por descrição</C.Label>
              <C.Input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Ex: Mercado, Aluguel..."
              />
            </C.InputContent>

            <C.Button onClick={handleFiltrar}>FILTRAR</C.Button>
            <C.Button
              onClick={handleReset}
              style={{ backgroundColor: "#ccc", color: "#000" }}
            >
              LIMPAR FILTRO
            </C.Button>
          </C.Container>
        </C.Wrapper>
        <Grid itens={transactionsList} setItens={setTransactionsList} />
      </div>
    </>
  );
};

export default Form;
