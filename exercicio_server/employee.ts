export class Employee {
    private id: number;
    private name: string;
    private position: string;

    constructor(id: number, name: string, position: string) {
        this.id = id;
        this.name = name;
        this.position = position;
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            position: this.position
        }
    }
}