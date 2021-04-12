/* DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages. */

const createActivityMiddleware = () => {
    console.log('[createActivityMiddleware]');

    // Middleware to customize default activity behavior
    const activityMiddleware = () => (next: any) => (card: any) => {
        console.log(`%c [ActivityMiddleware]`, 'background: #2a9fd4; color: #fff');
        console.log(card);

        if (card.activity) {

            // System message
            if (card.activity.channelData && card.activity.channelData.tags &&
                card.activity.channelData.tags.includes('system')) {
                console.log(`%c [ActivityMiddleware][Message][System] ${card.activity.text}`, 'background: #2a9fd4; color: #fff');
                return (children: any) => (
                    <div key={card.activity.id} className='system-message'>
                        {next(card)(children)}
                    </div>
                );
            }

            if (card.activity.text === undefined || card.activity.text == null) {
                return next(card);
            }

            // Agent message
            if (card.activity.from.role === 'bot') {
                console.log(`%c [ActivityMiddleware][Message][Agent] ${card.activity.text}`, 'background: #2a9fd4; color: #fff');
            }

            // Customer message
            if (card.activity.from.role === 'user') {
                console.log(`%c [ActivityMiddleware][Message][Customer] ${card.activity.text}`, 'background: #2a9fd4; color: #fff');
            }
        }

        return next(card); // Default Behavior
    }

    return activityMiddleware;
}

export default createActivityMiddleware;