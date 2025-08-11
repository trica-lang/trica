/**
 *  EnvVarUpdate.nsh
 *    : Environmental Variables: append, prepend, and remove entries
 *
 *     WARNING: If you use StrFunc.nsh header then include it before this file
 *              with all required definitions. This is to avoid conflicts
 *
 *  Usage:
 *    ${EnvVarUpdate} "ResultVar" "EnvVarName" "Action" "RegLoc" "PathString"
 *
 *    RegLoc should be either HKLM or HKCU
 *    Action should be either A for append, P for prepend or R for remove
 *    PathString is the string to append/prepend/remove
 *    ResultVar will contain either: "Added", "Removed", or "NoChange"
 *
 *  Example:
 *    ${EnvVarUpdate} $0 "PATH" "A" "HKLM" "C:\MyApp\bin"
 *
 *  Detailed Documentation:
 *    http://nsis.sourceforge.net/Environmental_Variables:_append%2C_prepend%2C_and_remove_entries
 *
 */

!ifndef ENVVARUPDATE_FUNCTION
!define ENVVARUPDATE_FUNCTION
!verbose push
!verbose 3
!include "LogicLib.nsh"
!include "WinMessages.nsh"
!include "StrFunc.nsh"

; ---- Fix for conflict if StrFunc.nsh is already included ----
!ifndef StrFunc_INCLUDED
${StrStr}
${StrRep}
!endif

!define hklm_all_users     'HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"'
!define hkcu_current_user  'HKCU "Environment"'

!macro _EnvVarUpdateConstructor ResultVar EnvVarName Action Regloc PathString
  Push "${EnvVarName}"
  Push "${Action}"
  Push "${RegLoc}"
  Push "${PathString}"
    Call EnvVarUpdate
  Pop "${ResultVar}"
!macroend
!define EnvVarUpdate '!insertmacro "_EnvVarUpdateConstructor"'

!macro _unEnvVarUpdateConstructor ResultVar EnvVarName Action Regloc PathString
  Push "${EnvVarName}"
  Push "${Action}"
  Push "${RegLoc}"
  Push "${PathString}"
    Call un.EnvVarUpdate
  Pop "${ResultVar}"
!macroend
!define un.EnvVarUpdate '!insertmacro "_unEnvVarUpdateConstructor"'

