// Pages/relatorio/styles.js
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 150px);
  background-color: #f5f5f5;
  padding: 0;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 0px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 4px;
  padding: 8px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 4px;
  background-color: white;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${(props) => (props.loading ? "#ccc" : "#6f42c1")};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.loading ? "not-allowed" : "pointer")};
  margin-top: 20px;
`;
