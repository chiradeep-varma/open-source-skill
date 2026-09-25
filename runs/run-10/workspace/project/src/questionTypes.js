const QUESTION_TYPES = {
  short_text: { label: 'Short text', hasOptions: false },
  long_text: { label: 'Long text', hasOptions: false },
  email: { label: 'Email', hasOptions: false },
  number: { label: 'Number', hasOptions: false },
  single_choice: { label: 'Single choice', hasOptions: true },
  multi_choice: { label: 'Multiple choice', hasOptions: true },
  yes_no: { label: 'Yes / No', hasOptions: false },
  rating: { label: 'Rating (1-5)', hasOptions: false },
  date: { label: 'Date', hasOptions: false },
};

module.exports = { QUESTION_TYPES };
