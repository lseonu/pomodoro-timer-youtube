const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  {
    name: 'publicKey',
    question: 'Enter your EmailJS Public Key: ',
    validate: (input) => input.startsWith('user_')
  },
  {
    name: 'serviceId',
    question: 'Enter your EmailJS Service ID: ',
    validate: (input) => input.startsWith('service_')
  },
  {
    name: 'templateId',
    question: 'Enter your EmailJS Template ID: ',
    validate: (input) => input.startsWith('template_')
  }
];

const answers = {};

const askQuestion = (index) => {
  if (index === questions.length) {
    // Write the configuration to the file
    const configContent = `export const EMAILJS_CONFIG = {
  PUBLIC_KEY: "${answers.publicKey}",
  SERVICE_ID: "${answers.serviceId}",
  TEMPLATE_ID: "${answers.templateId}",
};`;

    const configPath = path.join(__dirname, '../src/config/email.ts');
    fs.writeFileSync(configPath, configContent);
    console.log('\nEmailJS configuration has been saved successfully!');
    rl.close();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    if (question.validate && !question.validate(answer)) {
      console.log('Invalid input. Please try again.');
      askQuestion(index);
      return;
    }
    answers[question.name] = answer;
    askQuestion(index + 1);
  });
};

console.log('Welcome to EmailJS Setup!');
console.log('Please enter your EmailJS credentials:');
askQuestion(0); 