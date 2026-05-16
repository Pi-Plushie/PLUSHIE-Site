   
console.log("JS OK");

window.onload = function () {
    console.log(localStorage.getItem("profile"));
    let profile =
        localStorage.getItem("profile");
    console.log("Profil chargé :", profile);

    if (!profile) {

        profile = "public";
    }

    if (profile) {

        applyProfile(profile)
       
    }
}

function setText(id, text) {

    let element = document.getElementById(id);

    if (element) element.innerHTML = text;
}

function setProfile(profile) {

    localStorage.setItem("profile", profile);
    applyProfile(profile);
}

function applyProfile(profile) {
    let buttons = document.querySelectorAll(".boutonprofil");

    buttons.forEach(btn => {

        btn.classList.remove("active-profile");

        if (btn.dataset.profile.includes(profile)) btn.classList.add("active-profile");
       
    });

    let sections =
        document.querySelectorAll(
            "[data-profile]"
        );

    sections.forEach(section => {

        if (
            (section.dataset.profile.includes(profile) || section.dataset.profile.includes("all"))
        ) {

            section.style.display = "block";
        }

        else {

            section.style.display = "none";
        }
    });

     
    let textchoix =
    {
        public: " ✦_✦ une nouvelle manière simple d'aborder la programmation.",
        curieux: " ?_? un langage original et intrigant",
        chercheur: " 🔬 un modèle computationnel basé sur l’auto-modification et les systèmes émergents.",
        prof: " Abc un langage facile à apprendre... et à enseigner",
        math: "Σλ un langage précis et rigoureux, simple mais riche de possibilités",
        hacker: " >_◉ un code qui se modifie lui-même en temps réel.",
        geek: " 💻 un langage minimaliste, une seule instruction.",
        philo: " ♾️ un langage rigoureux universel ?",
        poete: " ☾ une porte vers l'infini",
    }
    setText("Choix de présentation", textchoix[profile]);

    let Textagline =
    {
        public: "Un langage simple et naturel qui apprend et se transforme",
        curieux: "Une découverte à chaque mot",
        chercheur: "Minimaliste, séquentiel, et pourtant Turing complet !",
        prof: "Un langage qui apprend, facile à apprendre",
        math: "Quand le calcul émerge de la structure",
        hacker: "Casser les règles classiques",
        geek: "Une instruction, une expérience",
        philo: "D'un seul mot connu, naît tout un langage",
        poete: "Un mot, un univers",
    }
    setText("Tag line",Textagline[profile]);

    let Textpourquoi =
    {
        public: "Démystifier l'informatique",
        curieux: "Explorer et comprendre la complexité",
        chercheur: "Comprendre l'émergence de la complexité",
        prof: "Faciliter l'enseignement de l'informatique",
        math: "Décrire avec une rigueur vérifiable",
        hacker: "Un code qui se modifie",
        geek: "Un nouveau langage à expérimenter",
        philo: "Se poser les bonnes questions",
        poete: "Libérer l'informatique",
    }
    setText("Pourquoi", Textpourquoi[profile]);

    let Textpitch =
    {
        public: "PLUSHIE c'est de la programmation simple à apprendre, proche du langage naturel. Mais PLUSHIE est plus que ça: il apprend, se modifie lui-même et s'adapte aux besoins de l'utilisateur. PLUSHIE apprivoise l'informatique pour vous ",
        curieux: "PLUSHIE est une découverte, une aventure. Minimaliste et pourtant d'une portée infinie, il permet d'explorer et de comprendre comment se construit le complexe à partir du simple. Une expérience intrigante.",
        chercheur: "PLUSHIE explore un modèle computationnel basé sur l’auto-modification et les systèmes émergents. Même si le nom peut prêter à sourire(et c'est le but), PLUSHIE est un langage à portée universelle avec des fondements solides et rigoureux",
        prof: "PLUSHIE est très simple, presque dépouillé, à une seule instruction, sans syntaxe lourde, utilisant des mots usuels choisis par le programmeur. Un bijou à enseigner",
        math: "PLUSHIE est rigoureux et simple, proche de la génèse des mathématiques. Il permet de construire des concepts précis à partir de rien",
        hacker: "PLUSHIE est une expérience radicale qui casse les bonnes pratiques de programmation : il ne possède pas de syntaxe, pas de type de variables, le code peut se modifier lui-même en temps réel. Envie d'expérimenter ?",
        geek: "PLUSHIE est volontairement minimaliste à l'extrême. Son instruction unique et sa capacité à s'auto modifier permettent l'émergence de comportements inattendus. Il est fourni avec une interface afin de pouvoir explorer ses possibilités",
        philo: "PLUSHIE cherche à redéfinir les fondements du langage, qui est naturellement auto-référencé, et à explorer ce qui fait que le tout est plus que la somme de ses parties. Son existence seule force à se poser des questions sur la nature profonde du monde",
        poete: "PLUSHIE est plus qu'un langage informatique. Il pose des questions profondes sur la nature même de notre univers. Laissez-vous entraîner dans cette expérience.",
    }
    
    setText("Pitch", Textpitch[profile]);

    let Textprésentation =
    {
        public: "Un langage qui apprend et se transforme",
        curieux: "",
        chercheur: "PLUSHIE explore un modèle computationnel basé sur l’auto-modification et les systèmes émergents.",
        prof: "",
        math: "",
        hacker: "PLUSHIE casse les règles classiques : le code peut se modifier lui-même en temps réel.",
        geek: "Un langage minimaliste avec une seule instruction… et des comportements inattendus.",
        philo: "",
        poete: "",
    }
  
    setText("Textprésentation", Textprésentation[profile]);
    console.log("Profil sauvegardé :", profile);
}

function getProfile() {
    return localStorage.getItem("profile") || "public";
}

function getProfileText(texts) {
    return texts[getProfile()] || texts.public;
}
const presentations = {

    public:
        "Présentations/presentation-public.html",

    curieux:
        "Présentations/presentation-curieux.html",

    chercheur:
        "Présentations/presentation-chercheur.html",

    prof:
        "Présentations/presentation-prof.html",

    math:
        "Présentations/presentation-math.html",

    hacker:
        "Présentations/presentation-hacker.html",

    geek:
        "Présentations/presentation-geek.html",

    philo:
        "Présentations/presentation-philo.html",

    poete:
        "Présentations/presentation-poete.html",
};


function openPresentation() {

    let profile =
        localStorage.getItem("profile");

    let target =
        presentations[profile];

    if (!target)  target = presentations.public;
    window.location.href = target;
};