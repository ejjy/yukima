import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    ageRange: '',
    skinType: '',
    concerns: [] as string[],
    budget: 0,
    preference: '',
    language: 'english'
  });

  const questions = [
    {
      id: 'ageRange',
      title: 'What is your age range?',
      options: ['18-24', '25-30', '31-35', '36-40', '40+']
    },
    {
      id: 'skinType',
      title: 'What is your skin type?',
      options: ['oily', 'dry', 'combination', 'sensitive', 'normal']
    },
    {
      id: 'concerns',
      title: 'What are your main skin concerns?',
      options: ['acne', 'pigmentation', 'dullness', 'fine_lines', 'large_pores', 'dryness'],
      multiple: true
    },
    {
      id: 'budget',
      title: 'What is your monthly skincare budget?',
      options: ['Under ₹500', '₹500-1000', '₹1000-2000', '₹2000-5000', 'Above ₹5000']
    },
    {
      id: 'preference',
      title: 'Product preference?',
      options: ['ayurvedic', 'natural', 'no_preference']
    }
  ];

  const handleAnswer = (value: string | string[]) => {
    const question = questions[currentStep];
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completed, navigate to routine
      navigate('/routine', { state: { userProfile: answers } });
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentStep + 1} of {questions.length}
              </span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentQuestion.title}
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(currentQuestion.multiple ? 
                  answers[currentQuestion.id as keyof typeof answers].includes(option) ?
                    (answers[currentQuestion.id as keyof typeof answers] as string[]).filter(item => item !== option) :
                    [...(answers[currentQuestion.id as keyof typeof answers] as string[]), option]
                  : option
                )}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors duration-200 ${
                  currentQuestion.multiple ?
                    (answers[currentQuestion.id as keyof typeof answers] as string[]).includes(option) ?
                      'border-rose-500 bg-rose-50 text-rose-700' :
                      'border-gray-200 hover:border-rose-300'
                    : answers[currentQuestion.id as keyof typeof answers] === option ?
                      'border-rose-500 bg-rose-50 text-rose-700' :
                      'border-gray-200 hover:border-rose-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id as keyof typeof answers] || 
              (currentQuestion.multiple && (answers[currentQuestion.id as keyof typeof answers] as string[]).length === 0)}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {currentStep === questions.length - 1 ? 'Get My Routine' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};