export const bannedWords = [
  // English offensive words
  'fuck',
  'fuk',
  'fukk',
  'fck',
  'shit',
  'shyt',
  'sh1t',
  'shitt',
  'bitch',
  'bich',
  'biatch',
  'asshole',
  'assholee',
  'assh0le',
  'ass',
  'assh0l3',
  'nigga',
  'niga',   
  'nigger',
  'niggaaa',
  'n1gga',
  'niggah',
  'gay',
  'bayot',
  'suckmadick',
  'suck',
  'penis',
  'mamanimo',
  'piste ka',
  'yawaka',
  'yawa ka',
  'pisitka',

  // Bisaya offensive words (some are mild, use discretion)
  'gago',       // stupid/idiot
  'gagu',
  ' gago ',     // spaced versions to catch substrings
  ' gagoo',
  ' gagooy',
  ' buang',     // crazy/idiot
  ' buangon',
  ' gago ka',
  ' ulol',      // insane
  ' ulol ka',
  ' gago kaayo',
  ' gagoha',
  ' buangha',
  ' gagoha ka',
  ' puke',      // vagina (vulgar)
  ' puke ka',
  ' puke nimo',
  ' ulol ka',
  
  // More Bisaya offensive words added:
  ' gagoan',
  ' gagoanan',
  ' gago gay',
  ' bakakon',     // liar
  ' lagot',       // pissed off (used aggressively)
  ' lagota',
  ' pisti',       // curse/interjection
  ' pisti ka',
  ' pisti nimo',
  ' buang-buang', // crazy
  ' layas',       // get lost (rude)
  ' layasa',
  ' buaya',       // crocodile (figuratively a liar or cheating person)
  ' buayaha',
  ' buaya ka',
  ' iha',         // derogatory term (can be mild but often rude)
  ' iha ka',
  ' wota',        // insulting
  ' wota ka',
  ' uloloy',      // stupid person
  ' uloloy ka',
  ' layas ka',
  ' paktol',      // stupid (less common but rude)
  ' paktolan ka',
  ' bastos',      // rude, disrespectful
  ' bastosa',
  ' bastos ka',
  ' tokhang',     // slang (negative connotation, "knock-knock" drug ops term)
  ' hayop',       // animal (insult)
  ' hayopa',
  ' hayop ka',

  // Tagalog offensive words
  ' putang ina',
  ' putangina',
  ' putangina mo',
  ' putang ina mo',
  ' gago',
  ' gago ka',
  ' gago mo',
  ' tanga',
  ' tanga ka',
  ' tanga mo',
  ' ulol',
  ' ulol ka',
  ' ulol mo',
  ' puke',
  ' puke mo',
  ' puke ka',
  ' gago ka',

  // Misc / slang / misspellings
  'bastard',
  'bastad',
  'bastad ka',
  'bitchass',
  'dickhead',
  'dick',
  'd1ck',
  'faggot',
  'fagot',
  'fag',
  'motherfucker',
  'mothafucker',
  'mothafucka',
  'slut',
  'whore',
  'cum',
  'c0ck',
  'cok',
  'cuck',
  'cucks',
  'cuckold',
];


export const bannedWordsNormalized = bannedWords.map(word => word.trim().toLowerCase());

export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+"]/g, '') // remove punctuation
    .replace(/\s+/g, ' ') // collapse multiple spaces into one
    .trim();
}

// Check if input contains banned words
export function containsBannedWord(input) {
  const normalizedInput = normalizeText(input);

  // Use normalized banned words array for faster checks
  for (const bannedWord of bannedWordsNormalized) {
    if (bannedWord.includes(' ')) {
      // Phrase: check substring
      if (normalizedInput.includes(bannedWord)) {
        return true;
      }
    } else {
      // Single word: check with word boundaries
      const regex = new RegExp(`\\b${bannedWord}\\b`, 'i');
      if (regex.test(normalizedInput)) {
        return true;
      }
    }
  }

  return false;
}