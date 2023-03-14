class Node {
    constructor(data = null, left = null, right = null) {
        this.data = data;
        this.leftLeg = left;
        this.rightLeg = right;
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        const sorted = [...new Set(array)].sort((a, b) => a - b);

        // Base case to stop recursion
        if (array.length < 1) return null;
        const mid = Math.floor(sorted.length/2);
        const end = sorted.length - 1;

        let root = new Node(
            sorted[mid], // this.data 
            this.buildTree(sorted.splice(0, mid)), // this.left
            this.buildTree(sorted.splice(1, end)) // this.right
            );
        return root;
    }

    insert(value, root = this.root) {
        // Base case 
        if (root == null) {
            root = new Node(value);
            return root;
        }
        
        if (root.data < value) root.rightLeg = this.insert(value, root.rightLeg);
        else if (root.data > value) root.leftLeg = this.insert(value, root.leftLeg);
        return root;
    }

    delete(value, root = this.root) {
        //  Base case
        if (root == null) return null;
        // Traverse down the tree
        if (root.data < value) root.rightLeg = this.delete(value, root.rightLeg);
        else if (root.data > value) root.leftLeg = this.delete(value, root.leftLeg);
        else { // values matches
            // Case the node has no child or only 1
            if (root.leftLeg == null) return root.rightLeg;
            else if (root.rightLeg == null) return root.leftLeg;
            // Case the node has 2 children
            root.data = this.minValue(root.rightLeg);
            root.rightLeg = this.delete(root.data, root.rightLeg);
        }
        return root;
    }

    minValue(root) {
        let minV = root.data;
        while (root.leftLeg !== null) {
            minV = root.leftLeg.data;
            root = root.leftLeg;
        }
        return minV;
    }


    find(value, root = this.root) {
        // Base case
        if (root == null || root.data == value) return root;
        // If value is greater than node's data
        if (root.data < value) return this.find(value, root.rightLeg);
        // If value is lesser than node's data
        return this.find(value, root.leftLeg);
    }


    levelOrder(arr = [], queue = [], root = this.root) {
        // Base case
        if (root == null) return;
        // Push the node value into arr
        arr.push(root.data);
        // Enqueue his children if any
        queue.push(root.leftLeg);
        queue.push(root.rightLeg);

        while(queue.length) {
            const level = queue[0];
            queue.shift();
            this.levelOrder(arr, queue, level);
        }
        return arr;
    }


    preorder(arr = [], root = this.root) { // Read the node data, then left subtree, then right subtree
        // Base case
        if (root == null) return;
        // read the data
        arr.push(root.data);
        // recursive call to the left subtree
        this.preorder(arr, root.leftLeg);
        // then recursive call to the right subtree
        this.preorder(arr, root.rightLeg);

        return arr;
      }


    inorder(arr = [], root = this.root) { // left subtree, then node's data, then right subtree
        // Base case
        if (root == null) return;
        // traverse down left subtree
        this.inorder(arr, root.leftLeg);
        // visit the root
        arr.push(root.data);
        // traverse down right subtree
        this.inorder(arr, root.rightLeg);

        return arr;
      }


    postorder(arr = [], root = this.root) {
        // Base case 
        if (root == null) return;
        this.postorder(arr, root.leftLeg);
        this.postorder(arr, root.rightLeg);
        arr.push(root.data);
        return arr;
      }

    
    height(node = this.root) {
      if (node == null) return -1;
      
      const leftHeight = this.height(node.leftLeg);
      const rightHeight = this.height(node.rightLeg);
    
        return Math.max(leftHeight, rightHeight) + 1;
      }

    
    depth(node, root = this.root, depth = 0) {
        // Base cases
        if (!node || root == null) return null;
        if (node == root.data) return depth;
        // Traverse down tree
        if (root.data < node) return this.depth(node, root.rightLeg, depth + 1);
            return this.depth(node, root.leftLeg, depth + 1);
      }
    

    isBalanced() {
        let root = this.root;
        if (root == null) throw new Error('Tree is empty');
        const queue = [root];

        while (queue.length) {
            // cache node to test
            let current = queue.shift();
            if (Math.abs(this.height(current.leftLeg) - this.height(current.rightLeg) > 1)) return false;
            // add child node to the queue if any
            if (current.leftLeg != null) queue.push(current.leftLeg);
            if (current.rightLeg != null) queue.push(current.rightLeg);
            current = queue[0];
        }  
        return true;
    }


    rebalance() {
        if (this.isBalanced()) return; // avoids uselessly running code if tree is already balanced
        const inorderList = this.inorder(); // get data nodes for tested tree
        this.root = this.buildTree(inorderList); // rebuild a balanced tree
    }
    

    prettyPrint(node = this.root, prefix = '', isLeft = true) {
        if (node == null) return node;
        if (node.rightLeg !== null) {
          this.prettyPrint(node.rightLeg, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
        if (node.leftLeg !== null) {
          this.prettyPrint(node.leftLeg, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
      }
}


function generateRdmTree() {
    let initArray = createRdmArray();
    let testTree = new Tree(initArray);
    return testTree;
}

function createRdmArray() {
    // init an empty array
    const array = [];
    // create an array of 30 rdm numbers
    for (let i = 0; array.length <= 30; i++) {
        let number = Math.floor(Math.random() * 50);
        if (!array.includes(number)) array.push(number);
    }
    return array;
}

let randomTree = generateRdmTree(); // generates a tree from a random array
randomTree.prettyPrint();
console.log(randomTree.isBalanced()); // true
// console.log(randomTree.levelOrder());
// console.log(randomTree.preorder());
// console.log(randomTree.inorder());
// console.log(randomTree.postorder());
