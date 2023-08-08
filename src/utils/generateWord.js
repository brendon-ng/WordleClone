import { generate } from 'random-words';
import { MAX_WORD_LENGTH } from '../constants/gameConstants';

const generateTargetWord = () => {
  return generate({
    minLength: MAX_WORD_LENGTH,
    maxLength: MAX_WORD_LENGTH,
  }).toUpperCase();
};

export default generateTargetWord;
