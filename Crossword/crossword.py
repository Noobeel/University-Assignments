class CrosswordSolver:
    def __init__(self):
        """
        Constructs the board and sets error to None
        """
        self.board = [[' '] * 20 for i in range(20)]
        self.errorIndex = -1

    def resetBoard(self):
        """
        Resets the board
        
        Returns
        -------
        None
        """
        self.board = [[' '] * 20 for i in range(20)]
    
    def printBoard(self):
        """
        Prints the board

        Returns
        -------
        None
        """
        print(' _' * 20)

        for i in range(20):
            print('|' + ' '.join(self.board[i]) + '|')

        print(' _' * 20 + '\n')
    
    def solveCrossword(self, L):
        """
        Invokes the addWords method and prints a header for any errors.

        Parameters
        ----------
            L : str
                List of all words to be added
        
        Returns
        -------
        None
        """
        print("Words not added with reason:")
        self.__addWords(L)

    def __addWords(self, L):
        """
        Adds a word to the board

        Parameters
        ----------
            L : List[str]
                List of words being added

        Returns
        -------
        None
        """
        # While the first word in the list cannot be added, print an error message then remove the word and try again
        while not self.__addFirstWord(L[0]):
            print(L[0], ':', ERRORS[self.errorIndex])
            L.remove(L[0])

        for i in range(1, len(L)):
            # If index is even, tries to add horizontally first. If word cannot be added horizontally, tries vertically
            # If index is odd, tries to add vertically first. If word cannot be added vertically, tries horizontally
            # If word cannot be added horizontally or vertically, print an appropriate error message
            if i % 2 == 0:
                if self.__addHorizontal(L[i]):
                    continue
                elif self.__addVertical(L[i]):
                    continue
                else:
                    if not self.__addHorizontal(L[i]) and not self.__addVertical(L[i]):
                        self.errorIndex = 2
                        print(L[i], ':', ERRORS[self.errorIndex])
            else:
                if self.__addVertical(L[i]):
                    continue
                elif self.__addHorizontal(L[i]):
                    continue
                else:
                    if not self.__addVertical(L[i]) and not self.__addHorizontal(L[i]):
                        self.errorIndex = 2
                        print(L[i], ':', ERRORS[self.errorIndex])

    def __addFirstWord(self, word):
        """
        Adds the first word to the middle of the board or sets error message

        Parameters
        ----------
            word : str
                First word to be added

        Returns
        -------
        Boolean : True if word is added or False if error
        """
        if len(word) > 20:
            self.errorIndex = 0
            return False
        else:
            for n in range(len(word)):
                self.board[len(self.board)//2][len(self.board)//2 - len(word)//2 + n] = word[n]
            return True

    def __checkVertical(self, word, row, col):
        """
        Checks if a word can be added vertically (top to bottom)

        Parameters
        ----------
            word : str
                Word being checked
            row : int
                Starting row index
            col : int
                Starting column index

        Returns
        -------
        Boolean : True if word can fit vertically else False
        """
        if len(word) + row > 20 \
         or (row + len(word) < 20 and self.board[row + len(word)][col]) != ' ' \
         or (row - 1 > -1 and self.board[row - 1][col]) != ' ':
            return False

        check_current = [] # List of current vertical single characters on the board
        check_right = [] # List of characters on board to the right of current character
        check_left = [] # List of characters on board to the left of current character
        wordletter = [] # List of characters in the word being added

        for a in range(len(word)):
            check_current += [self.board[row + a][col]]
            wordletter += [word[a]]
            if (col - 1) != -1:
                check_left += [self.board[row + a][col - 1]]
            if (col + 1) != 20:
                check_right += [self.board[row + a][col + 1]]

        for b in range(len(word) - 1):
            # Returns False with an error message
            # if check_left is not an empty list and whether check_left[b] and check_left[b+1] are occupied
            # or
            # if check_right is not an empty list and whether check_right[b] and check_right[b+1] are occupied
            # or
            # if check_left is an empty list and whether check_right[b] and check_right[b+1] are occupied
            # or
            # if check_right is an empty list and whether check_left[b] and check_left[b+1] are occupied
            if (check_left != [] and check_left[b] != ' ' and check_left[b+1] != ' ') \
             or (check_right != [] and check_right[b] != ' ' and check_right[b+1] != ' ') \
             or (check_left == [] and check_right[b] != ' ' and check_right[b+1] != ' ') \
             or (check_right == [] and check_left[b] != ' ' and check_left[b+1] != ' '):
                self.errorIndex = 1
                return False

        for f in range(len(word)):
            # Returns True
            # if check_right and check_left are not an empty list and whether check_right[f] is not occupied and check_left[f] is occupied and first letter of current character is equal to first letter of word
            # or
            # if check_right and check_left are not an empty list and whether check_left[f] is not occupied and check_right[f] is occupied and first letter of current character is equal to first letter of word
            if (check_right != [] and check_left != [] and check_right[f] == ' ' and check_left[f] != ' ' and check_current[0] == wordletter[0]) \
             or (check_right != [] and check_left != [] and check_left[f] == ' ' and check_right[f] != ' ' and check_current[0] == wordletter[0]):
                return True
            
            # Returns False with an error message
            # if check_right and check_left are not an empty list and whether check_right[f] is not occupied and check_left[f] is occupied
            # or
            # if check_right and check_left are not an empty list and whether check_left[f] is occupied and check_right[f] is not occupied
            if (check_right != [] and check_left != [] and check_right[f] == ' ' and check_left[f] != ' ') \
              or (check_right != [] and check_left != [] and check_left[f] == ' ' and check_right[f] != ' '):
                self.errorIndex = 1
                return False
    
        for c in range(len(check_current) - 1):
            if check_current[c] in wordletter:
                for d in range(len(check_current) - 1):
                    # Returns False with an error message
                    # if check_current[d] is occupied and check_current[d] != wordletter[d]
                    # or
                    # if check_current[d] == wordletter[d] and check_current[d+1] == wordletter[d+1] (checks overlapping for e.g ball and basketball)
                    if (check_current[d] != ' ' and check_current[d] != wordletter[d]) \
                     or (check_current[d] == wordletter[d] and check_current[d+1] == wordletter[d+1]):
                        self.errorIndex = 1
                        return False
                # Returns true if current character == wordletter and no illegal adjacencies
                return True

        self.errorIndex = 1
        return False

    def __addVertical(self, word):
        """
        Adds a word vertically (top to bottom)

        Parameters
        ----------
            word : str
                 Word being added

        Returns
        -------
        Boolean : True if word added else False
        """
        for i, cells in enumerate(self.board):
            for j, _ in enumerate(cells):
                # Checks if word can be added vertically and adds word
                if self.__checkVertical(word, i, j):
                    for index in range(len(word)):
                        self.board[i + index][j] = word[index]
                    return True
        return False

    def __checkHorizontal(self, word, row, col):
        """
        Checks if a word can be added horizontally (left to right)

        Parameters
        ----------
            word : str
                Word being checked
            row : int
                Starting row index
            col : int
                Starting column index

        Returns
        -------
        Boolean : True if word can fit horizontally else False
        """
        if len(word) + col > 20 \
         or (col + len(word) < 20 and self.board[row][col+len(word)]) != ' ' \
         or (col-1 > -1 and self.board[row][col-1]) != ' ':
            return False

        check_current = [] # List of current horizontal single characters on the board
        check_up = [] # List of characters on board above the current character
        check_down = [] # List of characters on board below the current character
        wordletter = [] # List of characters in the word being added

        for a in range(len(word)):
            check_current += [self.board[row][col+a]]
            wordletter += [word[a]]
            if row - 1 != -1:
                check_up += [self.board[row-1][col+a]]
            if row + 1 != 20:
                check_down += [self.board[row+1][col+a]]

        for b in range(len(word)-1):
            # Returns False with an error message
            # if check_up is not an empty list and whether check_up[b] and check_up[b+1] are occupied
            # or
            # if check_down is not an empty list and whether check_down[b] and check_down[b+1] are occupied
            # or
            # if check_up is an empty list and whether check_down[b] and check_down[b+1] are occupied
            # or
            # if check_down is an empty list and whether check_up[b] and check_up[b+1] are occupied
            if (check_up != [] and check_up[b] != ' ' and check_up[b+1] != ' ') \
             or (check_down != [] and check_down[b] != ' ' and check_down[b+1] != ' ') \
             or (check_up == [] and check_down[b] != ' ' and check_down[b+1] != ' ') \
             or (check_down == [] and check_up[b] != ' ' and check_up[b] != ' '):
                self.errorIndex = 1
                return False

        for f in range(len(word)):
            # Returns True
            # if check_up and check_down are not an empty list and check_up[f] is not occupied and check_down[f] is occupied and first letter of current character is equal to first letter of word
            # or
            # if check_up and check_down are not an empty list and check_down[f] is not occupied and check_up[f] is occupied and first letter of current character is equal to first letter of word
            if (check_up != [] and check_down != [] and check_up[f] == ' ' and check_down[f] != ' ' and check_current[0] == wordletter[0]) \
             or (check_up != [] and check_down != [] and check_down[f] == ' ' and check_up[f] != ' ' and check_current[0] == wordletter[0]):
                return True
            # Returns False with an error message
            # if check_up and check_down are not an empty list and check_up[f] is not occupied and check_down[f] is occupied
            # or
            # if check_up and check_down are not an empty list and check_down[f] is not occupied and check_up[f] is occupied
            if (check_up != [] and check_down != [] and check_up[f] == ' ' and check_down[f] != ' ') \
             or (check_up != [] and check_down != [] and check_down[f] == ' ' and check_up[f] != ' '):
                self.errorIndex = 1
                return False

        for c in range(len(check_current) - 1):
            if check_current[c] in wordletter:
                for d in range(len(check_current) - 1):
                    # Returns False with an error message
                    # if check_current[d] is occupied and check_current[d] != wordletter[d]
                    # or
                    # if check_current[d] == wordletter[d] and check_current[d+1] == wordletter[d+1] (checks overlapping for e.g snake and rattlesnake)
                    if (check_current[d] != ' ' and check_current[d] != wordletter[d]) \
                     or (check_current[d] == wordletter[d] and check_current[d+1] == wordletter[d+1]):
                        self.errorIndex = 1
                        return False
                # Returns true if current character == wordletter and no illegal adjacencies
                return True
        
        self.errorIndex = 1
        return False

    def __addHorizontal(self, word):
        """
        Adds a word horizontally (left to right)

        Parameters
        ----------
            word : str
                 Word being added

        Returns
        -------
        Boolean : True if word added else False
        """
        for i, cells in enumerate(self.board):
            for j, _ in enumerate(cells):
                # Checks if word can be added horizontally and adds word
                if self.__checkHorizontal(word, i, j):
                    for index in range(len(word)):
                        self.board[i][j + index] = word[index]
                    return True
        return False

def main():
    tests = [
        ["mainstream", "horse", "loon", "rattlesnake", "cat", "rattlesnake", "dinosaur", "hypothesis", "chocolate"],
        ["dry", "fuel", "confront", "arm", "wedding", "hurl", "defendant", "reflection", "teacher", "treasure"],
        ["mario", "luigi", "waluigi", "wario", "peach", "toad", "bowser", "daisy"],
        ["Pseudopseudohypoparathyroidism", "addle", "apple", "clowning", "incline", "plan", "burr"]
    ]

    crosswordObj = CrosswordSolver()
    for test in tests:
        crosswordObj.solveCrossword(test)
        crosswordObj.printBoard()
        crosswordObj.resetBoard()

ERRORS = ["Reaches outside grid", "Illegal adjacencies", "No matching letter"]

if __name__ == "__main__":
    main()
