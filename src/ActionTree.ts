import TreeNode from './TreeNode';

export { TreeNode };

export default class ActionTree {
    protected root = new TreeNode<() => void>();
    protected activeNode = this.root;

    public add(sequence: number[], fn: () => void, isLastAction = false) {
        let currentNode = this.root;

        for (const buttonIndex of sequence) {
            if (!currentNode.children[buttonIndex]) {
                currentNode.children[buttonIndex] = new TreeNode<() => void>();
            }

            currentNode = currentNode.children[buttonIndex];
        }

        currentNode.actions.push(fn);

        currentNode.isLastAction = currentNode.isLastAction || isLastAction;
    }

    public move(nodeIndex: number) {
        const nextNode = this.activeNode.children[nodeIndex];

        if (!nextNode) {
            this.activeNode = this.root;
        } else {
            this.activeNode = nextNode;
        }

        this.activeNode.actions.forEach(fn => fn());

        if (this.activeNode.isLastAction) {
            this.activeNode = this.root;
        }
    }

    public reset() {
        this.activeNode = this.root;
    }
}
