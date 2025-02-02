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

    // Construction du message
    let message = ` ALERTE ESAM %0A`;
    message += ` Date : ${date}%0A`;
    message += ` Heure : ${heure}%0A`;
    message += ` Planton : ${planton}%0A%0A`;
    
    message += ` Appelant : ${prenom} ${nom} (%20Tel: ${telephone})%0A%0A`;
    
    message += ` Animal : ${type} - ${race}%0A`;
    message += ` Poids : ${poids} kg%0A`;
    message += ` Comportement : ${comportement}%0A`;
    message += ` Envoyé avec Pat'rouille%0A`;

    // Générer le lien Messenger
    let messengerUrl = `https://www.messenger.com/t/4257757770900949?text=${message}`;

    // Ouvrir Messenger dans un nouvel onglet
    window.open(messengerUrl, "_blank");
}

