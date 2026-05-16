  
// ====================|
// VARIABLES GLOBALES  |
// ====================|

let Tete = new Uint32Array(10_000_000); // émulation de la mémoire disponible, extensible la dimension est ici uniquement pour des questions de rapidité d'exécution

let Dest = 0;
let Source = 0;
let Pointeur = 0;
let MémoireMaximum = 1;
let Sauteruneligne = 0;

let MémoireLibre = 0;
let ValeurOutputVide = 3;               // 
let Adsuite = 1;                        //
let Output = 6;                         //
let PointeurVersExec = 7;               //valeurs données pour références, elle sont relues au démarrage dans le fichier plusbase.mem
let Exec = 8;                           //
let SuiteVar = 10;                      //
let ValeurInputVide = 17;               //
let Entrée = 19;                        //

let Compteur = 0;                       // utilitaire de terminaison du programme PLUSHIE
let InitialiserCompteur = 0;            //

let prochaineAdresseMemoire = 1;      // redéterminée au démarrage
let stop = false;                       // utilitaires d'interruption d'urgence en cas de plantage
let executionInterrompue = false;       //

let texte = document.getElementById("input");
let Fichiercode = [];                   // pas utilisé
let ecranoutput = "";
let Numérocaractère = 0;
let Timer = 0;                          // Pour mesurer la performance


// ==============================================|
// CHARGEMENT AUTOMATIQUE FICHIER MEMOIRE INITIAL|
// ==============================================|
window.onload = async function () {
    try {
        await ChargerMémoirededémarrage();

        setStatus("Bootstrap plusbase.mem chargé:" + prochaineAdresseMemoire + " cellules");
    }
    catch (e) {
        console.error(e);

        setStatus("Erreur chargement auto bootstrap");
    }
          
}
// =====================|
// CHARGER PLUSBASE.MEM |
// =====================|
async function ChargerMémoirededémarrage() {
    const response = await fetch("plusbase.mem");

    if (!response.ok) {
        throw new Error("Impossible de charger plusbase.mem");
    }

    const buffer = await response.arrayBuffer();

    LireMemoire(buffer, 2);
    
    RechargerVariables();
   }

ChargerMémoirededémarrage();

// ================|
// LECTURE MEMOIRE |
// ================|

