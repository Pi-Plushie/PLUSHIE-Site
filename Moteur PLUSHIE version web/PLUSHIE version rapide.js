  
// ==========================================
// VARIABLES GLOBALES
// ==========================================

let Tete = new Uint32Array(10_000_000);

let Dest = 0;
let Source = 0;
let Pointeur = 0;
let memoireMaximum = 1;
let Sauteruneligne = 0;

let MémoireLibre = 0;
let ValeurOutputVide = 3;
let Adsuite = 1;
let Output = 6;
let PointeurVersExec = 7;
let Exec = 8;
let SuiteVar = 10;
let ValeurInputVide = 17;
let Entrée = 19;

let Compteur = 480;
let InitialiserCompteur = 486;

let prochaineAdresseMemoire = 605;
let stop = false;
let executionInterrompue = false;

let texte = document.getElementById("input");
let Fichiercode = [];
let ecranoutput = "";
let Numérocaractère = 0;


// ==========================================
// STATUS
// ==========================================

function setStatus(txt) {
    document.getElementById("status").textContent = txt;
}

// ==========================================
// CHARGEMENT BOOTSTRAP AUTOMATIQUE
// ==========================================
window.onload = async function () {
    try {
        await chargerBootstrap();

        setStatus("Bootstrap plusbase.mem chargé:" + prochaineAdresseMemoire + " cellules");
    }
    catch (e) {
        console.error(e);

        setStatus("Erreur chargement auto bootstrap");
    }
          
}
// ==========================================
// FETCH PLUSBASE.MEM
// ==========================================
async function chargerBootstrap() {
    const response = await fetch("plusbase.mem");

    if (!response.ok) {
        throw new Error("Impossible de charger plusbase.mem");
    }

    const buffer = await response.arrayBuffer();

    LireMemoire(buffer, 2);
    
    RechargerVariables();
   
}

chargerBootstrap();

// ==========================================
// LECTURE MEMOIRE
// ==========================================

function LireMemoire(buffer, taille) {
    Tete = [];

    const view = new DataView(buffer);

    let cell = 0;
    let pos = 0;
    prochaineAdresseMemoire = 20;
    while (pos < buffer.byteLength) {
        let valeur;

        if (taille === 2) {
            valeur = view.getInt16(pos, true);
        }
        else {
            valeur = view.getInt32(pos, true);
        }

        Tete[cell] = valeur;
        if (valeur !== 0) prochaineAdresseMemoire = prochaineAdresseMemoire + 1 ;
        cell++;

        pos += taille;
    }
   
    memoireMaximum = Tete.length;
      
}

function RechargerVariables() {
    let txt = "";
    valeurOutputVide = 3; txt += "valeurOutputVide" + valeurOutputVide + "\n";
    Pointeur = 0;
    Adsuite = Suiv(Pointeur); txt += "Adsuite" + Adsuite + "\n";
    Pointeur = Tete[Suiv(Pointeur)];
    Pointeur = Tete[Suiv(Pointeur)];
    Output = Pointeur; txt += "Output" + Output + "\n";
    PointeurVersExec = Suiv(Pointeur); txt += "PointeurVersExec" + PointeurVersExec + "\n"; txt += "tete(PointeurVersExec)" + Tete[PointeurVersExec] + "\n";
    Pointeur = Tete[Suiv(Pointeur)];
    Exec = Pointeur; txt += "Exec" + Exec + "\n";
    Pointeur = Tete[Suiv(Pointeur)];
    SuiteVar = Pointeur; txt += "Suitevar" + SuiteVar + "\n";
    Pointeur = Tete[Suiv(Pointeur)];
    Compteur = Suiv(Pointeur); txt += "Compteur" + Compteur + "\n";
    Pointeur = Tete[Suiv(Pointeur)];
    ValeurInputVide = Suiv(Pointeur); txt += "ValeurInputVide" + ValeurInputVide + "\n";
    Pointeur = Tete[Suiv(Pointeur)];
    Entrée = Suiv(Pointeur); txt += "Entrée" + Entrée + "\n";
    txt += "prochaineAdresseMemoire" + prochaineAdresseMemoire + "\n";
    document.getElementById("memoire")
       .textContent = txt;
    
}
// ==========================================
// AFFICHAGE MEMOIRE
// ==========================================

