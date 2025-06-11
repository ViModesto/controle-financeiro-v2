// componentsRelatório/ReportTable/index.js
import React from "react";
import * as C from "./styles";

const ReportTable = ({ reportData, reportType }) => {
  const formatCurrency = (value) => {
    return value > 0 ? value.toFixed(2).replace(".", ",") : "";
  };

  // Função para gerar as colunas baseadas no período
  const generateColumns = () => {
    const startDate = new Date(reportData.startDate);
    const endDate = new Date(reportData.endDate);
    const columns = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      const monthNames = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      const monthKey = `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = `${
        monthNames[current.getMonth()]
      }/${current.getFullYear()}`;

      columns.push({
        key: monthKey,
        label: monthLabel,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return columns;
  };

  // Função para calcular o total de uma linha
  const calculateRowTotal = (item, columns) => {
    return columns.reduce((total, column) => {
      return total + (item[column.key] || 0);
    }, 0);
  };

  // Função para calcular o total de uma coluna
  const calculateColumnTotal = (expenses, columnKey) => {
    return expenses.reduce((total, category) => {
      return (
        total +
        category.items.reduce((categoryTotal, item) => {
          return categoryTotal + (item[columnKey] || 0);
        }, 0)
      );
    }, 0);
  };

  const columns = generateColumns();

  return (
    <C.Container>
      <C.Header>
        <C.Title>Relatório financeiro</C.Title>
        <C.ButtonGroup>
          <C.PrintButton>Imprimir</C.PrintButton>
        </C.ButtonGroup>
      </C.Header>

      <C.ReportTitle>
        {reportType === "Planilha de despesas"
          ? "PLANILHA DE DESPESAS"
          : "PLANILHA DE RECEITAS"}
      </C.ReportTitle>

      <C.ReportInfo>
        <div>
          <strong>Período:</strong> {reportData.period}
        </div>
        <div>
          <strong>Situação:</strong> {reportData.situation}
        </div>
      </C.ReportInfo>

      <C.TableContainer>
        <C.Table>
          <C.Thead>
            <C.Tr>
              <C.Th></C.Th>
              {columns.map((column) => (
                <C.Th key={column.key}>{column.label}</C.Th>
              ))}
              <C.Th>Total</C.Th>
            </C.Tr>
          </C.Thead>

          <C.Tbody>
            {reportData.expenses?.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                <C.CategoryTr>
                  <C.CategoryTd colSpan={columns.length + 2}>
                    {category.category}
                  </C.CategoryTd>
                </C.CategoryTr>

                {category.items.map((item, itemIndex) => (
                  <C.ItemTr key={itemIndex}>
                    <C.ItemTd>{item.name}</C.ItemTd>
                    {columns.map((column) => (
                      <C.ValueTd key={column.key}>
                        {item[column.key] > 0
                          ? formatCurrency(item[column.key])
                          : ""}
                      </C.ValueTd>
                    ))}
                    <C.ValueTd>
                      <strong>
                        {formatCurrency(calculateRowTotal(item, columns))}
                      </strong>
                    </C.ValueTd>
                  </C.ItemTr>
                ))}
              </React.Fragment>
            ))}

            <C.TotalTr>
              <C.TotalTd>
                <strong>Total</strong>
              </C.TotalTd>
              {columns.map((column) => (
                <C.ValueTd key={column.key}>
                  {formatCurrency(
                    calculateColumnTotal(reportData.expenses || [], column.key)
                  )}
                </C.ValueTd>
              ))}
              <C.ValueTd>
                <strong>{formatCurrency(reportData.totalGeneral)}</strong>
              </C.ValueTd>
            </C.TotalTr>
          </C.Tbody>
        </C.Table>
      </C.TableContainer>
    </C.Container>
  );
};

export default ReportTable;
