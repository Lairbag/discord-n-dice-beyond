# Discord&Dice Beyond
![](popup/header.png)
Webextension that allow yout to roll dice (with dice parser) into your discord channel from your D&amp;D Beyond character sheet


# Présentation
Cette extension (Firefox et Chromium) à pour vocation de simplifier les lancés de dés pour les joueurs utilisant Discord et D&D Beyond.

Différent dés apparaissent en bas à gauche de la fiche de personnage (**il faut être connecté à son compte**). Au clique sur l'un de ces dés, un jet se fera automatiquement (plus de détail ci-dessous).
Il y a également un dés à côté de chaque compétence pour faire le jet en prenant en compte le modificateur. Il en est de même pour les jets d'attaque ou le repos court.

Petit plus, le nom et l'avatar du personnage seront visible sur Discord.

![](Presentation.png)

Concernant le lancé de dé, il y a trois options :
- Sans Discord, affichage du résultat dans le navigateur. Le jet est décomposé avec chaque résultat de dés, le modificateur et le résultat total.
![](inBrowser.png)

- Avec Discord sans DiceParser, l'affichage est le même que lorsqu'il n'y a pas Discord de configuré.
![](inDiscordWithoutDiceParser.png)

- Avec Discord et DiceParser, l'affichage comprend l'envoie de la commande puis le résultat par DiceParser
![](inDiscordWithDiceParser.png)

# Une petit démo ?

Ci-dessous un gif de démonstration qui va montrer 4 choses :
- un jet simple avec le lancé d'un d100
- un jet d'attaque avec un d20 et le modificateur associé
- un jet de dégat avec un d4 et le modificateur associé
- un jet pour le repos court

![](demo-roll-a-dice.gif)

# Configuration de Discord
Pour que l'extension fonctionne avec Discord, il lui faut un point d'entrée permettant la communication.
Ce point d'entrée s'appelle un Webhook, il se matérialise par une simple URL.
Il ne doit être ajouté que dans le salon où il y aura des lancés de dés.

Le mieux étant de suivre la procédure fournis par Discord : https://support.discordapp.com/hc/fr/articles/228383668-Utiliser-les-Webhooks

# Configuration de l'extension
Après installation de l'extension, un D20 est visible en haut à droite avec les autres extensions.
Il suffit d'enregistrer l'URL du webhook et tout est prêt pour jouer !

# Un petit Gif sur la configuration de Discord et de l'extension

![](tuto/tuto.gif)

# A venir
J'ai plusieurs chantier en tête :
- recharger automatiquement l'onglet D&D Beyond lors du changement de configuration
- Avoir l'option de lancer un dés avec avantage/désavantage
- possibilité de lancer plusieur dés facilement
- améliorer l'affichage du résultat du jet de dés dans le navigateur
- ajouter un mode Discord sans Dice Parser et afficher le résultat dans le navigateur
