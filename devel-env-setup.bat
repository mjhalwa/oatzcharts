@ECHO OFF

:: open console
SET cmder=%ConEmuDir%\..\..\Cmder.exe
SET conemu=%ConEmuDir%\ConEmu64.exe

ECHO start Cmder
%cmder% /start %cd%
ECHO open a git console window
%conemu% -single -dir %cd% -run cmd -cur_console:t:"git" /k "%ConEmuDir%\..\init.bat & git status"
ECHO open an npm project management console window
%conemu% -single -dir %cd%\oatz-charts -run cmd -cur_console:t:"npm" /k "%ConEmuDir%\..\init.bat"
ECHO open a react run console window
%conemu% -single -dir %cd%\oatz-charts -run cmd -cur_console:t:"react" /k "%ConEmuDir%\..\init.bat"
ECHO open a console window for the dev-server
%conemu% -single -dir %cd%\oatz-charts -run cmd -cur_console:t:"dev-server" /k "%ConEmuDir%\..\init.bat"

:: open visual studio code
ECHO open Visual Studio Code
START /B code %cd%

:: ... and view in browser
start firefox
start chrome
TIMEOUT /t 2 > nul
start https://oatz.net/rocketleague/all
start https://github.com/mjhalwa/oatzcharts
start https://mjhalwa.github.io/oatzcharts/
