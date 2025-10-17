






function downloadTxt() {
    // Récupérer les valeurs du formulaire selon les nouveaux IDs
    const date = document.getElementById("requerant").value; // Si tu veux un vrai date, créer un champ DATE
    const telephone = document.getElementById("tel").value;
    const qualite = document.getElementById("qualite").value;

    const type = document.getElementById("type").value;
    const race = document.getElementById("race").value;
    const poids = document.getElementById("poids").value;

    const departement = document.getElementById("dep").value;
    const commune = document.getElementById("commune").value;
    const lieudi = document.getElementById("lieux").value;
    const coord = document.getElementById("cord").value;

    const description = document.getElementById("description").value;
    const blessure = document.getElementById("blessures").value;
    const depuis = document.getElementById("depuis").value;

    const marche = document.getElementById("marche").value;
    const aide = document.getElementById("aide").value;
    const pickup = document.getElementById("pickup").value;

    // Créer le contenu texte
    const content = `PRISE D'ALERTE
APPELANT
Requérant: ${date}
Téléphone: ${telephone}
Qualité: ${qualite}
ANIMAL
Type: ${type}
Race: ${race}
Poids: ${poids}
LIEUX
Département: ${departement}
Commune: ${commune}
Lieu-dit: ${lieudi}
Coordonnées: ${coord}
DESCRIPTION
Description: ${description}
Blessure: ${blessure}
Depuis: ${depuis}
ACCÈS
Marche: ${marche}
Aide: ${aide}
Pick-Up: ${pickup}`;

    // Créer un Blob et déclencher le téléchargement
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formulaire_prise_alerte.txt';
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
    const mapping = {
        "Requérant": "requerant",
        "Téléphone": "tel",
        "Qualité": "qualite",
        "Type": "type",
        "Race": "race",
        "Poids": "poids",
        "Département": "dep",
        "Commune": "commune",
        "Lieu-dit": "lieux",
        "Coordonnées": "cord",
        "Description": "description",
        "Blessure": "blessures",
        "Depuis": "depuis",
        "Marche": "marche",
        "Aide": "aide",
        "Pick-Up": "pickup"
    };

    Object.keys(mapping).forEach(key => {
        const fieldId = mapping[key];
        if (data[key] && document.getElementById(fieldId)) {
            document.getElementById(fieldId).value = data[key];
        }
    });
}


function sendMessenger() {
    // Récupération des valeurs du formulaire
    const requerant = document.getElementById("requerant").value;
    const tel = document.getElementById("tel").value;
    const qualite = document.getElementById("qualite").value;

    const type = document.getElementById("type").value;
    const race = document.getElementById("race").value;
    const poids = document.getElementById("poids").value;

    const departement = document.getElementById("dep").value;
    const commune = document.getElementById("commune").value;
    const lieux = document.getElementById("lieux").value;
    const coord = document.getElementById("cord").value;

    const description = document.getElementById("description").value;
    const blessures = document.getElementById("blessures").value;
    const depuis = document.getElementById("depuis").value;

    const marche = document.getElementById("marche").value;
    const aide = document.getElementById("aide").value;
    const pickup = document.getElementById("pickup").value;

    // Construction du message (encodé pour URL)
    let message = `ALERTE ESAM%0A`;
    message += `Appelant : ${requerant} (%20Tel: ${tel}, Qualité: ${qualite})%0A%0A`;
    message += `Animal : ${type} - ${race}%0A`;
    message += `Poids : ${poids} kg%0A%0A`;
    message += `Lieu : ${departement}, ${commune} - ${lieux}%0A`;
    message += `Coordonnées : ${coord}%0A%0A`;
    message += `Description : ${description}%0A`;
    message += `Blessures : ${blessures}%0A`;
    message += `Depuis : ${depuis}%0A%0A`;
    message += `Accès :%0A`;
    message += `Marche : ${marche}%0A`;
    message += `Aide : ${aide}%0A`;
    message += `Pick-up : ${pickup}%0A%0A`;
    message += `Pat'rouille-OLD | Alpha 1.2-tempo`;

    // Générer le lien Messenger et ouvrir dans un nouvel onglet
    const messengerUrl = `https://www.messenger.com/t/4257757770900949?text=${message}`;
    window.open(messengerUrl, "_blank");
}



