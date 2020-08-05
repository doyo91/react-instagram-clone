import React from "react";
import styled from "styled-components";

const WrapperStyled = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
`;

export const Wrapper = ({ children }) => {
  return <WrapperStyled>{children}</WrapperStyled>;
};
