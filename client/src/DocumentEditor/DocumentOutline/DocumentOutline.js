import {Component, useState} from "react";
import List from "@mui/material/List";
import {useDrop} from 'react-dnd';
import {DraggableItemTypes} from "../../components/constants";
import {DocumentSection} from "./DocumentSection";
import "./DocumentOutline.scss";


export function createDocumentSectionFromDetails(newSection) {
    return {
        type: newSection.type,
        icon: newSection.icon,
        name: newSection.name,
    }
}


export function DocumentOutline(props) {
    const [sections, setSections] = useState([]);

    console.log("render with sections", sections);

    const [{isOver, item, dragOffset}, drop] = useDrop(
        () => ({
            accept: DraggableItemTypes.SECTION,
            drop: (item) => {
                // if (item) {
                //     const section = createDocumentSectionFromDetails(item);
                //     console.log(sections);
                //     setSections(sections.concat([section]))
                // }
            },
            collect: monitor => ({
                isOver: !!monitor.isOver(),
                item: monitor.getItem(),
                dragOffset: monitor.getClientOffset(),
            }),
        })
    )

    let [dragPosition, setDragPosition] = useState(null, [dragOffset]);

    let newDocumentSection = null;
    if (item) {
        newDocumentSection = createDocumentSectionFromDetails(item);
    }

    function createNewSection(item, sectionIndex) {
        console.log("create new section", item, sectionIndex, sections);
        const section = createDocumentSectionFromDetails(item);
        const before = sections.slice(0, sectionIndex);
        const after = sections.slice(sectionIndex);
        const newSections = before.concat([section]).concat(after);

        console.log("newSections", before, after, newSections);
        setSections(newSections);
    }

    function hoverDragNewSection(item, sectionIndex) {
        setDragPosition(sectionIndex);
    }

    return <div className={"document-outline"}>
        <div className={"outline-header"}>
            Outline
        </div>
        <div className={"outline-body"}>
            <List className={"outline-section-list"}>
                {
                    sections.map((section, sectionIndex) => {
                            const elements = [];

                            if (dragPosition === sectionIndex && newDocumentSection) {
                                elements.push(<DocumentSection section={newDocumentSection} key={"new"}/>)
                            }

                            elements.push(<DocumentSection section={section} key={sectionIndex}/>)

                            return elements;
                        }
                    )
                }
                {
                    (newDocumentSection && dragPosition && dragPosition >= sections.length) ? <DocumentSection section={newDocumentSection} key={"new"}/> : null
                }
            </List>
            <div className={"drag-slot-overlay"}>
                {
                    sections.map((section, sectionIndex) => {
                        return <DragSlot
                            key={sectionIndex}
                            slotIndex={sectionIndex}
                            onDrop={(item, slotIndex) => createNewSection(item, slotIndex)}
                            onHover={(item, slotIndex) => hoverDragNewSection(item, slotIndex)}
                        />;
                    })
                }
                <DragSlot
                    slotIndex={sections.length + 1}
                    onDrop={(item, slotIndex) => createNewSection(item, slotIndex)}
                    onHover={(item, slotIndex) => hoverDragNewSection(item, slotIndex)}
                />
            </div>
        </div>
    </div>
}


export function DragSlot(props) {
    const [, drop] = useDrop(
        () => ({
            accept: DraggableItemTypes.SECTION,
            drop: (item) => {
                if (props.onDrop) {
                    props.onDrop(item, props.slotIndex);
                }
            },
            hover: (item) => {
                if (props.onHover) {
                    props.onHover(item, props.slotIndex);
                }
            }
        })
    )


    return <div className={"drag-slot"} ref={drop}></div>
}
