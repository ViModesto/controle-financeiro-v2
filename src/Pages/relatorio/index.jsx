import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import GlobalStyle from "../../styles/global";
import { supabase } from "../../supabaseClient";
import { Input, Label } from "./styles";

// const ApiService = {
//   async getTransactions(filters = {}) {
//     try {
//       let query = supabase.from("transactions").select("*");

//       if (filters.user_id) query = query.eq("user_id", filters.user_id);
//       if (filters.type) query = query.eq("type", filters.type);
//       if (filters.status) query = query.eq("status", filters.status);
//       if (filters.start_date) query = query.gte("data", filters.start_date);
//       if (filters.end_date) query = query.lte("data", filters.end_date);
//       if (filters.include_transfers === false)
//         query = query.eq("is_transfer", false);

//       // Filtro de data (período)
//       if (filters.start_date && filters.end_date) {
//         query = query
//           .gte("data", filters.start_date)
//           .lte("data", filters.end_date);
//       } else if (filters.start_date) {
//         query = query.gte("data", filters.start_date);
//       } else if (filters.end_date) {
//         query = query.lte("data", filters.end_date);
//       }

//       const { data: transactions, error } = await query;

//       if (error) {
//         throw new Error(`Erro ao buscar transações: ${error.message}`);
//       }

//       console.log(transactions, "transactions");

//       return transactions;
//     } catch (error) {
//       console.error("Erro na API:", error);
//       throw error;
//     }
//   },
// };

