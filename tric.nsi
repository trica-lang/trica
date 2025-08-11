!include "MUI2.nsh"

Name "Trica"
OutFile "TricaSetup.exe"
InstallDir "$PROGRAMFILES\Trica"
InstallDirRegKey HKLM "Software\Trica" "Install_Dir"
RequestExecutionLevel admin

!define REG_ROOT "HKLM"
!define APP_NAME "Trica"

!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\darkblue.bmp"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_INSTFILES

!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Launch Trica"
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchTrica"

Section "Install"
    SetOutPath "$INSTDIR"
    File "target\release\trica.exe"

    WriteUninstaller "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Trica" "Install_Dir" "$INSTDIR"

    ; Add to PATH manually
    ReadRegStr $0 ${REG_ROOT} "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
    StrCpy $1 "$0"
    Push "$1"
    Push "$INSTDIR"
    Call AddToPath
    Pop $1
    WriteRegExpandStr ${REG_ROOT} "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$1"

    ; Notify system
    System::Call 'user32::SendMessageTimeoutA(i 0xffff, i ${WM_SETTINGCHANGE}, i 0, t "Environment", i 0, i 5000, *i .r0)'
SectionEnd

Function LaunchTrica
    Exec "$INSTDIR\trica.exe"
FunctionEnd

Section "Uninstall"
    Delete "$INSTDIR\trica.exe"
    Delete "$INSTDIR\Uninstall.exe"
    RMDir "$INSTDIR"
    DeleteRegKey HKLM "Software\Trica"

    ; Remove from PATH
    ReadRegStr $0 ${REG_ROOT} "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
    Push "$0"
    Push "$INSTDIR"
    Call RemoveFromPath
    Pop $1
    WriteRegExpandStr ${REG_ROOT} "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$1"

    System::Call 'user32::SendMessageTimeoutA(i 0xffff, i ${WM_SETTINGCHANGE}, i 0, t "Environment", i 0, i 5000, *i .r0)'
SectionEnd

Function AddToPath
    Exch $1 ; new path
    Exch
    Exch $0 ; old path
    Push $2

    StrCpy $2 "$0"
    StrCmp $2 "" AddDone
    StrCmp $2 "$1" AddDone

    StrCpy $2 "$0;$1"
    Goto AddDone

AddDone:
    Pop $2
    Pop $0
    Pop $1
    Push $2
FunctionEnd

Function RemoveFromPath
    Exch $1 ; remove path
    Exch
    Exch $0 ; original path
    Push $2
    Push $3

    StrCpy $2 ""
    loop:
        StrCpy $3 "$0" "" 0
        ${If} $3 == ""
            Goto done
        ${EndIf}
        ${If} $3 != $1
            ${If} $2 == ""
                StrCpy $2 "$3"
            ${Else}
                StrCpy $2 "$2;$3"
            ${EndIf}
        ${EndIf}
        StrCpy $0 "$0" "" 1
        Goto loop
    done:
    Pop $3
    Pop $2
    Pop $0
    Pop $1
    Push $2
FunctionEnd
