// componentsRelatório/Sidebar/styles.js
// Adicione este styled component aos seus estilos existentes

import styled from "styled-components";

// ... seus estilos existentes ...

export const ErrorText = styled.span`
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  font-weight: 500;
`;

// Exemplo completo de como podem ficar seus estilos:
export const Container = styled.div`
  width: 280px;
  background-color: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  overflow-y: auto;
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
  }
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #333;
  cursor: pointer;
`;

export const Button = styled.button`
  background-color: #7c3aed;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background-color: #6d28d9;
  }

  &:active {
    background-color: #5b21b6;
  }
`;
