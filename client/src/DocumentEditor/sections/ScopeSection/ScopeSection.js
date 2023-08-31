import {Component} from "react";
import "./ScopeSection.scss";
import {SortableTreeWithoutDndContext as SortableTree} from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import createScopeItemRenderer from "./scope-item-renderer";
import {getCompletion} from "../../../components/api";
import {NewServiceItemModal} from "./NewServiceItemModal";


export class ScopeSection extends Component {
    static minTimeToLoadPredictions = 1000;

    state = {}

    constructor(...args) {
        super(...args);

        this.nodeContentRenderer = createScopeItemRenderer({
            onTitleChanged: this.handleItemTextChanged.bind(this),
            onNewItemClicked: this.onNewItemClicked.bind(this),
            onNewStandardServiceItemClicked: this.onNewStandardServiceItemClicked.bind(this),
            onDeleteItemClicked: this.onDeleteItemClicked.bind(this),
            onFillSubtasksClicked: this.onFillSubtasksClicked.bind(this),
            onTitleEditBlur: this.onTitleEditBlur.bind(this),
            onAcceptPredictedScopeItemClicked: this.onAcceptPredictedScopeItemClicked.bind(this),
            onRejectPredictedScopeItemClicked: this.onRejectPredictedScopeItemClicked.bind(this),
        });

        this.newItemIndex = 0;
        this.isLoadingPredictions = false;
        this.newServiceParentItemNode = null;

        const defaultItems = this.generateDefaultItems();
        this.updateTreeNodes(defaultItems);
        this.state = {
            items: defaultItems,
            isShowingNewServiceItemModal: false,
        };
    }

    componentDidMount() {
    }

    createTreeNodeForNewItemRow() {
        return {
            "id": `item-${this.newItemIndex++}`,
            "title": "",
            expanded: true,
            type: "new",
            children: [],
        };
    }

    createTreeNodeForScopeItem(taskTitle) {
        return {
            "id": `item-${this.newItemIndex++}`,
            "title": taskTitle,
            expanded: true,
            type: "scope-item",
            children: [],
        }
    }

    createTreeNodeForLoadingPredictionsRow() {
        return {
            "id": `item-${this.newItemIndex++}`,
            "title": "",
            expanded: true,
            type: "loading-predictions",
            children: [],
        }
    }

    createTreeNodeForPredictedScopeItem(taskTitle) {
        return {
            "id": `item-${this.newItemIndex++}`,
            "title": taskTitle,
            expanded: true,
            type: "predicted-scope-item",
            children: [],
        }
    }

    createTreeNodeForServiceItem(serviceItemInfo) {
        return {
            "id": `item-${this.newItemIndex++}`,
            "title": serviceItemInfo.label,
            expanded: true,
            type: "service-item",
            children: [],
        }
    }

    generateDefaultItems() {
        const mobileAppTask = this.createTreeNodeForScopeItem("Mobile App")
        mobileAppTask.children = [
            this.createTreeNodeForScopeItem("Login Screen"),
            this.createTreeNodeForScopeItem("Account Settings Screen"),
            this.createTreeNodeForScopeItem("Main Social Feed"),
            this.createTreeNodeForScopeItem("New Post Page"),
        ];

        const websiteTask = this.createTreeNodeForScopeItem("Website")
        websiteTask.children = [
            this.createTreeNodeForScopeItem("Landing Page Copywriting"),
            this.createTreeNodeForScopeItem("A/B Test Tool Integration"),
        ]


        return [
            mobileAppTask,
            websiteTask,
        ];
    }

    updateTreeNodes(items) {
        this.ensureTreeContainsNewItemNodes(items);
        this.assignTreeIndexNumbersToTreeNodes(items);
        this.assignScopeNumbersToTreeNodes(items);
        this.assignScopeItemPositionAttributesToTreeNodes(items);
    }


