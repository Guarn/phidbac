import * as React from "react";
import { Timeline, Icon, Tooltip, Button } from "antd";
import "./Exercices.css";
import { userContext } from "../../../App";
import Axios from "../../Fonctionnels/Axios";
import { Transition } from "react-transition-group";
import Programme from "../Programme/Programme";
import { useLocation, useHistory } from "react-router";
import * as Styled from "./Exercices.styled";
import { Helmet } from "react-helmet-async";
import { Desktop, Mobile, DesktopTablet } from "../../../responsive";

type coursT = {
    id: number;
    Titre: string;
    Description: string;
    Contenu: any;
    type: "Cours" | "PageUnique" | "Index";
    position: number;
};

type progT = {
    progression: number;
    idUser: number;
    idCours: number;
    updatedAt: string;
};

const duration = 200;
const defaultStyle = {
    transition: `all ${duration}ms `,
    opacity: 0
};
const transitionStyles: any = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 }
};

const Progression: React.FC<any> = ({ tab, idCours }) => {
    let newTab = tab ? tab.filter((el: any) => el.idCours === idCours) : [];
    if (tab && idCours) {
        if (newTab.length === 0) {
            return <div>Non commencé</div>;
        } else {
            if (newTab[0].progression < 100 && newTab[0].progression > 0) {
                return (
                    <div>{"En cours (" + newTab[0].progression + " %)"}</div>
                );
            }
            if (newTab[0].progression === 100) {
                let newTab = tab.filter((el: any) => el.idCours === idCours);
                let date = newTab[0].updatedAt
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/");
                return <div>Terminé le {date}</div>;
            }
            return newTab[0].progression;
        }
    } else {
        return 0;
    }
};

const SelIcone: React.FC<any> = ({ tab, idCours }) => {
    let newTab = tab ? tab.filter((el: any) => el.idCours === idCours) : [];
    if (tab && idCours) {
        if (newTab.length === 0) {
            return <Styled.Dot color="salmon" />;
        } else {
            if (newTab[0].progression < 100 && newTab[0].progression > 0) {
                return <Styled.Dot color="lightblue" />;
            }
            if (newTab[0].progression === 100) {
                return (
                    <Icon
                        type="check-circle"
                        theme="twoTone"
                        twoToneColor="#85E27B"
                        style={{ fontSize: "16px" }}
                    />
                );
            }
            return newTab[0].progression;
        }
    } else {
        return 0;
    }
};

const ProgressionGenerale: React.FC<any> = ({ tab, nbCours }) => {
    let newTab = tab ? tab.filter((el: any) => el.progression === 100) : [];
    return (
        <div>
            <span style={{ fontWeight: "bold" }}>
                {tab.length > 0
                    ? Math.round((100 / nbCours) * newTab.length) + "%"
                    : "0%"}
            </span>{" "}
            du programme terminés
        </div>
    );
};

const ProgressIcone: React.FC<any> = ({ tab, idCours, tt }) => {
    let newTab = tab ? tab.filter((el: any) => el.idCours === idCours) : [];
    if (tab && idCours) {
        if (newTab.length === 0) {
            return (
                <Tooltip placement="bottom" title={tt}>
                    <Styled.IcoProgress color="#FF8E9D" />
                </Tooltip>
            );
        } else {
            if (newTab[0].progression < 100 && newTab[0].progression > 0) {
                return (
                    <Tooltip placement="bottom" title={tt}>
                        <Styled.IcoProgress color="#BFE4F5" />
                    </Tooltip>
                );
            }
            if (newTab[0].progression === 100) {
                return (
                    <Tooltip placement="bottom" title={tt}>
                        <Styled.IcoProgress color="#85E27B" />
                    </Tooltip>
                );
            }
            return newTab[0].progression;
        }
    } else {
        return 0;
    }
};

const Exercices = () => {
    const location = useLocation();
    const [id, setId] = React.useState(
        location.pathname.substring(21)
            ? parseInt(location.pathname.substring(21).split("-")[0])
            : 0
    );
    const [lecture, setLecture] = React.useState(
        location.pathname !== "/Liste-des-exercices"
    );

    React.useEffect(() => {
        if (location.pathname === "/Liste-des-exercices") {
            setLecture(false);
        }
        if (location.pathname.substring(20)) {
            setId(parseInt(location.pathname.substring(21).split("-")[0]));
            setLecture(true);
        }
        /*
        if (state.length === 0 && progress.length === 0 && !lecture) {
            Axios.get("/Cours").then((rep) => setState(rep.data));
            if (cookies.token && user.connecte) {
                Axios.get(`/progression`).then((rep) => {
                    setProgress(rep.data);
                });
            }
        }*/
    }, [location.pathname, lecture]);

    return (
        <Styled.Conteneur>
            {lecture && <AfficherCours id={id} />}
            {!lecture && <AfficherListeCours />}
        </Styled.Conteneur>
    );
};
export default Exercices;

interface AfficherCoursI {
    id: number;
}

