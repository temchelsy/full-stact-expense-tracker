import styled from "styled-components";

export const MainLayout = styled.div`
    font-family: 'Roboto', sans-serif; /* Apply Roboto font */
    padding: 2rem;
    min-height: 100vh;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;

    @media screen and (max-width: 1200px) {
        flex-direction: column;
        padding: 1.5rem;
    }

    @media screen and (max-width: 768px) {
        padding: 1rem;
        gap: 1.5rem;
        align-items: center;  
    }

    @media screen and (max-width: 480px) {
        padding: 0.75rem;
        gap: 1rem;
    }
`;

export const InnerLayout = styled.div`
    font-family: 'Roboto', sans-serif; /* Apply Roboto font */
    padding: 2rem;
    width: 100%;
    max-width: 100%;
    background: #ffffff;
    border-radius: 1rem;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

    @media screen and (max-width: 1200px) {
        padding: 1.5rem;
    }

    @media screen and (max-width: 768px) {
        padding: 1.25rem;
    }

    @media screen and (max-width: 480px) {
        padding: 1rem;
        border-radius: 0.5rem;
    }
`;
