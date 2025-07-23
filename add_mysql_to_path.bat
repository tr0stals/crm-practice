@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "MYSQL_BIN="

REM Search in Program Files\MySQL\MySQL Server *\bin
set "BASE1=C:\Program Files\MySQL"
set "BASE2=C:\Program Files (x86)\MySQL"

for %%b in ("%BASE1%" "%BASE2%") do (
    if exist %%~b (
        for /d %%p in ("%%~b\\MySQL Server *") do (
            if exist "%%~p\\bin" (
                set "MYSQL_BIN=%%~p\\bin"
                echo Found: !MYSQL_BIN!
                goto :found
            )
        )
    )
)

echo MySQL bin folder not found in Program Files.
goto :theend

:found
REM Get current user Path
set "USERPATH="
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USERPATH=%%b"

REM Show current user Path
echo Current user Path: !USERPATH!

REM Check if already in Path
echo !USERPATH! | find /I "!MYSQL_BIN!" >nul
if not errorlevel 1 (
    echo Path already present.
    goto :theend
)

REM Add to Path
setx Path "!USERPATH!;!MYSQL_BIN!"

echo Added !MYSQL_BIN! to user Path.

:theend
pause