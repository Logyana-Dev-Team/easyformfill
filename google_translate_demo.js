const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

// // Your credentials
// const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
// // console.log(CREDENTIALS)
// // Configuration for the client
// const translate = new Translate({
//     credentials: CREDENTIALS,
//     projectId: CREDENTIALS.project_id
// });

// const detectLanguage = async (text) => {

//     try {
//         let response = await translate.detect(text);
//         return response[0].language;
//     } catch (error) {
//         console.log(`Error at detectLanguage --> ${error}`);
//         return 0;
//     }
// }

// detectLanguage('Oggi è lunedì')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(error);
//     });

// const translateText = async (text, targetLanguage) => {

//     try {
//         let [response] = await translate.translate(text, targetLanguage);
//         return response;
//     } catch (error) {
//         console.log(`Error at translateText --> ${error}`);
//         return 0;
//     }
// };

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const projectId = 'inbound-vim-305810';

// Imports the Google Cloud client library
// const {Translate} = require('@google-cloud/translate').v2;

// Instantiates a client
const translate = new Translate({projectId});

async function quickStart() {
  // The text to translate
  const text = 'Hello, world!';

  // The target language
  const target = 'ru';

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
}

quickStart();
