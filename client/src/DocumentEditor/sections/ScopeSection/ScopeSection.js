import {Component} from "react";
import "./ScopeSection.scss";
import {SortableTreeWithoutDndContext as SortableTree} from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import createScopeItemRenderer from "./scope-item-renderer";
import {getCompletion} from "../../../components/api";


export class ScopeSection extends Component {
    state = {
    }

    constructor(...args) {
        super(...args);

        this.nodeContentRenderer = createScopeItemRenderer({
            onTitleChanged: this.handleItemTextChanged.bind(this),
            onNewItemClicked: this.onNewItemClicked.bind(this),
            onDeleteItemClicked: this.onDeleteItemClicked.bind(this),
            onFillSubtasksClicked: this.onFillSubtasksClicked.bind(this),
        });

        this.newItemIndex = 0;


        const defaultItems = this.generateDefaultItems();
        this.updateTreeNodes(defaultItems);
        this.state = { items: defaultItems};
    }

    generateDefaultItems() {
        const defaultItems = [
            {
                "id": `item-${this.newItemIndex++}`,
                "title": "Mobile App",
                expanded: true,
                type: "scope-item",
                children: []
            }
        ];

        return defaultItems;
    }

    updateTreeNodes(items) {
        this.ensureTreeContainsNewItemNodes(items);
        this.assignTreeIndexNumbersToTree(items);
        this.assignScopeNumbersToTree(items);
        this.assignScopeItemPositionAttributes(items);
    }


    assignScopeNumbersToTree(items, root) {
        if (!root) {
            root = "";
        }

        for (let index = 0; index < items.length; index++) {
            let scopeNumber = root;
            if (scopeNumber) {
                scopeNumber += ".";
            }
            scopeNumber += (index + 1).toString();

            items[index].scopeNumber = scopeNumber;
            this.assignScopeNumbersToTree(items[index].children, scopeNumber)
        }
    }

    assignTreeIndexNumbersToTree(items, currentIndex) {
        if (!currentIndex) {
            currentIndex = 0;
        }

        for (let index = 0; index < items.length; index++) {
            items[index].treeIndex = currentIndex;
            currentIndex += 1;
            currentIndex = this.assignTreeIndexNumbersToTree(items[index].children, currentIndex);
        }

        return currentIndex;
    }


    ensureTreeContainsNewItemNodes(items) {
        if (items[items.length - 1].type !== "new") {
            items.push({
                "id": `item-${this.newItemIndex++}`,
                "title": "Create new item",
                expanded: true,
                type: "new",
                children: [],
            })
        }

        if (items.length === 1 && items[0].type === "new") {
            items.splice(0, 1);
        }

        for (let item of items) {
            if (item.type !== "new") {
                if (item.children && item.children.length > 0) {
                    this.ensureTreeContainsNewItemNodes(item.children);
                }
            }
        }
    }

    assignScopeItemPositionAttributes(items) {
        for (let index = 0; index < items.length; index++) {
            if (index === items.length - 1) {
                items[index].isLastScopeItemInGroup = false;
            } else if (index === items.length - 2) {
                items[index].isLastScopeItemInGroup = true;
            } else {
                items[index].isLastScopeItemInGroup = false;
            }

            if (index === 0) {
                items[index].isFirstScopeItemInGroup = true;
            } else {
                items[index].isFirstScopeItemInGroup = false;
            }

            this.assignScopeItemPositionAttributes(items[index].children)
        }
    }


    handleItemTextChanged(newValue, item) {
        item.title = newValue;
        this.setState({ items: this.state.items })
    }

    findParentOfItemByTreeIndex(treeIndex, items, parent) {
        if (!items) {
            items = this.state.items;
        }

        // Finds the item within the tree matching the given tree index
        for (let index = 0; index < items.length; index++) {
            if (items[index].treeIndex === treeIndex) {
                return parent;
            }

            const foundItem = this.findParentOfItemByTreeIndex(treeIndex, items[index].children, items[index]);
            if (foundItem) {
                return foundItem;
            }
        }
    }


    onNewItemClicked(newItemNode) {
        const items = this.state.items;

        const parent = this.findParentOfItemByTreeIndex(newItemNode.treeIndex);
        const newItem = {
            "id": `item-${this.newItemIndex++}`,
            "title": "new task",
            expanded: true,
            type: "scope-item",
            children: [],
        }

        if (parent) {
            parent.children.splice(parent.children.length - 1, 0, newItem);
        }
        else {
            items.splice(items.length - 1, 0, newItem);
        }

        this.handleTreeChanged(items);
    }

    onDeleteItemClicked(nodeToDelete) {
        const items = this.state.items;
        const parent = this.findParentOfItemByTreeIndex(nodeToDelete.treeIndex);

        if (parent) {
            const indexWithinParent = parent.children.findIndex((child) => child.treeIndex === nodeToDelete.treeIndex);
            parent.children.splice(indexWithinParent, 1);
        }
        else {
            const indexWithinTopLevel = items.findIndex((child) => child.treeIndex === nodeToDelete.treeIndex);
            items.splice(indexWithinTopLevel, 1);
        }

        this.handleTreeChanged(items);
    }

    onFillSubtasksClicked(nodeToFill) {
        const items = this.state.items;

        const prompt = "Come up with a list of subtasks for " + nodeToFill.title + ".";

        getCompletion(prompt).then((result) => {
            let text = result.result;

            const subtasks = text.split("\n");
            for (let subtask of subtasks) {
                const subtaskWithoutNumber = subtask.replace(/^\d+\.\s*/, "");

                const newItem = {
                    "id": `item-${this.newItemIndex++}`,
                    "title": subtaskWithoutNumber,
                    expanded: true,
                    type: "scope-item",
                    children: [],
                }

                nodeToFill.children.splice(nodeToFill.children.length - 1, 0, newItem);
            }

            this.handleTreeChanged(items);
        });
    }

    handleTreeChanged(newTree) {
        this.updateTreeNodes(newTree);
        this.setState({ items: newTree })
    }

    render() {
        return <div className={"scope-section"}>

            <h2>Scope</h2>

            <SortableTree
                treeData={this.state.items}
                onChange={treeData => this.handleTreeChanged(treeData)}
                getNodeKey={({ node }) => node.id}
                nodeContentRenderer={this.nodeContentRenderer}
                canNodeHaveChildren={(node) => node.type === "scope-item"}
                rowHeight={30}
                canDrop={(info) => {
                    if (info.nextParent) {
                        if (info.nextParent.children.length === 1) {
                            return true;
                        }

                        // console.log(info.nextTreeIndex, JSON.stringify(info.nextParent, null, 4))

                        const createNewChildNode = info.nextParent.children.find((child) => child.type === "new");
                        if (!createNewChildNode) {
                            return true;
                        } else {
                            if (info.prevTreeIndex < info.nextTreeIndex) {
                                return info.nextTreeIndex < createNewChildNode.treeIndex;
                            } else {
                                return info.nextTreeIndex <= createNewChildNode.treeIndex;
                            }
                        }
                    } else {
                        const lastItem = this.state.items[this.state.items.length - 1];

                        if (info.nextTreeIndex < lastItem.treeIndex) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }}
                isVirtualized={true}
            />
        </div>;
    }

}


