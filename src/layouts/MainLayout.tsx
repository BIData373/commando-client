import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <Outer dir="rtl">
      <Inner>
        <Outlet />
      </Inner>
    </Outer>
  );
}

const Outer = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
`;

const Inner = styled.main`
  width: 100%;
  min-height: 100vh;
`;
