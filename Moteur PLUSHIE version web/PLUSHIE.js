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
let PointeurVersExec = 7;               //valeurs données pour référence, elle sont relues au démarrage dans le fichier plusbase.mem
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
let Numérocaractère = 0;                // mise au début du fichier texte
let Timer = 0                           // Pour mesurer la performance

let running = false;                    // contrôle de l'exécution par javascript pour éviter deux runs en //
let duree = 0;                          // 
let runId = 0;
const iterationsParBloc = 1000000;      // réduire si on veut plus d'informations en cours, mais ça ralentit l'exécution
const dureeMax = 10;                    // durée en seconde au bout de laquelle le programme s'arrête de toute manière si rien d'autre ne l'arrête en cas de plantage
let sauvegardeEnCours = false;

// ==============================================|
// CHARGEMENT AUTOMATIQUE FICHIER MEMOIRE INITIAL|
// ==============================================|
window.onload = async function () {
    try {
        await ChargerMémoirededémarrage();

        setStatus("Bootstrap Plusbase.mem chargé:" + prochaineAdresseMemoire + " cellules");
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
    const response = await fetch("Plusbase.mem");

    if (!response.ok) {
        throw new Error("Impossible de charger plusbase.mem");
        return;
    }

    const buffer = await response.arrayBuffer();

    LireMemoire(buffer, 2);
    setStatus("Bootstrap Plusbase.mem chargé:" + prochaineAdresseMemoire + " cellules");
    //RechargerVariables();
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
    prochaineAdresseMemoire = 7;
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
    InitialiserCompteur = Suiv(Pointeur);       //
    Pointeur = Tete[Suiv(Pointeur)];            // utilitaire de fin de code PLUSHIE
    Compteur = Suiv(Pointeur);                  //         
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
            const taille = (file.name.includes("Plusbase")) ? 2 : 4;
            LireMemoire(buffer, taille);

           // RechargerVariables();

            setStatus("Mémoire chargée manuellement " + MémoireMaximum + " cellules");
            
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
                document.getElementById("input").value = evt.target.result;
                texte = document.getElementById("input");
                texte.value =
                    texte.value.replace(/\r?\n/g, "\r\n");

                RechargerVariables();
                Numérocaractère = 0;
                setStatus("Code chargé");
            }
        });

    document.addEventListener("keydown", function (e) {
        let executeMode = document.getElementById("exécutersurentrée").checked;
        if (e.key === "Escape") {
            executionInterrompue = true;

            setStatus("Arrêt demandé");
        }
        if (e.key === "Enter") {
            if (e.ctrlKey) {
                executer();
            }
            else
                if ((executeMode)) {
                    executer();
                    
                }
            texte = document.getElementById("input");
            //Numérocaractère = texte.value.length - 2 ;
            if (Numérocaractère > (texte.value.length - 3)) Numérocaractère++;
            //setStatus("Entrée " + texte.value.length + " ");
        }
    });
});

// ===========================|
// INITIALISER                |                              charger et exécuter le fichier ini.txt
//============================|
function Initialiser() {
    RAZ();
    charger("ini")
    }

// ===========================|
// CHARGER UN FICHIER DE DEMO |                              charger et exécuter lun fichier de démo
//============================|
async function charger(fichier) {
    const response = await fetch( fichier + ".txt" );

    if (!response.ok) {
        throw new Error("Fichier ini introuvable");
        setStatus("Fichier ini introuvable");
    }

    const buffer = await response.arrayBuffer();

    const decoder = new TextDecoder("windows-1252");

    const texteCharge = decoder.decode(buffer);

    // remplit la boite d'entrée
    document.getElementById("input").value = texteCharge;

    RechargerVariables();
    Numérocaractère = 0;
    executer();
}

// ==========|
// EXECUTION |                              executer et executerbloc servent à permettre l'interruption du code via la touche echap. sinon on pourrait juste boucler le moteur sur lui même
// ==========|

function executer() {
    running = false;
    runId++;
    const currentRun = runId;

    duree = 0;
    stop = false;
    executionInterrompue = false;

    Timer = performance.now();
    texte = document.getElementById("input");
    setStatus("Exécution Démarrée");
    
    RechargerVariables();
    Tete[Tete[Compteur]] = Tete[Tete[InitialiserCompteur]];
   

    running = true;
    executerBloc(currentRun);

    document.getElementById("output").textContent += ecranoutput; //  affiche à l'écran ce qui n'a pas encore été affiché
    ecranoutput = "";

    setStatus("Durée Totale: " + ((performance.now() - Timer) / 1000) + " s ");
}

