<h1 align="center"> Simple Cut Command for Linux </h1>

## Run Program
---
To run the program, get [GCC](https://gcc.gnu.org/)
Use the follow command to compile and run the code:
```
gcc assign2.c assign2funcs.c
./a.out , , 1 3 <thefile (for example)
```
---
3 files as follows: <br>
<pre>
assign2.c       - main function
assign2funcs.c  - functions used by main 
assign2funcs.h  - prototypes for functions defined in assign2funcs.c
</pre>

## assign2.c
---
The program implements a simplistic version of the Linux cut command. It is "simplistic" in that: 
 - it only cuts FIELDS (not characters, bytes, etc).
 - it requires between 1 and 100 fields (inclusive)
 - it requires fields to be unique, and specified in increasing order
 - it does not implement any functionality of cut other than cutting
  fields with given input delimiter and output delimiter 
 - the format of its command line arguments are simpler than cut's

The program expects command-line arguments specifying the following, in this order:
  - input  delimiter (a single character)
  - output delimiter (a single character)
  - field(s) (at least one, and at most 100, unique positive integers, given in increasing order of size)

Examples of proper calls to the program:
  - a.out , . 2 4 5 6 9 <inputFile
  - a.out , , 3 <inputFile
  - a.out x y 1 4 32 33 37 42 57 77 86 204 337 <inputFile

Examples of improper calls:
  - Wrong input delimiter
    - a.out ,, . 2 4 5 6 9 <inputFile
  - CLAs missing
    - a.out  <inputFile
  - Wrong field(s)
    - a.out , . 2 4-6 9 <inputFile
    - a.out , . 4 4 5 6 9 <inputFile
    - a.out , . 4 2 5  <inputFile

If CLAs are not as required above, the following message is printed on stderr and the program is exited with exit code 1:
<pre>
a.out: specify input_delimiter output_delimiter and 1-100 fields in order
</pre>

If the program run does not result in error, it exits with exit code 0.

The program reads input from stdin only, with fields separated by a single input delimiter. <br>
e.g., the following file contains 3 lines, where line 1 has 4 fields, line 2 has 2 fields, and line 3 has 6  fields (with input delimiter ","):
<pre>
abc,de,f,ghi
a   b,cd
a,,cdefg,hi  jkl,     m     ,
</pre>

The program writes output to stdout (and error message to stderr). For each line of input, the program displays the required fields on stdout using the output delimiter to separate fields. <br>
e.g., if the above input file was named "thefile", then the following run of tje program produces the following output:
```
  > ./a.out , , 1 3 <thefile

  abc,f
  a   b
  a,cdefg
```

## assign2funcs.[c/h] 
---
The main function is in assign2.c. Additional functions, declarations, and definitions are in files assign2funcs.h and assign2funcs.c.
