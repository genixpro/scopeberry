import {Component} from "react";
import "./ScopeSection.scss";
import {SortableTreeWithoutDndContext as SortableTree} from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import createNodeContentRenderer from "./node-content-renderer";


export class ScopeSection extends Component {
    state = {
    }

    constructor(...args) {
        super(...args);

        this.nodeContentRenderer = createNodeContentRenderer({
            onTitleChanged: this.handleItemTextChanged.bind(this),
            onNewItemClicked: this.onNewItemClicked.bind(this),
            onDeleteItemClicked: this.onDeleteItemClicked.bind(this),
        });

        this.newItemIndex = 0;


        const defaultItems = this.generateDefaultItems();
        this.assignScopeNumbersToTree(defaultItems);
        this.assignTreeIndexNumbersToTree(defaultItems);
        this.state = { items: defaultItems};
    }

    generateDefaultItems() {
        const defaultItems = [
            {
                "id": `item-${this.newItemIndex++}`,
                "title": "First Element",
                expanded: true,
                type: "scope-item",
                children: [
                    {
                        "id": `item-${this.newItemIndex++}`,
                        "title": "another element",
                        expanded: true,
                        type: "scope-item",
                        children: [],
                    },
                    {
                        "id": `item-${this.newItemIndex++}`,
                        "title": "Create new item",
                        expanded: true,
                        type: "new",
                        children: [],
                    }
                ]
            },
            {
                "id": `item-${this.newItemIndex++}`,
                "title": "Third",
                expanded: true,
                type: "scope-item",
                children: [
                    {
                        "id": `item-${this.newItemIndex++}`,
                        "title": "Fourth element",
                        expanded: true,
                        type: "scope-item",
                        children: [],
                    },
                    {
                        "id": `item-${this.newItemIndex++}`,
                        "title": "Create new item",
                        expanded: true,
                        type: "new",
                        children: [],
                    }
                ]
            }
        ];

        return defaultItems;
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

    handleTreeChanged(newTree) {
        this.assignScopeNumbersToTree(newTree);
        this.assignTreeIndexNumbersToTree(newTree);

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
                        return true;
                    }
                }}
                isVirtualized={true}
            />
        </div>;
    }

}