; ---- Installer ----
!macro _EnvVarUpdate_Installer
Function EnvVarUpdate
  Push $0
  Exch 4
  Exch $1
  Exch 3
  Exch $2
  Exch 2
  Exch $3
  Exch
  Exch $4
  Push $5
  Push $6
  Push $7
  Push $8
  Push $9
  Push $R0

  /* After this point:
  -------------------------
     $0 = ResultVar     (not changed)
     $1 = EnvVarName    (not changed)
     $2 = Action        (not changed)
     $3 = RegLoc        (not changed)
     $4 = PathString    (not changed)
     $5 = Orig EnvVar   (changed)
     $6 = Len of $0     (changed)
     $7 = tempstr1      (changed)
     $8 = Entry counter (changed)
     $9 = tempstr2      (changed)
     $R0 = tempChar     (changed)  */

  ; Make sure we have a valid action
  ${If} $2 != "A"
  ${AndIf} $2 != "P"
  ${AndIf} $2 != "R"
    DetailPrint "EnvVarUpdate: Invalid action - must be A, P, or R"
    Goto EnvVarUpdate_Restore_Vars
  ${EndIf}

  ; Get the current value
  ${If} $3 == HKLM
    ReadRegStr $5 ${hklm_all_users} $1     ; Get EnvVarName from all users into $5
  ${ElseIf} $3 == HKCU
    ReadRegStr $5 ${hkcu_current_user} $1  ; Read EnvVarName from current user into $5
  ${Else}
    DetailPrint "EnvVarUpdate: Invalid registry location - must be HKLM or HKCU"
    Goto EnvVarUpdate_Restore_Vars
  ${EndIf}

  ; Check for NULL
  ${If} $5 == ""                          ; Check if EnvVar is NULL
    ${If} $2 == "R"                       ; If Remove
      DetailPrint "EnvVarUpdate: Registry value is empty - nothing to remove"
      strcpy $0 "NoChange"
      Goto EnvVarUpdate_Restore_Vars
    ${EndIf}
    strcpy $5 $4                          ; Set EnvVar to PathString
    Goto EnvVarUpdate_Finish
  ${EndIf}

  ; Check if string already exists in the path
  ${StrStr} $7 $5 $4                     ; Find $4 in $5, put result in $7
  ${If} $7 == ""                         ; String not found
    ${If} $2 == "R"                      ; If Remove
      DetailPrint "EnvVarUpdate: String not found in PATH - nothing to remove"
      strcpy $0 "NoChange"
      Goto EnvVarUpdate_Restore_Vars
    ${EndIf}
    ; String not found, safe to add
    ${If} $2 == "A"                      ; If Append
      strcpy $5 "$5;$4"
    ${ElseIf} $2 == "P"                  ; If Prepend
      strcpy $5 "$4;$5"
    ${EndIf}
    Goto EnvVarUpdate_Finish
  ${EndIf}

  ; String found - check if it's an exact match or substring
  StrLen $6 $4                           ; Get length of PathString
  StrLen $8 $5                           ; Get length of current EnvVar
  
  ; Check if it's at the beginning
  ${If} $7 == $5                         ; String found at beginning
    StrCpy $9 $5 "" $6                   ; Copy everything after PathString
    ${If} $9 == ""                       ; PathString is the entire value
      ${If} $2 == "R"                    ; If Remove
        strcpy $5 ""
        Goto EnvVarUpdate_Finish
      ${Else}                            ; If Add (already exists)
        DetailPrint "EnvVarUpdate: String already exists in PATH"
        strcpy $0 "NoChange"
        Goto EnvVarUpdate_Restore_Vars
      ${EndIf}
    ${EndIf}
    StrCpy $R0 $9 1                      ; Get first char after PathString
    ${If} $R0 == ";"                     ; Check if followed by semicolon
      ${If} $2 == "R"                    ; If Remove
        StrCpy $5 $9 "" 1                ; Remove PathString and semicolon
        Goto EnvVarUpdate_Finish
      ${Else}                            ; If Add (already exists)
        DetailPrint "EnvVarUpdate: String already exists in PATH"
        strcpy $0 "NoChange"
        Goto EnvVarUpdate_Restore_Vars
      ${EndIf}
    ${EndIf}
  ${EndIf}

  ; Check if it's at the end
  IntOp $8 $8 - $6                       ; Calculate position where PathString should start if at end
  StrCpy $9 $5 $6 $8                     ; Get last $6 chars
  ${If} $9 == $4                         ; PathString found at end
    IntOp $8 $8 - 1                      ; Move back one position
    StrCpy $R0 $5 1 $8                   ; Get char before PathString
    ${If} $R0 == ";"                     ; Check if preceded by semicolon
      ${If} $2 == "R"                    ; If Remove
        StrCpy $5 $5 $8                  ; Remove semicolon and PathString
        Goto EnvVarUpdate_Finish
      ${Else}                            ; If Add (already exists)
        DetailPrint "EnvVarUpdate: String already exists in PATH"
        strcpy $0 "NoChange"
        Goto EnvVarUpdate_Restore_Vars
      ${EndIf}
    ${EndIf}
  ${EndIf}

  ; Check if it's in the middle
  IntOp $8 $7 - $5                       ; Get position of found string
  ${If} $8 > 0                           ; Not at beginning
    IntOp $8 $8 - 1                      ; Move back one position
    StrCpy $R0 $5 1 $8                   ; Get char before PathString
    ${If} $R0 == ";"                     ; Check if preceded by semicolon
      IntOp $8 $7 - $5                   ; Get position of found string again
      IntOp $8 $8 + $6                   ; Move to position after PathString
      StrCpy $R0 $5 1 $8                 ; Get char after PathString
      ${If} $R0 == ";"                   ; Check if followed by semicolon
        ${If} $2 == "R"                  ; If Remove
          IntOp $8 $7 - $5               ; Get position of found string
          StrCpy $9 $5 $8                ; Get part before PathString
          IntOp $8 $8 + $6 + 1           ; Move past PathString and semicolon
          StrCpy $8 $5 "" $8             ; Get part after PathString and semicolon
          strcpy $5 "$9$8"               ; Combine parts
          Goto EnvVarUpdate_Finish
        ${Else}                          ; If Add (already exists)
          DetailPrint "EnvVarUpdate: String already exists in PATH"
          strcpy $0 "NoChange"
          Goto EnvVarUpdate_Restore_Vars
        ${EndIf}
      ${EndIf}
    ${EndIf}
  ${EndIf}

  ; If we get here, it's a partial match - treat as not found for safety
  ${If} $2 == "R"                        ; If Remove
    DetailPrint "EnvVarUpdate: Exact match not found - nothing to remove"
    strcpy $0 "NoChange"
    Goto EnvVarUpdate_Restore_Vars
  ${Else}                                 ; If Add
    ${If} $2 == "A"                      ; If Append
      strcpy $5 "$5;$4"
    ${ElseIf} $2 == "P"                  ; If Prepend
      strcpy $5 "$4;$5"
    ${EndIf}
    Goto EnvVarUpdate_Finish
  ${EndIf}

  EnvVarUpdate_Finish:
  ${If} $3 == HKLM
    WriteRegExpandStr ${hklm_all_users} $1 $5     ; Write it in all users section
  ${ElseIf} $3 == HKCU
    WriteRegExpandStr ${hkcu_current_user} $1 $5  ; Write it to current user section
  ${EndIf}

  ${If} $2 == "R"
    strcpy $0 "Removed"
  ${Else}
    strcpy $0 "Added"
  ${EndIf}
  DetailPrint "EnvVarUpdate: $0 $4 to/from $1"

  EnvVarUpdate_Restore_Vars:
  ;
  ; Restore the user variables and return ResultVar
  Pop $R0
  Pop $9
  Pop $8
  Pop $7
  Pop $6
  Pop $5
  Pop $4
  Pop $3
  Pop $2
  Pop $1
  Exch $0
