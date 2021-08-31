#include "assign2funcs.h"
#include <stdio.h> 
#include <string.h>
#include <stdlib.h>

/*
Name: main
Purpose: Execute simple cut command
Parameters: argc: Integer number of arguments in stdin, 
            *argv[]: Character array of all standard input arguments
Return: returns exit code of program (1 if error else 0)
*/
int main(int argc, char *argv[]) {
    checkInput(argc, argv);
    char str[10000] ; /* Array of strings to store line */
    while(fgets(str, 10000, stdin) != NULL) { /* Reads each line from stdin until NULL */
        str[strlen(str)-1] = '\0'; /* Remove Newline Character */
        cut(str, argc, argv);
    }
    exit(0); /* Successfully Exit */
}