function afficherMemoire() {
    let txt = "";

    const max = Math.min(Tete.length, 2000);

    for (let i = 0; i < max; i++) {
        txt += i + " : " + Tete[i] + "\n";
    }

    document.getElementById("memoire")
        .textContent = txt;

    setStatus("Mémoire affichée : " + max + " cellules");
}


    // ==========================================
    // CHARGEMENT MEMOIRE MANUEL
    // ==========================================
window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("chargeMemoire")
        .addEventListener("change", async function (e) {
            const file = e.target.files[0];

            if (!file) setStatus("Echec Chargement Manuel Mémoire");

            const buffer = await file.arrayBuffer();

            LireMemoire(buffer, 2);
            RechargerVariables();
            setStatus("Mémoire chargée manuellement");
            //reader.readAsArrayBuffer(file)

            const reader = new FileReader();
        });
});

    // ==========================================
    // CHARGEMENT FICHIER TEXTE
    // ==========================================

    window.addEventListener("DOMContentLoaded", () => {
        document.getElementById("chargeCode")
            .addEventListener("change", function (e) {
                const file = e.target.files[0];

                if (!file) setStatus("Échec Chargement Code ");

                const reader = new FileReader();
                reader.readAsText(file, "windows-1252");
                reader.onload = function (evt) {
                    document.getElementById("input").value =
                        evt.target.result;
                   texte = document.getElementById("input");
                   // texte.value = texte.value.replace(/\r?\n/g, "\r\n");
                    
                    setStatus("Code chargé");
                }
            });
        
    });
        window.addEventListener("DOMContentLoaded", () => {

            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape") {
                    executionInterrompue = true;

                    setStatus("Arrêt demandé");
                }
            })
        });
       

// ==========================================
// EXECUTION
// ==========================================

function executer() {
    let t0 = performance.now();
    let duree = 0;
    texte = document.getElementById("input");
    setStatus("Exécution Démarrée");
    for (let i = 0; i < texte.length; i++) {
        Fichiercode[i] = texte.value.charCodeAt(i);
    }
    
    Numérocaractère = 0;
    stop = false;  
    executionInterrompue = false;
    executerBloc( duree);
    setStatus("Durée Totale: " + (performance.now() - t0));
}
function executerBloc(duree) {
    const iterationsParBloc = 200000;
    const dureeMax = 1000000;
    duree++;
    if (duree >= dureeMax) {
        setStatus("Durée Maximale Atteinte");
        stop = true;
        executionInterrompue = true;
    }
    for (let i = 0; i < iterationsParBloc; i++) {
        if (executionInterrompue) {
            setStatus("Exécution interrompue" + " Durée Totale: " + (performance.now() - t0));
            if (stop) setStatus("Exécution terminée" + " Durée Totale: " + (performance.now() - t0));
            return;
        }
        //setStatus("itération: " + i);
        MoteurPrincipal();
    }
    document.getElementById("output").textContent += ecranoutput;
    ecranoutput=""
    setStatus("caractère en cours n° " + (Numérocaractère));
    setTimeout(executerBloc, 0);
}
function MoteurPrincipal() {
    
    //ecranoutput += Tete[MémoireLibre] + " " + Tete[Exec] + " " + Tete[Tete[Exec]] + " " ;  // + " <- " + Tete[Tete[Suiv(Tete[Exec])]] + " " + Tete[Tete[Tete[Suiv(Tete[Exec])]]] + " " + Dest + " " + Tete[Tete[Dest]] ;
    

    if (Tete[Suiv(Tete[MémoireLibre])] === Tete[MémoireLibre]) (SiMémoireSaturée());

    Dest = Tete[Tete[Exec]];
    //ecranoutput += Dest + "\n";
    
    Tete[Tete[PointeurVersExec]] = Tete[Suiv(Tete[Exec])];
    //ecranoutput += " " + Tete[Exec] + " " + Suiv(Tete[Exec]) + " " + Tete[Suiv(Tete[Exec])] + " " + Tete[Tete[Exec]] + " <-- " + Tete[Tete[Tete[Suiv(Tete[Exec])]]] + "\n";

    Source = Tete[Tete[Exec]];
    Tete[Tete[PointeurVersExec]] = Tete[Suiv(Tete[Exec])];
    //ecranoutput += Source + " " + Tete[Exec] + " " + Tete[Tete[Exec]] + " " + Suiv(Tete[Exec]) + " " + Tete[Suiv(Tete[Exec])] + " " + Tete[Tete[Exec]] + "\n";

    Tete[Tete[Dest]] = Tete[Tete[Source]];
    //ecranoutput += Dest + " <- " + Source + " " + Tete[Tete[Dest]] + " = " + Tete[Tete[Source]] + "\n";

    Tete[Tete[Adsuite]] = Suiv(Tete[Tete[SuiteVar]]);

    //ecranoutput += "Adsuite : " + Adsuite + " " + Tete[Adsuite] + " " + Tete[SuiteVar] + " " + Tete[Tete[SuiteVar]] + " " + Tete[Tete[Adsuite]] + "\n";

    if (Tete[Tete[Entrée]] === Tete[Tete[ValeurInputVide]]) LireUnCaractère();

   //ecranoutput += Tete[Tete[Entrée]] + " " + Tete[Entrée] + " " + Entrée + "\n" ;
    if ((Tete[Output]) !== ValeurOutputVide) (AfficherCaractère(Tete[Output]));

   // ecranoutput += " <- " + Tete[Tete[Dest]] + " " + Tete[MémoireLibre] + "\n"
  // document.getElementById("output")
    //  .textContent = ecranoutput;

    stop = Tete[Tete[Compteur]] === Tete[Tete[Tete[Compteur]]]
    //ecranoutput += Tete[Tete[Compteur]] + " ";
    executionInterrompue = stop;
}

