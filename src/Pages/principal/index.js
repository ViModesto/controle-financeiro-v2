import React, { useEffect, useState } from "react";
import GlobalStyle from "../../styles/global";
import Header from "../../components/Header";
import Resume from "../../components/Resume";
import Form from "../../components/Form";
import { supabase } from "../../supabaseClient";

const Principal = ({ user, onLogout }) => {
  const [transactionsList, setTransactionsList] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar transações do Supabase quando o componente monta
  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    }
  }, [user]);

  // Recalcular totais quando a lista de transações muda
  useEffect(() => {
    calculateTotals();
  }, [transactionsList]);

  const getLocalStorageKey = () => `transactions_${user?.id || "default"}`;

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar se user existe e tem id
      if (!user?.id) {
        setError("Usuário não identificado");
        setLoading(false);
        return;
      }

      // Primeiro, carregar dados locais como backup
      const localData = localStorage.getItem(getLocalStorageKey());
      const localTransactions = localData ? JSON.parse(localData) : [];

      // Tentar carregar do Supabase
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar transações do Supabase:", error);
        setError("Modo offline - dados locais carregados");
        // Usar dados locais se houver erro no Supabase
        setTransactionsList(localTransactions);
      } else {
        // Sucesso ao carregar do Supabase
        const supabaseTransactions = transactions || [];
        setTransactionsList(supabaseTransactions);

        // Atualizar localStorage com dados mais recentes do servidor
        localStorage.setItem(
          getLocalStorageKey(),
          JSON.stringify(supabaseTransactions)
        );

        // Se há dados locais que não estão no servidor, tentar sincronizar
        if (localTransactions.length > supabaseTransactions.length) {
          await syncLocalTransactions(localTransactions, supabaseTransactions);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
      setError("Modo offline - dados locais carregados");
      // Fallback para localStorage
      const localData = localStorage.getItem(getLocalStorageKey());
      setTransactionsList(localData ? JSON.parse(localData) : []);
    } finally {
      setLoading(false);
    }
  };

  const syncLocalTransactions = async (
    localTransactions,
    supabaseTransactions
  ) => {
    try {
      // Encontrar transações que existem localmente mas não no servidor
      const supabaseIds = new Set(supabaseTransactions.map((t) => t.id));
      const unsyncedTransactions = localTransactions.filter(
        (t) => !supabaseIds.has(t.id) && typeof t.id === "number" // IDs temporários são números
      );

      if (unsyncedTransactions.length > 0) {
        for (const transaction of unsyncedTransactions) {
          const { id, isLocal, ...transactionWithoutId } = transaction;

          const { data, error } = await supabase
            .from("transactions")
            .insert([transactionWithoutId])
            .select()
            .single();

          if (!error && data) {
            // Substituir transação local pela do servidor
            const updatedList = localTransactions.map((t) =>
              t.id === id ? data : t
            );
            setTransactionsList(updatedList);
            localStorage.setItem(
              getLocalStorageKey(),
              JSON.stringify(updatedList)
            );
          }
        }
      }
    } catch (err) {
      console.error("Erro ao sincronizar transações locais:", err);
    }
  };

  const saveToLocalStorage = (transactions) => {
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(transactions));
  };

  const calculateTotals = () => {
    if (!Array.isArray(transactionsList) || transactionsList.length === 0) {
      setIncome("R$ 0.00");
      setExpense("R$ 0.00");
      setTotal("R$ 0.00");
      return;
    }

    const amountExpense = transactionsList
      .filter((item) => item?.expense === true)
      .map((transaction) => Number(transaction?.amount) || 0);

    const amountIncome = transactionsList
      .filter((item) => item?.expense === false)
      .map((transaction) => Number(transaction?.amount) || 0);

    const expenseTotal = amountExpense
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2);
    const incomeTotal = amountIncome
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2);
    const totalBalance = Math.abs(incomeTotal - expenseTotal).toFixed(2);

    setIncome(`R$ ${incomeTotal}`);
    setExpense(`R$ ${expenseTotal}`);
    setTotal(
      `${
        Number(incomeTotal) < Number(expenseTotal) ? "-" : ""
      }R$ ${totalBalance}`
    );
  };

  const handleAdd = async (transaction) => {
    try {
      // Validar dados de entrada
      if (!transaction || !transaction.description || !transaction.amount) {
        throw new Error("Dados da transação incompletos");
      }

      if (!user?.id) {
        throw new Error("Usuário não identificado");
      }

      // Criar transação com dados completos
      const newTransaction = {
        description: String(transaction.description).trim(),
        amount: parseFloat(transaction.amount),
        expense: Boolean(transaction.expense),
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      // Validar se amount é um número válido
      if (isNaN(newTransaction.amount) || newTransaction.amount <= 0) {
        throw new Error("Valor deve ser um número positivo");
      }

      // Tentar salvar no Supabase primeiro
      const { data, error } = await supabase
        .from("transactions")
        .insert([newTransaction])
        .select()
        .single();

      if (error) {
        console.error("Erro ao salvar transação no Supabase:", error);

        // Fallback: salvar localmente com ID temporário
        const tempTransaction = {
          ...newTransaction,
          id: Date.now(), // ID temporário para sincronizar depois
          isLocal: true,
        };
        const newArrayTransactions = [...transactionsList, tempTransaction];
        setTransactionsList(newArrayTransactions);
        saveToLocalStorage(newArrayTransactions);
        setError(
          "Transação salva localmente. Será sincronizada quando houver conexão."
        );
      } else {
        // Sucesso: usar dados do servidor
        const newArrayTransactions = [...transactionsList, data];
        setTransactionsList(newArrayTransactions);
        saveToLocalStorage(newArrayTransactions);
        setError(null);
      }
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);

      // Fallback completo
      const tempTransaction = {
        description: String(transaction?.description || "").trim(),
        amount: parseFloat(transaction?.amount) || 0,
        expense: Boolean(transaction?.expense),
        id: Date.now(),
        user_id: user?.id,
        created_at: new Date().toISOString(),
        isLocal: true,
      };

      const newArrayTransactions = [...transactionsList, tempTransaction];
      setTransactionsList(newArrayTransactions);
      saveToLocalStorage(newArrayTransactions);
      setError(
        "Transação salva localmente. Será sincronizada quando houver conexão."
      );
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      if (!transactionId) {
        console.error("ID da transação não fornecido");
        return;
      }

      // Atualizar lista local imediatamente para melhor UX
      const newArrayTransactions = transactionsList.filter(
        (transaction) => transaction?.id !== transactionId
      );
      setTransactionsList(newArrayTransactions);
      saveToLocalStorage(newArrayTransactions);

      // Tentar deletar do Supabase (só se não for uma transação local)
      const transactionToDelete = transactionsList.find(
        (t) => t?.id === transactionId
      );

      if (transactionToDelete && !transactionToDelete.isLocal && user?.id) {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", transactionId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Erro ao deletar transação do Supabase:", error);
          setError(
            "Transação removida localmente. Erro ao sincronizar com servidor."
          );
        }
      }
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
      setError("Transação removida localmente.");
    }
  };

  // Verificar se user existe antes de renderizar
  if (!user) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "18px",
          }}
        >
          Erro: Usuário não identificado
        </div>
        <GlobalStyle />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "18px",
          }}
        >
          Carregando transações...
        </div>
        <GlobalStyle />
      </>
    );
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      {error && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            color: "#856404",
            padding: "1rem",
            margin: "1rem",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          ⚠️ {error}
          {error.includes("offline") && (
            <button
              onClick={loadTransactions}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#ffc107",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Tentar reconectar
            </button>
          )}
        </div>
      )}

      <Resume income={income} expense={expense} total={total} />

      <Form
        handleAdd={handleAdd}
        transactionsList={transactionsList}
        setTransactionsList={setTransactionsList}
        onDelete={handleDelete}
      />

      <GlobalStyle />
    </>
  );
};

export default Principal;
