
function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}

Queue.prototype.size = function () {
    return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function (data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

Queue.prototype.dequeue = function () {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;

        return deletedData;
    }
};

function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}

function Tree(data) {
    let node = new Node(data);
    this._root = node;
}

Tree.prototype.traverseDF = function (callback) {
    (function recurse(currentNode) {
        for (var i = 0; i < currentNode.children.length; i++) {
            recurse(currentNode.children[i]);
        }
        callback(currentNode);
    })(this._root);
};

//this
Tree.prototype.traverseBF = function (callback) {
    let queue = new Queue();
    queue.enqueue(this._root);
    currentTree = queue.dequeue();
    while (currentTree) {
        for (var i = 0; i < currentTree.children.length; i++) {
            queue.enqueue(currentTree.children[i]);
        }
        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.contains = function (callback, traversal) {
    traversal.call(this, callback);
}

Tree.prototype.add = function (data, toData, traversal) {
    let child = new Node(data),
        parent = null,
        callback = function (node) {
            if (node.data === toData) {
                parent = node;
            }
        }
    this.contains(callback, traversal);

    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
}

function findIndex(arr, data) {
    var index;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }

    return index;
}

Tree.prototype.remove = function (data, fromData, traversal) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;

    var callback = function (node) {
        if (node.data === fromData) {
            parent = node;
        }
    };

    this.contains(callback, traversal);

    if (parent) {
        index = findIndex(parent.children, data);

        if (index === undefined) {
            throw new Error('Node to remove does not exist.');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist.');
    }

    return childToRemove;
};


//let tree = new Tree('CEO');
//tree.add('VP of Happines', 'CEO', tree.traverseBF);
//tree.add('VP of Finance', 'CEO', tree.traverseBF);
//tree.add('VP of Sadness', 'CEO', tree.traverseBF);
//tree.add('Director of Puppies', 'VP of Finance', tree.traverseBF);
//tree.add('Manager of Puppies', 'Director of Puppies', tree.traverseBF);

//tree.traverseDF(function (node) {
//    Debugging(node.data);
//});