const AfficherCours: React.FC<AfficherCoursI> = ({ id }) => {
    const history = useHistory();

    React.useEffect(() => {});

    return (
        <>
            <div
                style={{
                    position: "relative",
                    top: "0px",
                    left: "0px",
                    height: "100%"
                }}
            >
                <Transition
                    appear
                    enter
                    mountOnEnter
                    unmountOnExit
                    in={true}
                    timeout={{ appear: 200, enter: 0, exit: 200 }}
                >
                    {(state3) => (
                        <>
                            <Desktop>
                                <Button
                                    type="ghost"
                                    icon="arrow-left"
                                    onMouseDown={() =>
                                        history.push("/Liste-des-exercices")
                                    }
                                    style={{
                                        position: "absolute",
                                        top: "-10px",
                                        left: "110px",
                                        ...defaultStyle,
                                        ...transitionStyles[state3]
                                    }}
                                >
                                    Revenir à la liste d'exercices
                                </Button>
                            </Desktop>
                            <Mobile>
                                <Button
                                    type="ghost"
                                    icon="arrow-left"
                                    onMouseDown={() =>
                                        history.push("/Liste-des-exercices")
                                    }
                                    style={{
                                        position: "absolute",
                                        top: "55px",
                                        ...defaultStyle,
                                        ...transitionStyles[state3]
                                    }}
                                >
                                    Revenir à la liste d'exercices
                                </Button>
                            </Mobile>
                        </>
                    )}
                </Transition>
                <Programme id={id} tableMatiereShow />
            </div>
        </>
    );
};

const AfficherListeCours = () => {
    const history = useHistory();
    const [user] = React.useContext(userContext);
    const [state, setState] = React.useState<coursT[]>([]);
    const [progress] = React.useState<progT[]>([]);

    React.useEffect(() => {
        Axios.get("/Exercices").then((rep) => {
            setState(rep.data);
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>{`Liste des exercices de philosophie`}</title>
                <meta charSet="utf-8" />
                <meta
                    name="description"
                    content={`Exercices pour  la préparation au bac de philosophie.`}
                />
                <link
                    rel="canonical"
                    href={`https://www.phidbac.fr/Liste-des-exercices`}
                />
            </Helmet>
            <DesktopTablet>
                <Transition
                    appear
                    enter
                    mountOnEnter
                    unmountOnExit
                    in={user.connecte}
                    timeout={{ appear: 200, enter: 0, exit: 200 }}
                >
                    {(state3) => (
                        <Styled.ConteneurProgression
                            style={{
                                ...defaultStyle,
                                ...transitionStyles[state3]
                            }}
                        >
                            <ProgressionGenerale
                                tab={progress}
                                nbCours={state.length}
                            />
                            <Styled.ConteneurIcoProgress>
                                {state.map((element, index) => {
                                    return (
                                        <ProgressIcone
                                            key={`Icone - ${index}`}
                                            tab={progress}
                                            idCours={state[index].id}
                                            tt={element.Titre}
                                        />
                                    );
                                })}
                            </Styled.ConteneurIcoProgress>
                        </Styled.ConteneurProgression>
                    )}
                </Transition>
            </DesktopTablet>
            <Styled.ConteneurTimeline>
                <Timeline>
                    {state.map((element, index) => {
                        return (
                            <Transition
                                key={`Exercice-${index}`}
                                appear
                                enter
                                mountOnEnter
                                unmountOnExit
                                in={true}
                                timeout={{
                                    appear: 200 * index,
                                    enter: 0,
                                    exit: 200
                                }}
                            >
                                {(state3) => (
                                    <Timeline.Item
                                        style={{
                                            ...defaultStyle,
                                            ...transitionStyles[state3]
                                        }}
                                        dot={
                                            <SelIcone
                                                tab={progress}
                                                idCours={state[index].id}
                                            />
                                        }
                                    >
                                        <Styled.ConteneurCours
                                            onClick={() => {
                                                history.push(
                                                    `/Liste-des-exercices/${
                                                        element.id
                                                    }-${element.Titre.trim().replace(
                                                        / /g,
                                                        "-"
                                                    )}`
                                                );
                                            }}
                                        >
                                            <Styled.Description>
                                                <Styled.TitreEtape>
                                                    {element.Titre}
                                                </Styled.TitreEtape>
                                                <Styled.DescriptionEtape>
                                                    {element.Description}
                                                </Styled.DescriptionEtape>
                                            </Styled.Description>

                                            <DesktopTablet>
                                                <Styled.Details>
                                                    {user.connecte && (
                                                        <Progression
                                                            tab={progress}
                                                            idCours={
                                                                state[index].id
                                                            }
                                                        />
                                                    )}
                                                </Styled.Details>
                                            </DesktopTablet>
                                        </Styled.ConteneurCours>
                                    </Timeline.Item>
                                )}
                            </Transition>
                        );
                    })}
                </Timeline>
            </Styled.ConteneurTimeline>
        </>
    );
};
