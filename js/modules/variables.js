/* Vatiables Interfaz */
export const _actualtable = { name: 'tasks' }

export const _tables = {
    tasks: {
        name: 'tasks',
        searchinputs: ['id', 'name', 'description'],
        searchdata: { id: '', name: '', description: '' },
        saveinputs: ['id', 'name', 'description'],
        headers: ['id', 'name', 'description', 'created'],
        list: { table: 'tasks', limit: 50, sort: 'DESC', column: 'created', columns: ['id', 'name', 'description', 'created'] },
        deletedata: { type: '', keys: { individual: [], list: [], memory: [] } },
        savedata: { type: 'add', cardid: false }
    },
    products: {
        name: 'products',
        searchinputs: ['id', 'name', 'price'],
        searchdata: { id: '', name: '', price: '' },
        saveinputs: ['id', 'name', 'price', 'quantity'],
        headers: ['id', 'name', 'price', 'created'],
        list: { table: 'products', limit: 50, sort: 'DESC', column: 'created', columns: ['id', 'name', 'price', 'created'] },
        deletedata: { type: '', keys: { individual: [], list: [], memory: [] } },
        savedata: { type: 'add', cardid: false }
    }
}
