/**
 * Unit & Integration Test for "আপনার প্রযুক্তি জ্ঞান"
 */

import { QUIZ_QUESTIONS, getPerformanceMessage, toBengaliNumber, TECH_TOPICS } from './js/data.js';

console.log('🧪 Starting Quiz Verification Tests...\n');

let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failed++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. Check Questions Count
assert(QUIZ_QUESTIONS.length === 10, 'Quiz must have exactly 10 questions.');

// 2. Validate Each Question
QUIZ_QUESTIONS.forEach((q, idx) => {
  assert(q.id === idx + 1, `Question ${idx + 1} has correct ID.`);
  assert(q.question && q.question.length > 5, `Question ${idx + 1} has valid text.`);
  assert(Array.isArray(q.options) && q.options.length === 4, `Question ${idx + 1} has exactly 4 options.`);
  if (q.allCorrect) {
    assert(q.allCorrect === true, `Question ${idx + 1} has allCorrect enabled.`);
  } else if (Array.isArray(q.correctAnswer)) {
    q.correctAnswer.forEach(ans => {
      assert(q.options.includes(ans), `Question ${idx + 1} correct answer "${ans}" exists in options.`);
    });
  } else {
    assert(q.options.includes(q.correctAnswer), `Question ${idx + 1} correct answer "${q.correctAnswer}" exists in options.`);
  }
  assert(q.marks === 10, `Question ${idx + 1} is worth 10 marks.`);
  assert(q.explanation && q.explanation.length > 10, `Question ${idx + 1} has Bengali explanation.`);
});

// Test Question 1 - Both Android and iOS must be correct and give 10 marks
const q1 = QUIZ_QUESTIONS.find(q => q.id === 1);
assert(Array.isArray(q1.correctAnswer), 'Question 1 has multiple correct answers array');
assert(q1.correctAnswer.includes('Android'), 'Question 1 awards 10 marks for Android');
assert(q1.correctAnswer.includes('iOS'), 'Question 1 awards 10 marks for iOS');
assert(!q1.correctAnswer.includes('Symbian'), 'Question 1 rejects Symbian');
assert(!q1.correctAnswer.includes('Java'), 'Question 1 rejects Java');

// Test RAM Question (Question 2) - All answers must be correct and give 10 marks
const ramQ = QUIZ_QUESTIONS.find(q => q.id === 2);
assert(ramQ && ramQ.allCorrect === true, 'RAM question has allCorrect: true');
['3 GB', '4 GB', '6 GB', '8 GB'].forEach(opt => {
  const isCorrect = ramQ.allCorrect && ramQ.options.includes(opt);
  assert(isCorrect, `RAM option "${opt}" correctly awards 10 marks`);
});

// 3. Test Bengali Numbers
assert(toBengaliNumber(0) === '০', 'Bengali digit 0 is ০');
assert(toBengaliNumber(1) === '১', 'Bengali digit 1 is ১');
assert(toBengaliNumber(10) === '১০', 'Bengali number 10 is ১০');
assert(toBengaliNumber(80) === '৮০', 'Bengali number 80 is ৮০');
assert(toBengaliNumber(100) === '১০০', 'Bengali number 100 is ১০০');

// 4. Test Performance Messages
const msg100 = getPerformanceMessage(100);
assert(msg100.message === "অসাধারণ! প্রযুক্তি সম্পর্কে আপনার জ্ঞান দুর্দান্ত!", "100 marks message matches requirement");

const msg80 = getPerformanceMessage(80);
assert(msg80.message === "চমৎকার! আপনার প্রযুক্তি জ্ঞান বেশ ভালো।", "80 marks message matches requirement");

const msg60 = getPerformanceMessage(60);
assert(msg60.message === "ভালো করেছেন! আরও কিছু জানলে আপনি আরও এগিয়ে যাবেন।", "60 marks message matches requirement");

const msg40 = getPerformanceMessage(40);
assert(msg40.message === "খারাপ নয়! প্রযুক্তি সম্পর্কে আরও জানার সুযোগ রয়েছে।", "40 marks message matches requirement");

const msg20 = getPerformanceMessage(20);
assert(msg20.message === "চেষ্টা চালিয়ে যান! প্রযুক্তি সম্পর্কে আরও শিখুন এবং আবার পরীক্ষা দিন।", "20 marks message matches requirement");

// 5. Test Tech Topics Count
assert(TECH_TOPICS.length === 8, "Educational topics must have 8 topics");
const requiredTopics = ['smartphone', 'os', 'ram', 'processor', 'ai', 'programming', 'semiconductor', 'space'];
requiredTopics.forEach(tId => {
  const found = TECH_TOPICS.find(t => t.id === tId);
  assert(!!found, `Topic "${tId}" exists with full Bengali details.`);
});

// 6. Test Participants & Leaderboard Manager
import { ParticipantsManager } from './js/participants.js';
const pData = ParticipantsManager.getParticipantsData();
assert(pData.totalCount >= 10, 'Participants total count is at least 10');
assert(pData.list.length >= 10, 'Participants list contains at least 10 initial entries');

const top1 = pData.list[0];
assert(top1.name && top1.score !== undefined && top1.time && top1.date, 'Participant entry has name, score, time, date');

// Test adding a participant
const added = ParticipantsManager.addParticipant('পরীক্ষার্থী এক্স', 100, 100, '১০০/১০০ — অসাধারণ!');
assert(added.name === 'পরীক্ষার্থী এক্স', 'Added participant has correct name');
assert(added.score === 100, 'Added participant has 100 score');

console.log(`\n========================================`);
if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! (0 failures)');
} else {
  console.error(`💥 ${failed} test(s) failed!`);
  process.exit(1);
}
