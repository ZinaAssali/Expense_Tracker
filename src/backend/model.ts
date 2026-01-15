//define an expense
export interface Expense {
    expenseId: string; // unique identifier
    userId: string;
    title: string;
    amount: number; //should be positive only,, and a double
    date: Date;
    notes?: string | undefined; //optional
}

export interface User {
    userId: string; // unique identifier
    username: string;
    password: string; // hashed password
}

