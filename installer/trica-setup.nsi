; Trica Programming Language Installer
; Ultra-Fast Mind-Bending Programming Language
; Version 1.0.0 release

!define PRODUCT_NAME "Trica"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "Trica Team"
!define PRODUCT_WEB_SITE "https://trica.k2lang.org"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\trica.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; Modern UI
!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "WinMessages.nsh"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "trica-icon.ico"
!define MUI_UNICON "trica-icon.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "wizard.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "wizard.bmp"

; Welcome page
!define MUI_WELCOMEPAGE_TITLE "Welcome to Trica Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of Trica 1.0.0, the ultra-fast mind-bending programming language.$\r$\n$\r$\nNEW IN 1.0.0: Real bytecode VM execution! No more C code - pure Trica bytecode with quantum superposition, time travel, and mind destruction capabilities.$\r$\n$\r$\nClick Next to continue."
!insertmacro MUI_PAGE_WELCOME

; License page
!insertmacro MUI_PAGE_LICENSE "license.txt"

; Components page
!insertmacro MUI_PAGE_COMPONENTS

; Directory page
!insertmacro MUI_PAGE_DIRECTORY

; Instfiles page
!insertmacro MUI_PAGE_INSTFILES

; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\trica.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch Trica REPL"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.md"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "View Getting Started Guide"
!define MUI_FINISHPAGE_LINK "Visit Trica Website"
!define MUI_FINISHPAGE_LINK_LOCATION "${PRODUCT_WEB_SITE}"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language files
!insertmacro MUI_LANGUAGE "English"

; Reserve files (removed deprecated macro)

; MUI end ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "TricaSetup-${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES64\Trica"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin

; Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey "Comments" "Ultra-Fast Mind-Bending Programming Language with Bytecode VM"
VIAddVersionKey "CompanyName" "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "© 2025 ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion" "${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion" "${PRODUCT_VERSION}"
VIAddVersionKey "InternalName" "TricaSetup"
VIAddVersionKey "OriginalFilename" "TricaSetup-${PRODUCT_VERSION}.exe"

Section "Trica Core" SEC01
  SectionIn RO
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Main executable
  File "trica.exe"
  File "trica-compiler.exe"
  File "README.md"
  File "CHANGELOG.md"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\Trica"
  CreateShortCut "$SMPROGRAMS\Trica\Trica REPL.lnk" "$INSTDIR\trica.exe"
  CreateShortCut "$SMPROGRAMS\Trica\Trica Compiler.lnk" "$INSTDIR\trica-compiler.exe"
  CreateShortCut "$SMPROGRAMS\Trica\Uninstall.lnk" "$INSTDIR\uninst.exe"
  CreateShortCut "$DESKTOP\Trica.lnk" "$INSTDIR\trica.exe"
  
  ; Add to PATH (simplified)
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH"
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" "$0;$INSTDIR"
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
SectionEnd

Section "Examples and Documentation" SEC02
  SetOutPath "$INSTDIR\examples"
  File /r "examples\*.*"
  
  SetOutPath "$INSTDIR\docs"
  File /r "docs\*.*"
  
  CreateShortCut "$SMPROGRAMS\Trica\Examples.lnk" "$INSTDIR\examples"
  CreateShortCut "$SMPROGRAMS\Trica\Documentation.lnk" "$INSTDIR\docs"
SectionEnd

Section "Visual Studio Code Extension" SEC03
  ; VSCode extension not available in this version
  MessageBox MB_ICONINFORMATION "Visual Studio Code extension will be available in a future release. Check https://trica.k2lang.org for updates."
SectionEnd

Section "Add to System PATH" SEC04
  ; Already handled in core section
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC01} "Core Trica bytecode compiler and VM runtime (Required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC02} "Example programs and comprehensive documentation"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC03} "Visual Studio Code syntax highlighting and IntelliSense"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC04} "Add Trica to system PATH for command-line access"
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
  
  ; Get installed size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
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
  Delete "$INSTDIR\${PRODUCT_NAME}.url"
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\trica.exe"
  Delete "$INSTDIR\trica-compiler.exe"
  Delete "$INSTDIR\README.md"
  Delete "$INSTDIR\CHANGELOG.md"
  
  Delete "$SMPROGRAMS\Trica\Uninstall.lnk"
  Delete "$SMPROGRAMS\Trica\Website.lnk"
  Delete "$SMPROGRAMS\Trica\Trica REPL.lnk"
  Delete "$SMPROGRAMS\Trica\Trica Compiler.lnk"
  Delete "$SMPROGRAMS\Trica\Examples.lnk"
  Delete "$SMPROGRAMS\Trica\Documentation.lnk"
  Delete "$DESKTOP\Trica.lnk"

  RMDir "$SMPROGRAMS\Trica"
  RMDir /r "$INSTDIR\examples"
  RMDir /r "$INSTDIR\docs"
  RMDir "$INSTDIR"

  ; Remove from PATH (simplified - manual cleanup required)
  MessageBox MB_ICONINFORMATION "Please manually remove $INSTDIR from your PATH environment variable if needed."

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd