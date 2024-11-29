const { SessionsClient } = require('@google-cloud/dialogflow');
const path = require('path');

const keyFilePath = path.join(__dirname, '../markerdaollmagent.json');

const sessionClient = new SessionsClient({
  keyFilename: keyFilePath,
});

const projectId = 'markerdaollmagent-aipc';

async function detectIntent(message, sessionId) {
  try {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const params = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en',
        },
      },
    };

    const responses = await sessionClient.detectIntent(params);
    const result = responses[0]?.queryResult;

    if (!result || !result.fulfillmentText) {
      throw new Error('No response from Dialogflow');
    }

    return result.fulfillmentText;
  } catch (error) {
    console.error('Error in DialogflowService:', error);

    throw new Error('Failed to process message in Dialogflow');
  }
}

module.exports = { detectIntent };
