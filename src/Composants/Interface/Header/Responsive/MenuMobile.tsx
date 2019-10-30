import * as React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import Connexion from "../Connexion";
import { Icon, Drawer } from "antd";

const BoutonMenu = styled.div`
    font-size: 20px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-left: 16px;
    margin-bottom: 15px;
    font-family: "century-gothic";
    &:hover {
        color: orange;
    }
`;

const BoutonPage = styled.div`
    font-size: 18px;
    margin-left: 5px;
    &:hover {
        color: orange;
    }
`;

const Phi = styled.span`
    color: orange;
    font-family: "Century Gothic";
`;

const TexteTitre = styled.div`
    font-size: 30px;
    margin: 10px;
    margin-top: 0;
`;

const MenuMobile = () => {
    const [redActive, setRedActive] = React.useState(false);
    const [page, setPage] = React.useState("");
    const [menu, setMenu] = React.useState(false);

    let changementPage = (UrlPage: string) => {
        setMenu(false);
        setPage(UrlPage);
        setRedActive(true);
    };
    return (
        <>
            {redActive && <Redirect push to={page} />}
            <Drawer
                placement="left"
                visible={menu}
                onClose={() => setMenu(false)}
                title="PHIDBAC"
            >
                <BoutonPage onClick={() => changementPage("/")}>
                    Accueil
                </BoutonPage>
                <BoutonPage style={{ color: "rgba(0,0,0,0.3" }}>
                    Programmes / Epreuves
                </BoutonPage>
                <BoutonPage onClick={() => changementPage("/Sujets")}>
                    Sujets
                </BoutonPage>
                <BoutonPage style={{ color: "rgba(0,0,0,0.3" }}>
                    Cours
                </BoutonPage>
                <BoutonPage style={{ color: "rgba(0,0,0,0.3" }}>
                    Exercices
                </BoutonPage>
                <BoutonPage>
                    <Connexion />
                </BoutonPage>
            </Drawer>
            <BoutonMenu onClick={() => setMenu(true)}>
                MENU
                <Icon style={{ marginLeft: "5px" }} type="menu" />
            </BoutonMenu>
            <TexteTitre>
                <Phi>φ</Phi>d<Phi>'</Phi>
                bac
                <Phi>'</Phi>!
            </TexteTitre>
        </>
    );
};
export default MenuMobile;