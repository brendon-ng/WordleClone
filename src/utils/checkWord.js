import words from './5letterwords.json';

const wordSet = new Set(words.words);

const checkWord = (word) => {
  return wordSet.has(word.toLowerCase());
};

export default checkWord;
