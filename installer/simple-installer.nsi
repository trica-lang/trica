;--------------------------------
; Trica Programming Language - Simple Installer
; Safe PATH management without external dependencies
;--------------------------------

!define PRODUCT_NAME "Trica"
!define PRODUCT_VERSION "0.1.0"
!define PRODUCT_PUBLISHER "Trica Team"

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "TricaInstaller-${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES64\Trica"
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin

; Modern UI
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "WinMessages.nsh"

; MUI Settings
!define MUI_ABORTWARNING

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language
!insertmacro MUI_LANGUAGE "English"

; Sections
Section "Trica Compiler (Required)" SEC01
  SectionIn RO
  SetOutPath "$INSTDIR"
  
  ; Copy main executable
  File "..\target\release\trica.exe"
  File "..\README.md"
  File "LICENSE.txt"
  
  ; Copy examples
  SetOutPath "$INSTDIR\examples"
  File "..\examples\*.trica"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\Trica"
  CreateShortCut "$SMPROGRAMS\Trica\Trica Compiler.lnk" "$INSTDIR\trica.exe"
  CreateShortCut "$SMPROGRAMS\Trica\Examples.lnk" "$INSTDIR\examples"
  CreateShortCut "$DESKTOP\Trica.lnk" "$INSTDIR\trica.exe"
SectionEnd

Section "Add to PATH (Recommended)" SEC02
  ; Read current PATH
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH"
  
  ; Check if our path is already in PATH
  ${StrStr} $1 $0 "$INSTDIR"
  ${If} $1 == ""
    ; Not found, add it
    ${If} $0 == ""
      ; PATH is empty (unlikely but possible)
      WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" "$INSTDIR"
    ${Else}
      ; Append to existing PATH
      WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" "$0;$INSTDIR"
    ${EndIf}
    
    ; Notify system of environment change
    SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
    DetailPrint "Added $INSTDIR to system PATH"
  ${Else}
    DetailPrint "Path already exists in system PATH"
  ${EndIf}
SectionEnd

Section "Development Tools" SEC03
  SetOutPath "$INSTDIR\tools"
  File "..\build.ps1"
  
  CreateShortCut "$SMPROGRAMS\Trica\Build Tools.lnk" "powershell.exe" "-ExecutionPolicy Bypass -File `"$INSTDIR\tools\build.ps1`""
SectionEnd

; Component descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC01} "The Trica compiler and core files (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC02} "Add Trica to your system PATH for easy command-line access"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC03} "Development tools and build scripts"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Post-install
Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  CreateShortCut "$SMPROGRAMS\Trica\Uninstall.lnk" "$INSTDIR\uninst.exe"
  
  ; Registry entries
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\trica.exe"
SectionEnd

; Uninstaller
Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to remove $(^Name)?" IDYES +2
  Abort
FunctionEnd

Section Uninstall
  ; Remove from PATH safely
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH"
  
  ; Remove our directory from PATH
  ${StrStr} $1 $0 ";$INSTDIR"
  ${If} $1 != ""
    ; Found with semicolon prefix
    ${StrRep} $0 $0 ";$INSTDIR" ""
    WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" "$0"
    DetailPrint "Removed $INSTDIR from system PATH"
  ${Else}
    ; Check if it's at the beginning
    ${StrStr} $1 $0 "$INSTDIR;"
    ${If} $1 == $0
      ; Found at beginning with semicolon suffix
      StrLen $2 "$INSTDIR;"
      StrCpy $0 $0 "" $2
      WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" "$0"
      DetailPrint "Removed $INSTDIR from system PATH"
    ${Else}
      ; Check if it's the only entry
      ${If} $0 == "$INSTDIR"
        WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" ""
        DetailPrint "Removed $INSTDIR from system PATH"
      ${EndIf}
    ${EndIf}
  ${EndIf}
  
  ; Notify system of environment change
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  ; Remove files
  Delete "$INSTDIR\trica.exe"
  Delete "$INSTDIR\README.md"
  Delete "$INSTDIR\LICENSE.txt"
  Delete "$INSTDIR\uninst.exe"
  
  ; Remove examples
  Delete "$INSTDIR\examples\*.trica"
  RMDir "$INSTDIR\examples"
  
  ; Remove tools
  Delete "$INSTDIR\tools\build.ps1"
  RMDir "$INSTDIR\tools"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\Trica\Trica Compiler.lnk"
  Delete "$SMPROGRAMS\Trica\Examples.lnk"
  Delete "$SMPROGRAMS\Trica\Build Tools.lnk"
  Delete "$SMPROGRAMS\Trica\Uninstall.lnk"
  Delete "$DESKTOP\Trica.lnk"
  RMDir "$SMPROGRAMS\Trica"
  
  ; Remove installation directory
  RMDir "$INSTDIR"
  
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd