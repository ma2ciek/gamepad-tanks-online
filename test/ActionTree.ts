import { expect } from 'chai';
import * as sinon from 'sinon';
import ActionTree, { TreeNode } from '../src/ActionTree';

class TestActionTree extends ActionTree {
    public root: TreeNode<any>;
}

describe('ActionTree', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
    });

    describe('add()', () => {
        it('should add sequence', () => {
            const actionTree = new TestActionTree();
            const spy = sandbox.spy();

            actionTree.add([1], spy);

            sinon.assert.notCalled(spy);

            expect(actionTree.root.children[1].actions[0]).to.be.equal(spy);
        });

        it('should add sequence 2', () => {
            const actionTree = new TestActionTree();
            const spy = sandbox.spy();

            actionTree.add([1, 2, 3], spy);

            sinon.assert.notCalled(spy);

            expect(actionTree.root.children[1].children[2].children[3].actions[0]).to.be.equal(spy);
        });
    });

    describe('move', () => {
        it('should be able to move', () => {
            const actionTree = new TestActionTree();
            const spy = sandbox.spy();

            actionTree.add([1, 2, 3], spy);

            actionTree.move(1);
            actionTree.move(2);
            actionTree.move(3);

            sinon.assert.calledOnce(spy);
        });

        it('should not move when other key is pressed', () => {
            const actionTree = new TestActionTree();
            const spy = sandbox.spy();

            actionTree.add([1], spy);

            actionTree.move(2);

            sinon.assert.notCalled(spy);
        });

        it('should be able to move', () => {
            const actionTree = new TestActionTree();
            const spy = sandbox.spy();

            actionTree.add([1, 2, 3], spy);

            actionTree.move(3);
            actionTree.move(2);
            actionTree.move(1);
            actionTree.move(2);
            actionTree.move(3);

            sinon.assert.calledOnce(spy);
        });

        it('should fire callback twice and handle last action option', () => {
            const actionTree = new TestActionTree();
            const spy = sandbox.spy();

            actionTree.add([1, 2, 3], spy, true);

            actionTree.move(1);
            actionTree.move(2);
            actionTree.move(3);

            actionTree.move(1);
            actionTree.move(2);
            actionTree.move(3);

            sinon.assert.calledTwice(spy);
        });
    });
});