function LireMemoire(buffer, taille) {
    Tete = [];

    const view = new DataView(buffer);

    let cell = 0;
    let pos = 0;
    prochaineAdresseMemoire = 1;
    while (pos < buffer.byteLength) {
        let valeur;

        if (taille === 2) {
            valeur = view.getInt16(pos, true);
        }
        else {
            valeur = view.getInt32(pos, true);
        }

        Tete[cell] = valeur;
        if (valeur !== 0) prochaineAdresseMemoire ++ ;
        cell++;

        pos += taille;
    }
   
    MémoireMaximum = Tete.length;
      
}
// ==========================================|
// INITIATISATION DES VARIABLES DE NIVEAU -1 |
// ==========================================|
function RechargerVariables() {
    let txt = "";
    valeurOutputVide = 3;                       // valeur considérée comme null pour les caractères en sortie
    Pointeur = 0;
    Adsuite = Suiv(Pointeur);                   // adresse où on trouve la valeur de la suite de Suitevar
    Pointeur = Tete[Suiv(Pointeur)];
    Pointeur = Tete[Suiv(Pointeur)];
    Output = Pointeur;                          // adresse de sortie de caractères
    PointeurVersExec = Suiv(Pointeur);          //
    Pointeur = Tete[Suiv(Pointeur)];            // Pointeur d'exécution
    Exec = Pointeur;                            //
    Pointeur = Tete[Suiv(Pointeur)];
    SuiteVar = Pointeur;                        // Variable de la la fonction suite: suite prend la valeur de suiv(SuiteVar)
    Pointeur = Tete[Suiv(Pointeur)];
    Compteur = Suiv(Pointeur);                  // utilitaire de fin de code PLUSHIE
    Pointeur = Tete[Suiv(Pointeur)];            
    ValeurInputVide = Suiv(Pointeur);           // valeur considérée comme null pour les caractères en entrée
    Pointeur = Tete[Suiv(Pointeur)];
    Entrée = Suiv(Pointeur);                    // adresse de l'entrée de caractères
       
}
// ==========================|
// CHARGEMENT MEMOIRE MANUEL |                  appelée par le bouton charger mémoire
// ==========================|
window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("chargeMemoire")
        .addEventListener("change", async function (e) {
            const file = e.target.files[0];

            if (!file) setStatus("Echec Chargement Manuel Mémoire");

            const buffer = await file.arrayBuffer();

            LireMemoire(buffer, 2);

            RechargerVariables();

            setStatus("Mémoire chargée manuellement");
            
        });
});

    // ===========================================|
    // CHARGEMENT FICHIER DE CODE AU FORMAT TEXTE |
    // ===========================================|

    window.addEventListener("DOMContentLoaded", () => {
        document.getElementById("chargeCode")
            .addEventListener("change", function (e) {
                const file = e.target.files[0];

                if (!file) setStatus("Échec Chargement Code ");

                const reader = new FileReader();
                reader.readAsText(file, "windows-1252");
                reader.onload = function (evt) {
                   document.getElementById("input").value =evt.target.result;
                   texte = document.getElementById("input");
                
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
       

// ==========|
// EXECUTION |                              executer et executerbloc servent à permettre l'interruption du code via la touche echap. sinon on pourrait juste boucler le moteur sur lui même
// ==========|

function executer() {
    let duree = 0;
    Timer = performance.now();
    texte = document.getElementById("input");
    setStatus("Exécution Démarrée");
    Numérocaractère = 0;
    stop = false;  
    executionInterrompue = false;

    executerBloc(duree);

    document.getElementById("output").textContent += ecranoutput; //  affiche à l'écran ce qui n'a pas encore été affiché
    ecranoutput = ""

    setStatus("Durée Totale: " + ((performance.now() - Timer) / 1000) + " s ");
}

function executerBloc(duree) {
    const iterationsParBloc = 1000000;                          // réduire si on veut plus d'informations en cours, mais ça ralentit l'exécution
    const dureeMax = 100000;                                    // si rien d'autre ne l'arrête en cas de plantage
    duree++;
    if (duree >= dureeMax) {
        setStatus("Durée Maximale Atteinte");
        executionInterrompue = true;
    }

    for (let i = 0; i < iterationsParBloc; i++) {
        if (executionInterrompue) {
            setStatus("Exécution interrompue" + " Durée Totale: " + ((performance.now() - Timer)/1000) + " s ");
            if (stop) setStatus("Exécution terminée" + " Durée Totale: " + ((performance.now() - Timer) / 1000) + " s ");
            document.getElementById("output").textContent += ecranoutput; //  affiche à l'écran ce qui n'a pas encore été affiché
            return;
        }

        MoteurPrincipal();
    }
    document.getElementById("output").textContent += ecranoutput;
    ecranoutput=""
    document.getElementById("status").textContent = ("caractère en cours n° " + (Numérocaractère) + "en : " + ((performance.now() - Timer) / 1000) + " s ");
    setTimeout(executerBloc, 0);                                // permet de laisser le temps d'appuyer la touche echap
}
// ===================================================|
// AUTOMATE DE NIVEAU -1 SERVANT DE SUPPORT À PLUSHIE |        Coeur du fonctionnement de PLUSHIE, écrit en simili PLUSHIE                     
// ===================================================|    

function MoteurPrincipal() {
    
  
    if (Tete[Suiv(Tete[MémoireLibre])] === Tete[MémoireLibre]) (SiMémoireSaturée());    // assure de disposer d'une adresse mémoire disponible.

    Dest = Tete[Tete[Exec]];                                                            // adresse de destination pour l'instruction unique
    
    Tete[Tete[PointeurVersExec]] = Tete[Suiv(Tete[Exec])];                              // avancée du pointeur d'exécution
 
    Source = Tete[Tete[Exec]];                                                          // adresse de la source pour l'instruction unique
            
    Tete[Tete[PointeurVersExec]] = Tete[Suiv(Tete[Exec])];                              // avancée du pointeur d'exécution
 
    Tete[Tete[Dest]] = Tete[Tete[Source]];                                              //EXÉCUTION DE L'INSTRUCTION PRINCIPALE
 
    Tete[Tete[Adsuite]] = Suiv(Tete[Tete[SuiteVar]]);                                   // Fonction suite: Adsuite contient toujours l'adresse de la tete de SuiteVar

    if (Tete[Tete[Entrée]] === Tete[Tete[ValeurInputVide]]) LireUnCaractère();          // Permet la lecture d'un nouveau caractère quand le précédent a été traité

    if ((Tete[Output]) !== ValeurOutputVide) (AfficherCaractère(Tete[Output]));         // Appelle le driver de sortie systématiquement ou ici si il est non vide (pour augmenter la vitesse d'exécution)
     
    stop = Tete[Tete[Compteur]] === Tete[Tete[Tete[Compteur]]]                          // test de terminaison interne au programme PLUSHIE

    executionInterrompue = stop;                                                        // test de terminaison du code javascript
}

// ======================|
// GESTION DE LA MÉMOIRE |       
// ======================|

function ExtrapolerMemoire() {
   
    MémoireMaximum *= 2;

    while (Tete.length < MémoireMaximum) {
        Tete.push(0);
        }
    setStatus("mémoire doublée")
}

function SiMémoireSaturée() {

    if (prochaineAdresseMemoire > MémoireMaximum - 2) ExtrapolerMemoire() ;

    Tete[Suiv(prochaineAdresseMemoire)] = Tete[MémoireLibre] ;
    Tete[MémoireLibre] = prochaineAdresseMemoire ;
    prochaineAdresseMemoire = prochaineAdresseMemoire + 2 ;

 // ================================|
 // SECONDE ADRESSE MÉMOIRE POINTÉE |
 // ================================|
    
}
function Suiv(adr) {
    return adr + 1;
}

// ======================|
// DRIVER D'ENTRÉE       |
// ======================|
function LireUnCaractère() {

    if (Numérocaractère >= texte.value.length) {
        stop = true;
        return 0;
    }
    else {
        const c = texte.value.charCodeAt(Numérocaractère);//Fichiercode[Numérocaractère]
        if (c !== null ) Tete[Tete[Entrée]] = c;

        Numérocaractère++;
            }
}
// ======================|
// DRIVER DE SORTIE      |
// ======================|
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

    Tete[Output] = ValeurOutputVide;
}
// ====================|
// Boutons effacement  |
// ====================|

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

}
function effacerMemoire() {
    document.getElementById("memoire").textContent = "";
    ChargerMémoirededémarrage();
    setStatus("Mémoire effacée");
}
// =================|
// BARRE DE STATUS  |
// =================|

function setStatus(txt) {
    document.getElementById("status").textContent = txt;
}

// ============================================|
// AFFICHAGE MEMOIRE (utilitaire niveau avancé)|
// ============================================|

function afficherMemoire() {
    let txt = "";
    let i = 0;
    let j = 0;

    const max = Math.min(Tete.length, 60000);

    while ((i < max) && (j < 8)) {
        txt += i + " : " + Tete[i] + "\n";
        i++;
        if (Tete[i] === 0) j++;
    }

    document.getElementById("memoire")
        .textContent = txt;

    setStatus("Mémoire affichée : " + i + " cellules");
}