function executerBloc(currentRun) {
    
    let écran = document.getElementById("output");
    if (!running || currentRun !== runId) return;

    if (duree >= dureeMax) {
        setStatus("Durée Maximale Atteinte");
        executionInterrompue = true;
    }

    for (let i = 0; i < iterationsParBloc; i++) {
        if (executionInterrompue) break;
        MoteurPrincipal();
    }
    duree = ((performance.now() - Timer) /1000)

    if (ecranoutput.length > 0) {
        écran.textContent += ecranoutput;
        écran.scrollTop = écran.scrollHeight;
        ecranoutput = "";
    }

    if (executionInterrompue || stop) {

        running = false;

        setStatus(
            "Exécution terminée — " +
            Numérocaractère +
            " caractères en " +
            ((performance.now() - Timer) / 1000).toFixed(3) +
            " s"
        );

        return;
    }

    
      document.getElementById("status").textContent = "caractère n° " + Numérocaractère + " — " + ((performance.now() - Timer) / 1000).toFixed(2) + " s";

    requestAnimationFrame(() => executerBloc(currentRun));                    // permet de laisser le temps d'appuyer la touche echap
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
        //stop = true;
        
        return 0;
    }
    else {
        const c = texte.value.charCodeAt(Numérocaractère);
        if (c === 13) {
            Numérocaractère++;
            LireUnCaractère();
        }
        if (c !== null) Tete[Tete[Entrée]] = c;
        //ecranoutput += String.fromCharCode(c);
        Numérocaractère++;
    }
}
// ======================|
// DRIVER DE SORTIE      |
// ======================|
function AfficherCaractère(v) {
    let car = ""

    if ((v > 31 && v < 256)) {
        car = String.fromCharCode(v);
    }
    else {
        car = String(v) + "[" + String.fromCharCode(v)+"]";
    }
    if (Tete[Output] == 12) {
        ecranoutput += "\n";
        Tete[Output] = ValeurOutputVide;
        return;
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
    if (Tete[Output] === 9) {
        ecranoutput += "\t";
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
    if (texte !== null) texte.value = "";
    setStatus("Entrée effacée");
}


function effacerSortie() {
    ecranoutput = "";
    document.getElementById("output").textContent = ecranoutput;
    document.getElementById("output").width = 98 %

    setStatus("Sortie effacée");

}
function effacerMemoire() {
    document.getElementById("memoire").textContent = "";
    ChargerMémoirededémarrage();
    setStatus("Mémoire effacée");
}
function étendreMemoire() {
    let zone = document.getElementById("memoire")
    zone.style.height = (zone.offsetHeight + 200 ) + "px";
}
function réduireMemoire() {
    let zone = document.getElementById("memoire")
    zone.style.height = 60 + "px";
}
function RAZ() {
    effacerEntree();
    effacerSortie();
    effacerMemoire();
    ChargerMémoirededémarrage();
    setStatus("Entrée effacée" + "/n" + "Sortie effacée" + "/n" + "Mémoire effacée");
}
// =================|
// BARRE DE STATUT  |
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

    const max = Math.min(Tete.length, 1000000);

    while ((i < max) && (j < 20)) {
        txt += i + " : " + Tete[i] + " \t" ;
        if ((Tete[i] > 31 && Tete[i] < 1000000)) {
            txt += " [ " + String.fromCharCode(Tete[i]) + " ] " + " \t";
        }
        else txt += " \t\t";
        if (i % 2 != 0) txt += "\n";
        i++;
        if (Tete[i] === 0) j++;
    }

    document.getElementById("memoire")
        .textContent = txt;

    setStatus("Mémoire affichée : " + i + " cellules");
}
// ============================================|
// CACHER LES INFOBULLES                       |
// ============================================|

function Cacher() {
   
    let infobullescachées = document.getElementById("cachertooltips").checked;

    if (infobullescachées) {

        let buttons = document.querySelectorAll(".tooltip");

        buttons.forEach(btn => {
          
            btn.className = "notooltip";
        });
    }
    else {
      
        let buttons = document.querySelectorAll(".notooltip");

        buttons.forEach(btn => {
            btn.className = "tooltip";
        });
    }
}
// ============================================|
// AFFICHER LES BOUTONS DE Démo web            |
// ============================================|

function AfficherDémos() {
    let buttons = document.querySelectorAll(".démo");
    
    buttons.forEach(btn => {
        if (btn.style.display === "none") btn.style.display = "initial"; else btn.style.display = "none"

    });

}
// ============================================|
// AFFICHER LES BOUTONS avancés                |
// ============================================|

function AfficherExpert() {
    let buttons = document.querySelectorAll(".avancé");

    buttons.forEach(btn => {
        if (btn.style.display === "none") btn.style.display = "initial"; else btn.style.display = "none"
       
    });

}

// ==============================================|
// SAUVEGARDER MEMOIRE (utilitaire niveau avancé)|
// ==============================================|
function SauverMemoire() {
    
    const max = MémoireMaximum + 1;
    const buffer = new ArrayBuffer(max * 4); // 4 octets par case
    const view = new DataView(buffer);
    let cell = 0
    if (sauvegardeEnCours) return;

    sauvegardeEnCours = true;

    if (!Number.isFinite(max) || max <= 0 || max > 1_000_000) {
        alert("Taille mémoire invalide : " + max);
        return;
    }

    let compteurArret = 0;

    for (cell = 0; cell < (MémoireMaximum + 1) && compteurArret < 20; cell++) {
        const val = Number.isFinite(Tete[cell]) ? Tete[cell] : 0;

        view.setInt32(cell * 4, val, true); // true = little endian

        if (val === 0) {
            compteurArret++;
        } else {
            compteurArret = 0;
        }
    }
        // téléchargement du fichier
       const blob = new Blob([buffer], { type: "application/octet-stream" });
      const a = document.createElement("a");
       a.href = URL.createObjectURL(blob);
       a.download = "PLUSHIE.mem";
      a.click();

       setTimeout(() => {
            URL.revokeObjectURL(a.ref);
       sauvegardeEnCours = false;
      }, 1000);
        
        setStatus("Mémoire sauvegardée : " + cell + " cellules")
   
}




