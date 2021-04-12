/* DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages. */

import { IResultAction } from "../../interfaces/IResultAction";
import { IWebChatAction } from "../../interfaces/IWebChatAction";
import { IWebChatMiddleware } from "../../interfaces/IWebChatMiddleware";

export interface IDataMaskingRule {
    [key: string]: string;
}

export interface IDataMaskingSetting {
    msdyn_maskforcustomer: boolean;
    msdyn_maskforagent: boolean;
}

export interface IDataMaskingInfo {
    dataMaskingRules: IDataMaskingRule;
    setting: IDataMaskingSetting;
}

class DataMaskingMiddleware implements IWebChatMiddleware {
    private dataMaskingRules: any;

    public constructor (dataMaskingRules: any) {
        // console.log(`[DataMaskingMiddleware][constructor]`);
        this.dataMaskingRules = dataMaskingRules;

        console.log(`[DataMaskingRules]`);
        console.log(this.dataMaskingRules);
    }

    public applicable(action: any): boolean {
        // console.log(`[DataMaskingMiddleware][applicable]`);
        const { text } = action.payload;
        if (Object.keys(this.dataMaskingRules).length > 0 && text && action.type === "WEB_CHAT/SEND_MESSAGE") {
            return true;
        }
        return false;
    }

    public apply(action: any): IResultAction {
        // console.log('[DataMaskingMiddleware][apply]');
        let _nextAction = this.applyDataMasking(action);
        return {
            dispatchAction: null,
            nextAction: _nextAction
        };
    }

    private applyDataMasking(action: any): IWebChatAction {
        const maskingCharacter = '#';
        let {text} = action.payload;
        if (Object.keys(this.dataMaskingRules).length > 0) {
            for (const maskingRule of Object.values(this.dataMaskingRules)) {
                const regex = new RegExp(maskingRule as string, 'g');
                let match;
                while (match = regex.exec(text)) {
                    const replaceStr = match[0].replace(/./g, maskingCharacter);
                    text = text.replace(match[0], replaceStr);
                }
            }
        }

        action.payload.text = text;
        return action;
    }
}

const createDataMaskingMiddleware = (chatConfig: any) => {
    console.log('[createDataMaskingMiddleware]');
    return new DataMaskingMiddleware(chatConfig);
};

export {
    createDataMaskingMiddleware
}
