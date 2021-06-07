class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor(value) {
        const node = new LinkedListNode(value);
        this.head = node;
        this.tail = node;
        this.last = null;
    }

    moveList(newValue) {
        let current = this.head;
        let oldValue;
        while (current !== null) {
            oldValue = current.value;
            current.value = newValue;
            newValue = oldValue;
            current = current.next;
        }
        this.last = newValue;
    }

    insertTail() {
        const newTail = new LinkedListNode(this.last);
        this.tail.next = newTail;
        this.tail = newTail;
    }
}

export default LinkedList;