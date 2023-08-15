import React from 'react'
import {isDescendant} from '@nosferatu500/react-sortable-tree'
import './scope-item-renderer.scss'
import {IconButton, Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandIcon from '@mui/icons-material/Expand';
import DragHandleIcon from '@mui/icons-material/DragHandle';

//TODO: Need to clean this file up. Get ride of all the rst class-names and replace with our own,
// get rid of code that is not relevant to our use-case

function classnames(...args) {
    return args.join(" ");
}

const defaultProps = {
    isSearchMatch: false,
    isSearchFocus: false,
    canDrag: false,
    toggleChildrenVisibility: undefined,
    buttons: [],
    className: '',
    style: {},
    parentNode: undefined,
    draggedNode: undefined,
    canDrop: false,
    title: undefined,
    subtitle: undefined,
    rowDirection: 'ltr',
}
//
// export interface NodeRendererProps {
//     node: TreeItem
//     path: number[]
//     treeIndex: number
//     isSearchMatch: boolean
//     isSearchFocus: boolean
//     canDrag: boolean
//     scaffoldBlockPxWidth: number
//     toggleChildrenVisibility?(data: NodeData): void | undefined
//     buttons?: JSX.Element[] | undefined
//     className?: string | undefined
//     style?: React.CSSProperties | undefined
//     title?: ((data: NodeData) => JSX.Element | JSX.Element) | undefined
//     subtitle?: ((data: NodeData) => JSX.Element | JSX.Element) | undefined
//     icons?: JSX.Element[] | undefined
//     lowerSiblingCounts: number[]
//     swapDepth?: number | undefined
//     swapFrom?: number | undefined
//     swapLength?: number | undefined
//     listIndex: number
//     treeId: string
//     rowDirection?: 'ltr' | 'rtl' | string | undefined
//
//     connectDragPreview: ConnectDragPreview
//     connectDragSource: ConnectDragSource
//     parentNode?: TreeItem | undefined
//     startDrag: ({ path }: { path: number[] }) => void
//         endDrag: (dropResult: unknown) => void
//         isDragging: boolean
//     didDrop: boolean
//     draggedNode?: TreeItem | undefined
//     isOver: boolean
//     canDrop?: boolean | undefined
// }


/**
 * This renders the rows in the scope editor that are used for adding new items.
 * @param props
 * @returns {Element}
 */
function renderNewScopeItemRow(props, eventHandlers) {
    const {
        onTitleChanged,
        onNewItemClicked,
        onDeleteItemClicked,
        onFillSubtasksClicked
    } = eventHandlers;

    const {
        scaffoldBlockPxWidth,
        toggleChildrenVisibility,
        connectDragPreview,
        connectDragSource,
        isDragging,
        canDrop,
        canDrag,
        node,
        title,
        subtitle,
        draggedNode,
        path,
        treeIndex,
        isSearchMatch,
        isSearchFocus,
        buttons,
        className,
        style,
        didDrop,
        treeId: _treeId,
        isOver: _isOver, // Not needed, but preserved for other renderers
        parentNode: _parentNode, // Needed for dndManager
        rowDirection,
        ...otherProps
    } = props;

    const rowDirectionClass = rowDirection === 'rtl' ? 'scope-item-rtl' : undefined

    return <div style={{height: '100%'}} {...otherProps} className={"scope-editor-tree-item"}>
        <div className={classnames('scope-item-rowWrapper', rowDirectionClass ?? '')}>
            <div className={'scope-item-row'}>
                <Button color="success"
                        variant="contained"
                        startIcon={<AddIcon/>}
                        aria-label="add"
                        onClick={(evt) => onNewItemClicked(node)}
                        className={"scope-item-add-button"}
                >
                    <span className={"add-scope-item-button-text"}>Add</span>
                </Button>
            </div>
        </div>
    </div>;
}

function renderScopeItemToolbar(node, eventHandlers) {
    const {
        onTitleChanged,
        onNewItemClicked,
        onDeleteItemClicked,
        onFillSubtasksClicked
    } = eventHandlers;

    return <div className="scope-item-rowToolbar">
        <Button
            className={"scope-item-toolbar-button"}
            color="primary"
            variant="contained"
            aria-label="fillSubtasks"
            onClick={(evt) => onFillSubtasksClicked(node)}
        >
            <ExpandIcon sx={{fontSize: "20px"}}/>
        </Button>
        <Button
            className={"scope-item-toolbar-button"}
            color="error"
            variant="contained"
            aria-label="delete"
            onClick={(evt) => onDeleteItemClicked(node)}
        >
            <DeleteIcon sx={{fontSize: "20px"}}/>
        </Button>
    </div>;
}

function renderRowContentsEditor(rowDirectionClass, node, nodeTitle, onTitleChanged) {
    return <div
        className={classnames(
            'scope-item-rowContents',
            rowDirectionClass ?? '',
        )}>

        <span className={"scope-number"}>
            {node.scopeNumber}
        </span>

        <input
            className={"scope-item-title-edit"}
            value={nodeTitle}
            onChange={(e) => onTitleChanged(e.target.value, node)}
        />
    </div>;
}

/**
 * This renders scope item rows in the renderer
 */
function renderScopeItemRow(props, eventHandlers) {
    const {
        onTitleChanged,
        onNewItemClicked,
        onDeleteItemClicked,
        onFillSubtasksClicked
    } = eventHandlers;

    const {
        scaffoldBlockPxWidth,
        toggleChildrenVisibility,
        connectDragPreview,
        connectDragSource,
        isDragging,
        canDrop,
        canDrag,
        node,
        title,
        subtitle,
        draggedNode,
        path,
        treeIndex,
        isSearchMatch,
        isSearchFocus,
        buttons,
        className,
        style,
        didDrop,
        treeId: _treeId,
        isOver: _isOver, // Not needed, but preserved for other renderers
        parentNode: _parentNode, // Needed for dndManager
        rowDirection,
        ...otherProps
    } = props
    const rowDirectionClass = rowDirection === 'rtl' ? 'scope-item-rtl' : undefined
    const nodeTitle = title || node.title;

    let handle
    if (canDrag) {
        handle =
            typeof node.children === 'function' && node.expanded ? (
                <div className="scope-item-loadingHandle">
                    <div className="scope-item-loadingCircle">
                        {Array.from({length: 12}).map((_, index) => (
                            <div
                                key={index}
                                className={classnames(
                                    'scope-item-loadingCirclePoint',
                                    rowDirectionClass ?? ''
                                )}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                connectDragSource(<div className="scope-item-moveHandle">
                </div>, {
                    dropEffect: 'copy',
                })
            )
    }

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    const isLandingPadActive = !didDrop && isDragging

    let buttonStyle = {left: -0.5 * scaffoldBlockPxWidth, right: 0}
    if (rowDirection === 'rtl') {
        buttonStyle = {right: -0.5 * scaffoldBlockPxWidth, left: 0}
    }

    let scopeTreeItemClasses =
        "scope-editor-tree-item " +
        (node.children.length > 0 ? 'scope-item-has-children ' : ' ') +
        (node.isLastScopeItemInGroup ? 'scope-item-last-in-group ' : ' ') +
        (node.isFirstScopeItemInGroup && node.treeIndex > 0 ? 'scope-item-first-in-group ' : ' ');

    return (
        <div style={{height: '100%'}} {...otherProps} className={scopeTreeItemClasses}>
            {toggleChildrenVisibility &&
                node.children &&
                (node.children.length > 0 || typeof node.children === 'function') && (
                    <div>
                        <button
                            type="button"
                            aria-label={node.expanded ? 'Collapse' : 'Expand'}
                            className={classnames(
                                node.expanded ? 'scope-item-collapseButton' : 'scope-item-expandButton',
                                rowDirectionClass ?? ''
                            )}
                            style={buttonStyle}
                            onClick={() =>
                                toggleChildrenVisibility({
                                    node,
                                    path,
                                    treeIndex,
                                })
                            }
                        />

                        {node.expanded && !isDragging && (
                            <div
                                style={{width: scaffoldBlockPxWidth}}
                                className={classnames(
                                    'scope-item-lineChildren',
                                    rowDirectionClass ?? ''
                                )}
                            />
                        )}
                    </div>
                )}

            <div className={classnames('scope-item-rowWrapper', rowDirectionClass ?? '')}>
                {/* Set the row preview to be used during drag and drop */}
                {connectDragPreview(
                    <div
                        className={classnames(
                            'scope-item-row',
                            isLandingPadActive ? 'scope-item-rowLandingPad' : '',
                            isLandingPadActive && !canDrop ? 'scope-item-rowCancelPad' : '',
                            isSearchMatch ? 'scope-item-rowSearchMatch' : '',
                            isSearchFocus ? 'scope-item-rowSearchFocus' : '',
                            rowDirectionClass ?? '',
                            className ?? ''
                        )}
                        style={{
                            opacity: isDraggedDescendant ? 0.5 : 1,
                            ...style,
                        }}>
                        {handle}

                        {renderRowContentsEditor(rowDirectionClass, node, nodeTitle, onTitleChanged)}

                        {renderScopeItemToolbar(node, eventHandlers)}
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * This is the function that creates the renderer for the scope items. The renderer is then plugged
 * into react-sortable-tree and thus must be compatible with its code base.
 */
const CreateNodeRenderer = function (eventHandlers) {
    const NodeRenderer = function (props) {
        props = {...defaultProps, ...props}
        const node = props.node;

        if (node.type === "new") {
            return renderNewScopeItemRow(props, eventHandlers);
        } else if (node.type === "scope-item") {
            return renderScopeItemRow(props, eventHandlers);
        } else {
            throw new Error("Unknown node type: " + node.type);
        }
    }

    return NodeRenderer;
}
export default CreateNodeRenderer;
