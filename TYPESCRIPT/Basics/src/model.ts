type Cost = number | string

let displayName: string = "Colin's Standing Desk";
let inventoryType: string = "furniture";
let trackingNumber: string = "FD123455";
let createdDate: Date = new Date();
let originalCost: Cost;

if (typeof originalCost === "number") {
    let cost: number = originalCost;
} else {
    let x = originalCost;
}

enum InventoryItemType {
    Computer = "computer",
    Furniture = "furniture"
}

interface InventoryItem {
    displayName: string;
    inventoryType: "computer" | "furniture";
    readonly trackingNumber: string;
    createdDate: Date;
    originalCost?: number;

    addNote?: (note: string) => string;
}

function getInventoryItem(trackingNumber: string): InventoryItem {
    return null;
}

function saveInventoryItem(item: InventoryItem) {

}

let inventoryItem = getInventoryItem(trackingNumber)

inventoryItem.createdDate = new Date();

saveInventoryItem({
    displayName: "MacBook Pro 15 Retina",
    inventoryType: "computer",
    trackingNumber: "MBP123456",
    createdDate: new Date(),
})

function clone<T, U>(source: T, options: U): T {
    const serialized = JSON.stringify(source);
    return JSON.parse(serialized);
}

const cloned = clone(inventoryItem, {deep: true});

interface KeyValuePair<TKey, TValue> {
    Key: TKey;
    Value: TValue;
}