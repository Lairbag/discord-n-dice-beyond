# Discord&Dice Beyond
![](popup/header.png)
Webextension that allow yout to roll dice (with dice parser) into your discord channel from your D&amp;D Beyond character sheet


# Présentation
Cette extension (Firefox et Chromium) à pour vocation de simplifier les lancés de dés pour les joueurs utilisant Discord et D&D Beyond.

Différent dés apparaissent en bas à droite de la fiche de personnage (**il faut être connecté à son compte**). Au clique sur l'un de ces dés, un jet se fera automatiquement (plus de détail ci-dessous).
Au clique sur le +, une fenêtre permettant de lancer plusieurs dés à la fois va apparaître.
Il y a également un dés à côté de chaque compétence pour faire le jet en prenant en compte le modificateur. Il en est de même pour les jets d'attaque ou le repos court.

Petit plus, le nom et l'avatar du personnage seront visible sur Discord.

![](Presentation.png)

Concernant le lancé de dés, il y a trois options :
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
Après installation de l'extension, un d20 est visible en haut à droite avec les autres extensions.
Au clique, une fenêtre apparait ou il est possible de saisir l'URL du Webhook et de choisir le mode de lancé de dés (voir plus haut).

![](configuration.png)

# Un petit Gif sur la configuration de Discord et de l'extension

![](tuto/tuto.gif)

# A venir
J'ai plusieurs chantier en tête :
- Avoir l'option de lancer un dés avec avantage/désavantage
- améliorer l'affichage du résultat du jet de dés dans le navigateur
- possibilité de partager le résultat du dés à d'autres personnes sans passer par Discord
