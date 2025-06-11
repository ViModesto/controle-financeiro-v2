import React from "react";
import { Container, Label, RadioInput } from "./styles";


const Radio = ({ selected, onChange }) => {
  return (
    <Container>
      <Label>Filtrar por:</Label>
      <label>
        <RadioInput
          type="radio"
          value="dia"
          checked={selected === "dia"}
          onChange={onChange}
        />
        Dia
      </label>
      <label>
        <RadioInput
          type="radio"
          value="mes"
          checked={selected === "mes"}
          onChange={onChange}
        />
        Mês
      </label>
      <label>
        <RadioInput
          type="radio"
          value="ano"
          checked={selected === "ano"}
          onChange={onChange}
        />
        Ano
      </label>
    </Container>
  );
};

export default Radio;
