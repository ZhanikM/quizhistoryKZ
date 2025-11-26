import { useEffect, useMemo, useState } from "react";
import { questionsDB } from "./questionsDB";

export default function Quiz() {
  const initialData = useMemo(() => {
    const randomized = getRandomQuestions(questionsDB);
    return {
      questions: randomized,
      answers: Array(randomized.length).fill(null),
    };
  }, []);

  const [questions, setQuestions] = useState(initialData.questions);
  const [answers, setAnswers] = useState(initialData.answers);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleConfirm = () => {
    if (selected === null) return;

    const updatedAnswers = [...answers];
    updatedAnswers[current] = selected;
    setAnswers(updatedAnswers);

    const nextIndex = current + 1;
    if (nextIndex < questions.length) {
      setCurrent(nextIndex);
      setSelected(updatedAnswers[nextIndex]);
    } else {
      setSelected(null);
    }
  };





  const goNext = () => {
    if (current < questions.length - 1) {
      const nextIndex = current + 1;
      setCurrent(nextIndex);
      setSelected(answers[nextIndex]);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      const prevIndex = current - 1;
      setCurrent(prevIndex);
      setSelected(answers[prevIndex]);
    }
  };

  const jumpTo = (index) => {
    setCurrent(index);
    setSelected(answers[index]);
  };

  const restartQuiz = () => {
    const randomized = getRandomQuestions(questionsDB);
    setQuestions(randomized);
    setAnswers(Array(randomized.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
  };

  useEffect(() => {
    if (answers.length && answers.every((a) => a !== null)) {
      setShowResult(true);
    }
  }, [answers]);

  const correctCount = answers.filter(
    (ans, i) => ans === questions[i].correct
  ).length;

  return (
    <div className="quiz-container">

      {/* Сұрақтар навигациясы */}
      <div className="question-nav">
        {questions.map((_, i) => (
          <button
            key={i}
            className={
              "nav-btn " +
              (i === current
                ? "active"
                : answers[i] !== null
                  ? "answered"
                  : "")
            }
            onClick={() => jumpTo(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {!showResult ? (
        <div className="quiz-card">
          <h2 className="quiz-title">
            {/* Сұрақ {current + 1} / {questions.length} */}
          </h2>

          <p className="quiz-question">{questions[current].question}</p>

          <div className="options">
            {questions[current].options.map((opt, idx) => (
              <button
                key={idx}
                className={
                  "option-btn " + (selected === idx ? "selected" : "")
                }
                onClick={() => setSelected(idx)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Панель управления */}
          <div className="controls">
            <button className="nav-control" onClick={goPrev}>
              ⬅ Артқа
            </button>

            <button className="confirm-btn" onClick={handleConfirm}>
              Растау
            </button>

            <button className="nav-control" onClick={goNext}>
              Келесі ➡
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-card">
          <h2 className="quiz-title">
            Нәтиже: {correctCount} / {questions.length}
          </h2>

          <div className="answers-list">
            {questions.map((q, i) => (
              <div key={i} className="answer-card">
                <p className="answer-question">{q.question}</p>

                <p
                  className={
                    answers[i] === q.correct
                      ? "answer-correct"
                      : "answer-wrong"
                  }
                >
                  Сіздің жауабыңыз:{" "}
                  {answers[i] !== null ? q.options[answers[i]] : "Жауап жоқ"}{" "}
                </p>

                {answers[i] !== q.correct && (
                  <p className="answer-correct">
                    Дұрыс жауап: {q.options[q.correct]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button onClick={restartQuiz} className="restart-btn">
            Тестті қайта бастау
          </button>
        </div>
      )}
    </div>
  );
}

function getRandomQuestions(db, count = 20) {
  const arr = [...db];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(count, arr.length));
}
