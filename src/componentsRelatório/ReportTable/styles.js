// componentsRelatório/ReportTable/styles.js
import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
  padding: 30px;
  margin: 20px;
  margin-top: -50px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const PrintButton = styled.button`
  padding: 8px 16px;
  background-color: #6041bf;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  &:hover {
     background-color: #5035a3;
  }
`;

export const EditorButton = styled.button`
  padding: 8px 16px;
  background-color: #6041bf;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #5035a3;
  }
`;

export const ReportTitle = styled.h2`
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
`;

export const ReportInfo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  font-size: 14px;
  color: #666;

  div {
    margin-bottom: 5px;
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 2px solid #e5e5e5;
`;

export const Th = styled.th`
  text-align: center;
  padding: 12px 16px;
  font-weight: 500;
  color: #333;
  border-bottom: 2px solid #e5e5e5;
  &:first-child {
    text-align: left;
  }
`;

export const CategoryTr = styled.tr`
  background-color: #f8f9fa;
`;

export const CategoryTd = styled.td`
  padding: 10px 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
`;

export const ItemTr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

export const ItemTd = styled.td`
  padding: 8px 16px;
  padding-left: 32px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
`;

export const ValueTd = styled.td`
  padding: 8px 16px;
  text-align: center;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
`;

export const TotalTr = styled.tr`
  border-top: 2px solid #333;
  background-color: #f8f9fa;
`;

export const TotalTd = styled.td`
  padding: 12px 16px;
  font-weight: bold;
  color: #333;
`;
