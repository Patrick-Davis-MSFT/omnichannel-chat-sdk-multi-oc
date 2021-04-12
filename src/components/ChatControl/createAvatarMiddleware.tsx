/* DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages. */

import { AlertCircle } from "react-feather";

const getInitial = (text: string): string => {
    if (text) {
        const initials = text.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        if (initials.length > 1) {
            return initials.substring(0, 2).toUpperCase();
        } else {
            return text.substring(0, 2).toUpperCase();
        }
    }
    return "";
}

const createAvatarMiddleware = () => {
    console.log('[createAvatarMiddleware]');

    // Middleware to display avatar
    const avatarMiddleware = () => (next: any) => (card: any) => {
        console.log(`[AvatarMiddleware]`);
        const {
            activity: {
                channelData: {
                    tags
                },
                from: {
                    name
                },
                text
            },
            fromUser
        } = card;

        console.log(card);
        // System message
        if (tags && tags.includes('system')) {
            console.log(`[AvatarMiddleware][Message][System] ${text}`);

            // Display alert icon
            return (
                <div>
                    <AlertCircle color='red' size={20}/>
                </div>
            )
        }

        if (fromUser === undefined || fromUser === null) {
            return false; // Do not display avatar on unknown message
        }

        // Display avatar on agent/customer messages

        // Agent message
        if (!fromUser) {
            console.log(`[AvatarMiddleware][Message][Agent] ${text}`);
            return (
                <div className='webchat__avatar'>
                    <p className='webchat__avatar_initials'> {getInitial(name)} </p>
                </div>
            )
        }

        // Customer message
        if (fromUser) {
            console.log(`[AvatarMiddleware][Message][Customer] ${text}`);
            return (
                <div className='webchat__avatar'>
                    <p className='webchat__avatar_initials'> {getInitial(name) || 'CU'}  </p>
                </div>
            )
        }

        return next(card); // Default Behavior
    }

    return avatarMiddleware;
}

export default createAvatarMiddleware;