    assignScopeNumbersToTreeNodes(items, root) {
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
            this.assignScopeNumbersToTreeNodes(items[index].children, scopeNumber)
        }
    }

    assignTreeIndexNumbersToTreeNodes(items, currentIndex) {
        if (!currentIndex) {
            currentIndex = 0;
        }

        for (let index = 0; index < items.length; index++) {
            items[index].treeIndex = currentIndex;
            currentIndex += 1;
            currentIndex = this.assignTreeIndexNumbersToTreeNodes(items[index].children, currentIndex);
        }

        return currentIndex;
    }


    ensureTreeContainsNewItemNodes(items) {
        if (items[items.length - 1].type !== "new") {
            items.push(this.createTreeNodeForNewItemRow())
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

    assignScopeItemPositionAttributesToTreeNodes(items) {
        for (let index = 0; index < items.length; index++) {

            if (index === items.length - 1) {
                items[index].isLastScopeItemInGroup = false;
            } else {
                const nextItem = items[index + 1];
                if (nextItem.type !== "new") {
                    items[index].isLastScopeItemInGroup = false;
                } else {
                    items[index].isLastScopeItemInGroup = true;
                }
            }

            if (index === 0) {
                items[index].isFirstScopeItemInGroup = true;
            } else {
                items[index].isFirstScopeItemInGroup = false;
            }

            this.assignScopeItemPositionAttributesToTreeNodes(items[index].children)
        }
    }


    handleItemTextChanged(newValue, item) {
        item.title = newValue;
        this.setState({items: this.state.items})
    }

    findParentOfItemByTreeIndex(treeIndex, items, parent) {
        if (!items) {
            items = this.state.items;
        }

        if (!parent) {
            parent = null;
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

    findItemByTreeIndex(treeIndex, items) {
        if (!items) {
            items = this.state.items;
        }

        // Finds the item within the tree matching the given tree index
        for (let index = 0; index < items.length; index++) {
            if (items[index].treeIndex === treeIndex) {
                return items[index];
            }

            const foundItem = this.findItemByTreeIndex(treeIndex, items[index].children);
            if (foundItem) {
                return foundItem;
            }
        }
        return null;
    }


    onNewItemClicked(newItemNode) {
        const parent = this.findParentOfItemByTreeIndex(newItemNode.treeIndex);
        const newItem = this.createTreeNodeForScopeItem("New Task...");
        this.addChildItem(parent, newItem);
    }


    onNewStandardServiceItemClicked(parentItemNode) {
        this.setState({
            isShowingNewServiceItemModal: true
        });
        this.newServiceParentItemNode = parentItemNode;
    }

    onDeleteItemClicked(nodeToDelete) {
        const items = this.state.items;
        this.removeNodeItemFromTree(nodeToDelete);
        this.handleTreeChanged(items);
    }

    removeNodeItemFromTree(nodeToDelete) {
        const items = this.state.items;

        const parent = this.findParentOfItemByTreeIndex(nodeToDelete.treeIndex);

        if (parent) {
            const indexWithinParent = parent.children.findIndex((child) => child.treeIndex === nodeToDelete.treeIndex);
            parent.children.splice(indexWithinParent, 1);
        } else {
            const indexWithinTopLevel = items.findIndex((child) => child.treeIndex === nodeToDelete.treeIndex);
            items.splice(indexWithinTopLevel, 1);
        }
    }

    onFillSubtasksClicked(nodeToFill) {
        const items = this.state.items;

        const prompt = "Come up with a list of subtasks for " + nodeToFill.title + "."

        this.addPredictionsLoadingRowForNode(nodeToFill);

        this.ensureMinimumPromiseResolveTime(getCompletion(prompt), ScopeSection.minTimeToLoadPredictions).then((result) => {
            this.removeAllPredictionLoadingRows(nodeToFill.children);

            const subtasks = this.extractTasksFromGPTResult(result);
            for (let subtask of subtasks) {
                const newItem = this.createTreeNodeForScopeItem(subtask);
                nodeToFill.children.splice(nodeToFill.children.length - 1, 0, newItem);
            }

            this.handleTreeChanged(items);
        });
    }

    onAcceptPredictedScopeItemClicked(nodeToAccept) {
        const items = this.state.items;
        nodeToAccept.type = "scope-item";
        this.handleTreeChanged(items);
    }

    onRejectPredictedScopeItemClicked(nodeToReject) {
        const items = this.state.items;
        this.removeNodeItemFromTree(nodeToReject);
        this.handleTreeChanged(items);
    }

    onAddServiceItem(serviceItemInfo) {
        const parent = this.findParentOfItemByTreeIndex(this.newServiceParentItemNode.treeIndex);
        const newItem = this.createTreeNodeForServiceItem(serviceItemInfo);
        this.addChildItem(parent, newItem);
        this.setState({isShowingNewServiceItemModal: false});
    }

    addChildItem(parent, newItem) {
        const items = this.state.items;
        if (parent) {
            parent.children.splice(parent.children.length - 1, 0, newItem);
        } else {
            items.splice(items.length - 1, 0, newItem);
        }

        this.handleTreeChanged(items);
    }

    extractTasksFromGPTResult(result) {
        let tasks = [];

        let text = result.result;

        const lines = text.split("\n");
        for (let line of lines) {
            if (/^\d+\.\s*/.test(line)) {
                const lineTextWithoutNumber = line.replace(/^\d+\.\s*/, "");
                tasks.push(lineTextWithoutNumber);
            }
        }

        return tasks;
    }

    removeAllPredictedScopeItems(items) {
        for (let index = 0; index < items.length; index++) {
            if (items[index].type === "predicted-scope-item") {
                items.splice(index, 1);
                index -= 1;
            } else {
                this.removeAllPredictedScopeItems(items[index].children);
            }
        }
    }

    removeAllPredictionLoadingRows(items) {
        for (let index = 0; index < items.length; index++) {
            if (items[index].type === "loading-predictions") {
                items.splice(index, 1);
                index -= 1;
            } else {
                this.removeAllPredictionLoadingRows(items[index].children);
            }
        }
    }

    predictMissingTasks(nodeToPredict) {
        if (!nodeToPredict) {
            // Do nothing.
            return;
        }

        if (this.isLoadingPredictions) {
            // Do nothing
            return;
        }

        this.isLoadingPredictions = true;

        const children = nodeToPredict.children;
        this.addPredictionsLoadingRowForNode(nodeToPredict);

        let prompt = `Given the following subtasks for the task """${nodeToPredict.title}""":\n`;
        for (let childIndex = 0; childIndex < children.length; childIndex++) {
            const child = children[childIndex];
            if (child.type === "scope-item") {
                prompt += `${childIndex + 1}. ${child.title}\n`;
            }
        }

        prompt += "\n";
        prompt += "Predict the missing subtasks for the original task.\n";

        this.ensureMinimumPromiseResolveTime(getCompletion(prompt), ScopeSection.minTimeToLoadPredictions).then((result) => {
                this.removeAllPredictionLoadingRows(nodeToPredict.children);

                const subtasks = this.extractTasksFromGPTResult(result);
                for (let subtask of subtasks) {
                    const newItem = this.createTreeNodeForPredictedScopeItem(subtask);
                    nodeToPredict.children.splice(nodeToPredict.children.length - 1, 0, newItem);
                }

                if (subtasks.length === 0) {
                    // TODO: need a better way of handling these errors
                    const newItem = this.createTreeNodeForPredictedScopeItem("Error! Failed to predict any subtasks");
                    nodeToPredict.children.splice(nodeToPredict.children.length - 1, 0, newItem);
                }

                const items = this.state.items;
                this.handleTreeChanged(items);

                this.isLoadingPredictions = false;
        });
    }

    //TODO: Move this into its own utilities file
    ensureMinimumPromiseResolveTime(promise, minimumTime) {
        let startTime = new Date();
        return promise.then((result) => {
            const endTime = new Date();
            const timeTaken = endTime.getTime() - startTime.getTime();
            const timeToDelay = Math.max(0, minimumTime - timeTaken)

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(result);
                }, timeToDelay)
            });
        });
    }

    addPredictionsLoadingRowForNode(nodeToPredict) {
        const nodeForLoadingPredictionsRow = this.createTreeNodeForLoadingPredictionsRow();
        nodeToPredict.children.splice(nodeToPredict.children.length - 1, 0, nodeForLoadingPredictionsRow);
        this.removeAllPredictedScopeItems(this.state.items);
        this.handleTreeChanged(this.state.items);
    }

    onTitleEditBlur(node) {
        const parent = this.findParentOfItemByTreeIndex(node.treeIndex);
        this.predictMissingTasks(parent);
    }

    handleTreeChanged(newTree) {
        this.updateTreeNodes(newTree);
        this.setState({items: newTree})
    }

    checkIfScopeItemCanDropAtLocation(info) {
        if (info.nextParent) {
            if (info.nextParent.children.length === 1) {
                return true;
            }

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

            return info.nextTreeIndex < lastItem.treeIndex;
        }
    }

    computeRowHeightForTreeNode(treeIndex) {
        const treeNode = this.findItemByTreeIndex(treeIndex);
        if (!treeNode) {
            return 0;
        }

        if (treeNode.type === "service-item") {
            return 120;
        } else {
            return 30;
        }
    }

    render() {
        return <div className={"scope-section"}>

            <h2>Scope</h2>

            <SortableTree
                treeData={this.state.items}
                onChange={treeData => this.handleTreeChanged(treeData)}
                getNodeKey={({node}) => node.id}
                nodeContentRenderer={this.nodeContentRenderer}
                canNodeHaveChildren={(node) => node.type === "scope-item"}
                rowHeight={(treeIndex) => this.computeRowHeightForTreeNode(treeIndex)}
                canDrop={(info) => this.checkIfScopeItemCanDropAtLocation(info)}
                isVirtualized={true}
            />

            <NewServiceItemModal
                open={this.state.isShowingNewServiceItemModal}
                handleClose={() => this.setState({isShowingNewServiceItemModal: false})}
                handleAddServiceItem={(serviceItem) => {this.onAddServiceItem(serviceItem)}}
            />
        </div>;
    }
}