const ApiService = {
  async getTransactions(filters = {}) {
    try {
      let query = supabase.from("transactions").select("*");

      if (filters.user_id) query = query.eq("user_id", filters.user_id);
      if (filters.type) query = query.eq("type", filters.type);
      if (filters.status) query = query.eq("status", filters.status);
      if (filters.start_date)
        query = query.gte("created_at", filters.start_date);
      if (filters.end_date) query = query.lte("created_at", filters.end_date);

      if (filters.include_transfers === false)
        query = query.eq("is_transfer", false);

      const { data: transactions, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar transações: ${error.message}`);
      }

      console.log(transactions, "transactions");
      console.log(filters, "filters");
      return transactions;
    } catch (error) {
      console.error("Erro na API:", error);
      throw error;
    }
  },
};

// Exemplo de uso:
// const transactions = await ApiService.getTransactions({
//   user_id: 123,
//   start_date: '2024-01-01',
//   end_date: '2024-12-31',
//   status: 'completed'
// });

// Componente Sidebar

const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return null;

  const clean = dateString.trim();

  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(clean)) {
    return null;
  }

  const [dayStr, monthStr, yearStr] = clean.split("/");

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  const date = new Date(year, month - 1, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
};
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
  loading,
}) => {
  const applyDateMask = (value) => {
    const numbers = value.replace(/\D/g, "");
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

  const handleGenerateReport = () => {
    const parsedStartDate = startDate ? parseDate(startDate) : null;
    const parsedEndDate = endDate ? parseDate(endDate) : null;

    if (startDate && !parsedStartDate) {
      alert("Formato de data inicial inválido. Use dd/mm/aaaa");
      return;
    }
    if (endDate && !parsedEndDate) {
      alert("Formato de data final inválido. Use dd/mm/aaaa");
      return;
    }
    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      alert("A data inicial deve ser menor ou igual à data final");
      return;
    }

    const filterParams = {
      reportType,
      reportCategory,
      account,
      analysisBy,
      situation,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      includeTransfers,
    };

    onGenerateReport(filterParams);
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    marginBottom: "4px",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "white",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: loading ? "#ccc" : "#6f42c1",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "20px",
  };

  return (
    <div
      style={{
        width: "280px",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRight: "1px solid #dee2e6",
        height: "calc(100vh - 60px)",
        overflowY: "auto",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Relatório</label>
        <select
          style={selectStyle}
          value={reportCategory}
          onChange={(e) => setReportCategory(e.target.value)}
        >
          <option value="Planilha de despesas">Planilha de despesas</option>
          <option value="Planilha de receitas">Planilha de receitas</option>
        </select>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Label>Período Inicial</Label>
        <Input
          value={applyDateMask(startDate)}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="data inicial"
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Label>Período Final</Label>
        <Input
          value={applyDateMask(endDate)}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="data final"
        />
      </div>

      <button
        style={buttonStyle}
        onClick={() => {
          handleGenerateReport();
        }}
        disabled={loading}
      >
        {loading ? "Gerando..." : "Ver relatório"}
      </button>
    </div>
  );
};

const ReportTable = ({ reportType, startDate, endDate }) => {
  const [reportData, setReportData] = useState({
    transactions: [],
    period: "",
    situation: "",
  });

  // useEffect(() => {
  //   // const fetchTransactions = async () => {
  //   //   try {
  //   //     const transactions = await ApiService.getTransactions();
  //   //     let periodText = "";
  //   //     if (startDate && endDate) {
  //   //       periodText = `${startDate} - ${endDate}`;
  //   //     } else if (startDate) {
  //   //       periodText = `A partir de ${startDate}`;
  //   //     } else if (endDate) {
  //   //       periodText = `Até ${endDate}`;
  //   //     } else {
  //   //       periodText = "Todos os períodos";
  //   //     }

  //   //     setReportData({
  //   //       transactions,
  //   //       period: periodText,
  //   //     });
  //   //   } catch (error) {
  //   //     console.error("Erro ao buscar transações:", error);
  //   //   }
  //   // };
  //   const fetchTransactions = async () => {
  //     try {
  //       const filters = {
  //         start_date: startDate || null,
  //         end_date: endDate || null,
  //       };

  //       const transactions = await ApiService.getTransactions(filters);

  //       let periodText = "";
  //       if (startDate && endDate) {
  //         periodText = `${startDate} - ${endDate}`;
  //       } else if (startDate) {
  //         periodText = `A partir de ${startDate}`;
  //       } else if (endDate) {
  //         periodText = `Até ${endDate}`;
  //       } else {
  //         periodText = "Todos os períodos";
  //       }

  //       setReportData({
  //         transactions,
  //         period: periodText,
  //       });
  //     } catch (error) {
  //       console.error("Erro ao buscar transações:", error);
  //     }
  //   };

  //   fetchTransactions();
  // }, [startDate, endDate]);

  useEffect(() => {
    const formatDateForSupabase = (dateString) => {
      const parsedDate = parseDate(dateString);
      if (!parsedDate) return null;

      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const fetchTransactions = async () => {
      try {
        const formattedStartDate = formatDateForSupabase(startDate);
        const formattedEndDate = formatDateForSupabase(endDate);

        // Se o usuário digitou uma data inválida e mesmo assim o useEffect rodou... já barra logo:
        if (
          (startDate && !formattedStartDate) ||
          (endDate && !formattedEndDate)
        ) {
          console.warn("Data inválida! Não buscando transações...");
          return;
        }

        const filters = {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        };

        const transactions = await ApiService.getTransactions(filters);

        let periodText = "";
        if (startDate && endDate) {
          periodText = `${startDate} - ${endDate}`;
        } else if (startDate) {
          periodText = `A partir de ${startDate}`;
        } else if (endDate) {
          periodText = `Até ${endDate}`;
        } else {
          periodText = "Todos os períodos";
        }

        setReportData({
          transactions,
          period: periodText,
        });
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, [startDate, endDate]);

  const formatCurrency = (value) => {
    return value > 0 ? `R$ ${value.toFixed(2).replace(".", ",")}` : "";
  };

  const generateColumns = () => {
    const monthSet = new Set();

    console.log(reportData.transactions, "reportData.transactions");

    reportData.transactions?.forEach((t) => {
      const date = new Date(t.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      monthSet.add(key);
    });

    const monthKeys = Array.from(monthSet).sort();
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

    return monthKeys.map((key) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: `${monthNames[Number(month) - 1]}/${year}`,
      };
    });
  };

  const groupTransactions = () => {
    const grouped = {};
    const isExpense = reportType === "Planilha de despesas";

    reportData.transactions
      ?.filter((tx) => tx.expense === isExpense)
      .forEach((tx) => {
        const date = new Date(tx.created_at);
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const category = tx.type || "Sem categoria";
        const name = tx.description;

        if (!grouped[category]) grouped[category] = {};
        if (!grouped[category][name]) grouped[category][name] = {};

        grouped[category][name][key] =
          (grouped[category][name][key] || 0) + parseFloat(tx.amount);
      });

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items: Object.entries(items).map(([name, monthlyData]) => ({
        name,
        ...monthlyData,
      })),
    }));
  };

  const calculateRowTotal = (item, columns) => {
    return columns.reduce(
      (total, column) => total + (item[column.key] || 0),
      0
    );
  };

  const calculateColumnTotal = (expenses, columnKey) => {
    return expenses.reduce((total, category) => {
      return (
        total +
        category.items.reduce(
          (catTotal, item) => catTotal + (item[columnKey] || 0),
          0
        )
      );
    }, 0);
  };

  const calculateTotalGeneral = (expenses, columns) => {
    return expenses.reduce((sum, category) => {
      return (
        sum +
        category.items.reduce(
          (itemSum, item) => itemSum + calculateRowTotal(item, columns),
          0
        )
      );
    }, 0);
  };

  const columns = generateColumns();
  const expenses = groupTransactions();
  const totalGeneral = calculateTotalGeneral(expenses, columns);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: "20px",
        height: "calc(100vh - 60px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "15px",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>Relatório financeiro</h2>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => window.print()}
        >
          Imprimir
        </button>
      </div>

      <h3
        style={{
          textAlign: "center",
          margin: "20px 0",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {reportType === "Planilha de despesas"
          ? "PLANILHA DE DESPESAS"
          : "PLANILHA DE RECEITAS"}
      </h3>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        <div>
          <strong>Período:</strong> {reportData.period}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #dee2e6",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                  fontWeight: "600",
                }}
              >
                Descrição
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: "12px 8px",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                    fontWeight: "600",
                  }}
                >
                  {column.label}
                </th>
              ))}
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                  fontWeight: "600",
                }}
              >
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                <tr style={{ backgroundColor: "#e9ecef" }}>
                  <td
                    style={{
                      padding: "10px 8px",
                      fontWeight: "600",
                      border: "1px solid #dee2e6",
                    }}
                    colSpan={columns.length + 2}
                  >
                    {category.category}
                  </td>
                </tr>

                {category.items.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #dee2e6",
                        paddingLeft: "20px",
                      }}
                    >
                      {item.name}
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {item[column.key] > 0
                          ? formatCurrency(item[column.key])
                          : ""}
                      </td>
                    ))}
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        border: "1px solid #dee2e6",
                        fontWeight: "600",
                      }}
                    >
                      {formatCurrency(calculateRowTotal(item, columns))}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}

            <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "600" }}>
              <td
                style={{
                  padding: "12px 8px",
                  border: "1px solid #dee2e6",
                }}
              >
                <strong>Total</strong>
              </td>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: "12px 8px",
                    textAlign: "right",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {formatCurrency(calculateColumnTotal(expenses, column.key))}
                </td>
              ))}
              <td
                style={{
                  padding: "12px 8px",
                  textAlign: "right",
                  border: "1px solid #dee2e6",
                }}
              >
                <strong>{formatCurrency(totalGeneral)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Relatorio = ({ user, onLogout }) => {
  const [reportType, setReportType] = useState("Manual");
  const [reportCategory, setReportCategory] = useState("Planilha de receitas");
  const [account, setAccount] = useState("Todas as contas");
  const [analysisBy, setAnalysisBy] = useState("Data da transação");
  const [situation, setSituation] = useState("Todas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeTransfers, setIncludeTransfers] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDateForAPI = (dateObj) => {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return null;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const processApiData = (transactions, filterParams) => {
    const grouped = {};

    transactions.forEach((transaction) => {
      const category = transaction.tags || "Outros";
      const description = transaction.description || "Sem descrição";
      const amount = parseFloat(transaction.amount) || 0;
      const date = new Date(transaction.transaction_date);

      if (!grouped[category]) {
        grouped[category] = {};
      }

      if (!grouped[category][description]) {
        grouped[category][description] = {};
      }

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!grouped[category][description][monthKey]) {
        grouped[category][description][monthKey] = 0;
      }

      grouped[category][description][monthKey] += amount;
    });

    const expenses = Object.keys(grouped).map((categoryName) => ({
      category: categoryName,
      items: Object.keys(grouped[categoryName]).map((itemName) => {
        const itemData = { name: itemName };
        Object.keys(grouped[categoryName][itemName]).forEach((monthKey) => {
          itemData[monthKey] = grouped[categoryName][itemName][monthKey];
        });
        return itemData;
      }),
    }));

    const totalGeneral = expenses.reduce((total, category) => {
      return (
        total +
        category.items.reduce((categoryTotal, item) => {
          return (
            categoryTotal +
            Object.keys(item)
              .filter((key) => key !== "name")
              .reduce(
                (itemTotal, monthKey) => itemTotal + (item[monthKey] || 0),
                0
              )
          );
        }, 0)
      );
    }, 0);

    // Determinar período para exibição
    let periodText = "";
    if (filterParams.startDate && filterParams.endDate) {
      periodText = `${filterParams.startDate.toLocaleDateString(
        "pt-BR"
      )} a ${filterParams.endDate.toLocaleDateString("pt-BR")}`;
    } else if (filterParams.startDate) {
      periodText = `A partir de ${filterParams.startDate.toLocaleDateString(
        "pt-BR"
      )}`;
    } else if (filterParams.endDate) {
      periodText = `Até ${filterParams.endDate.toLocaleDateString("pt-BR")}`;
    } else {
      // periodText = "Todos os períodos";
    }

    // Determinar intervalo de datas para colunas
    const dates = transactions.map((t) => new Date(t.transaction_date));
    const minDate =
      filterParams.startDate ||
      (dates.length ? new Date(Math.min(...dates)) : new Date());
    const maxDate =
      filterParams.endDate ||
      (dates.length ? new Date(Math.max(...dates)) : new Date());

    return {
      expenses,
      totalGeneral,
      startDate: minDate,
      endDate: maxDate,
      period: periodText,
      // situation: filterParams.situation || "Todas",
    };
  };

  const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());
  const handleGenerateReport = async (filterParams) => {
    setLoading(true);
    setError(null);

    try {
      const apiFilters = {
        user_id: user?.id,
      };

      if (filterParams.reportCategory === "Planilha de despesas") {
        apiFilters.expense = true;
      } else if (filterParams.reportCategory === "Planilha de receitas") {
        apiFilters.expense = false;
      }

      if (filterParams.situation !== "Todas") {
        apiFilters.status = filterParams.situation;
      }

      if (!isValidDate(filterParams.startDate)) {
        setError("Data inicial inválida");
        return;
      }

      if (!isValidDate(filterParams.endDate)) {
        setError("Data final inválida");
        return;
      }

      if (filterParams.startDate) {
        apiFilters.created_at = `gte.${formatDateForAPI(
          filterParams.startDate.toLocaleDateString("pt-BR")
        )}`;
      }

      if (filterParams.endDate) {
        apiFilters.created_at = apiFilters.created_at
          ? apiFilters.created_at +
            `&created_at=lte.${formatDateForAPI(
              filterParams.endDate.toLocaleDateString("pt-BR")
            )}`
          : `lte.${formatDateForAPI(
              filterParams.endDate.toLocaleDateString("pt-BR")
            )}`;
      }

      const transactions = await ApiService.getTransactions(apiFilters);

      if (!transactions || transactions.length === 0) {
        setShowReport(false);
        setReportData(null);
        setError("Nenhuma transação encontrada para os filtros selecionados.");
        return;
      }

      const processedData = processApiData(transactions, filterParams);

      setReportData(processedData);
      setShowReport(true);
      setError(null);
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      setError("Erro ao buscar dados. Tente novamente.");
      setShowReport(false);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
      <GlobalStyle />
      <Header user={user} onLogout={onLogout} />
      <div
        style={{
          display: "flex",
          marginTop: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        <Sidebar
          reportType={reportType}
          setReportType={setReportType}
          reportCategory={reportCategory}
          setReportCategory={setReportCategory}
          account={account}
          setAccount={setAccount}
          analysisBy={analysisBy}
          setAnalysisBy={setAnalysisBy}
          situation={situation}
          setSituation={setSituation}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          includeTransfers={includeTransfers}
          setIncludeTransfers={setIncludeTransfers}
          onGenerateReport={handleGenerateReport}
          loading={loading}
        />

        {error && (
          <div
            style={{
              flex: 1,
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff5f5",
                border: "1px solid #fed7d7",
                borderRadius: "8px",
                color: "#c53030",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>
                Erro ao carregar relatório
              </h3>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {showReport && reportData && !error ? (
          <ReportTable
            reportData={reportData}
            reportType={reportCategory}
            startDate={startDate}
            endDate={endDate}
          />
        ) : !error ? (
          <div
            style={{
              flex: 1,
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#666",
              backgroundColor: "white",
            }}
          >
            <h2 style={{ marginBottom: "10px", color: "#333" }}>
              Relatório Financeiro
            </h2>
            <p
              style={{
                textAlign: "center",
                maxWidth: "400px",
                lineHeight: "1.5",
              }}
            >
              Selecione os filtros no painel lateral e clique em "Ver relatório"
              para gerar o relatório com dados reais do banco.
            </p>

            <div
              style={{
                marginTop: "30px",
                padding: "40px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "50%",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  color: "#6c757d",
                }}
              >
                📊
              </div>
              <p
                style={{
                  textAlign: "center",
                  margin: 0,
                  fontSize: "14px",
                  color: "#6c757d",
                }}
              >
                {loading
                  ? "Carregando dados..."
                  : "Aguardando configuração do relatório"}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Relatorio;