function ExtrapolerMemoire() {
   
    memoireMaximum *= 2;

    while (Tete.length < memoireMaximum) {
        Tete.push(0);
        }
    setStatus("mémoire doublée")
}

function SiMémoireSaturée() {

    if (prochaineAdresseMemoire > memoireMaximum - 2) ExtrapolerMemoire() ;

    Tete[Suiv(prochaineAdresseMemoire)] = Tete[MémoireLibre] ;
    Tete[MémoireLibre] = prochaineAdresseMemoire ;
    prochaineAdresseMemoire = prochaineAdresseMemoire + 2 ;
    //setStatus("mémoire saturée " + prochaineAdresseMemoire) ;
}
function Suiv(adr) {
    return adr + 1;
}
function LireUnCaractère() {

    if (Numérocaractère >= texte.value.length) {
        stop = true;
        return 0;
    }
    else {
        const c = texte.value.charCodeAt(Numérocaractère);//Fichiercode[Numérocaractère]
        if (c !== null ) Tete[Tete[Entrée]] = c;

        //ecranoutput += texte.value[Numérocaractère];

        //document.getElementById("output")
        //    .textContent = ecranoutput;

        Numérocaractère++;


        //Tete[Tete[Entrée]] = Tete[Tete[ValeurInputVide]];
        return c;
    }
}

function AfficherCaractère(v) {
    let car = ""

    if ((v > 31 && v < 256) || v === 10 || v === 10 || v === 13) {
        car = String.fromCharCode(v);
    }
    else {
        car += String(v);
    }
    if (Tete[Output] === 13) {
        Tete[Output] = ValeurOutputVide;
        return
    }
    if (Tete[Output] === 10) {
        ecranoutput += "\n";
        Tete[Output] = ValeurOutputVide;
        return;
    }

    ecranoutput += car;

    //document.getElementById("output")
     //   .textContent = ecranoutput;

    Tete[Output] = ValeurOutputVide;
}



function effacerEntree() {
    document.getElementById("input").value = "";
    Numérocaractère = 0;
    texte.value = "";
    setStatus("Entrée effacée");
}
function effacerSortie() {
    ecranoutput = "";
        document.getElementById("output").textContent = ecranoutput;
    setStatus("Sortie effacée");

} function effacerMemoire() {
    document.getElementById("memoire").textContent = "";

    setStatus("Mémoire effacée");
}





