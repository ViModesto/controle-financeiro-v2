import React from "react";
import * as C from "./styles";

const Grid = ({ itens }) => {
  return (
    <C.Table>
      <C.Thead>
        <C.Tr>
          <C.Th width={40}>Descrição</C.Th>
          <C.Th width={40}>Valor</C.Th>
          <C.Th width={40} alignCenter>
            Tipo
          </C.Th>
        </C.Tr>
      </C.Thead>
      <C.Tbody>
        {itens?.map((item, index) => (
          <C.Tr key={index}>
            <C.Td>{item.desc}</C.Td>
            <C.Td>R$ {Number(item.amount).toFixed(2)}</C.Td>
            <C.Td alignCenter>
              {item.expense ? (
                <span style={{ color: "red" }}>Saída</span>
              ) : (
                <span style={{ color: "green" }}>Entrada</span>
              )}
            </C.Td>
          </C.Tr>
        ))}
      </C.Tbody>
    </C.Table>
  );
};

export default Grid;
