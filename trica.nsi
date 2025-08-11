!define PRODUCT_NAME "Trica"
!define PRODUCT_VERSION "1.0"
!define PRODUCT_PUBLISHER "Prime Inc"
!define PRODUCT_DIR_REGKEY "Software\${PRODUCT_NAME}"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

SetCompressor lzma

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "TricaInstaller.exe"
InstallDir "$PROGRAMFILES\Trica"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" "Install_Dir"

Page directory
Page instfiles

Section "Install"
  SetOutPath "$INSTDIR"
  File "C:\Users\Prime\OneDrive\Desktop\trica\target\release\trica.exe"

  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "Install_Dir" "$INSTDIR"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\trica.exe"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
SectionEnd
