import styled from 'styled-components';

export const DetailPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 260px;
  padding: ${(p) => p.theme.spacing.sm};
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-radius: ${(p) => p.theme.radius.sm};
  background-color: ${(p) => p.theme.colors.white};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const Image = styled.img`
  padding: ${(p) => p.theme.spacing.sm} 0;
  width: 100px;
`;

export const Button = styled.button`
  width: max-content;
  padding: ${(p) => p.theme.spacing.xxs};
  cursor: pointer;
  outline: none;
  border: 1px solid ${(p) => p.theme.colors.text.secondary};
  border-radius: ${(p) => p.theme.radius.sm};
  font-size: ${(p) => p.theme.font.size.xxs};
`;
