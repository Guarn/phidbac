import React, {
    useCallback,
    useMemo,
    useState,
    useEffect,
    useContext
} from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import styled from "styled-components";
import { isEqual } from "lodash";
import {
    BarreOutils,
    FormatGras,
    FormatItalic,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    FormatFold,
    FormatUnfold,
    FormatH1,
    FormatH2,
    FormatH3,
    Separateur,
    FormatCouleurTexte,
    FormatCouleurBackground,
    FormatNumberedList,
    FormatOrderedList
} from "./Components";
import "./Slate.css";
import isUrl from "is-url";

import { Button, Icon } from "antd";

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underlined",
    "mod+`": "code"
};

const TEXT_FORMATS = [
    "bold",
    "italic",
    "underlined",
    "code",
    "couleurTexteActive",
    "couleurBackgroundActive"
];
const LIST_FORMATS = ["numbered-list", "bulleted-list"];
const BLOCK_FORMATS = [...LIST_FORMATS, "h1", "h2", "h3", "block-quote"];

const SlateJs = (props) => {
    const [state, setState] = useState();
    const [selection, setSelection] = useState(null);
    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(
        () => withLinks(withRichText(withHistory(withReact(createEditor())))),
        []
    );
    useEffect(() => {}, [state]);

    return (
        <Slate editor={editor} value={props.value} selection={selection}>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                readOnly={true}
                style={{ userSelect: "text" }}
            />
        </Slate>
    );
};

const withLinks = (editor) => {
    const { exec, isInline } = editor;

    editor.isInline = (element) => {
        return element.type === "link" ? true : isInline(element);
    };

    editor.exec = (command) => {
        if (command.type === "insert_link") {
            const { url } = command;

            if (editor.selection) {
                wrapLink(editor, url);
            }

            return;
        }

        let text;

        if (command.type === "insert_data") {
            text = command.data.getData("text/plain");
        } else if (command.type === "insert_text") {
            text = command.text;
        }

        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            exec(command);
        }
    };

    return editor;
};

const isLinkActive = (editor) => {
    const [link] = Editor.nodes(editor, { match: { type: "link" } });
    return !!link;
};

const unwrapLink = (editor) => {
    Editor.unwrapNodes(editor, { match: { type: "link" } });
};

const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link = {
        type: "link",
        url,
        children: isCollapsed ? [{ text: url }] : []
    };

    if (isCollapsed) {
        Editor.insertNodes(editor, link);
    } else {
        Editor.wrapNodes(editor, link, { split: true });
        Editor.collapse(editor, { edge: "end" });
    }
};

const withRichText = (editor) => {
    const { exec } = editor;

    editor.exec = (command) => {
        if (command.type === "marginLeft") {
            const { format, type } = command;
            const [match] = Editor.nodes(editor, {
                match: "block",
                mode: "all"
            });
            let margin;
            if (format === "unfold") {
                margin = match[0].marginLeft
                    ? match[0].marginLeft === 0
                        ? null
                        : match[0].marginLeft - 15
                    : null;
            }
            if (format === "fold") {
                margin = match[0].marginLeft ? match[0].marginLeft + 15 : 15;
            }
            Editor.setNodes(editor, {
                type: match[0].type,
                marginLeft: margin
            });
        }
        if (command.type === "alignement") {
            const { format, type } = command;
            const isActive = isFormatActive(editor, format);
            const isAlign = isAlignActive(editor, type);
            const [match] = Editor.nodes(editor, {
                match: "block",
                mode: "all"
            });
            if (match)
                Editor.setNodes(editor, {
                    type: match[0].type,
                    align: format
                });
        }
        if (command.type === "couleur") {
            const { format } = command;
            const { couleurTexte, couleurBackground } = command;
            const isActive = isFormatActive(editor, format);
            const memeCouleur = sontMemeCouleurs(editor, couleurTexte);
            const memeCouleur1 = sontMemeCouleurs1(editor, couleurBackground);
            const active = () => {
                if (isActive) {
                    if (command.couleurTexte === "" || memeCouleur) {
                        return false;
                    }
                    if (command.couleurTexte !== "" && !memeCouleur) {
                        return true;
                    }
                } else {
                    if (command.couleurTexte === "") {
                        return false;
                    }
                    if (command.couleurTexte !== "") {
                        return true;
                    }
                }
            };

            const active1 = () => {
                if (isActive) {
                    if (command.couleurBackground === "" || memeCouleur1) {
                        return false;
                    }
                    if (command.couleurBackground !== "" && !memeCouleur1) {
                        return true;
                    }
                } else {
                    if (command.couleurBackground === "") {
                        return false;
                    }
                    if (command.couleurBackground !== "") {
                        return true;
                    }
                }
            };

            if (format === "couleurTexteActive") {
                Editor.setNodes(
                    editor,
                    {
                        [format]: active() ? true : null,
                        couleurTexte: active() ? command.couleurTexte : null
                    },
                    { match: "text", split: true }
                );
            }
            if (format === "couleurBackgroundActive") {
                Editor.setNodes(
                    editor,
                    {
                        [format]: active1() ? true : null,
                        couleurBackground: active1()
                            ? command.couleurBackground
                            : null
                    },
                    { match: "text", split: true }
                );
            }
        }

        if (command.type === "toggle_format") {
            const { format } = command;
            const isActive = isFormatActive(editor, format);
            const isList = LIST_FORMATS.includes(format);

            if (TEXT_FORMATS.includes(format)) {
                Editor.setNodes(
                    editor,
                    { [format]: isActive ? null : true },
                    { match: "text", split: true }
                );
            }

            if (BLOCK_FORMATS.includes(format)) {
                for (const f of LIST_FORMATS) {
                    Editor.unwrapNodes(editor, {
                        match: { type: f },
                        split: true
                    });
                }

                Editor.setNodes(editor, {
                    type: isActive ? "paragraph" : isList ? "list-item" : format
                });

                if (!isActive && isList) {
                    Editor.wrapNodes(editor, { type: format, children: [] });
                }
            }
        } else {
            exec(command);
        }
    };

    return editor;
};

