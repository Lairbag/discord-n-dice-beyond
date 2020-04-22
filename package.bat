@echo off

set destination=%1
set browser=%2

IF exist %destination% ( rmdir /S /Q %destination% ) 

mkdir %destination%

echo F|xcopy /Q /Y /F ".\manifest.%browser%.json" ".\%destination%\manifest.json"
echo F|xcopy /Q /Y /F ".\discord-n-dice-beyond.js" ".\%destination%\discord-n-dice-beyond.js"

echo R|xcopy /S /Q /Y /F ".\icons" ".\%destination%\icons"
echo R|xcopy /S /Q /Y /F ".\popup" ".\%destination%\popup"