import { createStore } from 'vuex'
import app from './modules/app'
import identity from './modules/identity'

export default createStore({
    modules: {
        app,
        identity
    }
})