const getCouleur = (editor) => {
    const [match] = Editor.nodes(editor, {
        match: { couleurTexteActive: true }
    });
    if (match) {
        return match[0].couleurTexte;
    } else {
        return "";
    }
};

const getBackground = (editor) => {
    const [match] = Editor.nodes(editor, {
        match: { couleurBackgroundActive: true }
    });
    if (match) {
        return match[0].couleurBackground;
    } else {
        return "";
    }
};

const sontMemeCouleurs = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: { couleurTexte: format },
        mode: "all"
    });

    return !!match;
};

const sontMemeCouleurs1 = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: { couleurBackground: format },
        mode: "all"
    });

    return !!match;
};

const isAlignActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: { align: format },
        mode: "all"
    });

    return !!match;
};

const isFoldActive = (editor, format) => {
    const [match] = Editor.nodes(editor, { match: "element" });

    return match ? (match[0].marginLeft ? true : false) : false;
};

const isFormatActive = (editor, format) => {
    if (TEXT_FORMATS.includes(format)) {
        const [match] = Editor.nodes(editor, {
            match: { [format]: true },
            mode: "all"
        });

        return !!match;
    }

    if (BLOCK_FORMATS.includes(format)) {
        const [match] = Editor.nodes(editor, {
            match: { type: format },
            mode: "all"
        });

        return !!match;
    }

    return false;
};

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case "citation":
            return (
                <div
                    style={{
                        textAlign: element.align,
                        marginLeft: element.marginLeft,
                        marginTop: "0px",
                        marginBottom: "0px",
                        display: "flex"
                    }}
                    {...attributes}
                >
                    <div
                        style={{
                            backgroundColor: "rgba(0,0,0,0.2)",
                            width: "6px",
                            marginRight: "30px"
                        }}
                    />
                    {children}
                </div>
            );
        case "bulleted-list":
            return <ul {...attributes}>{children}</ul>;
        case "h1":
            return (
                <h1
                    style={{
                        textAlign: element.align,
                        marginLeft: element.marginLeft,
                        marginTop: "0px",
                        marginBottom: "0px"
                    }}
                    {...attributes}
                >
                    {children}
                </h1>
            );
        case "h2":
            return (
                <h2
                    style={{
                        textAlign: element.align,
                        marginLeft: element.marginLeft,
                        marginTop: "0px",
                        marginBottom: "0px"
                    }}
                    {...attributes}
                >
                    {children}
                </h2>
            );
        case "h3":
            return (
                <h3
                    style={{
                        textAlign: element.align,
                        marginLeft: element.marginLeft,
                        marginTop: "0px",
                        marginBottom: "0px"
                    }}
                    {...attributes}
                >
                    {children}
                </h3>
            );
        case "list-item":
            return <li {...attributes}>{children}</li>;
        case "numbered-list":
            return <ol {...attributes}>{children}</ol>;
        case "link":
            return (
                <a
                    {...attributes}
                    target="_blank"
                    href={"http://" + element.url}
                >
                    {children}
                </a>
            );
        default:
            return (
                <p
                    style={{
                        textAlign: element.align,
                        marginLeft: element.marginLeft,
                        marginTop: "0px",
                        marginBottom: "0px"
                    }}
                    {...attributes}
                >
                    {children}
                </p>
            );
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underlined) {
        children = <u>{children}</u>;
    }

    return (
        <span
            style={{
                color: leaf.couleurTexteActive ? leaf.couleurTexte : null,
                backgroundColor: leaf.couleurBackgroundActive
                    ? leaf.couleurBackground
                    : null,
                textAlign: leaf.alignement ? leaf.align : null
            }}
            {...attributes}
        >
            {children}
        </span>
    );
};

export default SlateJs;