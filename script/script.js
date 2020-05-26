//обработчик событий
document.addEventListener('DOMContentLoaded', function () {
    'use strict'
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswer = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const modalDialog = document.querySelector('.modal-dialog');
    const sendButton = document.querySelector('#send');

    const firebaseConfig = {
        apiKey: "AIzaSyC6KgYmh3NCGX2YZBTK2cr20FxweHX8Mug",
        authDomain: "burgerquiz-3122c.firebaseapp.com",
        databaseURL: "https://burgerquiz-3122c.firebaseio.com",
        projectId: "burgerquiz-3122c",
        storageBucket: "burgerquiz-3122c.appspot.com",
        messagingSenderId: "824124209097",
        appId: "1:824124209097:web:db5e33e979c2a8328b1a18"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);


    const getData = () => {
        formAnswer.textContent = 'Load';

        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
        
        firebase.database().ref().child('questions').once('value')
            .then(snap => playTest(snap.val()));

    }


    //открытие модального окна
    btnOpenModal.addEventListener("click", function () {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        getData();
    })

    //закрытие модального окна
    closeModal.addEventListener("click", function () {
        modalBlock.classList.remove('d-block');
    })

    let count = -100;

    modalDialog.style.top = count + "%";

    const animateModal = () => {
        modalDialog.style.top = count + "%";
        count++;

        if (count < 0) {
            requestAnimationFrame(animateModal);
        } else {
            count = -100;
        } 

    };
    // функция тестирования
    const playTest = (questions) => {

        const finalAnswers = [];
        // переменная с номером вопроса
        let numberQuestion = 0;
        // функция рендринга ответов
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answers) => {
                const answerItem = document.createElement('div');

                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answers.title}" name="answer" class="d-none" value="${answers.title}">
                    <label for="${answers.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answers.url}" alt="burger">
                    <span>${answers.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);
            })
        }
        //функция рендренга вопросов и ответов
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';

            //switch вопросы
            switch (true) {
                case numberQuestion === 0:
                    questionTitle.textContent = `${questions[indexQuestion].question}`;
                    renderAnswers(indexQuestion);
                    prevButton.classList.add('d-none');
                    nextButton.classList.remove('d-none');
                    console.log('первый вопрос');
                    break;

                case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
                    questionTitle.textContent = `${questions[indexQuestion].question}`;
                    renderAnswers(indexQuestion);
                    nextButton.classList.remove('d-none');
                    sendButton.classList.add('d-none');
                    prevButton.classList.remove('d-none');
                    console.log('ни первое ни ввод телефона ни последнее сообщение');
                    break;

                case (numberQuestion === questions.length):
                    nextButton.classList.add('d-none');
                    prevButton.classList.add('d-none');
                    sendButton.classList.remove('d-none');
                    formAnswers.innerHTML = `
                <div class="form-group">
                    <label for="numberPhone">Введите свой номер телефона</label>
                    <input type="phone" class="form-control" id="numberPhone">
                </div>
                `;
                    console.log('ввод телефона вопрос');
                    break;

                case (numberQuestion === questions.length + 1):
                    formAnswers.textContent = 'Спасибо за пройденный тест!';
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block');
                    }, 2000);
                    console.log('последнее сообщение');
                    break;

            }
        }

        // запуск функции рендринга
        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};

            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');
            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value
                }

                if (numberQuestion === questions.length) {
                    obj['номер телефона'] = input.value;
                }
            })

            finalAnswers.push(obj);

        }

        //кнопка далее
        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);

        }
        //кнопка назад
        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }
        //кнопка отправить
        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            firebase
            .database()
            .ref()
            .child('contacts')
            .push(finalAnswers);
        }

    }
})