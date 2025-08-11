;--------------------------------
; Trica Programming Language Installer
; Ultra-fast, mind-bending language installer
;--------------------------------

!define PRODUCT_NAME "Trica"
!define PRODUCT_VERSION "0.1.0"
!define PRODUCT_PUBLISHER "Trica Team"
!define PRODUCT_WEB_SITE "https://github.com/trica-lang/trica"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\trica.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; Modern UI
!include "MUI2.nsh"
!include "EnvVarUpdate.nsh"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "trica.ico"
!define MUI_UNICON "trica.ico"

; Welcome page
!insertmacro MUI_PAGE_WELCOME

; License page
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"

; Directory page
!insertmacro MUI_PAGE_DIRECTORY

; Components page
!insertmacro MUI_PAGE_COMPONENTS

; Instfiles page
!insertmacro MUI_PAGE_INSTFILES

; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\trica.exe"
!define MUI_FINISHPAGE_RUN_PARAMETERS "--version"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.md"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language files
!insertmacro MUI_LANGUAGE "English"

; MUI end ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "TricaInstaller-${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES64\Trica"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

; Request admin privileges
RequestExecutionLevel admin

; Version Information
VIProductVersion "0.1.0.0"
VIAddVersionKey "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey "Comments" "Ultra-fast, mind-bending programming language"
VIAddVersionKey "CompanyName" "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalTrademarks" ""
VIAddVersionKey "LegalCopyright" "© 2024 ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion" "${PRODUCT_VERSION}"

Section "Trica Compiler (Required)" SEC01
  SectionIn RO
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Main executable
  File "..\target\release\trica.exe"
  
  ; Documentation
  File "..\README.md"
  File "LICENSE.txt"
  
  ; Examples
  SetOutPath "$INSTDIR\examples"
  File "..\examples\*.trica"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\Trica"
  CreateShortCut "$SMPROGRAMS\Trica\Trica Compiler.lnk" "$INSTDIR\trica.exe"
  CreateShortCut "$SMPROGRAMS\Trica\Examples.lnk" "$INSTDIR\examples"
  CreateShortCut "$SMPROGRAMS\Trica\Uninstall.lnk" "$INSTDIR\uninst.exe"
  CreateShortCut "$DESKTOP\Trica.lnk" "$INSTDIR\trica.exe"
SectionEnd

Section "Add to PATH" SEC02
  ; Safely add to PATH using EnvVarUpdate
  ${EnvVarUpdate} $0 "PATH" "A" "HKLM" "$INSTDIR"
  
  ; Notify system of environment change
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
SectionEnd

Section "Development Tools" SEC03
  SetOutPath "$INSTDIR\tools"
  
  ; Build script
  File "..\build.ps1"
  
  ; VS Code extension (if we had one)
  ; File "trica-vscode-extension.vsix"
  
  CreateShortCut "$SMPROGRAMS\Trica\Build Script.lnk" "powershell.exe" "-ExecutionPolicy Bypass -File `"$INSTDIR\tools\build.ps1`""
SectionEnd

Section "GCC Compiler (Recommended)" SEC04
  ; Check if GCC is already installed
  nsExec::ExecToStack 'gcc --version'
  Pop $0
  ${If} $0 != 0
    MessageBox MB_YESNO|MB_ICONQUESTION "GCC compiler not found. Would you like to download and install it?$\n$\nGCC is required to compile Trica programs to native executables." IDNO skip_gcc
    
    ; Download and install TDM-GCC (lightweight GCC distribution)
    inetc::get "https://jmeubank.github.io/tdm-gcc/download/" "$TEMP\tdm-gcc-installer.exe"
    Pop $0
    ${If} $0 == "OK"
      ExecWait "$TEMP\tdm-gcc-installer.exe"
      Delete "$TEMP\tdm-gcc-installer.exe"
    ${Else}
      MessageBox MB_OK|MB_ICONEXCLAMATION "Failed to download GCC installer. You can install it manually later."
    ${EndIf}
    
    skip_gcc:
  ${EndIf}
SectionEnd

; Component descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC01} "The Trica compiler executable and core files (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC02} "Add Trica to your system PATH so you can run 'trica' from anywhere"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC03} "Development tools including build scripts and utilities"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC04} "Download and install GCC compiler for native code generation"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

Section -AdditionalIcons
  WriteIniStr "$INSTDIR\${PRODUCT_NAME}.url" "InternetShortcut" "URL" "${PRODUCT_WEB_SITE}"
  CreateShortCut "$SMPROGRAMS\Trica\Website.lnk" "$INSTDIR\${PRODUCT_NAME}.url"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\trica.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\trica.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) was successfully removed from your computer."
FunctionEnd

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove $(^Name) and all of its components?" IDYES +2
  Abort
FunctionEnd

Section Uninstall
  ; Remove from PATH safely
  ${un.EnvVarUpdate} $0 "PATH" "R" "HKLM" "$INSTDIR"
  
  ; Remove files
  Delete "$INSTDIR\${PRODUCT_NAME}.url"
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\trica.exe"
  Delete "$INSTDIR\README.md"
  Delete "$INSTDIR\LICENSE.txt"
  
  ; Remove examples
  Delete "$INSTDIR\examples\*.trica"
  RMDir "$INSTDIR\examples"
  
  ; Remove tools
  Delete "$INSTDIR\tools\build.ps1"
  RMDir "$INSTDIR\tools"

  ; Remove shortcuts
  Delete "$SMPROGRAMS\Trica\Uninstall.lnk"
  Delete "$SMPROGRAMS\Trica\Website.lnk"
  Delete "$SMPROGRAMS\Trica\Trica Compiler.lnk"
  Delete "$SMPROGRAMS\Trica\Examples.lnk"
  Delete "$SMPROGRAMS\Trica\Build Script.lnk"
  Delete "$DESKTOP\Trica.lnk"

  RMDir "$SMPROGRAMS\Trica"
  RMDir "$INSTDIR"

  ; Remove registry keys
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  ; Notify system of environment change
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  SetAutoClose true
SectionEnd