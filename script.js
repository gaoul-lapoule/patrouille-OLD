document.addEventListener("DOMContentLoaded", function () {
    function showDiv(divId) {
        // Cacher toutes les divs
        document.getElementById("formu").style.display = "none";
        document.getElementById("save").style.display = "none";

        // Afficher la div correspondante
        document.getElementById(divId).style.display = "block";
    }

    // Ajouter les événements aux boutons
    document.querySelectorAll(".toggle-btn").forEach(button => {
        button.addEventListener("click", function () {
            let target = this.getAttribute("data-target");
            if ( target === "chat" ){
                window.open('https://www.messenger.com/', 'Messenger', 'width=500,height=700');
            }
            else {
                showDiv(target);
            }
        });
    });
});

function envoyerMessage() {
    // Récupération des valeurs du formulaire
    let date = document.getElementById("DATE").value;
    let heure = document.getElementById("HEURE").value;
    let planton = document.getElementById("PLANTON").value;
    
    let nom = document.getElementById("NOM").value;
    let prenom = document.getElementById("PRÉNOM").value;
    let telephone = document.getElementById("TÉLÉPHONE").value;
    
    let type = document.getElementById("TYPE").value;
    let race = document.getElementById("RACE").value;
    let poids = document.getElementById("POIDS").value;
    let comportement = document.getElementById("COMPORTEMENT").value;

    let departement = document.getElementById("departement").value;
    let commune = document.getElementById("commune").value;
    let lat = parseFloat(document.getElementById("latitude").value); // Convertit en nombre
    let long = parseFloat(document.getElementById("longitude").value);

    let situation = document.getElementById("situation").value;
    let blessure = document.getElementById("blessure").value;
    let depuis = document.getElementById("depuis").value;

    let piste = document.getElementById("piste").value;
    let temps = document.getElementById("temps").value;
    let aide = document.getElementById("aide").value;
    let autres = document.getElementById("autres").value;

    let com = document.getElementById("com").value;

    // Construction du message
    let message = ` ALERTE ESAM %0A`;
    message += ` Date : ${date}%0A`;
    message += ` Heure : ${heure}%0A`;
    message += ` Planton : ${planton}%0A%0A`;
    
    message += ` Appelant : ${prenom} ${nom} (%20Tel: ${telephone})%0A%0A`;
    
    message += ` Animal : ${type} - ${race}%0A`;
    message += ` Poids : ${poids} kg%0A`;
    message += ` Comportement : ${comportement}%0A%0A`;

    message += ` Département : ${departement}%0A`;
    message += ` Commune : ${commune}%0A`;
    message += ` Coordonnées : ${lat}, ${long} %0A%0A`;

    message += ` Description :%0A`;
    message += ` ${situation}%0A%0A`;
    message += ` Blessures : ${blessure}%0A`;
    message += ` Depuis : ${depuis}%0A%0A`;

    message += ` Accés :%0A`;
    message += ` Pistes Pick-up : ${piste}%0A`;
    message += ` Temps de marche : ${temps}%0A`;
    message += ` Aides : ${aide}%0A`;
    message += ` Autres : ${autres}%0A%0A`;

    message += ` Commentaires :%0A`;
    message += ` ${com}%0A%0A`;    

    message += ` Pat'rouille | Alpha 1.1`;
    


    // Générer le lien Messenger
    let messengerUrl = `https://www.messenger.com/e2ee/t/25540215708903119?text=${message}`;

    // Ouvrir Messenger dans un nouvel onglet
    window.open(messengerUrl, "_blank");
}


document.addEventListener("DOMContentLoaded", function () {
    // Charger les départements
    fetch("https://geo.api.gouv.fr/departements")
        .then(response => response.json())
        .then(data => {
            let datalist = document.getElementById("departements");

            data.forEach(departement => {
                let option = document.createElement("option");
                option.value = `${departement.code} - ${departement.nom}`;
                datalist.appendChild(option);
            });
        })
        .catch(error => console.error("Erreur API Départements :", error));
});

function loadCommunes() {
    // Récupérer le code du département sélectionné
    let departementInput = document.getElementById("departement");
    let departementCode = departementInput.value.split(' ')[0]; // Le code du département est avant le tiret

    // Vérifier si un code de département est sélectionné
    if (departementCode) {
        fetch(`https://geo.api.gouv.fr/departements/${departementCode}/communes`)
            .then(response => response.json())
            .then(data => {
                let datalist = document.getElementById("communes");
                datalist.innerHTML = ""; // Effacer les anciennes communes

                // Vérifier si des communes sont retournées
                if (data && data.length > 0) {
                    data.forEach(commune => {
                        let option = document.createElement("option");
                        option.value = commune.nom;
                        datalist.appendChild(option);
                    });
                } else {
                    let option = document.createElement("option");
                    option.value = "Aucune commune trouvée";
                    datalist.appendChild(option);
                }
            })
            .catch(error => console.error("Erreur API Communes :", error));
    } else {
        // Si aucun département n'est sélectionné, vider les communes
        let datalist = document.getElementById("communes");
        datalist.innerHTML = "";
    }
}

    function download() {
        // Récupérer les valeurs du formulaire
        var date = document.getElementById("DATE").value;
        var heure = document.getElementById("HEURE").value;
        var planton = document.getElementById("PLANTON").value;
        var nom = document.getElementById("NOM").value;
        var prenom = document.getElementById("PRÉNOM").value;
        var telephone = document.getElementById("TÉLÉPHONE").value;
        var qualite = document.querySelector('select[name="Chosir"]').value;
        var type = document.getElementById("TYPE").value;
        var race = document.getElementById("RACE").value;
        var poids = document.getElementById("POIDS").value;
        var comportement = document.getElementById("COMPORTEMENT").value;
        var departement = document.getElementById("departement").value;
        var commune = document.getElementById("commune").value;
        var latitude = document.getElementById("latitude").value;
        var longitude = document.getElementById("longitude").value;
        var situation = document.getElementById("situation").value;
        var blessure = document.getElementById("blessure").value;
        var depuis = document.getElementById("depuis").value;
        var piste = document.getElementById("piste").value;
        var temps = document.getElementById("temps").value;
        var aide = document.getElementById("aide").value;
        var autres = document.getElementById("autres").value;
        var commentaires = document.getElementById("com").value;

        // Créer une chaîne de texte avec toutes les informations
var content = `PRISE D'ALERTE
DATE: ${date}
HEURE: ${heure}
PLANTON: ${planton}
APPELANT
NOM: ${nom}
PRÉNOM: ${prenom}
TÉLÉPHONE: ${telephone}
QUALITÉ: ${qualite}
ANIMAL
TYPE: ${type}
RACE: ${race}
POIDS: ${poids}
COMPORTEMENT: ${comportement}
LIEUX
departement: ${departement}
commune: ${commune}
latitude: ${latitude}
longitude: ${longitude}
DESCRIPTION
situation: ${situation}
blessure: ${blessure}
depuis: ${depuis}
ACCÉS
piste: ${piste}
temps: ${temps}
aide: ${aide}
autres: ${autres}
com:${commentaires}`;

        // Créer un Blob avec le texte du formulaire
        var blob = new Blob([content], { type: 'text/plain' });

        // Créer un lien de téléchargement
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'formulaire_prise_alerte.txt';

        // Simuler un clic sur le lien pour télécharger le fichier
        link.click();
    }


    function uploadFile() {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (!file) {
            alert("Veuillez sélectionner un fichier .txt");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            const data = parseTextFile(content);
            fillForm(data);
        };
        reader.readAsText(file);
    }

    function parseTextFile(content) {
        const data = {};
        const lines = content.split("\n");

        lines.forEach(line => {
            line = line.trim();
            if (line.includes(":")) {
                const parts = line.split(":");
                const key = parts[0].trim();
                const value = parts.slice(1).join(":").trim();
                if (key && value) {
                    data[key] = value;
                }
            }
        });

        return data;
    }

    function fillForm(data) {
        const fields = [
            "DATE", "HEURE", "PLANTON",
            "NOM", "PRÉNOM", "TÉLÉPHONE", "QUALITÉ",
            "TYPE", "RACE", "POIDS", "COMPORTEMENT",
            "departement", "commune", "latitude", "longitude",
            "situation", "blessure", "depuis",
            "piste", "temps", "aide", "autres",
            "com"
        ];

        fields.forEach(field => {
            if (document.getElementById(field) && data[field]) {
                document.getElementById(field).value = data[field];
            }
        });
    }

