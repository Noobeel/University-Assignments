#include "assign2funcs.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

/*
Name: checkInput
Purpose: Checks if input arguments are correct, exits with code 1 if error in arguments
Parameters: argc: number of arguments in stdin,
            **argv: pointer to array storing arguments in stdin
Return: No Return
*/
void checkInput(int argc, char **argv) {
    if ((argc < 4) || (argc > (MAXVAL + 3))) { /* Check if incorrect number of argument */
        fprintf(stderr,"%s: specify input_delimiter output_delimiter and 1-%d fields in order\n", argv[0], MAXVAL);
        exit(1);
    } else if ((strlen(argv[1]) != 1) || (strlen(argv[2]) != 1)) { /* Checks if input delimiters are more than 1 character long */
        fprintf(stderr,"%s: specify input_delimiter output_delimiter and 1-%d fields in order\n", argv[0], MAXVAL);
        exit(1);
    } else if ((atoi(argv[3]) < 1) || (atoi(argv[argc-1]) > MAXVAL)) { /* Checks if field numbers are greater than 1 and less than max value (100) */
        fprintf(stderr,"%s: specify input_delimiter output_delimiter and 1-%d fields in order\n", argv[0], MAXVAL);
        exit(1);
    }

    int checkval = 0; /* Initialize checkval */
    char str[10];     /* Array to store argument */ 
    char *ptr;        /* Pointer */
    for (int i = 3; i < argc; i++) {
        strcpy(str, argv[i]); /* Copy argument to array */
        strtol(str, &ptr, 10); /* Converts string to long integer, if non-integer in argument, ptr points to it */

        if (strlen(ptr) != 0) { /* If invalid character in argument */
           fprintf(stderr,"%s: specify input_delimiter output_delimiter and 1-%d fields in order\n", argv[0], MAXVAL);
           exit(1);
        } else if (atoi(argv[i]) <= checkval) { /* If current argument less than or equal to previous argument */
           fprintf(stderr,"%s: specify input_delimiter output_delimiter and 1-%d fields in order\n", argv[0], MAXVAL);
           exit(1);
        }

        checkval = atoi(argv[i]); /* Sets checkval to previous value */
    }
}

/*
Name: cut
Purpose: Cuts words from line at specified field number seperated with specified
         input delimiter and prints them with specified output delimiter
Parameters: str: character array containing current line,
            argc: number of arguments in stdin,
            **argv: pointer to array containing arguments in stdin
Return: No Return
*/
void cut(char* str, int argc, char **argv) {
    char inputdel = *(argv[1]); /* Stores input delimiter */
    char outputdel = *(argv[2]); /* Stores output delimiter */
    int prev = -1; /* Stores index of previous occurance of input delimiter */

    for (int i = 3; i < argc; i++) { /* Loop through given field numbers in stdin arguments */
        int x = 0; /* Counts number of words looped through */
        int pos = atoi(argv[i]); /* Stores current field number */
        prev = -1; /* Reset prev */

        for (int y = 0; str[y] != '\0'; y++) { /* Loop through array until null character */
            if (str[y] == inputdel) { 
                x++;
                if (pos == x) { /* If current word is field needed to be cut, print it and exit loop */
                    for (int z = prev + 1; z < y; z++) {
                        printf("%c", str[z]);
                    }
                    if (i != (argc - 1)) {
                        printf("%c", outputdel) ;
                    }
                    break;
                }
                prev = y; /* Store current position of input delimiter (becomes previous when delimtier found next time) */
            }
            if (y == strlen(str) - 1) { /* If last character in array, if last word is equal to field argument, print it (handles last field case w/o end delimiter */
                if ((x + 1) == atoi(argv[i])) { 
                    for (int a = prev + 1; a < strlen(str); a++) {
                        printf("%c", str[a]);
                    }	
                    break;
                }
            }
        }
    }

    if (prev == -1) { /* If no input delimiter found, print whole line (like linux cut command) */
        for (int n = 0; n < strlen(str); n++) {
            if (str[n] == inputdel) {
                break;	
            } else if (n == (strlen(str) - 1)) {
                for (int k = 0; k < strlen(str); k++) {
                        printf("%c", str[k]);
                }
            }
        }
    }
    
    printf("\n"); /* Print Newline after line has been cut and printed */
}
