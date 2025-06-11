// componentsRelatório/Sidebar/index.js
import React from "react";
import * as C from "./styles";

const Sidebar = ({
  reportType,
  setReportType,
  reportCategory,
  setReportCategory,
  account,
  setAccount,
  analysisBy,
  setAnalysisBy,
  situation,
  setSituation,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  includeTransfers,
  setIncludeTransfers,
  onGenerateReport,
}) => {
  // Função para aplicar máscara de data (dd/mm/aaaa)
  const applyDateMask = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara progressivamente
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    }
  };

  // Função para validar formato de data
  const isValidDateFormat = (dateString) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateString);
  };

  // Função para converter string dd/mm/aaaa para objeto Date
  const parseDate = (dateString) => {
    if (!isValidDateFormat(dateString)) return null;

    const [day, month, year] = dateString.split("/");
    const date = new Date(year, month - 1, day); // month é 0-indexado

    // Verifica se a data é válida
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return null;
    }

    return date;
  };

  // Função para validar se a data inicial é menor ou igual à final
  const validateDateRange = () => {
    if (!startDate || !endDate) return true;

    const startDateObj = parseDate(startDate);
    const endDateObj = parseDate(endDate);

    if (!startDateObj || !endDateObj) return true;

    return startDateObj <= endDateObj;
  };

  // Handler para mudança na data inicial
  const handleStartDateChange = (e) => {
    const maskedValue = applyDateMask(e.target.value);
    setStartDate(maskedValue);
  };

  // Handler para mudança na data final
  const handleEndDateChange = (e) => {
    const maskedValue = applyDateMask(e.target.value);
    setEndDate(maskedValue);
  };

  // Função para gerar o relatório com validações
  const handleGenerateReport = () => {
    // Validações antes de gerar o relatório
    if (startDate && !isValidDateFormat(startDate)) {
      alert("Formato de data inicial inválido. Use dd/mm/aaaa");
      return;
    }

    if (endDate && !isValidDateFormat(endDate)) {
      alert("Formato de data final inválido. Use dd/mm/aaaa");
      return;
    }

    if (!validateDateRange()) {
      alert("A data inicial deve ser menor ou igual à data final");
      return;
    }

    // Se chegou até aqui, as datas são válidas
    const filterParams = {
      reportType,
      reportCategory,
      account,
      analysisBy,
      situation,
      startDate: startDate ? parseDate(startDate) : null,
      endDate: endDate ? parseDate(endDate) : null,
      includeTransfers,
    };

    onGenerateReport(filterParams);
  };

  // Estilo para campos com erro
  // const getInputStyle = (dateValue) => {
  //   if (!dateValue) return {};

  //   const isValid = isValidDateFormat(dateValue) && parseDate(dateValue);
  //   return {
  //     borderColor: isValid ? "#ccc" : "#ff4444",
  //     backgroundColor: isValid ? "white" : "#fff5f5",
  //   };
  // };

  return (
    <C.Container>
      <C.FilterSection>
        <C.InputContent>
          <C.Label>Tipo de Relatório</C.Label>
          <C.Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
          </C.Select>
        </C.InputContent>

        <C.InputContent>
          <C.Label>Relatório</C.Label>
          <C.Select
            value={reportCategory}
            onChange={(e) => setReportCategory(e.target.value)}
          >
            <option value="Planilha de despesas">Planilha de despesas</option>
            <option value="Planilha de receitas">Planilha de receitas</option>
          </C.Select>
        </C.InputContent>

        <C.InputContent>
          <C.Label>Conta</C.Label>
          <C.Select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            <option value="Todas as contas">Todas as contas</option>
            <option value="Conta Corrente">Conta Corrente</option>
            <option value="Poupança">Poupança</option>
          </C.Select>
        </C.InputContent>

        {/* <C.InputContent>
          <C.Label>Análise por</C.Label>
          <C.Select
            value={analysisBy}
            onChange={(e) => setAnalysisBy(e.target.value)}
          >
            <option value="Data do movimento">Data do movimento</option>
            <option value="Data de vencimento">Data de vencimento</option>
          </C.Select>
        </C.InputContent> */}

        {/* <C.InputContent>
          <C.Label>Situação</C.Label>
          <C.Select
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="Em aberto">Em aberto</option>
            <option value="Realizadas">Realizadas</option>
          </C.Select>
        </C.InputContent> */}

        <C.InputContent>
          <C.Label>Período inicial</C.Label>
          <C.Input
            type="text"
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="dd/mm/aaaa"
            maxLength="10"
            // style={getInputStyle(startDate)}
          />
          {startDate && !isValidDateFormat(startDate) && (
            <C.ErrorText>Formato inválido</C.ErrorText>
          )}
        </C.InputContent>

        <C.InputContent>
          <C.Label>Período final</C.Label>
          <C.Input
            type="text"
            value={endDate}
            onChange={handleEndDateChange}
            placeholder="dd/mm/aaaa"
            maxLength="10"
            // style={getInputStyle(endDate)}
          />
          {endDate && !isValidDateFormat(endDate) && (
            <C.ErrorText>Formato inválido</C.ErrorText>
          )}
          {startDate && endDate && !validateDateRange() && (
            <C.ErrorText>Data final deve ser maior que a inicial</C.ErrorText>
          )}
        </C.InputContent>

        {/* <C.CheckboxContainer>
          <C.Checkbox
            type="checkbox"
            checked={includeTransfers}
            onChange={(e) => setIncludeTransfers(e.target.checked)}
          />
          <C.CheckboxLabel>Incluir transferências no relatório</C.CheckboxLabel>
        </C.CheckboxContainer> */}

        <C.Button onClick={handleGenerateReport}>Ver relatório</C.Button>
      </C.FilterSection>
    </C.Container>
  );
};

export default Sidebar;
