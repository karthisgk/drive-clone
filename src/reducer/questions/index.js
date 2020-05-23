import * as types from "./action";

const initState = {
    data: {
        _id: '',
        content: '',
        tags: '',
        modalTitle: 'Create Question'
    }
}

export default function (state = initState, action) {
    switch (action.type) {
        case types.ADD:
            return {
                ...state,
                data: action.payload.data
            }
        case types.EDIT:
            return {
                ...state,
                data: action.payload.data
            }
        default:
            return state;
    }
}