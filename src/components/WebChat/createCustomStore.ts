/* DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages. */

import {createStore} from 'botframework-webchat';
import {IMiddlewareCollection} from '../../interfaces/IMiddlewareCollection';
import {IWebChatMiddleware} from '../../interfaces/IWebChatMiddleware';

class CustomStore {
    private static _instance: CustomStore;
    private middlewares: IMiddlewareCollection;

    private constructor() {
        this.middlewares = {};
    }

    public static getInstance(): CustomStore {
        if (!this._instance) {
            this._instance = new CustomStore();
        }
        return this._instance;
    }

    // Add new middlewares
    public subscribe(name: string, middleware: IWebChatMiddleware): void {
        this.middlewares[name] = middleware;
    }

    public create() {
        console.log(`[CustomStore][create]`);
        return createStore(
            {}, // initial state
            ({ dispatch }: any) => (next: any) => (action: any) => {
                // console.log(`[Store] ${action.type}`);
                let nextAction = action;
                if (action && action.payload) {
                    for (const name of Object.keys(this.middlewares)) {
                        const currentMiddleware = this.middlewares[name];
                        // Apply middleware if applicable
                        if (currentMiddleware.applicable(nextAction)) {
                            const result = currentMiddleware.apply(nextAction);
                            if (result.dispatchAction) {
                                dispatch(result.dispatchAction);
                            }
                            if (result.nextAction) {
                                nextAction = result.nextAction;
                            }
                        }
                    }
                }
                return next(nextAction);
            }
        );
    }
}

const createCustomStore = () => {
    console.log(`[createCustomStore]`);
    const store = CustomStore.getInstance();
    return store;
};

export default createCustomStore;