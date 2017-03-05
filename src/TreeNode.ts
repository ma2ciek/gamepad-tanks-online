export default class TreeNode<T> {
    public children: { [buttonIndex: number]: TreeNode<T> } = {};

    public actions: T[] = [];

    public isLastAction = false;
}
