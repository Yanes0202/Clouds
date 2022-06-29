export const inicialState = {
    user: null,
};

export const actionTypes = {
    SET_USER: "SET_USER",
};

// USER PROVIDER
const reducer = (state, action)=>{
    switch(action.type){
        case actionTypes.SET_USER:
            return{
                ...state,
                user: action.user,
            };

        default:
            return state;
    }
};

export default reducer;