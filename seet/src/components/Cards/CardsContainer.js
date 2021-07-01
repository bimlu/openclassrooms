import styled from 'styled-components';

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 3fr));
  grid-auto-rows: auto;
  grid-gap: 16px;
`;

export default CardsContainer;
