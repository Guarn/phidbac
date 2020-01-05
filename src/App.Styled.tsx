import styled from "styled-components";
import { MaxDimensions } from "./Shared/Styled";

export const ConteneurGlobal = styled.div`
    height: 100%;
    width: 100%;
    ${MaxDimensions};
    color: ${(props) => props.theme.main};
    display: grid;
    grid-template-rows: 80px calc(100% - 160px) 80px;
    font-family: century-gothic, sans-serif;
    overflow: hidden;
`;

export const ConteneurHeader = styled.div`
    display: flex;
    justify-content: space-between;
    z-index: 100;
`;

export const ConteneurContenu = styled.div`
    display: flex;
`;

export const ConteneurFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 50px;
    z-index: 2;
`;
