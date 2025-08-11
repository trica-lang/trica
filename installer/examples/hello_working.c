/*
 * Trica Ultra-Fast Compiled Output
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define TRICA_INLINE __forceinline
#define TRICA_RESTRICT __restrict
#define TRICA_LIKELY(x) __builtin_expect(!!(x), 1)
#define TRICA_UNLIKELY(x) __builtin_expect(!!(x), 0)

static char* trica_last_output = NULL;
static size_t trica_last_output_len = 0;

// Pre-computed string literals for maximum performance
static const char trica_str_0[] = "\x25 Welcome to Trica!";
static const char trica_str_1[] = "Your mind is about to be destroyed...";
static const char trica_str_2[] = "\xe0 Mind destruction complete!";
static const char trica_str_3[] = "\x80 Trica is LEGENDARY!";

// Ultra-optimized runtime functions
TRICA_INLINE void trica_print(const char* TRICA_RESTRICT str) {
    fputs(str, stdout);
    if (TRICA_UNLIKELY(trica_last_output != NULL)) free(trica_last_output);
    size_t len = strlen(str);
    trica_last_output = (char*)malloc(len + 1);
    memcpy(trica_last_output, str, len + 1);
    trica_last_output_len = len;
}

TRICA_INLINE char* trica_concat(const char* TRICA_RESTRICT str1, const char* TRICA_RESTRICT str2) {
    size_t len1 = strlen(str1), len2 = strlen(str2);
    char* result = (char*)malloc(len1 + len2 + 1);
    memcpy(result, str1, len1);
    memcpy(result + len1, str2, len2 + 1);
    return result;
}

TRICA_INLINE const char* trica_get_last_output(void) {
    return trica_last_output ? trica_last_output : "";
}

int main(void) {
    // Ultra-fast execution starts here
    trica_print(trica_str_0);
    trica_print(trica_str_1);
    trica_print(trica_str_2);
    trica_print(trica_str_3);
    if (trica_last_output != NULL) free(trica_last_output);
    return 0;
}
