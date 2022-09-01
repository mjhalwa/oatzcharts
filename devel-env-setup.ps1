# path to console
#$cmder = "${Env:ConEmuDir}/../../Cmder.exe"
$conemu = "${Env:ConEmuDir}/ConEmu64.exe"

# open console
Write-Output "start Cmder"
#Invoke-Expression "$cmder /start $pwd"
Invoke-Expression "$conemu -Here"
# - wait for new console window to open to avoid jumping to Desktop window with last opened console
Start-Sleep 2
Write-Output "- opens a git console window"
Invoke-Expression "${conemu} -Single -dir $pwd -run cmd -cur_console:t:`"git`" /k `"${Env:ConEmuDir}/../init.bat & git status`""
Start-Sleep 1
Write-Output "- opens an npm project management console window"
Invoke-Expression "${conemu} -Single -dir $pwd\oatz-charts -run cmd -cur_console:t:`"npm`" /k `"${Env:ConEmuDir}/../init.bat & echo npm install & echo npm install PACKAGE & echo npm install --dev PACKAGE & echo npm audit`""
Start-Sleep 1
Write-Output "- open a react run console window"
Invoke-Expression "${conemu} -Single -dir $pwd\oatz-charts -run cmd -cur_console:t:`"react`" /k `"${Env:ConEmuDir}/../init.bat & echo npm run start`""
Start-Sleep 1
Write-Output "- open a console window for the dev-server"
Invoke-Expression "${conemu} -Single -dir $pwd\dev-server -run cmd -cur_console:t:`"dev-server`" /k `"${Env:ConEmuDir}/../init.bat & echo npm install & echo npm run run`""

# open visual studio code
# see https://stackoverflow.com/a/57339331/2195180
# > It unnecessary attaches itself to the console window preventing it to close even after shell application quit.
# > create new hidden console window for VS Code to attach to, instead of console window of your PowerShell instance:
Write-Output "opens Visual Studio Code"
#Invoke-Expression "code $pdw/.."
Start-Process -WindowStyle Hidden code .

# ... and view in browser
Write-Output "opens Webbrowser"
Start-Process firefox
Start-Process chrome
Start-Sleep 2
Start-Process "https://oatz.net/rocketleague/all"
Start-Sleep 2
Start-Process "https://github.com/mjhalwa/oatzcharts"
Start-Sleep 2
Start-Process "https://mjhalwa.github.io/oatzcharts/"

