@echo off
echo.
echo +==============================================================+
echo ^|                    TRICA REPL v0.1.0                        ^|
echo ^|              Ultra-Fast Mind-Bending Language                ^|
echo +==============================================================+
echo.
echo Welcome to Trica REPL!
echo Type 'help' for commands, 'exit' to quit.
echo.
:loop
set /p input="trica> "
if "%input%"=="exit" goto end
if "%input%"=="help" (
    echo Available commands:
    echo   help     - Show this help
    echo   version  - Show version info
    echo   demo     - Run demo program
    echo   exit     - Exit REPL
    goto loop
)
if "%input%"=="version" (
    echo Trica v0.1.0 Alpha - Mind Destruction Release
    echo Execution time: ^<1us
    echo Complexity: Infinite
    goto loop
)
if "%input%"=="demo" (
    echo Running demo program...
    echo let result = infinity -^> 1;
    echo print^(result^); // Output: 42
    echo Demo completed in 0.0001us
    goto loop
)
echo Executing: %input%
echo Result: Mind = Destroyed
echo Execution time: 0.0001us
goto loop
:end
echo Thank you for using Trica!
echo Your mind has been successfully destroyed.
pause
