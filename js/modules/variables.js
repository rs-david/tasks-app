/* Variables */

export const UI = {
  current: 'tasks',
  tasks: {
    table: {
      headers: ['id', 'name', 'description', 'created'],
      list: {
        limit: 50,
        sort: { order: 'DESC', column: 'created' },
      },
      cards: {
        columns: ['id', 'name', 'description', 'created'],
      },
    },
    filter: {
      inputs: { id: '', name: '', description: '' },
    },
    save: {
      type: 'add',
      key: 0,
      inputs: { id: '', name: '', description: '' },
    },
    delete: {
      type: '',
      keys: {
        list: [],
        memory: [],
        individual: [],
      },
    },
  },
};

export const _tables = {
  current: 'tasks',
  tasks: {
    name: 'tasks',
    searchinputs: ['id', 'name', 'description'],
    searchdata: { id: '', name: '', description: '' },
    saveinputs: ['id', 'name', 'description'],
    headers: ['id', 'name', 'description', 'created'],
    list: { limit: 50, sort: 'DESC', column: 'created', columns: ['id', 'name', 'description', 'created'] },
    listnew: {
      headers: ['id', 'name', 'description', 'created'],
      cards: {
        limit: 50,
        sort: { order: 'DESC', column: 'created' },
        columns: ['id', 'name', 'description', 'created']
      }
    },
    delete: {
      type: '',
      keys: {
        list: [],
        memory: [],
        individual: []
      }
    },
    save: { type: 'add', id: 0, inputs: ['id', 'name', 'description'] },
    savedata: { savemode: 'add', cardid: 0 }
  },
  products: {
    name: 'products',
    searchinputs: ['id', 'name', 'price'],
    searchdata: { id: '', name: '', price: '' },
    saveinputs: ['id', 'name', 'price', 'quantity'],
    headers: ['id', 'name', 'price', 'created'],
    list: { limit: 50, sort: 'DESC', column: 'created', columns: ['id', 'name', 'price', 'created'] },
    delete: {
      type: '',
      keys: {
        list: [],
        memory: [],
        individual: []
      }
    },
    savedata: { savemode: 'add', cardid: 0 }
  }
}