FunctionEnd
!macroend

; ---- Uninstaller ----
!macro _EnvVarUpdate_Uninstaller
Function un.EnvVarUpdate
  Push $0
  Exch 4
  Exch $1
  Exch 3
  Exch $2
  Exch 2
  Exch $3
  Exch
  Exch $4
  Push $5
  Push $6
  Push $7
  Push $8
  Push $9
  Push $R0

  ; Make sure we have a valid action
  ${If} $2 != "A"
  ${AndIf} $2 != "P"
  ${AndIf} $2 != "R"
    DetailPrint "EnvVarUpdate: Invalid action - must be A, P, or R"
    Goto un.EnvVarUpdate_Restore_Vars
  ${EndIf}

  ; Get the current value
  ${If} $3 == HKLM
    ReadRegStr $5 ${hklm_all_users} $1
  ${ElseIf} $3 == HKCU
    ReadRegStr $5 ${hkcu_current_user} $1
  ${Else}
    DetailPrint "EnvVarUpdate: Invalid registry location - must be HKLM or HKCU"
    Goto un.EnvVarUpdate_Restore_Vars
  ${EndIf}

  ; Check for NULL
  ${If} $5 == ""
    DetailPrint "EnvVarUpdate: Registry value is empty - nothing to remove"
    strcpy $0 "NoChange"
    Goto un.EnvVarUpdate_Restore_Vars
  ${EndIf}

  ; For uninstaller, we only do Remove operations
  ${StrStr} $7 $5 $4
  ${If} $7 == ""
    DetailPrint "EnvVarUpdate: String not found in PATH - nothing to remove"
    strcpy $0 "NoChange"
    Goto un.EnvVarUpdate_Restore_Vars
  ${EndIf}

  ; Use the same logic as installer for removal
  StrLen $6 $4
  StrLen $8 $5
  
  ; Check if it's at the beginning
  ${If} $7 == $5
    StrCpy $9 $5 "" $6
    ${If} $9 == ""
      strcpy $5 ""
      Goto un.EnvVarUpdate_Finish
    ${EndIf}
    StrCpy $R0 $9 1
    ${If} $R0 == ";"
      StrCpy $5 $9 "" 1
      Goto un.EnvVarUpdate_Finish
    ${EndIf}
  ${EndIf}

  ; Check if it's at the end
  IntOp $8 $8 - $6
  StrCpy $9 $5 $6 $8
  ${If} $9 == $4
    IntOp $8 $8 - 1
    StrCpy $R0 $5 1 $8
    ${If} $R0 == ";"
      StrCpy $5 $5 $8
      Goto un.EnvVarUpdate_Finish
    ${EndIf}
  ${EndIf}

  ; Check if it's in the middle
  IntOp $8 $7 - $5
  ${If} $8 > 0
    IntOp $8 $8 - 1
    StrCpy $R0 $5 1 $8
    ${If} $R0 == ";"
      IntOp $8 $7 - $5
      IntOp $8 $8 + $6
      StrCpy $R0 $5 1 $8
      ${If} $R0 == ";"
        IntOp $8 $7 - $5
        StrCpy $9 $5 $8
        IntOp $8 $8 + $6 + 1
        StrCpy $8 $5 "" $8
        strcpy $5 "$9$8"
        Goto un.EnvVarUpdate_Finish
      ${EndIf}
    ${EndIf}
  ${EndIf}

  ; If we get here, exact match not found
  DetailPrint "EnvVarUpdate: Exact match not found - nothing to remove"
  strcpy $0 "NoChange"
  Goto un.EnvVarUpdate_Restore_Vars

  un.EnvVarUpdate_Finish:
  ${If} $3 == HKLM
    WriteRegExpandStr ${hklm_all_users} $1 $5
  ${ElseIf} $3 == HKCU
    WriteRegExpandStr ${hkcu_current_user} $1 $5
  ${EndIf}

  strcpy $0 "Removed"
  DetailPrint "EnvVarUpdate: Removed $4 from $1"

  un.EnvVarUpdate_Restore_Vars:
  Pop $R0
  Pop $9
  Pop $8
  Pop $7
  Pop $6
  Pop $5
  Pop $4
  Pop $3
  Pop $2
  Pop $1
  Exch $0
FunctionEnd
!macroend

; ---- Include both macros ----
!insertmacro _EnvVarUpdate_Installer
!insertmacro _EnvVarUpdate_Uninstaller

!verbose pop
!endif