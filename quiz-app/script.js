// Constructor

function Soru(soruMetni, soruSecenekleri, dogruCevap){
    this.soruMetni = soruMetni;
    this.soruSecenekleri = soruSecenekleri;
    this.dogruCevap = dogruCevap;
}

Soru.prototype.cevabiBul = function(cevap){
    return cevap === this.dogruCevap;
}

let sorular = [
    new Soru("1-Who is the richest man in the world",{a:"Elon Musk",b:"Jeff Bezos",c:"Mark Zuckerbarg"},"b"),
    new Soru("2-Hangisi javascript paket yönetim uygulasıdır?", { a: "Node.js", b: "Typescript", c: "Npm" }, "c")
]

function Quiz(sorular) {
    this.sorular = sorular;
    this.soruIndex = 0;
    this.dogruCevap = 0;
}

Quiz.prototype.soruGetir = function() {
    return this.sorular[this.soruIndex]
}

const quiz = new Quiz(sorular);

const time_line = document.querySelector('.time-line');


document.querySelector('#start_btn').addEventListener('click', function(){
    startTimerLine();
    startTimer(10);
    document.querySelector('.quiz_box').classList.add('active');
    soruGoster(quiz.soruGetir());
    soruSayisiniGoster(quiz.soruIndex + 1,quiz.sorular.length);
    document.querySelector('#next_question').classList.remove('show');
})

document.querySelector('#next_question').addEventListener('click', function(){
    clearInterval(counterLine);
    startTimerLine();
    clearInterval(counter);
    if(quiz.sorular.length == quiz.soruIndex + 1){
        clearInterval(counterLine);
        console.log("Quiz is finished");
        document.querySelector('.score-text').innerHTML = `Toplam ${quiz.sorular.length} sorudan ${quiz.dogruCevap} doğru cevap verdiniz`
        document.querySelector('.quiz_box').classList.remove('active');
        document.querySelector('.score_box').classList.add('active');
    }else{
        quiz.soruIndex += 1;
        startTimer(10);
        document.querySelector('#next_question').classList.remove('show');
        soruSayisiniGoster(quiz.soruIndex + 1,quiz.sorular.length);
        soruGoster(quiz.soruGetir());
    }
})

const option_list =  document.querySelector('.option_list');

function soruGoster(soru) {
    let question = `
    <span>${soru.soruMetni}</span>
    `;
    let options = "";
    for(let cevap in soru.soruSecenekleri){
        options += `
        
            <div class="option">
                <span><b>${cevap}</b>: ${soru.soruSecenekleri[cevap]}</span>            
            </div>

        `
    }
    document.querySelector('.question_text').innerHTML = question;
    option_list.innerHTML = options;

    const option = option_list.querySelectorAll('.option');

    for(let opt of option) {
        opt.setAttribute('onclick', 'selectedOption(this)');
    }

}

function selectedOption(option){
    const cevap = option.querySelector('span b').textContent;
    let soru = quiz.soruGetir();

        if(soru.cevabiBul(cevap)){
            option.classList.add('correct');
            quiz.dogruCevap += 1;
        }else{
            option.classList.add('incorrect');
        }

    for(let i=0; i < option_list.children.length; i++){
        option_list.children[i].classList.add('disabled');
    }
    document.querySelector('#next_question').classList.add('show');
}


function soruSayisiniGoster(soruSirasi, toplam) {
    let tag = ` <span class="badge bg-warning">${soruSirasi} / ${toplam}</span>`;
    document.querySelector('.question_index').innerHTML = tag;
} 

document.querySelector('.btn_reply').addEventListener('click', function(){
    document.querySelector('.score_box').classList.remove('active');
    document.querySelector('.quiz_box').classList.add('active');
    quiz.soruIndex = 0;
    document.querySelector('#start_btn').click();
})

document.querySelector('.btn_quit').addEventListener('click', function(){
    window.location.reload();
})

const time_txt = document.querySelector('.time_text');
const time_num = document.querySelector('.time_second');

let counter;
function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        time_num.textContent = time;
        time--;
        if(time < 0){
            clearInterval(counter);
            time_txt.innerHTML = "Süre Bitti";
            let cevap = quiz.soruGetir().dogruCevap;
            for(let option of option_list.children){
                if(option.querySelector('span b').textContent == cevap){
                    option.classList.add('correct');
                    document.querySelector('#next_question').classList.add('show');
                }
                option.classList.add('disabled');
            }
        }
    }
}

let counterLine;

function startTimerLine(){
    let line_width = 0; 

    counterLine = setInterval(starterLine, 10);

    function starterLine(){
        line_width += 0.5;
        time_line.style.width = line_width + "px";

        if(line_width > 549){
            clearInterval(counterLine);
        }
    }
}