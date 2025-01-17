import Client from "../database"
import { BaseModel } from "./base.model";


export type Order = {
    id: number,
    product_id: number,
    user_id: number,
    quantity: number,
    status: OrderStatus
}


export type ProductOrder = {
    id: number,
    product_id: number,
    user_id: number,
    quantity: number,
    status: OrderStatus,
    name: string,
    category: string
}

export enum OrderStatus {
    ACTIVE = 'active',
    COMPLETED = 'complete'
}

export class OrderModel extends BaseModel<Order> {

    tableName: string = 'orders'


    async create(p: Order): Promise<Order> {
        try {
            const sql = `INSERT INTO ${this.tableName} (product_id,user_id ,quantity,status) VALUES($1, $2, $3, $4) RETURNING *`

            const db = await Client.connect()

            const result = await db.query(sql, [p.product_id, p.user_id, p.quantity, p.status])

            const row = result.rows[0]

            db.release()

            return row
        } catch (err) {
            throw new Error(`Could not add new ${this.tableName} . Error: ${err}`)
        }
    }
    edit(id: number, b: Order): Promise<Order> {
        throw new Error("Method not implemented.");
    }

    async currentOrdersByUser(user_id: number):Promise<Array<ProductOrder>> {
        try {
            const sql = `select orders.*,products.name, products.category from orders join products on products.id = orders.product_id where user_id = $1 and status = 'active';`
            // @ts-ignore
            const db = await Client.connect()

            const result = await db.query(sql, [user_id])

            const rows = result.rows

            db.release()

            return rows
        } catch (err) {
            throw new Error(`Could not add new ${this.tableName} . Error: ${err}`)
        }
    }

    async completedOrdersByUser(user_id: number):Promise<Array<ProductOrder>> {
        try {
            const sql = `select orders.*,products.name, products.category from orders join products on products.id = orders.product_id where user_id = $1 and status = 'completed';`
            // @ts-ignore
            const db = await Client.connect()

            const result = await db.query(sql, [user_id])

            const rows = result.rows

            db.release()

            return rows
        } catch (err) {
            throw new Error(`Could not add new ${this.tableName} . Error: ${err}`)
        }
    }

}