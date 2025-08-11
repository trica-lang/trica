@echo off
echo Replacing all FiWindows imports and usage in your project files...

for /R src %%f in (*.js *.jsx) do (
    powershell -Command "(Get-Content '%%f') -replace 'import { FiWindows } from ''react-icons/fi'';', 'import { FaWindows } from ''react-icons/fa'';' | Set-Content '%%f'"
    powershell -Command "(Get-Content '%%f') -replace '<FiWindows />', '<FaWindows />' | Set-Content '%%f'"
)

echo Done replacing. Go flex with FaWindows now.
pause
